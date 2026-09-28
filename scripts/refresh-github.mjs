import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../src/data/impact.json', import.meta.url);
const snapshot = JSON.parse(await readFile(path, 'utf8'));
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'hfawaz-portfolio',
};
if (process.env.GITHUB_TOKEN)
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      `GitHub ${response.status}: ${path}. Existing snapshot kept.`,
    );
  return response.json();
}
function repository(repo) {
  if (
    !Number.isSafeInteger(repo.stargazers_count) ||
    repo.stargazers_count < 0 ||
    !repo.full_name ||
    !repo.html_url
  ) {
    throw new Error('Invalid repository response. Existing snapshot kept.');
  }
  return {
    name: repo.full_name,
    stars: repo.stargazers_count,
    url: repo.html_url,
  };
}

const repositories = [];
for (let page = 1; ; page++) {
  const batch = await github(
    `/users/hfawaz/repos?per_page=100&type=owner&page=${page}`,
  );
  if (!Array.isArray(batch))
    throw new Error('Invalid repository list. Existing snapshot kept.');
  repositories.push(...batch.filter((repo) => !repo.fork).map(repository));
  if (batch.length < 100) break;
}
if (!repositories.length)
  throw new Error('No repositories returned. Existing snapshot kept.');
const collaborations = await Promise.all(
  snapshot.github.collaborations.map(async (repo) =>
    repository(await github(`/repos/${repo.name}`)),
  ),
);
snapshot.github = {
  ...snapshot.github,
  checkedAt: new Date().toISOString().slice(0, 10),
  repositories: repositories.sort((a, b) => b.stars - a.stars),
  collaborations,
};
await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
  `Updated ${repositories.length} owned repositories; collaborations are counted separately.`,
);

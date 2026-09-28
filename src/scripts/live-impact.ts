// Public browser requests only. No API keys or build-time network dependency.
const CACHE_KEY = 'portfolio-github-v1';
const TTL = 60 * 60 * 1000;
const number = new Intl.NumberFormat('en-US');
type Metrics = {
  fetchedAt: number;
  total: number;
  stars: Record<string, number>;
};
type Repository = {
  full_name: string;
  stargazers_count: number;
  fork: boolean;
};
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

async function request(path: string): Promise<unknown> {
  const response = await fetch(`https://api.github.com${path}`, {
    credentials: 'omit',
    signal: AbortSignal.timeout(10000),
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response.json();
}

function repository(value: unknown): Repository {
  const repo = value as Repository | null;
  if (
    !repo ||
    typeof repo.full_name !== 'string' ||
    !isCount(repo.stargazers_count) ||
    typeof repo.fork !== 'boolean'
  ) {
    throw new Error('Invalid repository metrics');
  }
  return repo;
}

function cached(required: string[]): Metrics | undefined {
  try {
    const data = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (
      data &&
      isCount(data.fetchedAt) &&
      data.fetchedAt <= Date.now() &&
      Date.now() - data.fetchedAt < TTL &&
      isCount(data.total) &&
      data.stars &&
      required.every(
        (name) => Object.hasOwn(data.stars, name) && isCount(data.stars[name]),
      )
    )
      return data;
  } catch {
    /* Storage can be disabled or contain an obsolete cache. */
  }
}

function render(data: Metrics) {
  const checked =
    new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(data.fetchedAt) + ' UTC';
  document.querySelectorAll('[data-github-total]').forEach((el) => {
    el.textContent = number.format(data.total);
  });
  document.querySelectorAll<HTMLElement>('[data-github-repo]').forEach((el) => {
    const stars = data.stars[el.dataset.githubRepo!];
    const value = el.querySelector('[data-github-stars]');
    if (isCount(stars) && value) {
      value.textContent = number.format(stars);
      el.title = `GitHub stars checked ${checked}`;
    }
  });
  document.querySelectorAll('[data-github-updated]').forEach((el) => {
    el.textContent = checked;
  });
}

async function refreshGitHub() {
  if (!document.querySelector('[data-github-total], [data-github-repo]'))
    return;
  const required = [
    ...new Set(
      [...document.querySelectorAll<HTMLElement>('[data-github-repo]')].map(
        (el) => el.dataset.githubRepo!,
      ),
    ),
  ];
  const saved = cached(required);
  if (saved) {
    render(saved);
    return;
  }
  try {
    const stars: Record<string, number> = {};
    let total = 0;
    let complete = false;
    // Paginate to avoid silently undercounting as the account grows.
    for (let page = 1; page <= 100; page++) {
      const batch = await request(
        `/users/hfawaz/repos?type=owner&per_page=100&page=${page}`,
      );
      if (!Array.isArray(batch)) throw new Error('Invalid repository list');
      for (const item of batch) {
        const repo = repository(item);
        if (repo.full_name.split('/')[0].toLowerCase() !== 'hfawaz')
          throw new Error('Unexpected repository owner');
        if (Object.hasOwn(stars, repo.full_name))
          throw new Error('Duplicate repository');
        stars[repo.full_name] = repo.stargazers_count;
        if (!repo.fork) total += repo.stargazers_count;
      }
      if (batch.length < 100) {
        complete = true;
        break;
      }
    }
    if (!complete) throw new Error('Incomplete repository list');
    for (const name of required) {
      if (Object.hasOwn(stars, name)) continue;
      const repo = repository(await request(`/repos/${name}`));
      if (repo.full_name.toLowerCase() !== name.toLowerCase())
        throw new Error('Unexpected repository');
      stars[name] = repo.stargazers_count;
    }
    const data: Metrics = { fetchedAt: Date.now(), total, stars };
    render(data);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      /* Counts still update when storage is unavailable. */
    }
  } catch {
    // Keep the server-rendered counts and their original checked dates.
  }
}

void refreshGitHub();

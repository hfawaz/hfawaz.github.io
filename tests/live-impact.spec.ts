import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
const snapshot = JSON.parse(
  readFileSync(new URL('../src/data/impact.json', import.meta.url), 'utf8'),
) as { github: { repositories: Array<{ name: string; stars: number }> } };

const owned = snapshot.github.repositories.map((repo) => ({
  full_name: repo.name,
  stargazers_count: repo.stars + 10,
  fork: false,
}));
const total = owned.reduce((sum, repo) => sum + repo.stargazers_count, 0);
const fallback = snapshot.github.repositories.reduce(
  (sum, repo) => sum + repo.stars,
  0,
);
const format = (value: number) => value.toLocaleString('en-US');

async function mockGitHub(page: Page) {
  const calls: string[] = [];
  await page.route('https://api.github.com/**', async (route) => {
    calls.push(route.request().url());
    const url = new URL(route.request().url());
    const body = url.pathname.startsWith('/users/')
      ? [
          ...owned,
          { full_name: 'hfawaz/fork', stargazers_count: 99999, fork: true },
        ]
      : {
          full_name: 'EricssonResearch/UDA-4-TSC',
          stargazers_count: 123,
          fork: false,
        };
    await route.fulfill({ json: body });
  });
  return calls;
}

test('browser updates totals and project badges, excludes forks/collaborations, and caches across pages', async ({
  page,
}) => {
  const calls = await mockGitHub(page);
  await page.goto('/');
  await expect(page.locator('[data-github-total]')).toHaveText(format(total));
  await expect(
    page.locator('[data-github-repo="hfawaz/dl-4-tsc"] [data-github-stars]'),
  ).toHaveText(format(1669));
  await expect(
    page.locator(
      '[data-github-repo="EricssonResearch/UDA-4-TSC"] [data-github-stars]',
    ),
  ).toHaveText('123');
  await expect(page.locator('[data-github-updated]')).toContainText('UTC');
  expect(calls).toHaveLength(2);
  await page.goto('/work/');
  await expect(page.locator('[data-github-total]')).toHaveText(format(total));
  await expect(
    page.locator('[data-github-repo="hfawaz/bigdata18"] [data-github-stars]'),
  ).toHaveText('391');
  expect(calls).toHaveLength(2);
});

test('all repository pages are included before the total changes', async ({
  page,
}) => {
  let secondPage = false;
  await page.route('https://api.github.com/**', async (route) => {
    const url = new URL(route.request().url());
    let body: unknown;
    if (url.pathname.startsWith('/repos/')) {
      body = {
        full_name: url.pathname.slice(7),
        stargazers_count: 7,
        fork: false,
      };
    } else if (url.searchParams.get('page') === '1') {
      body = Array.from({ length: 100 }, (_, i) => ({
        full_name: `hfawaz/repo-${i}`,
        stargazers_count: 1,
        fork: false,
      }));
    } else {
      secondPage = true;
      body = [{ full_name: 'hfawaz/last', stargazers_count: 9, fork: false }];
    }
    await route.fulfill({ json: body });
  });
  await page.goto('/');
  await expect(page.locator('[data-github-total]')).toHaveText('109');
  expect(secondPage).toBe(true);
});

for (const failure of [
  'rate limit',
  'malformed data',
  'collaboration failure',
]) {
  test(`${failure} preserves dated fallback counts without errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('https://api.github.com/**', async (route) => {
      if (failure === 'malformed data') {
        await route.fulfill({
          json: [{ full_name: 'hfawaz/broken', fork: false }],
        });
      } else if (
        failure === 'collaboration failure' &&
        route.request().url().includes('/users/')
      ) {
        await route.fulfill({ json: owned });
      } else {
        await route.fulfill({
          status: 403,
          json: { message: 'API rate limit exceeded' },
        });
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-github-total]')).toHaveText(
      format(fallback),
    );
    await expect(page.locator('[data-github-updated]')).not.toContainText(
      'UTC',
    );
    expect(errors).toEqual([]);
    expect(
      await page.evaluate(() => localStorage.getItem('portfolio-github-v1')),
    ).toBeNull();
  });
}

test('blocked local storage does not prevent live updates', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await mockGitHub(page);
  await page.goto('/');
  await expect(page.locator('[data-github-total]')).toHaveText(format(total));
});

for (const kind of ['expired', 'corrupt', 'invalid counts']) {
  test(`${kind} cache is replaced with fetched data`, async ({ page }) => {
    await page.addInitScript(
      ({ kind, owned }) => {
        localStorage.setItem(
          'portfolio-github-v1',
          kind === 'corrupt'
            ? '{invalid'
            : JSON.stringify({
                fetchedAt: Date.now() - (kind === 'expired' ? 7200000 : 0),
                total: kind === 'invalid counts' ? -1 : 999,
                stars: Object.fromEntries([
                  ...owned.map((repo) => [repo.full_name, 1]),
                  ['EricssonResearch/UDA-4-TSC', 1],
                ]),
              }),
        );
      },
      { kind, owned },
    );
    const calls = await mockGitHub(page);
    await page.goto('/');
    await expect(page.locator('[data-github-total]')).toHaveText(format(total));
    expect(calls).toHaveLength(2);
  });
}

test('pages without GitHub counters make no GitHub API requests', async ({
  page,
}) => {
  const calls = await mockGitHub(page);
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  expect(calls).toHaveLength(0);
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const sourceBib = readFileSync(
  new URL('../references.bib', import.meta.url),
  'utf8',
);
const sourceCount = (sourceBib.match(/^@/gm) || []).length;

for (const route of ['/', '/about/', '/work/', '/publications/']) {
  test(`${route} renders accessibly without overflow or browser errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test('publication search, combined year filtering, empty state, reset, and citation expansion', async ({
  page,
}) => {
  await page.goto('/publications/');
  await expect(page.locator('[data-publication]')).toHaveCount(sourceCount);
  await expect(page.locator('#paper-count')).toHaveText(
    `${sourceCount} publications`,
  );
  await page.getByLabel('Search publications').fill('inceptiontime');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await expect(page.locator('#paper-count')).toHaveText('1 publication');
  await page.getByLabel('Year', { exact: true }).selectOption('2025');
  await expect(page.locator('#no-results')).toBeVisible();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(
    sourceCount,
  );
  await page.getByLabel('Year', { exact: true }).selectOption('2025');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await expect(
    page.locator('[data-publication]:visible .authors'),
  ).toContainText('Aurélie Boisbunon');
  await page.locator('[data-publication]:visible summary').click();
  await expect(page.locator('[data-publication]:visible pre')).toContainText(
    '@InProceedings',
  );
});

test('all local links, images, downloads, and anchors resolve', async ({
  page,
  request,
}) => {
  const paths = new Set<string>();
  for (const route of ['/', '/about/', '/work/', '/publications/']) {
    await page.goto(route);
    const links = await page
      .locator('a[href^="/"], img[src^="/"]')
      .evaluateAll((elements) =>
        elements.map(
          (el) => el.getAttribute('href') || el.getAttribute('src') || '',
        ),
      );
    links.forEach((link) => paths.add(link));
    const anchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((elements) =>
        elements.map((el) => el.getAttribute('href')!.slice(1)),
      );
    for (const id of anchors)
      expect(
        await page.evaluate((id) => !!document.getElementById(id), id),
      ).toBe(true);
  }
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  expect(await (await request.get('/references.bib')).text()).toBe(sourceBib);
  const cv = await request.get('/latex/CV-4-Industry/hassan.pdf');
  expect(await cv.body()).toEqual(
    readFileSync(new URL('../latex/CV-4-Industry/hassan.pdf', import.meta.url)),
  );
  expect((await request.get('/social-card.png')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
});

test('core content and navigation work with JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Publications' })
    .click();
  await expect(page.locator('[data-publication]')).toHaveCount(sourceCount);
  await expect(page.locator('.publication-filters')).toBeHidden();
  await page.locator('summary').first().click();
  await expect(page.locator('pre').first()).toBeVisible();
  await context.close();
});

test('missing pages show a useful 404', async ({ page }) => {
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
});

test('research metrics link to the matching paper and unknown counts stay absent', async ({
  page,
}) => {
  const snapshot = JSON.parse(
    readFileSync(new URL('../src/data/impact.json', import.meta.url), 'utf8'),
  );
  await page.goto('/');
  await expect(page.locator('[data-impact="citations"] strong')).toHaveText(
    snapshot.scholar.citations.toLocaleString('en-US'),
  );
  const paper = snapshot.scholar.papers.ismailfawaz2018deep;
  await expect(
    page.locator('#ismailfawaz2018deep .paper-impact'),
  ).toHaveAttribute('href', paper.url);
  await expect(
    page.locator('#ismailfawaz2018deep .paper-impact strong'),
  ).toHaveText(paper.count.toLocaleString('en-US'));
  await expect(
    page.locator(
      '.star-badge[href="https://github.com/hfawaz/dl-4-tsc/stargazers"]',
    ),
  ).toBeVisible();
  await page.goto('/publications/');
  await expect(page.locator('#IsmailFawaz2018gdr .paper-impact')).toHaveCount(
    0,
  );
});

test('Keras authorship and all three Hugging Face integrations have source links', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#open-source');
  await expect(
    section.getByRole('link', { name: 'Read the Keras tutorial' }),
  ).toHaveAttribute(
    'href',
    'https://keras.io/examples/timeseries/timeseries_classification_from_scratch/',
  );
  for (const [name, number] of [
    ['DBpedia-14', '1116'],
    ['Yelp Review Full', '1315'],
    ['Amazon Polarity', '1389'],
  ]) {
    await expect(
      section.getByRole('link', { name: `Merged pull request for ${name}` }),
    ).toHaveAttribute(
      'href',
      `https://github.com/huggingface/datasets/pull/${number}`,
    );
  }
  await page.goto('/work/#open-source');
  await expect(
    page.getByRole('heading', { name: 'Making knowledge usable.' }),
  ).toBeVisible();
});

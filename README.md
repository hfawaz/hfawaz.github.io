# Hassan Ismail Fawaz — portfolio

A static Astro + TypeScript website for GitHub Pages. Pages and publications are
rendered at build time; a small browser script adds publication search and year
filtering. Content, navigation, and BibTeX remain available without JavaScript.
Fonts are served locally. No backend, API keys, or database are required.

## Run locally

Use Node.js 24 LTS (`.nvmrc`) and npm. Conda is **not required** for the website.

```bash
cd ~/worktrees-getbetter/portfolio-astro
# If using nvm:
nvm install
nvm use
npm ci
npm run dev
```

Open **http://localhost:4321/**. Edits refresh automatically. Stop with `Ctrl+C`.
If port 4321 is busy, Astro prints the actual address in the terminal.

To inspect exactly what GitHub Pages will serve:

```bash
npm run build
npm run preview
```

Open the address printed by Astro (normally http://localhost:4321/).
Rebuild after changes when using preview; use `dev` for live updates.

## Validate

```bash
npm run format:check
npm run build
npx playwright install chromium
npm test
npm run test:dev
```

The build runs Astro/TypeScript checks before generating `dist/`. `npm test` checks
the production output; `npm run test:dev` runs the same checks against the
development server. Browser checks
cover desktop and mobile layouts, accessibility, search and reset, BibTeX,
internal links and downloads, no-JavaScript content, and the 404 page.
On Linux, Playwright may also require `npx playwright install --with-deps chromium`.

Run `npm run format` to format the active project files. A local pre-commit hook
also runs this command. The optional, separate `portfolio-astro` Conda environment
contains pre-commit; activate it and run `pre-commit run --all-files` to use it.
It is unrelated to the `getbetter` environment.

## Update content

| Content                                                   | File                                    |
| --------------------------------------------------------- | --------------------------------------- |
| Role, contact, profile links, experience, projects        | `src/data/profile.ts`                   |
| Publication source (including PDFs and code links)        | `references.bib`                        |
| Featured publication IDs                                  | `src/data/publications.ts`              |
| Teaching, awards, visits, grants, certifications, service | `src/data/academic.json`                |
| Biography                                                 | `src/pages/about.astro`                 |
| Homepage copy                                             | `src/pages/index.astro`                 |
| Colors, type, responsive layouts                          | `src/styles/global.css`                 |
| Portrait                                                  | `src/assets/portrait.png`               |
| Public CV                                                 | `public/latex/CV-4-Industry/hassan.pdf` |

After recompiling the CV from its existing LaTeX sources, replace the public PDF
as well. The `/references.bib` download is generated from the root source file,
so it cannot drift from the displayed publication list. Publication dates and
links are taken from that file; they are not fetched from an external service.
The displayed current role follows the existing site's GOSI biography.

The old HTML, CSS, JavaScript, and template directories remain in the repository
as historical source material. Astro only publishes generated pages and `public/`;
it does not ship those legacy template files. Do not open the root `index.html`
to preview the redesign—use `npm run dev`.

## GitHub Pages deployment

The redesign is on `codex/portfolio-astro`. Local work does not publish the site.

When ready to publish:

1. In the repository's **Settings → Pages → Build and deployment**, select
   **GitHub Actions** as the source.
2. Merge the redesign into **master** (this repository's default branch).
3. The workflow in `.github/workflows/deploy.yml` installs the locked dependencies,
   validates formatting, builds, runs browser checks, and deploys `dist/`.

Pull requests run validation without deploying. Manual runs only deploy when
run against `master`. The site URL stays **https://hfawaz.github.io/**.
If renaming the default branch, update the workflow triggers and deploy condition.

## Attribution

The previous site used the Academic Responsive template by Demetris Zeinalipour,
University of Cyprus (2015), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Its [source and credits](https://github.com/dmsl/academic-responsive-template)
remain acknowledged in the footer. The new layout is implemented in Astro.

The existing MIT-licensed BibTeX parser is reused at build time in
`src/lib/bibtex.js`; its license is in `src/lib/BIBTEX-LICENSE.txt`.

## Impact and contributions

`src/data/impact.json` contains dated Google Scholar and GitHub snapshots.
Citation counts refer to Google Scholar (not publisher or Semantic Scholar counts).
Paper entries are keyed by the citation IDs from `references.bib`; unverified
counts are omitted, not shown as zero. The homepage features the review,
InceptionTime, and the transfer learning paper.

The GitHub total sums public, non-fork repositories owned by `hfawaz`.
Collaborations such as `EricssonResearch/UDA-4-TSC` have their own star badges
but are excluded from the owned-repository total. Refresh GitHub counts with:

```bash
npm run refresh:github
```

This command keeps the existing data if a request fails. It optionally uses
`GITHUB_TOKEN` for a higher API rate limit. Review and commit the updated snapshot
before deployment. Normal builds and visitors do not depend on external APIs.

Update Google Scholar totals, per-paper counts, and `scholar.checkedAt` together
after checking the linked profile and papers. Dates are shown beside the metrics.
The Hugging Face contribution list in `src/data/impact.ts` links the three merged
PRs referenced by the CV: DBpedia-14 (#1116), Yelp Review Full (#1315), and Amazon
Polarity (#1389). These are dataset integrations, not claims of dataset authorship.
The official Keras tutorial credits `hfawaz` as its author.

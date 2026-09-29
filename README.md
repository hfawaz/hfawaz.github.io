# Hassan Ismail Fawaz — portfolio

A static Astro + TypeScript website for GitHub Pages. Pages and publications are
rendered at build time; small browser scripts add publication search, year
filtering, and current GitHub star counts. Content, navigation, and BibTeX remain available without JavaScript.
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

| Content                                                   | File                       |
| --------------------------------------------------------- | -------------------------- |
| Role, contact, profile links, experience, projects        | `src/data/profile.ts`      |
| Publication source (including PDFs and code links)        | `references.bib`           |
| Featured publication IDs                                  | `src/data/publications.ts` |
| Teaching, awards, visits, grants, certifications, service | `src/data/academic.json`   |
| Biography                                                 | `src/pages/about.astro`    |
| Homepage copy                                             | `src/pages/index.astro`    |
| Colors, type, responsive layouts                          | `src/styles/global.css`    |
| Portrait                                                  | `src/assets/portrait.png`  |
| Public CV                                                 | `public/cv.pdf`            |

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
but are excluded from the owned-repository total. Browser JavaScript fetches the
public GitHub REST API on pages that display stars, updating totals and project
badges together. Successful results are cached in the visitor's browser for one
hour to reduce API usage. Counts have a checked timestamp; failed requests,
rate limits, or disabled JavaScript leave the dated build-time snapshot visible.
No scheduled GitHub Actions job, backend, or browser API key is used.

To test live updates locally, run `npm run dev`, open http://localhost:4321/,
and inspect the `api.github.com` requests in DevTools → Network. Reloads within
one hour use the cache. Remove `portfolio-github-v1` from DevTools → Application →
Local Storage to force a new fetch. Browser tests mock success, pagination,
API failures, caching, and unavailable storage so checks never depend on GitHub.

Optionally refresh the committed fallback snapshot with:

```bash
npm run refresh:github
```

This command keeps the existing data if a request fails. It optionally uses
`GITHUB_TOKEN` for a higher API rate limit. Review and commit the updated snapshot
before deployment. Normal builds do not depend on external APIs; browser requests
progressively enhance the dated fallback counts.

Google Scholar citations remain a dated snapshot: its profile page does not
allow cross-origin browser requests. Live Google Scholar updates would require a
separately hosted proxy endpoint. The Semantic Scholar author profile was checked
but contains unrelated publications, so it is not substituted for Google Scholar.

Update Google Scholar totals, per-paper counts, and `scholar.checkedAt` together
after checking the linked profile and papers. Dates are shown beside the metrics.
The Hugging Face contribution list in `src/data/impact.ts` links the three merged
PRs referenced by the CV: DBpedia-14 (#1116), Yelp Review Full (#1315), and Amazon
Polarity (#1389). These are dataset integrations, not claims of dataset authorship.
The official Keras tutorial credits `hfawaz` as its author.

## Paper figures

Project cards use original vector figures extracted from the papers' PDFs:

| Project                       | Figure                              | Source                                                     |
| ----------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| InceptionTime                 | Fig. 2, Inception module            | [PDF, page 6](https://arxiv.org/pdf/1909.04939v3#page=6)   |
| Deep learning for time series | Fig. 7, classifier comparison       | [PDF, page 22](https://arxiv.org/pdf/1809.04356v4#page=22) |
| Learning across domains       | Fig. 1, temporal and feature shifts | [PDF, page 4](https://arxiv.org/pdf/2312.09857v3#page=4)   |

Click a figure to open its code repository; its caption links to the original PDF.
The SVGs in `public/figures/` preserve the original colors, paths, and labels;
text is outlined so it does not depend on installed fonts. Only the surrounding
page text and margins are cropped. These figures retain their source attribution
to the paper authors; they are not newly illustrated artwork.

`scripts/paper-figures.json` records versioned arXiv IDs, source PDF hashes, page
numbers, and crop rectangles (PDF points, measured from the top-left).
To regenerate, download those exact PDF versions, install `PyMuPDF==1.28.2`
in a separate Python environment, then run
`python scripts/extract-paper-figures.py /path/to/pdfs`.
SVGs are committed, so normal website builds need neither Python nor PDF tools.

## Icons

`src/components/Icon.astro` renders local SVGs with visible text labels. Brand
assets are stored in `src/assets/icons/`; no icon CDN or client library is needed.
Google Scholar, GitHub, LinkedIn, Keras, ORCID, arXiv, dblp, ResearchGate,
Semantic Scholar, and X icons come from
[Simple Icons 11.15.0](https://github.com/simple-icons/simple-icons/tree/11.15.0/icons)
(CC0; license included). The colored Hugging Face logo comes from
[Hugging Face](https://huggingface.co/front/assets/huggingface_logo-noborder.svg).
Brand marks remain the property of their respective owners. The PDF, code,
email, and navigation symbols are small inline vector drawings.

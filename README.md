# gmp-ipo-backend

Automated backend scraper for IPO GMP data from [InvestorGain](https://www.investorgain.com).

## Features

- Scrapes 7 GMP-related pages from InvestorGain using [Playwright](https://playwright.dev/).
- Aggregates all data into `data/gmp.json`.
- Automatically pushes updated data to the [ipo-gmp frontend repo](https://github.com/ainstarc/ipo-gmp) if changes are detected.
- Runs every 3 hours via GitHub Actions (see `.github/workflows/scrape.yml`).

## Pages Scraped

- Live GMP (All, Mainboard, SME, Current)
- GMP Performance (All, Mainline, SME)

## Usage

### Run Locally

```bash
npm install
npx playwright install --with-deps
npx tsx scrape.ts
```

### Output

- The script generates/updates `data/gmp.json` with the latest data from all target pages.

### GitHub Actions

- The workflow in `.github/workflows/scrape.yml` runs the scraper every 3 hours, compares the output, and pushes updates to the frontend repo if there are changes.
- Requires a `GH_PAT` secret (GitHub Personal Access Token) with push access to the frontend repo.

## Project Structure

- `scrape.ts` — Main scraping script
- `gmpPages.ts` — List of URLs to scrape
- `data/gmp.json` — Output data file (auto-generated)

## Requirements

- Node.js 18+
- [Playwright](https://playwright.dev/)
- [tsx](https://github.com/esbuild/tsx) for running TypeScript directly

## License

MIT

import { chromium } from 'playwright';
import fs from 'fs';
import { gmpPages } from './gmpPages';

async function scrapeTable(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const response = await page.goto(url, { timeout: 15000 });
    if (!response?.ok()) throw new Error(`Failed to load ${url}`);

    await page.waitForSelector('#report_table');

    const headers = await page.$$eval('#report_table thead tr th', ths =>
      ths.map(th => th.textContent?.trim() || '')
    );

    const rows = await page.$$eval('#report_table tbody tr', trs =>
      trs.map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim() || ''))
    );

    const data = rows.map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = row[i] || ''));
      return obj;
    });

    await browser.close();
    return data;

  } catch (err) {
    await browser.close();
    throw new Error(`❌ Error scraping ${url}: ${(err as Error).message}`);
  }
}

(async () => {
  const allResults: Record<string, any[]> = {};
  try {
    for (const [key, url] of Object.entries(gmpPages)) {
      console.log(`🔍 Scraping ${key}`);
      allResults[key] = await scrapeTable(url);
    }

    fs.writeFileSync('data/gmp.json', JSON.stringify(allResults, null, 2));
    console.log('✅ gmp.json written to /data');
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1); // Fail the GitHub Action
  }
})();

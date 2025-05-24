const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://giveth.io/projects', { waitUntil: 'networkidle2' });

  // Wait for project cards to load
  await page.waitForSelector('a[href^="/project/"]');

  // Scrape project data
  const projects = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/project/"]'));
    return cards.map(card => {
      const title = card.querySelector('h2')?.innerText || '';
      const description = card.querySelector('p')?.innerText || '';
      const logo = card.querySelector('img')?.src || '';
      const slug = card.getAttribute('href').replace('/project/', '');
      return { title, description, logo, slug };
    });
  });

  // Save to JSON
  const outPath = path.join(__dirname, '../client/src/data/giveth-projects.json');
  fs.writeFileSync(outPath, JSON.stringify(projects, null, 2));
  console.log(`Scraped ${projects.length} projects to ${outPath}`);

  await browser.close();
})();

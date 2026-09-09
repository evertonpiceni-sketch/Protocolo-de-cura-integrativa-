import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const html = await page.content();
  console.log('HTML Length:', html.length);
  if (html.length < 1000) {
      console.log(html);
  } else {
      console.log('Body:', await page.evaluate(() => document.body.innerHTML.substring(0, 500)));
  }
  
  await browser.close();
})();

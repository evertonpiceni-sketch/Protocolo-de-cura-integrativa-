import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message, error.stack));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' }).catch(e => console.log(e));
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    try {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('INICIAR SESSÃO')) {
        console.log('Clicking button:', text);
        await btn.click();
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {}
  }
  
  await browser.close();
})();

import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Switch to login tab
    const tabs = await page.$$('#auth-tabs button');
    for (const tab of tabs) {
        const text = await page.evaluate(el => el.textContent, tab);
        if (text.includes('Já tenho conta')) {
            await tab.click();
            break;
        }
    }
    
    await page.waitForTimeout(500);
    await page.waitForSelector('#log-login');
    await page.type('#log-login', 'admin');
    await page.type('#log-password', 'admin123');
    await page.click('#btn-login-submit');
    
    // wait for app view
    await page.waitForTimeout(3000);
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('Body after login:', html);
  } catch (err) {
    console.error('Error in script:', err.message);
  }
  
  await browser.close();
})();

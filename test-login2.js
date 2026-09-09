import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    const root = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('Root initially:', root);

    // Let's create an account
    // wait for #reg-login
    await page.waitForSelector('#reg-login', { timeout: 5000 });
    await page.type('#reg-login', 'testuser');
    await page.type('#reg-password', 'testpass');
    await page.type('#reg-name', 'Test User');
    await page.click('#btn-register-submit');
    
    // wait for app view
    await page.waitForTimeout(3000);
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('Body after login:', html);
  } catch (err) {
    console.error('Error in script:', err.message);
  }
  
  await browser.close();
})();

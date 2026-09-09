import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Attempt to log in
    await page.waitForSelector('#log-login');
    await page.type('#log-login', 'admin');
    await page.type('#log-password', 'admin123');
    await page.click('#btn-login-submit');
    
    // Wait for something after login
    await page.waitForTimeout(3000);
    
    console.log('Login sequence completed');
  } catch (err) {
    console.error('Error in script:', err.message);
  }
  
  await browser.close();
})();

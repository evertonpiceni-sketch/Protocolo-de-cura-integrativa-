import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR (EXCEPTION):', error.message));
  
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', e => {
      console.log('UNCAUGHT_ERROR:', e.message);
    });
    window.addEventListener('unhandledrejection', e => {
      console.log('UNHANDLED_REJECTION:', e.reason);
    });
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // login
    await page.evaluate(() => {
        const tabs = document.querySelectorAll('#auth-tabs button');
        if (tabs[1]) tabs[1].click();
    });
    
    await new Promise(r => setTimeout(r, 500));
    await page.type('#log-login', 'admin');
    await page.type('#log-password', 'admin123');
    await page.click('#btn-login-submit');
    
    await new Promise(r => setTimeout(r, 5000));
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 1000));
    console.log('Body after login:', html);
  } catch (err) {
    console.error('Error in script:', err.message);
  }
  
  await browser.close();
})();

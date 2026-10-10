// Local browser fixtures only; never creates a real account.
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage();let registrationCalls=0;let mode='unavailable';let loginCalls=0;let loginAvailable=false;
await page.setRequestInterception(true);
page.on('request',r=>{
 const path=new URL(r.url()).pathname;
 if(path==='/api/auth/me')return r.respond({status:401,contentType:'application/json',body:'{}'});
 if(path==='/api/auth/register'){
 registrationCalls++;
 return r.respond({status:mode==='unavailable'?503:200,contentType:'application/json',body:mode==='unavailable'?'{}':JSON.stringify({user:{login:'audit-only',email:'audit@example.test',profile:{name:'Maria',plan:'free'},progress:[],role:'user'}})});
 }
 if(path==='/api/user/sync')return r.respond({status:503,contentType:'application/json',body:'{}'});
 if(path==='/api/auth/login'){loginCalls++;return r.respond(loginAvailable?{status:200,contentType:'application/json',body:JSON.stringify({user:{login:'audit-only',fullName:'Maria',profile:{name:'Maria',plan:'free'},progress:[],role:'user'}})}:{status:503,contentType:'text/plain',body:'Temporary unavailable'});}
 if(path.startsWith('/api/'))return r.respond({status:200,contentType:'application/json',body:'{}'});
 return r.continue();
});
try{
 await page.goto(process.env.NATURAL_SERENO_QA_URL||'http://127.0.0.1:4174/',{waitUntil:'networkidle0'});
 await page.waitForSelector('#reg-fullname');
 for(const [id,value]of [['reg-fullname','Maria'],['reg-email','audit@example.test'],['reg-login','audit-only'],['reg-password','test-password']])await page.type('#'+id,value);
 await page.$eval('#reg-birthdate',el=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'1990-01-01');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.click('#lgpd-consent');await page.click('#btn-complete-setup');
 await page.waitForSelector('#auth-error');
 assert.equal(await page.$eval('#btn-complete-setup',el=>el.disabled),false);
 assert.equal(await page.$eval('#reg-email',el=>el.value),'audit@example.test');
 mode='success';await page.click('#btn-complete-setup');await page.waitForSelector('#auth-success');
 assert.equal(await page.$eval('#btn-complete-setup',el=>el.disabled),true,'Successful creation remains locked while the app opens');
 assert.equal(registrationCalls,2,'No additional registration after profile-sync failures');
 await page.waitForSelector('.ns-app',{timeout:10000});
 await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('#auth-tabs');await page.click('#auth-tabs button:nth-child(2)');
 await page.click('#auth-forgot-password');await page.waitForSelector('[data-access-support-link="true"]');assert(await page.$eval('[data-access-support-link="true"]',el=>el.href.startsWith('https://wa.me/5551982215296')));assert.match(await page.$eval('[data-access-support-link="true"]',el=>el.textContent),/suporte/);await page.$$eval('button',els=>els.find(el=>el.textContent.includes('Voltar ao Login')).click());await page.waitForSelector('#login-form');
 assert.equal(await page.$eval('#auth-forgot-password',el=>getComputedStyle(el).color),'rgb(113, 81, 28)');assert(!(await page.$eval('label[for=log-login]',el=>getComputedStyle(el).fontFamily)).toLowerCase().includes('mono'));
 await page.type('#log-login','audit-only');await page.type('#log-password','test-password');await page.click('#btn-login-submit');await page.waitForSelector('#auth-error');
 assert.match(await page.$eval('#auth-error',el=>el.textContent),/temporariamente indisponível/);
 loginAvailable=true;await page.click('#btn-login-submit');await page.waitForSelector('#auth-success');assert.equal(await page.$eval('#btn-login-submit',el=>el.disabled),true);assert.equal(loginCalls,2);await page.waitForSelector('.ns-app');
 console.log('Registration failure retry, successful transition lock, profile-sync recovery, unavailable login, and successful login transition passed with local fixtures.');
}finally{await browser.close();}

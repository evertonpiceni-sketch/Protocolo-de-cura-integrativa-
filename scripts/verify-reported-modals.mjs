// Browser regression: all APIs are intercepted, with synthetic accounts only.
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.FOUR_LAYOUTS_OUT||'/tmp/reported-modal-fixes';
const url=process.env.FOUR_LAYOUTS_URL||'http://127.0.0.1:4173/';
assert(['localhost','127.0.0.1'].includes(new URL(url).hostname),'QA must not write to production');
await fs.mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.QA_BROWSER||'/usr/bin/chromium',args:['--no-sandbox','--disable-gpu']});
const results=[];
const audioFixture=await fs.readFile('public/brand/natural-sereno/voz-masculina-amostra.mp3');
const layouts={'natural-sereno':'Natural Sereno','elegancia-profunda':'Elegância Profunda','essencia-luminosa':'Essência Luminosa','mistico-moderno':'Místico Moderno'};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function clickText(page,text){
 for(const h of await page.$$('button')){
  const found=await h.evaluate((e,t)=>e.textContent.trim().startsWith(t)&&e.getBoundingClientRect().height>0,text);
  if(found){await h.evaluate(e=>e.scrollIntoView({block:'center'}));await h.click();return;}
 }throw Error('Missing visible button: '+text);
}
async function selectLayout(page,layout){
 await page.waitForSelector('[aria-labelledby="layout-choice-title"]');
 assert.equal(await page.evaluate(()=>document.documentElement.hasAttribute('data-layout')),false,'No theme before explicit confirmation');
 const images=await page.$$eval('[aria-labelledby="layout-choice-title"] button img',es=>es.map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0})));
 assert.equal(images.length,4,'Four actual reference images, with no synthetic preview');
 for(const h of await page.$$('[aria-labelledby="layout-choice-title"] button'))if(await h.evaluate((e,n)=>e.querySelector('h3')?.textContent===n,layouts[layout])){await h.click();break;}
 await clickText(page,'Confirmar');await page.waitForFunction(l=>document.documentElement.dataset.layout===l,{},layout);
 await page.waitForSelector('.reference-layout');await delay(300);
}
try{
 for(const [layout,name] of Object.entries(layouts).filter(([id])=>!process.env.QA_LAYOUT||id===process.env.QA_LAYOUT)){
  const page=await browser.newPage();page.setDefaultTimeout(12000);
  const record={layout,name,screens:[],responsive:[],errors:[],requests:[]};results.push(record);
  page.on('pageerror',e=>record.errors.push(e.message));
  const profile={name:'Maria',fullName:'Maria',login:'reference-qa',email:'qa@example.test',birthDate:'1990-01-01',visualLayout:layout,voiceId:'mJqP14JQFEK0PojR5lfV',plan:'pro',subscriptionPlan:'mensal',selectedJourney:'21d',selectedProtocolId:'transformacao',audioEnabled:false,bgMusicType:'none',notificationsEnabled:false,anamnesis:{filledAt:'2026-10-12',mainComplaints:[],stressLevel:3,sleepQuality:'bom',physicalSymptoms:[],emotionalState:[],primaryGoal:'Presença',dailyTimeAvailable:'20min',recommendedFrequency:'528hz',prescribedFocus:'Presença'}};
  await page.evaluateOnNewDocument(()=>{if(!sessionStorage.getItem('reference-qa-welcome'))sessionStorage.setItem('transformation_journey_entered_v2','true');localStorage.setItem('cura_integrada_welcome_seen_v1','true')});
  await page.setRequestInterception(true);page.on('request',r=>{
   const p=new URL(r.url()).pathname;
   if(p==='/api/auth/me')return r.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{profile,role:'user',progress:Array.from({length:21},(_,i)=>({dayNumber:i+1,completed:i<2}))}})});
   if(p==='/api/tts/stream'||p==='/api/elevenlabs/tts')return r.respond({status:200,contentType:'audio/mpeg',body:audioFixture});
   if(p==='/api/community')return r.respond({status:200,contentType:'application/json',body:'{"posts":[],"canModerate":false}'});
   if(p.startsWith('/api/')){record.requests.push({path:p,method:r.method()});return r.respond({status:200,contentType:'application/json',body:'{}'});}
   return r.continue();
  });
  async function capture(screen){
   await page.evaluate(()=>document.fonts.ready);await delay(200);await page.evaluate(()=>window.scrollTo(0,0));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${layout}/${screen}: horizontal overflow`);
   const path=`${out}/${layout}-${screen}.png`;await page.screenshot({path});record.screens.push({screen,path});
  }
  async function home(){if(await page.$('[data-ns-screen="home"]'))return;if(await page.$('.ns-dock'))await page.click('.ns-dock button:first-child');else await page.click('.ns-page-heading > button');await page.waitForSelector('[data-ns-screen="home"]');}
  async function menu(){await home();await page.click('.ns-home-menu');await page.waitForSelector('[data-ns-screen="menu"]');}
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});await page.goto(url,{waitUntil:'domcontentloaded'});await selectLayout(page,layout);
   await capture('home');
   async function resources(){await menu();await clickText(page,'Recursos');await page.waitForSelector('[data-ns-screen="resources"]');}
   await resources();await clickText(page,'Numerologia');await page.waitForSelector('#numerology-modal');
   await capture('numerology');
   record.cycle = await page.$eval('.numerology-cycle', e=>({background:getComputedStyle(e).backgroundColor, color:getComputedStyle(e.querySelector('p')).color}));
   await page.click('[aria-label="Fechar mapa numerológico"]');
   await resources();await clickText(page,'Mapa Astral');await page.waitForSelector('#astral-map-modal');await capture('astrology');
   assert(await page.$('[data-reading="astrology"]'));
   await page.click('[aria-label="Fechar mapa astral"]');
   await resources();await clickText(page,'Numerologia');await page.waitForSelector('#numerology-modal');await clickText(page,'Versão Completa');await clickText(page,'Ver Planos PRO');await page.waitForSelector('#plans-modal');await capture('plans');
   record.actions=await page.$$eval('#plans-modal button.plan-primary-action',es=>es.map(e=>({label:e.textContent,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor})));
   assert(record.actions.length>0);
   const contrast=(fg,bg)=>{
    const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];};
    const a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   };
   for(const b of record.actions){b.contrast=contrast(b.color,b.background);assert(b.contrast>=4.5,JSON.stringify(b));}
   await clickText(page,'Escolher');await capture('checkout');
   assert.equal(await page.$$eval('#checkout-planos [data-universal-core-benefit]',es=>es.length),1);
   assert(contrast(record.cycle.color,record.cycle.background)>=4.5,'Personal year must remain legible');
   profile.numerologyPurchased=true;profile.astralMapPurchased=true;
   await page.reload({waitUntil:'domcontentloaded'});await selectLayout(page,layout);
   await resources();await clickText(page,'Numerologia');await page.waitForSelector('#numerology-modal');await clickText(page,'Versão Completa');
   assert(await page.$('[data-reading="numerology"]'));await capture('numerology-complete');
   assert((await page.$eval('[data-reading="numerology"]',e=>e.textContent)).includes('Integração em sete dias'));
   await page.click('[aria-label="Fechar mapa numerológico"]');
   await resources();await clickText(page,'Mapa Astral');await page.waitForSelector('#astral-map-modal');await page.click('[role="tab"][aria-label^="Versão Completa"]');
   await capture('astrology-complete');assert((await page.$eval('[data-reading="astrology"]',e=>e.textContent)).includes('Roteiro de reflexão aprofundada'));

   assert.deepEqual(record.errors,[]);record.passed=true;
  }catch(e){record.passed=false;record.failure=e.stack;console.error(layout,e.message);await page.screenshot({path:`${out}/${layout}-failure.png`}).catch(()=>{});}
  await page.close();console.log(name,record.passed?'PASS':'FAIL',record.screens.length,'screens');
 }
}finally{await browser.close();await fs.writeFile(`${out}/verification.json`,JSON.stringify(results,null,2));}
assert(results.every(r=>r.passed),'See verification.json for failures');

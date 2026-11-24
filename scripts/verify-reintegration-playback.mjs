// Browser regression: all APIs are intercepted, with synthetic accounts only.
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.FOUR_LAYOUTS_OUT||'/tmp/reintegration-playback-qa';
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
  let failVoice=true;
  const profile={name:'Maria',fullName:'Maria',login:'reference-qa',email:'qa@example.test',birthDate:'1990-01-01',visualLayout:layout,voiceId:'mJqP14JQFEK0PojR5lfV',plan:'pro',subscriptionPlan:'mensal',selectedJourney:'21d',selectedProtocolId:'transformacao',audioEnabled:false,bgMusicType:'none',notificationsEnabled:false,anamnesis:{filledAt:'2026-10-12',mainComplaints:[],stressLevel:3,sleepQuality:'bom',physicalSymptoms:[],emotionalState:[],primaryGoal:'Presença',dailyTimeAvailable:'20min',recommendedFrequency:'528hz',prescribedFocus:'Presença'}};
  await page.evaluateOnNewDocument(()=>{if(!sessionStorage.getItem('reference-qa-welcome'))sessionStorage.setItem('transformation_journey_entered_v2','true');localStorage.setItem('cura_integrada_welcome_seen_v1','true')});
  await page.evaluateOnNewDocument(()=>{
   window.qaFailMusic=true;
   HTMLMediaElement.prototype.play=function(){
    if(window.qaFailMusic && this.src.includes('vercel-storage.com')) return Promise.reject(new Error('fixture music unavailable'));
    this.qaPlaying=true;this.dispatchEvent(new Event('playing'));return Promise.resolve();
   };
   HTMLMediaElement.prototype.pause=function(){this.qaPlaying=false;this.dispatchEvent(new Event('pause'));};
   Object.defineProperty(HTMLMediaElement.prototype,'paused',{get(){return !this.qaPlaying;},configurable:true});
  });
  await page.setRequestInterception(true);page.on('request',r=>{
   const p=new URL(r.url()).pathname;
   if(p==='/api/reintegration-tts')return r.respond(failVoice?{status:503,contentType:'application/json',body:'{"error":"fixture unavailable"}'}:{status:200,contentType:'audio/mpeg',body:audioFixture});
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
   await menu();await clickText(page,'21 Dias para Voltar para Mim');
   await page.waitForSelector('.ep-reintegration-acceptance');await page.click('.ep-reintegration-acceptance input');
   await clickText(page,'Iniciar meditação guiada');await page.waitForSelector('[data-ep-reintegration-running]');
   await page.waitForFunction(()=>document.querySelector('[data-ep-reintegration-running] [role="alert"]')?.textContent.includes('música'));
   assert.equal(await page.$eval('.ep-reintegration-running-cta',e=>e.textContent.trim()),'Continuar');await capture('music-error');
   await page.evaluate(()=>window.qaFailMusic=false);await page.click('.ep-reintegration-running-cta');
   await page.waitForFunction(()=>document.querySelector('[data-ep-reintegration-running] [role="alert"]')?.textContent.includes('narração'));
   await capture('voice-error');await page.click('.ep-reintegration-running-cta');
   failVoice=false;await page.click('.ep-reintegration-running-cta');
   await page.waitForFunction(()=>!document.querySelector('[data-ep-reintegration-running] [role="alert"]'));
   assert.equal(await page.$eval('.ep-reintegration-running-cta',e=>e.textContent.trim()),'Pausar');
   await capture('playing');await page.click('.ep-reintegration-running-cta');
   assert.equal(await page.$eval('.ep-reintegration-running-cta',e=>e.textContent.trim()),'Continuar');
   await page.click('[aria-label="Fechar meditação"]');
   assert.equal(await page.$('[data-ep-reintegration-running]'),null);
   assert.deepEqual(record.errors,[]);record.passed=true;
  }catch(e){record.passed=false;record.failure=e.stack;console.error(layout,e.message);await page.screenshot({path:`${out}/${layout}-failure.png`}).catch(()=>{});}
  await page.close();console.log(name,record.passed?'PASS':'FAIL',record.screens.length,'screens');
 }
}finally{await browser.close();await fs.writeFile(`${out}/verification.json`,JSON.stringify(results,null,2));}
assert(results.every(r=>r.passed),'See verification.json for failures');

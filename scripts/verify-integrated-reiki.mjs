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
   if(p==='/api/tts/stream'||p==='/api/elevenlabs/tts'){record.narration ||= [];record.narration.push(JSON.parse(r.postData()||'{}').text||'');return r.respond({status:200,contentType:'audio/mpeg',body:audioFixture});}
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
   await menu();await clickText(page,'Jornada Integrada — 21 dias');await page.waitForSelector('#arcanjo-protocol-view');
   assert.equal(await page.$$eval('[aria-label="21 dias da Jornada Integrada"] button',es=>es.length),21);
   record.days=[];
   for(let day=1;day<=21;day++){
    await page.click(`[aria-label^="Abrir dia ${day},"]`);
    await page.waitForSelector(`[data-reiki-art-day="${day}"]`);
    record.days.push(await page.$eval('[data-reiki-art-day]',e=>({day:Number(e.dataset.reikiArtDay),title:e.querySelector('h2').textContent,position:getComputedStyle(e.querySelector('[role="img"]')).backgroundPosition})));
    if([1,7,8,14,15,21].includes(day)){await page.$eval('[data-reiki-art-day]',e=>e.scrollIntoView({block:'center'}));await capture(`day-${day}`);}
   }
   assert.equal(new Set(record.days.map(d=>d.position)).size,21);
   await clickText(page,'Ler roteiro completo');
   assert((await page.$eval('#arcanjo-protocol-view',e=>e.textContent)).includes('Dia 21. Eu volto para mim.'));
   await page.click('[aria-label="Iniciar ou continuar"]');
   await page.waitForFunction(()=>document.querySelector('[aria-label="Pausar"]'));
   assert(record.narration.some(t=>t.includes('Dia 21. Eu volto para mim.')&&t.includes('Arcanjo Rafael')));
   await page.click('[aria-label="Pausar"]');
   await clickText(page,'Concluir o momento de hoje');
   assert.equal(await page.evaluate(()=>localStorage.getItem('reiki_integrada_21_dia_21')),'true');
   assert.deepEqual(record.errors,[]);record.passed=true;
  }catch(e){record.passed=false;record.failure=e.stack;console.error(layout,e.message);await page.screenshot({path:`${out}/${layout}-failure.png`}).catch(()=>{});}
  await page.close();console.log(name,record.passed?'PASS':'FAIL',record.screens.length,'screens');
 }
}finally{await browser.close();await fs.writeFile(`${out}/verification.json`,JSON.stringify(results,null,2));}
assert(results.every(r=>r.passed),'See verification.json for failures');

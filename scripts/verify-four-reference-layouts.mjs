// Browser regression: all APIs are intercepted, with synthetic accounts only.
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.FOUR_LAYOUTS_OUT||'/tmp/four-reference-layouts';
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
   for(const width of [320,390,768,1440]){
    await page.setViewport({width,height:844,deviceScaleFactor:1});await delay(100);
    const data=await page.evaluate((l)=>({overflow:document.documentElement.scrollWidth>innerWidth+1,dock:[...document.querySelectorAll(l==='elegancia-profunda'?'.ref-home-shortcuts button':'.ns-dock button')].map(e=>{const r=e.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {label:e.textContent,visible:r.x>=0&&r.right<=innerWidth&&r.y>=0&&r.bottom<=innerHeight,uncovered:hit?.closest('button')===e};})}),layout);
    assert.equal(data.overflow,false);assert(data.dock.every(b=>b.visible&&b.uncovered),JSON.stringify(data.dock));record.responsive.push({width,...data});
    if(width===1440)await capture('home-desktop');
   }
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   await menu();await capture('menu');
   await clickText(page,'Ferramentas de Apoio');await page.waitForSelector('[data-ns-screen="tools"]');await capture('tools');
   await menu();await clickText(page,'Recursos');await page.waitForSelector('[data-ns-screen="resources"]');await capture('resources');
   await page.type('[aria-label="Buscar nos recursos"]','Numerologia');assert.equal(await page.$$eval('.ns-library-row',es=>es.length),1);
   await page.$eval('[aria-label="Buscar nos recursos"]',e=>e.select());await page.keyboard.type('sem-resultado-qa');await page.waitForSelector('.ns-empty');await capture('resources-empty');
   await menu();await clickText(page,'Minha Comunidade');await page.waitForSelector('[data-ns-screen="community"]');await capture('community');
   await menu();await clickText(page,'Meu Perfil');await page.waitForSelector('[data-ns-screen="profile"]');await capture('profile');
   assert.equal(await page.$eval('progress',e=>e.value),2);
   await clickText(page,'Anamnese Energética');await page.waitForSelector('#anamnesis-modal');await capture('anamnesis-summary');await clickText(page,'Refazer Anamnese');await delay(650);await capture('anamnesis');
   await page.click('button[aria-label="Fechar Mapa do Momento"]');
   if(layout!=='natural-sereno'){await menu();await clickText(page,'Meu Resultado');}else{await home();await clickText(page,'Acolhimento Emocional');}await page.waitForSelector('[data-ns-screen="result"]');await capture('result');
   await menu();await clickText(page,'Protocolo da Transformação');await page.waitForSelector('[data-ns-screen="journey"]');await capture('journey');
   assert.equal(await page.$$eval('.ns-day',es=>es.length),21);
   await page.click('.ns-day:nth-of-type(3)');await page.waitForSelector('#meditation-session');await capture('player-portal');
   await clickText(page,'Aceitar e Adentrar');await page.waitForSelector('[data-session-phase="checkin_before"]');await capture('checkin');
   await clickText(page,'Iniciar a Harmonização');await page.waitForSelector('[data-session-phase="playing"]');await page.waitForFunction(()=>!document.querySelector('.ep-session-checkin')&&document.querySelector('#meditation-session > main')?.getBoundingClientRect().height>300);await delay(650);record.playerGeometry=await page.evaluate(()=>[...document.querySelectorAll('#meditation-session,#meditation-session > main,#meditation-session > footer,#meditation-session .ep-session-stage')].map(e=>({tag:e.tagName,class:e.className,rect:e.getBoundingClientRect().toJSON(),display:getComputedStyle(e).display,height:getComputedStyle(e).height,flex:getComputedStyle(e).flex,position:getComputedStyle(e).position,overflow:getComputedStyle(e).overflow,scrollTop:e.scrollTop})));
   await capture('player');
   assert.equal(await page.$eval('#meditation-session',e=>e.scrollTop),0,'Player starts at the top after check-in');
   assert(await page.$eval('#meditation-session > footer',e=>{const r=e.getBoundingClientRect();return Math.abs(r.bottom-innerHeight)<2}),'Player controls stay at the bottom after transitions');
   assert(await page.$eval('#meditation-session > header',e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),'Player header stays visible');
   await page.click('[aria-label="Sair da sessão"]');await page.waitForSelector('.reference-layout');
   await menu();await clickText(page,'Meu Perfil');await clickText(page,'Configurações');await page.waitForSelector('#settings-view');await capture('settings');
   // Welcome is a separate initial state; reset only the synthetic tab's session.
   await page.evaluate(()=>{sessionStorage.setItem('reference-qa-welcome','true');sessionStorage.removeItem('transformation_journey_entered_v2');});await page.reload({waitUntil:'domcontentloaded'});await selectLayout(page,layout);
   await page.waitForSelector('[data-ns-screen="welcome"]');await capture('welcome');await clickText(page,'Entrar no meu espaço');await page.waitForSelector('[data-ns-screen="home"]');
   assert.deepEqual(record.errors,[]);record.passed=true;
  }catch(e){record.passed=false;record.failure=e.stack;console.error(layout,e.message);await page.screenshot({path:`${out}/${layout}-failure.png`}).catch(()=>{});}
  await page.close();console.log(name,record.passed?'PASS':'FAIL',record.screens.length,'screens');
 }
}finally{await browser.close();await fs.writeFile(`${out}/verification.json`,JSON.stringify(results,null,2));}
assert(results.every(r=>r.passed),'See verification.json for failures');

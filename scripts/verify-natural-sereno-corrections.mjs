// Local visual fixtures only. API policy/persistence is independently exercised by community.test.ts.
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const url=process.env.NATURAL_SERENO_QA_URL || 'http://127.0.0.1:4174/';
assert(new URL(url).hostname==='127.0.0.1','This fixture must never send publication requests to production.');
const out=process.env.NATURAL_SERENO_QA_DIR || '/tmp/natural-sereno-corrections-focused';
await fs.mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const profile={name:'Maria',fullName:'Maria',login:'local-qa',email:'qa@example.test',birthDate:'1990-01-01',visualLayout:'natural-sereno',audioEnabled:false,bgMusicVolume:0,voiceVolume:1,bgMusicType:'none',plan:'pro',selectedJourney:'21d',notificationsEnabled:false};
let posts=[];const sent=[];
await page.setRequestInterception(true);
page.on('request',r=>{
 const p=new URL(r.url()).pathname;
 if(p==='/api/auth/me')return r.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{profile,progress:Array.from({length:21},(_,i)=>({dayNumber:i+1,completed:false})),role:'user'}})});
 if(p==='/api/community'){
  if(r.method()==='POST'){const data=JSON.parse(r.postData());sent.push(data);posts.push({id:'local-only',initials:'Q.A.',text:data.text,createdAt:new Date().toISOString(),mine:true,status:'pending',likes:0,liked:false});return r.respond({status:201,contentType:'application/json',body:'{"id":"local-only","status":"pending"}'});}
  return r.respond({status:200,contentType:'application/json',body:JSON.stringify({posts,canModerate:false})});
 }
 if(p==='/api/elevenlabs/tts'||p==='/api/reintegration-tts')return r.respond({status:503,contentType:'application/json',body:'{"error":"Local voice fixture"}'});
 if(p==='/api/tts/stream')return r.respond({status:503,contentType:'application/json',body:'{"fallbackToSpeechSynthesis":true}'});
 if(p.startsWith('/api/'))return r.respond({status:200,contentType:'application/json',body:'{}'});
 r.continue();
});
await page.evaluateOnNewDocument(()=>{
 sessionStorage.setItem('transformation_journey_entered_v2','true');localStorage.setItem('cura_integrada_welcome_seen_v1','true');
 Object.defineProperty(speechSynthesis,'speak',{value:utterance=>{window.__nativeUtterance=utterance;utterance.onstart?.(new Event('start'));},configurable:true});
 HTMLMediaElement.prototype.play=function(){return Promise.resolve()};
 Object.defineProperty(HTMLMediaElement.prototype,'duration',{get(){return 1797},configurable:true});
});
const wait=()=>new Promise(r=>setTimeout(r,400));
async function text(label){for(const h of await page.$$('button'))if(await h.evaluate((e,label)=>e.textContent.trim()===label,label)){await h.click();return}throw Error(`Missing button: ${label}`)}
async function dock(label){for(const h of await page.$$('.ns-dock button'))if(await h.evaluate((e,l)=>e.textContent.trim()===l,label)){await h.click();return}throw Error(label)}
async function capture(name){await wait();await page.screenshot({path:`${out}/${name}.png`})}
try{
 await page.setViewport({width:1365,height:600});await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-ns-screen="home"]');await capture('desktop-home');
 assert(await page.$eval('.ns-app',e=>e.getBoundingClientRect().width>=900));
 assert(await page.$eval('.ns-home-scene > .ns-gold',e=>e.getBoundingClientRect().bottom<=document.querySelector('.ns-dock').getBoundingClientRect().top),'Home CTA must fit above desktop navigation');
 await dock('Comunidade');await page.waitForSelector('#community-experience');await capture('desktop-community');
 await page.type('#community-experience','Hoje encontrei um momento de presença.');
 assert(await page.$eval('.ns-community-composer button',e=>e.disabled));
 await page.click('.ns-community-consent input');await page.click('.ns-community-composer button');await page.waitForSelector('.ns-community-post');
 assert.equal(sent[0].consent,true);assert.equal(sent[0].text,'Hoje encontrei um momento de presença.');
 assert(await page.$eval('.ns-community-post',e=>e.textContent.includes('Em revisão')));
 await dock('Início');await page.click('button[aria-label="Abrir menu principal"]');
 for(const h of await page.$$('.ns-row'))if(await h.evaluate(e=>e.textContent.includes('Anamnese / Teste'))){await h.click();break}
 await page.waitForSelector('#anamnesis-modal');await page.$eval('[aria-label="Fechar Mapa do Momento"]',e=>e.focus());await page.keyboard.down('Shift');await page.keyboard.press('Tab');await page.keyboard.up('Shift');
 assert(await page.evaluate(()=>!!document.activeElement.closest('#anamnesis-modal')),'Modal focus must stay inside');
 await text('Avançar');await wait();assert.equal(await page.$eval('#anamnesis-modal > div',e=>e.scrollTop),0);
 assert(await page.$('input[aria-label="Nível de estresse ou tensão atual"]'));
 await page.keyboard.press('Escape');await page.waitForSelector('#anamnesis-modal',{hidden:true});
 await dock('Jornada');await page.click('.ns-day');await page.waitForSelector('.ep-acceptance-portal');await text('Aceitar e Adentrar o Espaço Sagrado');await page.waitForSelector('[data-session-phase="checkin_before"]');await text('Iniciar a Harmonização');await page.waitForSelector('[data-session-phase="playing"]');await capture('desktop-player');
 const rect=await page.$eval('.ns-play-toggle',e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}});
 assert(rect.bottom<=600 && rect.top>=0,`Desktop player must fit: ${JSON.stringify(rect)}`);
 await page.waitForFunction(()=>!!window.__nativeUtterance?.onboundary);await page.evaluate(()=>window.__nativeUtterance.onboundary({elapsedTime:5}));await wait();
 assert(await page.$eval('.ep-breathing-guide',e=>e.textContent.includes('Sustente em Paz')),'Breathing must follow native speech progress');
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('[data-ns-screen="home"]');await page.click('button[aria-label="Abrir menu principal"]');await text('21 Dias para Voltar para Mim\nReintegração da Vida').catch(async()=>{for(const h of await page.$$('.ns-row'))if(await h.evaluate(e=>e.textContent.includes('Reintegração da Vida'))){await h.click();return}});
 await page.waitForSelector('.ep-reintegration-shell');
 assert.equal(await page.$eval('.ep-reintegration-card summary',e=>e.parentElement.open),false);
 await page.$eval('.ep-reintegration-card summary',e=>e.click());assert.equal(await page.$eval('.ep-reintegration-card summary',e=>e.parentElement.open),true);
 await page.$eval('.ep-reintegration-card summary',e=>e.click());
 await page.$eval('.ep-reintegration-card summary',e=>e.scrollIntoView({block:'center'}));await capture('energy-details-collapsed');
 await page.$eval('.ep-reintegration-card summary',e=>e.click());await capture('energy-details-expanded');await page.$eval('.ep-reintegration-card summary',e=>e.click());
 await capture('desktop-reintegration');await page.click('.ep-reintegration-card input[type="checkbox"]');await text('Iniciar meditação guiada');await page.waitForSelector('[aria-label="Meditação guiada em andamento"]');await capture('desktop-reintegration-playing');
 assert.equal(await page.$$eval('[aria-label="Meditação guiada em andamento"] .reintegration-presence-frame',els=>els.filter(e=>+getComputedStyle(e).opacity===1).length),1);
 await page.evaluate(()=>{const audio=document.querySelector('.ep-reintegration-shell > audio');Object.defineProperty(audio,'currentTime',{value:950,writable:true,configurable:true});audio.dispatchEvent(new Event('timeupdate',{bubbles:true}));});await new Promise(r=>setTimeout(r,1700));
 assert.equal(await page.$eval('[aria-label="Meditação guiada em andamento"] .reintegration-presence-visual',e=>e.getAttribute('aria-label')),'Enraizamento nos pés e no solo');await capture('desktop-reintegration-grounding');
 await text('Ler roteiro deste dia');await page.waitForSelector('[aria-label="Roteiro do Dia 1: Presença e chão"]');assert(await page.$eval('[aria-label="Roteiro do Dia 1: Presença e chão"]',e=>e.textContent.includes('Encontre uma posição confortável.')));await text('Fechar roteiro');
 await page.setViewport({width:390,height:844});await capture('mobile-reintegration-playing');
 assert.equal(errors.length,0,errors.join('\n'));
 await fs.writeFile(`${out}/checks.json`,JSON.stringify({checks:['desktop web width','community consent and real request shape','pending state','desktop playback control visible','energy details collapsed, expandable','approved Day 1 artwork','same Reintegração voice cues in script panel','mobile/desktop captures'],errors},null,2));
 console.log('Focused audit corrections passed. Local fixtures; no production writes.');
}finally{await browser.close()}

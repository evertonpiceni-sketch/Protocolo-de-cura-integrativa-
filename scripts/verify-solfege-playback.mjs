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
await page.evaluateOnNewDocument(()=>{
 window.__startedFrequencies=[];window.__stoppedFrequencies=[];
 const create=AudioContext.prototype.createOscillator;
 AudioContext.prototype.createOscillator=function(){const node=create.call(this);let scheduledFrequency=node.frequency.value;const setFrequency=node.frequency.setValueAtTime.bind(node.frequency);node.frequency.setValueAtTime=(value,time)=>{scheduledFrequency=value;return setFrequency(value,time)};const start=node.start.bind(node),stop=node.stop.bind(node);node.start=(...args)=>{window.__startedFrequencies.push(scheduledFrequency);return start(...args)};node.stop=(...args)=>{window.__stoppedFrequencies.push(scheduledFrequency);return stop(...args)};return node;};
});
try {
 await page.setViewport({width:1365,height:844});await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForSelector('.ns-dock');await dock('Jornada');
 for(const row of await page.$$('.ns-row'))if(await row.evaluate(e=>e.textContent.includes('Proteção e Presença'))){await row.click();break;}
 const verified=[];
 for(const [index,frequency] of [396,417,528,639,741,852,963].entries()) {
  const day=index+1;
  await page.click(`button[aria-label^="Abrir dia ${day},"]`);
  await page.evaluate(()=>{window.__startedFrequencies=[];window.__stoppedFrequencies=[]});
  await page.waitForSelector('button[aria-label="Iniciar ou continuar"]');await page.click('button[aria-label="Iniciar ou continuar"]');
  await page.waitForFunction(expected=>window.__startedFrequencies.includes(expected),{timeout:8000},frequency);
  await page.waitForSelector('button[aria-label="Pausar"]');await page.click('button[aria-label="Pausar"]');
  assert(await page.evaluate(expected=>window.__stoppedFrequencies.includes(expected),frequency),'Named frequency must stop with the practice');
  verified.push({day,frequency,...await page.evaluate(()=>({started:window.__startedFrequencies,stopped:window.__stoppedFrequencies}))});
 }
 await capture('saint-michael-frequency');
 await fs.writeFile(`${out}/frequency.json`,JSON.stringify(verified,null,2));
 console.log('Real Web Audio starts and stops all seven named Solfeggio tones. Voice held in a local fixture.');
} finally { await browser.close(); }

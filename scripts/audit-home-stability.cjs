const puppeteer = require('puppeteer');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const url = process.env.JORNADA_QA_URL || 'http://127.0.0.1:4177/';
assert(['localhost','127.0.0.1'].includes(new URL(url).hostname));
(async () => {
 const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-gpu',...(process.env.HTTPS_PROXY?['--proxy-server='+process.env.HTTPS_PROXY,'--proxy-bypass-list=127.0.0.1;localhost']:[])]});
 const checks=[];
 try {
  for (const state of ['no-anamnesis','no-access','choose-protocol','active-journey']) {
   const page = await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const profile={name:'Maria',fullName:'Maria',login:'synthetic-qa',visualLayout:'natural-sereno',plan:'pro',audioEnabled:false,bgMusicType:'none',bgMusicVolume:0,notificationsEnabled:false,
    subscriptionPlan:state==='no-access'?undefined:'mensal',selectedJourney:'21d',selectedProtocolId:state==='choose-protocol'?undefined:'transformacao',
    anamnesis:state==='no-anamnesis'?undefined:{filledAt:'2026-10-12',mainComplaints:[],complaintNotes:'',stressLevel:3,sleepQuality:'bom',physicalSymptoms:[],emotionalState:[],chakraImbalance:[],primaryGoal:'Presença',goalDetails:'',dailyTimeAvailable:'20min',recommendedFrequency:'528hz',prescribedFocus:'Presença',customDecree:''}};
   await page.evaluateOnNewDocument(()=>{if(location.protocol!=='http:')return;sessionStorage.setItem('transformation_journey_entered_v2','true');localStorage.setItem('cura_integrada_welcome_seen_v1','true');});
   await page.setRequestInterception(true);page.on('request',r=>{const path=new URL(r.url()).pathname;if(path==='/api/auth/me')return r.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{profile,role:'user',progress:Array.from({length:21},(_,i)=>({dayNumber:i+1,completed:false}))}})});if(path.startsWith('/api/'))return r.respond({status:200,contentType:'application/json',body:'{}'});r.continue()});
   await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.goto(url,{waitUntil:'domcontentloaded'});
   const cls={'no-anamnesis':'ep-home-needs-anamnesis','no-access':'ep-home-needs-access','choose-protocol':'ep-home-needs-protocol','active-journey':'ep-home-active-journey'}[state];
   await page.waitForSelector('.ns-app.'+cls);await new Promise(r=>setTimeout(r,500));
   await page.evaluate(()=>{window.homeMutations=0;window.qaHomeObserver=new MutationObserver(records=>{window.homeMutations+=records.length});window.qaHomeObserver.observe(document.querySelector('.ns-app'),{childList:true,subtree:true})});
   await new Promise(r=>setTimeout(r,800));const mutations=await page.evaluate(()=>window.homeMutations);assert(mutations<5,state+' must settle; mutations='+mutations);
   assert.deepEqual(errors,[]);
   const disabled=await page.$eval('[data-ep-quick="journey"]',e=>e.disabled);assert.equal(disabled,state!=='active-journey');
   if(state==='choose-protocol')assert.equal(await page.$$eval('[data-ep-select-protocol]',es=>es.length),2);
   checks.push({state,mutations,journeyDisabled:disabled,errors});await page.screenshot({path:'/tmp/home-state-'+state+'.png'});await page.close();
  }
  fs.writeFileSync('/tmp/home-stability-checks.json',JSON.stringify(checks,null,2));console.log(checks);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

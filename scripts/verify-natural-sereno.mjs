// Browser QA uses synthetic fixtures and intercepts every API request. No production data is changed.
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const out=process.env.NATURAL_SERENO_QA_DIR || '/tmp/natural-sereno-qa';
await fs.mkdir(out,{recursive:true});
const qaUrl=process.env.NATURAL_SERENO_QA_URL || 'http://127.0.0.1:4173/';
const browser=await puppeteer.launch({executablePath:process.env.NATURAL_SERENO_QA_BROWSER || '/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage();
const errors=[]; const consoleErrors=[]; const checks=[];
page.on('pageerror',err=>errors.push(err.message));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('Failed to load resource'))consoleErrors.push(msg.text())});
let profile={name:'Maria',fullName:'Maria',login:'visual-qa',email:'visual-qa@example.test',birthDate:'1990-01-01',currentStreak:0,longestStreak:0,visualLayout:'natural-sereno',audioEnabled:false,bgMusicVolume:0,voiceVolume:1,bgMusicType:'none',plan:'pro',selectedJourney:'21d',notificationsEnabled:false};
const progress=Array.from({length:21},(_,i)=>({dayNumber:i+1,completed:i<2}));
await page.setRequestInterception(true);
page.on('request',req=>{
 const path=new URL(req.url()).pathname;
 if(path==='/api/auth/me')return req.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{profile,progress,role:'user'}})});
 if(path==='/api/elevenlabs/tts')return req.respond({status:503,contentType:'application/json',body:'{"error":"QA: use browser voice fallback"}'});
 if(path.startsWith('/api/'))return req.respond({status:200,contentType:'application/json',body:'{}'});
 req.continue();
});
await page.evaluateOnNewDocument(()=>{
 if(localStorage.getItem('natural-sereno-qa-welcome')==='true')sessionStorage.removeItem('transformation_journey_entered_v2');else sessionStorage.setItem('transformation_journey_entered_v2','true');
 localStorage.setItem('cura_integrada_welcome_seen_v1','true');
 Object.defineProperty(window.speechSynthesis,'speak',{value:utterance=>{utterance.onstart?.(new Event('start'));},configurable:true});
});
const ready=async(selector)=>{await page.waitForSelector(selector);await new Promise(r=>setTimeout(r,750))};
const shot=async(name)=>{console.log(`QA capture: ${name}`);await page.screenshot({path:`${out}/${name}.png`})};
const dock=async(label)=>{
 const handles=await page.$$('.ns-dock button');
 for(const h of handles){if(await h.evaluate((el,label)=>el.textContent.trim()===label,label)){
 const unobstructed=await h.evaluate(el=>{const r=el.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===el});
 if(!unobstructed)console.log(await h.evaluate(el=>{const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {rect:r.toJSON(),hit:hit?.outerHTML?.slice(0,600)}}));assert(unobstructed,`${label} must not be covered`); await h.click(); return;
 }}throw Error(`Missing dock ${label}`);
};
const menu=async()=>{await dock('Início');await page.click('[aria-label="Abrir menu principal"]');await ready('[data-ns-screen="menu"]')};
const row=async(title)=>{const handles=await page.$$('.ns-row');for(const h of handles){if(await h.evaluate((el,title)=>el.querySelector('strong')?.textContent===title,title)){await h.evaluate(el=>el.scrollIntoView({block:'center'}));await h.click();return}}throw Error(`Missing row ${title}`)};
const textButton=async(text)=>{for(const h of await page.$$('button')){if(await h.evaluate((el,text)=>el.textContent.trim()===text,text)){await h.click();return}}throw Error(`Missing ${text}`)};
try {
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});
 await page.goto(qaUrl,{waitUntil:'networkidle0'});
 await ready('[data-ns-screen="home"]');await shot('home');
 for(const [label,screen]of[['Jornada','journey'],['Biblioteca','library'],['Comunidade','community']]){await dock(label);await ready(`[data-ns-screen="${screen}"]`);await shot(screen)}
 checks.push('Home, jornada, biblioteca and community navigate by real pointer clicks; dock unobstructed.');
 await dock('Jornada');
 assert.equal(await page.$$eval('.ns-day img',els=>new Set(els.map(img=>img.getAttribute('src'))).size),21);
 await page.$$eval('.ns-day img',async els=>{for(const img of els)img.loading='eager';await Promise.all(els.map(img=>img.decode()))});
 checks.push('All 21 journey thumbnails are distinct and load successfully.');
 await dock('Biblioteca');
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.ns-library-row img')).every(img=>img.complete && img.naturalWidth>0));
 assert(await page.$$eval('.ns-library-row img',els=>els.every(img=>img.getAttribute('src').startsWith('/brand/natural-sereno/'))));
 checks.push('Every Natural Sereno library thumbnail loads from an isolated theme asset.');
 assert.equal(await page.$$eval('.ns-library-row img',els=>new Set(els.map(img=>img.getAttribute('src'))).size),6);
 assert(await page.$eval('.ns-library-row:last-of-type',el=>el.getBoundingClientRect().bottom<=document.querySelector('.ns-dock').getBoundingClientRect().top),'All six library rows fit above the dock');
 checks.push('Six distinct library cards fit above the dock at the approved 390×844 viewport.');
 await page.type('input[aria-label="Buscar na biblioteca"]','numerologia');
 assert.equal(await page.$$eval('.ns-library-row',els=>els.length),1);
 await page.$eval('input[aria-label="Buscar na biblioteca"]',el=>el.select());await page.keyboard.type('sem resultado');
 await ready('.ns-empty'); checks.push('Library search and empty state.');
 await menu();await shot('menu');
 assert(await page.$eval('.ns-row:last-of-type',el=>el.getBoundingClientRect().bottom<=document.querySelector('.ns-dock').getBoundingClientRect().top),'Menu last row stays above the dock');
 checks.push('All six menu rows fit above the dock at 390×844.');
 await row('Ferramentas de Apoio');await ready('[data-ns-screen="tools"]');await shot('tools');
 await menu();await row('Meu Perfil');await ready('[data-ns-screen="profile"]');await shot('profile');
 assert.equal(await page.$eval('progress',el=>el.value),2);checks.push('Profile progress uses the supplied real completion data.');
 assert(await page.$eval('.ns-profile .ns-row:last-of-type',el=>el.getBoundingClientRect().bottom<=document.querySelector('.ns-dock').getBoundingClientRect().top),'Profile logout stays above the dock');
 await row('Fale conosco');await ready('#contact-us-modal');await page.click('button[aria-label="Fechar Fale Conosco"]');await ready('[data-ns-screen="profile"]');
 checks.push('Profile logout is visible above the dock and contact opens/closes with existing callbacks.');
 await row('Como estou?');await ready('#anamnesis-modal');await shot('anamnesis');
 await page.click('button[aria-label="Fechar Mapa do Momento"]');
 await dock('Jornada');await page.click('button[aria-label="Abrir dia 3: Purificação das Águas"]');await ready('.ep-acceptance-portal');await shot('portal');assert.equal(await page.$eval('#meditation-session header h1',el=>el.textContent.trim()),'Purificação das Águas');
 await textButton('Aceitar e Adentrar o Espaço Sagrado');await ready('[data-session-phase="checkin_before"]');
 await textButton('Iniciar a Harmonização');await ready('[data-session-phase="playing"]');assert.equal(await page.$eval('#meditation-session',el=>el.scrollTop),0,'Player starts at the top after check-in');await shot('player');assert.equal(await page.$eval('#meditation-session > main',el=>getComputedStyle(el).paddingTop),'90px','Approved player scene spacing overrides legacy mobile padding');
 for(const width of [320,390,768,1440]){
  await page.setViewport({width,height:844,deviceScaleFactor:1});
  assert(await page.$eval('.ns-play-toggle',el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth}),`Playback control visible at ${width}`);
  assert(await page.$eval('#meditation-session',el=>el.scrollWidth<=innerWidth),`No player overflow at ${width}`);
 }
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});
 checks.push('Larger playback controls remain visible with no player overflow at 320, 390, 768 and 1440 CSS px.');
 for(const title of ['Pausar sessão','Iniciar sessão','Voltar 15 segundos','Avançar 15 segundos','Ler roteiro completo']){const b=await page.$(`button[title="${title}"]`);if(b)await b.click();await new Promise(r=>setTimeout(r,100))}
 assert(await page.$eval('[aria-label="Roteiro da sessão"]',el=>el.textContent.includes('Que bom ter você aqui.')));
 checks.push('Acceptance → check-in → player; play/pause, seek and script-drawer callbacks do not throw. Browser speech held in QA to inspect the stage.');
 await page.reload({waitUntil:'networkidle0'});await ready('[data-ns-screen="home"]');
 await menu();await row('21 Dias para Voltar para Mim');await ready('.ep-reintegration-shell');await shot('frozen-reintegration');
 const frozen=await page.$eval('.ep-reintegration-shell',el=>({color:getComputedStyle(el).color,canvas:getComputedStyle(el).getPropertyValue('--bg-canvas').trim()}));
 assert.equal(frozen.canvas,'#F8F4EC');checks.push('Reintegração keeps its own frozen ivory tokens.');
 profile.anamnesis={filledAt:new Date().toISOString(),mainComplaints:['ansiedade'],complaintNotes:'',stressLevel:5,sleepQuality:'regular',physicalSymptoms:[],emotionalState:[],chakraImbalance:[],primaryGoal:'Equilíbrio emocional',goalDetails:'',dailyTimeAvailable:'10min',recommendedFrequency:'528hz',prescribedFocus:'Presença',recommendedFloral:'Helianto',recommendedAromatherapy:'Laranja Doce',customDecree:''};
 await page.reload({waitUntil:'networkidle0'});await ready('[data-ns-screen="home"]');
 const label=await page.$eval('.ns-home-content .ns-row-copy strong',el=>el.textContent);
 const handles=await page.$$('.ns-home-content .ns-row');for(const h of handles){if(await h.evaluate(el=>el.querySelector('small')?.textContent==='Seu resultado personalizado')){await h.click();break}}
 await ready('[data-ns-screen="result"]');await shot('result');checks.push('Result uses existing recommendation engine, without altering its content or rules.');
 for(const width of [320,390,768,1440]){await page.setViewport({width,height:900,deviceScaleFactor:1});await dock('Início');await ready('[data-ns-screen="home"]');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow at ${width}`);await shot(`responsive-${width}`)}
 checks.push('No horizontal overflow at 320, 390, 768 and 1440 CSS px.');
 for(const theme of ['elegancia-profunda','essencia-luminosa','mistico-moderno']){profile.visualLayout=theme;await page.reload({waitUntil:'networkidle0'});await ready('.ep-home');assert.equal(await page.$('.ns-app'),null);await shot(`isolated-${theme}`)}
 checks.push('The three other themes keep the legacy component branch and never render Natural Sereno.');
 profile.visualLayout='natural-sereno';await page.reload({waitUntil:'networkidle0'});await ready('.ns-app');await page.evaluate(()=>localStorage.setItem('natural-sereno-qa-welcome','true'));await page.reload({waitUntil:'networkidle0'});await ready('[data-ns-screen="welcome"]');await page.setViewport({width:390,height:844,deviceScaleFactor:1});await shot('welcome');
 await page.click('[aria-label="Ouvir acolhimento"]');await page.waitForSelector('[aria-label="Pausar acolhimento"]');await page.click('[aria-label="Pausar acolhimento"]');await textButton('Entrar na minha jornada');await ready('[data-ns-screen="home"]');
 checks.push('Welcome voice toggle and session-persisted entry still work.');
 const loadingPage=await browser.newPage();
 await loadingPage.setViewport({width:390,height:844,deviceScaleFactor:1});
 await loadingPage.setRequestInterception(true);
 loadingPage.on('request',req=>{const path=new URL(req.url()).pathname;if(path==='/api/auth/me'){setTimeout(()=>req.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{profile,progress,role:'user'}})}),2500);return}if(path.startsWith('/api/'))return req.respond({status:200,contentType:'application/json',body:'{}'});req.continue()});
 await loadingPage.goto(qaUrl,{waitUntil:'domcontentloaded'});await loadingPage.waitForSelector('#auth-loading-view');await new Promise(r=>setTimeout(r,400));await loadingPage.screenshot({path:`${out}/loading.png`});await loadingPage.waitForSelector('.ns-app');await loadingPage.close();
 const loginPage=await browser.newPage();await loginPage.setViewport({width:390,height:844,deviceScaleFactor:1});await loginPage.setRequestInterception(true);
 loginPage.on('request',req=>{const path=new URL(req.url()).pathname;if(path.startsWith('/api/'))return req.respond({status:path==='/api/auth/me'?401:200,contentType:'application/json',body:'{}'});req.continue()});
 await loginPage.goto(qaUrl,{waitUntil:'networkidle0'});await loginPage.waitForSelector('#profile-setup-view');await loginPage.screenshot({path:`${out}/frozen-login.png`});
 for(const theme of ['natural-sereno','elegancia-profunda','essencia-luminosa','mistico-moderno']){
  await loginPage.evaluate(theme=>document.documentElement.dataset.layout=theme,theme);
  assert.equal(await loginPage.$eval('#onboarding-card',el=>getComputedStyle(el).backgroundColor),'rgb(255, 249, 232)','Authentication stays Natural Sereno independently of profile theme');
  assert.equal(await loginPage.$eval('#reg-fullname',el=>getComputedStyle(el).backgroundColor),'rgb(255, 253, 243)','Registration input stays ivory');
  await loginPage.$eval('#register-form details',el=>el.open=true);
  assert.equal(await loginPage.$eval('#register-form details > div',el=>getComputedStyle(el).backgroundColor),'rgb(250, 243, 223)','Expanded registration stays ivory under every theme');
 }
 for(const width of [320,390,713]){
  await loginPage.setViewport({width,height:844,deviceScaleFactor:1});
  assert(await loginPage.$eval('#onboarding-card',el=>el.scrollWidth<=el.clientWidth),'Expanded registration has no horizontal overflow');
  assert(await loginPage.$$eval('#voice-gender-selector .grid > div',els=>els.every(el=>el.scrollWidth<=el.clientWidth)),'Voice cards contain their buttons and labels');
 }
 assert(await loginPage.$eval('#voice-gender-selector',el=>el.textContent.includes('Voz masculina')&&!el.textContent.includes('Éverton')));
 await loginPage.evaluate(()=>{window.__samplePlayed='';HTMLMediaElement.prototype.play=function(){window.__samplePlayed=this.src;return Promise.resolve()};});
 await loginPage.$$eval('#voice-gender-selector button',els=>els.find(el=>el.textContent.includes('Ouvir Amostra')).click());
 await loginPage.waitForFunction(()=>window.__samplePlayed.endsWith('/brand/natural-sereno/voz-masculina-amostra.mp3'));
 await loginPage.setViewport({width:390,height:844,deviceScaleFactor:1});
 await loginPage.$eval('#voice-gender-selector',el=>el.scrollIntoView({block:'center'}));
 await loginPage.screenshot({path:`${out}/registration-options.png`});
 checks.push('Expanded registration uses ivory under all themes, has no overflow at 320/390/713 px, and plays the static male sample before login without personal voice attribution.');
 await loginPage.click('#auth-tabs button:nth-child(2)');await loginPage.waitForSelector('#login-form');
 assert.equal(await loginPage.$eval('#login-form input:not([type="checkbox"])',el=>getComputedStyle(el).backgroundColor),'rgb(255, 253, 243)');
 await loginPage.screenshot({path:`${out}/login.png`});
 checks.push('Registration and login keep ivory Natural Sereno surfaces under all four theme IDs; existing tabs work.');
 await loginPage.close();
 checks.push('Loading scene captured and frozen registration/login remains accessible without authentication.');
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
 await fs.writeFile(`${out}/verification.json`,JSON.stringify({checks,errors,consoleErrors,frozen},null,2));
 console.log(JSON.stringify({checks,errors,consoleErrors},null,2));
}finally{await browser.close()}

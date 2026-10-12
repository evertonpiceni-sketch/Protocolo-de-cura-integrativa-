const fs = require('node:fs');
const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');
(async () => {
  const { code } = await esbuild.transform(fs.readFileSync('src/lib/universalAnamnesisDiaryAccessPatch.ts', 'utf8'), { loader: 'ts', format: 'iife' });
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-gpu'] });
  try {
    const page = await browser.newPage();
    await page.setContent('<button disabled aria-disabled="true" class="opacity-50">Anamnese</button>');
    await page.evaluate(() => {
      window.mutations = 0;
      const NativeObserver = MutationObserver;
      window.MutationObserver = class extends NativeObserver {
        constructor(callback) {
          super((records, observer) => {
            window.mutations++;
            // Stop a regression from freezing the test browser indefinitely.
            if (window.mutations > 50) { observer.disconnect(); return; }
            callback(records, observer);
          });
        }
      };
    });
    await page.addScriptTag({ content: code });
    await page.evaluate(() => document.querySelector('button').classList.add('startup-rendered'));
    await new Promise(resolve => setTimeout(resolve, 150));
    const result = await page.evaluate(() => ({ mutations: window.mutations, disabled: document.querySelector('button').disabled, aria: document.querySelector('button').getAttribute('aria-disabled') }));
    assert(result.mutations < 4, 'Access observer must settle instead of starving rendering: ' + JSON.stringify(result));
    assert.equal(result.disabled, false);
    assert.equal(result.aria, 'false');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
    console.log('PASS: universal access settles and browser renders', result);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });

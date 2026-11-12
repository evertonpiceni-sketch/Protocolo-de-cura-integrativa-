import test from 'node:test';
import assert from 'node:assert/strict';
import { INTEGRATED_REIKI_DAYS, integratedReikiProgress } from '../src/data/integratedReikiJourney';
test('integrated journey covers the approved three cycles and 21 distinct scenes',()=>{
 assert.equal(INTEGRATED_REIKI_DAYS.length,21);
 assert.equal(new Set(INTEGRATED_REIKI_DAYS.map(d=>d.nome)).size,21);
 for(let cycle=0;cycle<3;cycle++) assert.equal(INTEGRATED_REIKI_DAYS.filter(d=>d.cycle===cycle).length,7);
 assert.equal(INTEGRATED_REIKI_DAYS[7].nome,'Verdade interior');
 assert.equal(INTEGRATED_REIKI_DAYS[14].nome,'Centro e direção');
 assert.equal(INTEGRATED_REIKI_DAYS[20].nome,'Eu volto para mim');
 for(const {artwork:a} of INTEGRATED_REIKI_DAYS){assert(a.x>=0&&a.y>=0);assert(a.x+a.width<=906&&a.y+a.height<=1280);}
});
test('progress accepts days 8–21 and rejects duplicate, fractional and invalid days',()=>{
 assert.deepEqual(integratedReikiProgress([21,8,1,8,0,22,NaN,1.5]),[1,8,21]);
 assert.deepEqual(integratedReikiProgress(),[]);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoProgress,demoTime,heroVideoProgress} from '../src/config/demo-motion.mjs';
test('demo is on frame zero before scrolling and immediately advances with scroll',()=>{
 assert.equal(demoProgress(80,900,80),0);
 assert.ok(demoProgress(79,900,80)>0);
 assert.equal(demoProgress(80-900*1.8,900,80),1);
 assert.ok(demoProgress(-800,900,80)>demoProgress(-400,900,80));
 assert.equal(demoProgress(80,900,80),0);
});
test('demo seeking stays within the decoded video and is reversible',()=>{
 assert.equal(demoTime(0,5),0);assert.equal(demoTime(.5,5),2.5);assert.equal(demoTime(1,5),4.96);
 assert.equal(demoTime(2,5),4.96);assert.equal(demoTime(-1,5),0);
});

test('the supplied Hero video advances on first scroll even when Hero is taller than the viewport',()=>{
 for(const [height,viewport,header]of [[1058,900,80],[936,800,80],[878,844,72]]){
  assert.equal(heroVideoProgress(header,height,viewport,header),0);
  assert.ok(heroVideoProgress(header-1,height,viewport,header)>0);
  assert.equal(heroVideoProgress(header-Math.max(height,viewport)*.75,height,viewport,header),1);
 }
});
test('the supplied Hero video clamps overscroll and returns to its first frame',()=>{
 assert.equal(heroVideoProgress(200,1058,900,80),0);
 assert.equal(heroVideoProgress(-3000,1058,900,80),1);
 assert.ok(heroVideoProgress(-300,1058,900,80)>heroVideoProgress(-100,1058,900,80));
 assert.equal(heroVideoProgress(80,1058,900,80),0);
});

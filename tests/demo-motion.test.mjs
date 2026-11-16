import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoProgress,demoTime} from '../src/config/demo-motion.mjs';
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

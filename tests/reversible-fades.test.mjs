import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentFade} from '../src/motion-math.mjs';
import {introAboutGroups} from '../src/config/intro-scene.mjs';
test('content opacity follows viewport position and reverses without a played latch',()=>{
 const positions=[1000,940,820,700,0,-100,700,820,940,1000];
 const values=positions.map(top=>contentFade(top,1000));
 assert.equal(values[0],0);assert.equal(values[3],1);assert.equal(values[4],1);
 assert.equal(values[2],values[7]);assert.equal(values[1],values[8]);assert.equal(values[9],0);
 assert.ok(values[2]>0&&values[2]<1);
});
test('About groups reveal in semantic order and return to zero on reverse scroll',()=>{
 for(const p of [0,.45,.5,.55,.6,.7,.8,1]){const values=introAboutGroups(p);for(let i=1;i<values.length;i++)assert.ok(values[i-1]>=values[i]);}
 const middle=introAboutGroups(.6);introAboutGroups(1);assert.deepEqual(introAboutGroups(.6),middle);
 assert.deepEqual(introAboutGroups(0),[0,0,0,0,0]);assert.deepEqual(introAboutGroups(1),[1,1,1,1,1]);
});

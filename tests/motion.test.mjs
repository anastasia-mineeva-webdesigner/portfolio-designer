import test from 'node:test';
import assert from 'node:assert/strict';
import {videoTime,range} from '../src/motion-math.mjs';
const settings={start:0,end:1,startSeconds:0,endSeconds:null};
test('scroll uniquely determines time when scrolling forward, backward and jumping',()=>{
 const path=[0,.1,.8,.2,1,.4,0];
 assert.deepEqual(path.map(p=>videoTime(p,10,settings)),[0,1,8,2,10,4,0]);
 assert.equal(videoTime(.4,10,settings),videoTime(.4,10,settings));
});
test('overscroll remains within the playable duration',()=>{
 assert.equal(videoTime(-5,12,settings),0);
 assert.equal(videoTime(5,12,settings),12);
});
test('configured scene and clip ranges map their endpoints correctly',()=>{
 const clip={start:.2,end:.8,startSeconds:2,endSeconds:8};
 assert.equal(videoTime(.2,10,clip),2);
 assert.ok(Math.abs(videoTime(.5,10,clip)-5)<1e-9);
 assert.equal(videoTime(.8,10,clip),8);
});
test('shorter replacement videos cannot seek beyond the new duration',()=>{
 const clip={start:0,end:1,startSeconds:2,endSeconds:30};
 assert.equal(videoTime(1,6,clip),6);
 assert.equal(videoTime(0,1,clip),1);
 assert.equal(videoTime(.7,0,clip),0);
});
test('text transitions stay visible or hidden outside their configured intervals',()=>{
 assert.equal(range(.1,.2,.4),0);
 assert.ok(Math.abs(range(.3,.2,.4)-.5)<1e-9);
 assert.equal(range(.9,.2,.4),1);
});

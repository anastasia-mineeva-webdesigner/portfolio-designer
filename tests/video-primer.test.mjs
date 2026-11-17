import test from 'node:test';
import assert from 'node:assert/strict';
import {createVideoPrimer} from '../src/config/video-primer.mjs';
function media(){return {readyState:2,plays:0,pauses:0,frame:null,cancelled:[],play(){this.plays++;return Promise.resolve()},pause(){this.pauses++},requestVideoFrameCallback(callback){this.frame=callback;return 7},cancelVideoFrameCallback(id){this.cancelled.push(id)}}}
test('mobile decoding is not paused until the browser presents a frame',async()=>{
 const v=media();let ready=0;const p=createVideoPrimer(v,()=>ready++);
 await p.prime();assert.equal(v.pauses,0);assert.equal(v.muted,true);assert.equal(v.playsInline,true);
 v.frame();assert.equal(v.pauses,1);assert.equal(ready,1);
 await p.prime();assert.equal(v.plays,1);p.dispose();
});
test('blocked autoplay can retry on a later user gesture',async()=>{
 const v=media();v.play=function(){this.plays++;return this.plays===1?Promise.reject(new Error('NotAllowedError')):Promise.resolve()};
 let ready=0;const p=createVideoPrimer(v,()=>ready++);await p.prime();assert.equal(ready,0);
 await p.prime();v.frame();assert.equal(v.plays,2);assert.equal(ready,1);p.dispose();
});
test('cleanup during pending play cannot restart or notify the removed video',async()=>{
 const v=media();let resolve;v.play=()=>new Promise(done=>{resolve=done});let ready=0;
 const p=createVideoPrimer(v,()=>ready++);const pending=p.prime();p.dispose();resolve();await pending;
 assert.equal(ready,0);assert.equal(v.frame,null);assert.ok(v.pauses>0);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {introScene,introCues,introSceneProgress} from '../src/config/intro-scene.mjs';
test('the unified scene gives video several screens of scrolling and keeps reading time after it ends',()=>{
 assert.ok(introScene.desktopScrollScreens>=4);
 assert.ok(introScene.mobileScrollScreens>=4);
 assert.ok(introScene.videoRange[1]<introScene.aboutIn[1]);
 assert.ok(introScene.aboutIn[1]<1);
});
test('Hero content is gone before About becomes visible and media finishes lifting before About settles',()=>{
 assert.equal(introCues(0).hero,1);assert.equal(introCues(0).video,0);assert.equal(introCues(0).about,0);
 assert.equal(introCues(introScene.aboutIn[0]).hero,0);
 assert.equal(introCues(introScene.aboutIn[1]).lift,1);
 const end=introCues(1);assert.deepEqual(end,{hero:0,lift:1,about:1,video:1});
});
test('scene progress starts on first scroll, is reversible and clamps outside the scroll range',()=>{
 const distance=900*introScene.desktopScrollScreens;
 assert.equal(introSceneProgress(80,80,distance),0);
 assert.ok(introSceneProgress(79,80,distance)>0);
 const midpoint=introSceneProgress(80-distance/2,80,distance);assert.equal(midpoint,.5);
 const forward=introCues(midpoint);introCues(1);assert.deepEqual(introCues(midpoint),forward);
 assert.equal(introSceneProgress(500,80,distance),0);assert.equal(introSceneProgress(-99999,80,distance),1);
});

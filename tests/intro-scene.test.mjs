import {test} from 'node:test';
import assert from 'node:assert/strict';
import {introScene,introCues,introSceneProgress,introAboutGroups} from '../src/config/intro-scene.mjs';
test('the unified scene has a bounded pin distance and a reading interval',()=>{
 assert.ok(introScene.desktopScrollScreens>=1.5 && introScene.desktopScrollScreens<=2.5);
 assert.ok(introScene.mobileScrollScreens>=1.5 && introScene.mobileScrollScreens<=2.5);
 assert.ok(introScene.videoRange[1]<=introScene.aboutIn[1]);
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
test('the sticky scene releases as the last About group finishes',()=>{
 assert.ok(introScene.releaseAt>introScene.aboutIn[1]);
 assert.ok(introScene.releaseAt<1);
 assert.deepEqual(introAboutGroups(introScene.releaseAt),[1,1,1,1,1]);
 assert.deepEqual(introCues(introScene.releaseAt),{hero:0,lift:1,about:1,video:1});
 for(const height of [768,900,1080]){
  const timelineDistance=height*introScene.desktopScrollScreens;
  const scrollDistance=timelineDistance*introScene.releaseAt;
  assert.ok(Math.abs(introSceneProgress(80-scrollDistance,80,timelineDistance)-introScene.releaseAt)<1e-12);
 }
});

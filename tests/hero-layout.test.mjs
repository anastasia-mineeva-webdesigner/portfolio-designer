import {test} from 'node:test';
import assert from 'node:assert/strict';
import {heroLayouts,heroLayout,staticHeroLayout,sceneProgress} from '../src/config/hero-layout.mjs';
test('decorative tools stay above the metric pairs and side columns on all eight widths',()=>{
 for(const design of heroLayouts){const l=staticHeroLayout(design.width);if(l.width<600)assert.ok(l.top+l.artHeight+24<=l.metricsTop,`mobile media/metrics at ${l.width}`);
  for(const [x,y,w] of l.tools){const rotated=w*(Math.sin(Math.PI/10)+Math.cos(Math.PI/10));assert.ok(l.top+y+(rotated+w)/2+12<l.metricsTop,`tool/metrics at ${l.width}`);assert.ok(x>=0&&x+w<=l.width,`tool bounds ${l.width}`)}
 }
});
test('breakpoints retain a matching design at both sides of every transition',()=>{
 for(const l of heroLayouts){assert.equal(heroLayout(l.min).width,l.width);if(l.min)assert.notEqual(heroLayout(l.min-1).width,l.width)}
});
test('a tall first screen scrolls fully into view before video scrubbing starts',()=>{
 assert.equal(sceneProgress(80,1162,900,80,2340),0);
 assert.equal(sceneProgress(-262,1162,900,80,2340),0);
 assert.equal(sceneProgress(-1432,1162,900,80,2340),.5);
 assert.equal(sceneProgress(-2602,1162,900,80,2340),1);
 assert.equal(sceneProgress(-1432,1162,900,80,2340),.5);
});

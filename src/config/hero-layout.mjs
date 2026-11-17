// Figma: «Макет в разработку», the eight supplied widths.
// Tool tuples are x, y and width inside the media area, in design pixels.
const layout=(min,width,height,top,artHeight,metricsTop,tools,stickers)=>({min,width,height,top,artHeight,metricsTop,tools,stickers});
export const heroLayouts=[
 layout(1700,1920,1040,384,463,871,[[113,216,155],[599,117,99],[1623,0,108],[1562,342,91],[1270,230,105]],[[265,7,223],[1350,23,236],[358,324,195]]),
 layout(1400,1440,1162,392,610,1026,[[132,256,121],[326,126,79],[1144,51,85],[1216,359,71],[1000,397,81]],[[136,-195,223],[1131,-210,236]]),
 layout(1200,1200,1024,344,520,888,[[120,225,97],[276,114,63],[960,48,68],[1017,312,57],[840,344,65]],[null,[900,161,156]]),
 layout(900,1024,960,320,480,824,[[102,209,81],[236,106,53],[819,47,56],[869,288,48],[717,317,54]],[null,[768,149,127]]),
 layout(600,768,896,296,440,760,[[70,280,96],[174,45,66],[570,10,70],[650,300,60],[45,130,68]],[null,[546,117,127]]),
 layout(401,414,878,256,430,710,[[20,131,51],[54,19,63],[303,50,68],[339,182,30],[295,325,65]],[]),
 layout(376,390,878,256,430,710,[[18,146,51],[36,0,63],[289,26,68],[324,183,30],[259,325,65]],[]),
 layout(0,360,878,256,430,710,[[18,156,51],[27,11,63],[267,21,68],[292,186,30],[259,325,65]],[]),
];
const about=[
 [1333,0,813,869,933,1125,1285,560],
 [1266,168,570,88,778,954,1130,800],
 [1258,168,570,88,778,946,1122,800],
 [1112,144,480,64,664,824,1000,800],
 [1112,144,480,64,664,824,1000,704],
 [994,112,330,48,466,642,898,366],
 [994,112,330,48,466,642,898,358],
 [994,112,330,48,466,642,898,328],
];
heroLayouts.forEach((l,i)=>{const [height,top,artHeight,labelTop,copyTop,tagsTop,buttonTop,leadWidth]=about[i];l.about={height,top,artHeight,labelTop,copyTop,tagsTop,buttonTop,leadWidth}});
export function heroLayout(width){return heroLayouts.find(l=>width>=l.min)??heroLayouts.at(-1)}
// A tall design scrolls naturally until its bottom fits, then the video pins.
export function sceneProgress(rootTop,stageHeight,viewportHeight,headerHeight,scrollDistance){
 const pinnedTop=Math.min(headerHeight,viewportHeight-stageHeight);
 return Math.max(0,Math.min(1,(pinnedTop-rootTop)/Math.max(1,scrollDistance)));
}

// Static two-line desktop heading: remove the former third line and its gap.
export function staticHeroLayout(width){
 const l=heroLayout(width),removed=width>=1700||width<600?0:width>=1400?104:width>=1200?88:width>=900?80:72;
 const height=l.height-removed;
 const metricsTop=width>=600&&width<1400?height-64-168:l.metricsTop-removed;
 const tools=l.tools.map(([x,y,w])=>[x,Math.min(y,metricsTop-(l.top-removed)-w*1.14-16),w]);
 return {...l,tools,top:l.top-removed,metricsTop,height,stickers:width>=1400&&width<1700?[[80,20,180],[1175,165,170]]:l.stickers};
}

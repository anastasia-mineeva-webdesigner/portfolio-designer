export function demoProgress(top,viewportHeight,headerHeight,scrollScreens=1.8){
 return Math.max(0,Math.min(1,(headerHeight-top)/Math.max(1,viewportHeight*scrollScreens)));
}
export function demoTime(progress,duration){return Math.max(0,Math.min(Math.max(0,duration-.04),progress*duration));}

export function heroVideoProgress(top,heroHeight,viewportHeight,headerHeight){
 const distance=Math.max(viewportHeight*.75,heroHeight*.75);
 return Math.max(0,Math.min(1,(headerHeight-top)/Math.max(1,distance)));
}

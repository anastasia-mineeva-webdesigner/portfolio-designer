// The unified Hero → About timeline. All ranges use normalized scene progress.
export const introScene={
 desktopScrollScreens:2.1,mobileScrollScreens:1.5,
 heroOut:[.02,.3],mediaLift:[.12,.6],aboutIn:[.4,.82],videoRange:[0,.82],
 releaseAt:.96,
 aboutTravelPx:0,heroTravelPx:0,
};
export const tabletIntroScene={
 ...introScene,
 desktopScrollScreens:1.2,
 heroOut:[.04,.3],mediaLift:[.18,.6],videoRange:[0,.72],
};
export const mobileIntroScene={
 ...introScene,
 mobileScrollScreens:1.05,
 heroOut:[.04,.26],mediaLift:[.18,.49],aboutIn:[.36,.65],videoRange:[0,.65],
 releaseAt:.74,
};
export function compactPortrait(initialTop,initialHeight,finalTop,lift){
 return {top:initialTop+(finalTop-initialTop)*lift,scale:1-.12*lift,height:initialHeight};
}
const clamp=n=>Math.max(0,Math.min(1,n));
const range=(p,[start,end])=>clamp((p-start)/Math.max(.0001,end-start));
const smooth=n=>n*n*(3-2*n);
export function introSceneProgress(top,header,distance){return clamp((header-top)/Math.max(1,distance));}
export function introVideoProgress(top,header,pinTop,distance,[start,end]=introScene.videoRange){
 const leadIn=Math.max(0,header-pinTop);
 return range(header-top,[distance*start,leadIn+distance*end]);
}
export function introCues(progress,settings=introScene){
 return {hero:1-smooth(range(progress,settings.heroOut)),lift:smooth(range(progress,settings.mediaLift)),about:smooth(range(progress,settings.aboutIn)),video:range(progress,settings.videoRange)};
}
export function introAboutGroups(progress,mobile=false){
 const intervals=mobile?[[.36,.46],[.39,.49],[.42,.53],[.46,.59],[.49,.65]]
  :[[.56,.66],[.62,.72],[.68,.78],[.74,.86],[.84,.96]];
 return intervals.map(interval=>smooth(range(progress,interval)));
}

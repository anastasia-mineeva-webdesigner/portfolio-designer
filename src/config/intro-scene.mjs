// The unified Hero → About timeline. All ranges use normalized scene progress.
export const introScene={
 desktopScrollScreens:2.1,mobileScrollScreens:1.9,
 heroOut:[.02,.3],mediaLift:[.12,.72],aboutIn:[.4,.82],videoRange:[0,.82],
 aboutTravelPx:0,heroTravelPx:0,
};
const clamp=n=>Math.max(0,Math.min(1,n));
const range=(p,[start,end])=>clamp((p-start)/Math.max(.0001,end-start));
const smooth=n=>n*n*(3-2*n);
export function introSceneProgress(top,header,distance){return clamp((header-top)/Math.max(1,distance));}
export function introCues(progress,settings=introScene){
 return {hero:1-smooth(range(progress,settings.heroOut)),lift:smooth(range(progress,settings.mediaLift)),about:smooth(range(progress,settings.aboutIn)),video:range(progress,settings.videoRange)};
}
export function introAboutGroups(progress){
 return [[.4,.52],[.46,.58],[.52,.64],[.58,.72],[.68,.82]].map(interval=>smooth(range(progress,interval)));
}

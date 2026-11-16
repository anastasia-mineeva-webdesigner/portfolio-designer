// The unified Hero → About timeline. All ranges use normalized scene progress.
export const introScene={
 desktopScrollScreens:4.5,mobileScrollScreens:4.2,
 heroOut:[.04,.25],mediaLift:[.2,.68],aboutIn:[.55,.86],videoRange:[0,.72],
 aboutTravelPx:72,heroTravelPx:40,
};
const clamp=n=>Math.max(0,Math.min(1,n));
const range=(p,[start,end])=>clamp((p-start)/Math.max(.0001,end-start));
const smooth=n=>n*n*(3-2*n);
export function introSceneProgress(top,header,distance){return clamp((header-top)/Math.max(1,distance));}
export function introCues(progress,settings=introScene){
 return {hero:1-smooth(range(progress,settings.heroOut)),lift:smooth(range(progress,settings.mediaLift)),about:smooth(range(progress,settings.aboutIn)),video:range(progress,settings.videoRange)};
}

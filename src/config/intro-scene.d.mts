export type IntroSettings={desktopScrollScreens:number;mobileScrollScreens:number;heroOut:number[];mediaLift:number[];aboutIn:number[];videoRange:number[];aboutTravelPx:number;heroTravelPx:number};
export const introScene:IntroSettings;
export function introSceneProgress(top:number,header:number,distance:number):number;
export function introCues(progress:number,settings?:IntroSettings):{hero:number;lift:number;about:number;video:number};
export function introAboutGroups(progress:number):number[];

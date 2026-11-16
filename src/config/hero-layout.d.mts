export type HeroLayout={min:number;width:number;height:number;top:number;artHeight:number;metricsTop:number;tools:number[][];stickers:(number[]|null)[];about:{height:number;top:number;artHeight:number;labelTop:number;copyTop:number;tagsTop:number;buttonTop:number;leadWidth:number}};
export const heroLayouts:HeroLayout[];
export function heroLayout(width:number):HeroLayout;
export function sceneProgress(rootTop:number,stageHeight:number,viewportHeight:number,headerHeight:number,scrollDistance:number):number;

export function staticHeroLayout(width:number):HeroLayout;

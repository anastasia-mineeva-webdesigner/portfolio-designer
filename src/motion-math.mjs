export const clamp = value => Math.max(0,Math.min(1,value));
export const range = (value,start,end) => clamp((value-start)/Math.max(.00001,end-start));
export function videoTime(progress,duration,settings){
 const start=Math.min(duration,Math.max(0,settings.startSeconds));
 const end=Math.max(start,Math.min(duration,settings.endSeconds??duration));
 return start+range(progress,settings.start,settings.end)*(end-start);
}

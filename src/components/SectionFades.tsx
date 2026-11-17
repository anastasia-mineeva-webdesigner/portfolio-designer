import {useLayoutEffect} from 'react';

/** Fade each semantic group once. Opacity preserves all layout measurements. */
export function SectionFades(){
 useLayoutEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const elements=Array.from(document.querySelectorAll<HTMLElement>('.section > .label, .section > h2, .section > h1, .section > .lead, .section > .statement, .section > .section-subheading, .section > .awards, .section > .button, .section > .project-grid, .section > .faq-list'));
  const pending=new Set<HTMLElement>();let frame=0;
  const render=()=>{frame=0;let order=0;
   for(const el of pending){const rect=el.getBoundingClientRect();if(preference.matches||rect.top<innerHeight*.94){
    // Skipped content and restored pages must be readable immediately.
    const immediate=preference.matches||rect.bottom<=0;
    el.style.transition=immediate?'none':`opacity 700ms ease ${Math.min(order++,3)*100}ms`;
    el.style.opacity='1';pending.delete(el);
   }}
   if(!pending.size)window.removeEventListener('scroll',schedule);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
  for(const el of elements){if(!preference.matches&&el.getBoundingClientRect().top>=innerHeight*.94){el.style.opacity='0';pending.add(el)}}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',schedule);elements.forEach(el=>{el.style.opacity='';el.style.transition=''})};
 },[]);
 return null;
}

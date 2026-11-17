import {useLayoutEffect} from 'react';
import {contentFade} from '../motion-math.mjs';

export function SectionFades(){
 useLayoutEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const elements=Array.from(document.querySelectorAll<HTMLElement>('.section > .label, .section > h2, .section > h1, .section > .lead, .section > .statement, .section > .section-subheading, .section > .awards, .section > .button, .section > .project-grid'));
  let frame=0;
  const render=()=>{frame=0;for(const el of elements){
   const opacity=preference.matches?1:contentFade(el.getBoundingClientRect().top,innerHeight);
   el.style.transition='none';el.style.opacity=String(opacity);el.inert=opacity===0;
  }};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',schedule);render();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',schedule);elements.forEach(el=>{el.style.opacity='';el.style.transition='';el.inert=false})};
 },[]);
 return null;
}

import {useLayoutEffect,useRef} from 'react';
import type {ReactNode} from 'react';
import {animation} from '../config/animation';
import {contentFade} from '../motion-math.mjs';
export function Reveal({children,kind='process',index=0,className=''}:{children:ReactNode;kind?:'process'|'faq'|'headings';index?:number;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=ref.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const render=()=>{frame=0;const opacity=reduced.matches||!animation.enabled[kind]?1:contentFade(el.getBoundingClientRect().top,innerHeight);el.style.transition='none';el.style.opacity=String(opacity);el.style.transform='none';el.inert=opacity===0};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);render();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[kind,index]);
 return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

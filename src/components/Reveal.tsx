import {useEffect,useRef} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import {animation,motionSettings} from '../config/animation';
import {range} from '../motion-math.mjs';
export function Reveal({children,kind='process',index=0,className=''}:{children:ReactNode;kind?:'process'|'faq'|'headings';index?:number;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const render=()=>{frame=0;const s=motionSettings();if(reduced.matches||!animation.enabled[kind]){el.style.opacity='1';el.style.transform='none';return}
   const top=el.getBoundingClientRect().top;
   if(kind==='headings'&&s.heading.scrub){el.style.transition='none';el.style.opacity=String(range(innerHeight-top,innerHeight*(1-s.heading.startViewport),innerHeight*(1-s.heading.endViewport)));el.style.transform='none'}
   else{el.style.transition=`opacity ${kind==='headings'?s.heading.durationMs:s.reveal.durationMs}ms ease ${index*(kind==='faq'?s.reveal.faqIntervalMs:s.reveal.processIntervalMs)}ms, transform ${s.reveal.durationMs}ms ease ${index*(kind==='faq'?s.reveal.faqIntervalMs:s.reveal.processIntervalMs)}ms`;const visible=top<innerHeight*s.reveal.startViewport;el.style.opacity=visible?'1':'0';el.style.transform=visible?'none':`translateY(${s.reveal.offsetPx}px) scale(${s.reveal.scale})`}
  };const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);render();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)}
 },[kind,index]);
 return <div ref={ref} className={`reveal ${className}`} style={{'--index':index} as CSSProperties}>{children}</div>
}

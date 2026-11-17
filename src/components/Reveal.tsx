import {useEffect,useRef} from 'react';
import type {ReactNode} from 'react';
import {animation,motionSettings} from '../config/animation';
export function Reveal({children,kind='process',index=0,className=''}:{children:ReactNode;kind?:'process'|'faq'|'headings';index?:number;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,shown=false;
  const show=(immediate=false)=>{if(shown)return;shown=true;el.style.transition=immediate?'none':`opacity ${motionSettings().reveal.durationMs}ms ease ${Math.min(index,3)*60}ms`;el.style.opacity='1';window.removeEventListener('scroll',schedule)};
  const render=()=>{frame=0;if(reduced.matches||!animation.enabled[kind]){show(true);return}
   // Include sections skipped by a fast scroll; never hide them again on return.
   if(el.getBoundingClientRect().top<innerHeight*.96)show();
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
  if(!reduced.matches&&animation.enabled[kind]&&el.getBoundingClientRect().top>=innerHeight*.96)el.style.opacity='0';
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);render();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[kind,index]);
 return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

import {useLayoutEffect,useRef} from 'react';
import type {CSSProperties,ReactNode} from 'react';

export function ProcessLabel({children,index}:{children:ReactNode;index:number}){
 const ref=useRef<HTMLSpanElement>(null),content=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{
  const el=ref.current!,text=content.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const measure=()=>el.style.setProperty('--badge-start',`${Math.ceil(text.getBoundingClientRect().width)+32}px`);
  const show=()=>{frame=0;const rect=el.getBoundingClientRect();
   if(reduced.matches||rect.bottom<=0)el.dataset.immediate='true';else delete el.dataset.immediate;
   el.dataset.expanded=String(reduced.matches||rect.top<innerHeight*.94);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(show)};
  measure();const resize=new ResizeObserver(measure);resize.observe(text);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
  // Give the initial capsule one paint before extending its background.
  schedule();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);delete el.dataset.expanded;delete el.dataset.immediate};
 },[]);
 return <span ref={ref} className="label label--dark process-label" style={{'--badge-delay':`${index*100}ms`} as CSSProperties}><span ref={content} className="process-label-content"><span className="dot"/>{children}</span></span>;
}

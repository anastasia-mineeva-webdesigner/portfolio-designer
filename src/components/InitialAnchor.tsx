import {useLayoutEffect} from 'react';

/** Resolve cross-document fragments after React has created their targets. */
export function InitialAnchor(){
 useLayoutEffect(()=>{
  const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
  if(!location.hash||navigation?.type==='back_forward')return;
  let cancelled=false,frame=0;
  const hash=location.hash;
  const cancel=()=>{cancelled=true};
  const align=()=>{
   if(cancelled||location.hash!==hash)return;
   let id;try{id=decodeURIComponent(hash.slice(1))}catch{return}
   document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});
  };
  window.addEventListener('wheel',cancel,{passive:true});window.addEventListener('touchstart',cancel,{passive:true});window.addEventListener('keydown',cancel);
  align();document.fonts.ready.then(()=>{if(!cancelled)frame=requestAnimationFrame(align)});
  return()=>{cancelled=true;cancelAnimationFrame(frame);window.removeEventListener('wheel',cancel);window.removeEventListener('touchstart',cancel);window.removeEventListener('keydown',cancel)};
 },[]);
 return null;
}

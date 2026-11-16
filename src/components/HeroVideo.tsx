import {useEffect,useRef,useState} from 'react';
import {animation} from '../config/animation';
import {media} from '../config/media';
import {demoTime,heroVideoProgress} from '../config/demo-motion.mjs';

export function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const v=ref.current,preference=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,target=0,ready=false,disposed=false;
  const render=()=>{raf=0;if(!v||!ready||preference.matches||document.hidden)return;
   const hero=v.closest('section');if(!hero)return;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const progress=heroVideoProgress(hero.getBoundingClientRect().top,hero.offsetHeight,innerHeight,header);
   target=demoTime(progress,v.duration);
   if(!v.seeking&&Math.abs(v.currentTime-target)>.025)v.currentTime=target;
  };
  const schedule=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(render)};
  const loaded=()=>{ready=!!v&&Number.isFinite(v.duration);schedule()};
  const seeked=()=>{if(v&&Math.abs(v.currentTime-target)>.025)schedule()};
  const change=()=>{setReduced(preference.matches);schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
  v?.addEventListener('loadeddata',loaded);v?.addEventListener('seeked',seeked);if(v&&v.readyState>=2)loaded();schedule();
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);v?.removeEventListener('loadeddata',loaded);v?.removeEventListener('seeked',seeked)};
 },[failed,reduced]);
 if(failed||reduced||!animation.enabled.video||!media.videoSrc)return <img className="hero-current-media" src={media.poster} width="1920" height="1080" alt="" fetchPriority="high"/>;
 return <video ref={ref} className="hero-current-media" src={media.videoSrc} poster={media.poster} width="1920" height="1080" muted playsInline preload="auto" aria-hidden="true" onError={()=>setFailed(true)}/>;
}

import {useEffect,useRef,useState} from 'react';
import {Button,Label} from './UI';
import {HeroMetrics} from './HeroMetrics';
import {demoProgress,demoTime} from '../config/demo-motion.mjs';

// An explicitly selected montage demo; the main portfolio stays static.
export function DesktopMotionDemo({missing}:{missing:(label:string)=>void}){
 const root=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const [about,setAbout]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=root.current!,box=stage.current!,v=video.current,reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,ready=false,target=0,disposed=false;
  const render=()=>{raf=0;const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const progress=reduced.matches?1:demoProgress(el.getBoundingClientRect().top,innerHeight,header);
   const reveal=Math.max(0,Math.min(1,(progress-.28)/.44));
   box.style.setProperty('--demo-reveal',String(reveal));setAbout(reveal>.5);
   if(v&&ready&&!reduced.matches){target=demoTime(progress,v.duration);if(!v.seeking&&Math.abs(v.currentTime-target)>.025)v.currentTime=target}
   el.dataset.reduced=String(reduced.matches);
  };
  const schedule=()=>{if(!raf&&!document.hidden&&!disposed)raf=requestAnimationFrame(render)};
  const loaded=()=>{ready=!!v&&Number.isFinite(v.duration);schedule()};
  const seeked=()=>{if(v&&Math.abs(v.currentTime-target)>.025)schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',visibility);
  v?.addEventListener('loadeddata',loaded);v?.addEventListener('seeked',seeked);if(v&&v.readyState>=2)loaded();schedule();
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);document.removeEventListener('visibilitychange',visibility);v?.removeEventListener('loadeddata',loaded);v?.removeEventListener('seeked',seeked)};
 },[failed]);
 return <section ref={root} className="motion-demo" aria-label="Desktop motion preview"><div ref={stage} className="motion-demo-stage">
  {!failed?<video ref={video} src="/media/pose-demo-16x9.mp4" poster="/media/pose-demo-first.jpg" muted playsInline preload="auto" onError={()=>setFailed(true)} aria-hidden="true"/>:<img className="motion-demo-fallback" src="/media/pose-demo-first.jpg" alt=""/>}
  <div className="motion-demo-hero" inert={about}><h1>I design and build websites<br/>with <span className="accent">AI agents</span></h1><HeroMetrics/></div>
  <div id="about" className="motion-demo-about" inert={!about}><Label>About</Label><h2>Hi, I'm <span className="accent highlight">Mira</span></h2><p>AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.</p><Button variant="secondary" onClick={()=>missing('CV PDF')}>Download CV (PDF)</Button></div>
 </div></section>;
}

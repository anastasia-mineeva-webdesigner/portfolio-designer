import {useEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
import {animation,motionSettings} from '../config/animation';
import {heroLayout,sceneProgress} from '../config/hero-layout.mjs';
import {media} from '../config/media';
import {links} from '../config/links';
import {Odometer} from './AnimationEffects';
import {Button,Label,Tag} from './UI';
import {range,videoTime} from '../motion-math.mjs';
export default function VideoScene({missing}:{missing:(label:string)=>void}){
 const scene=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const [layout,setLayout]=useState(()=>heroLayout(innerWidth));
 const [aboutActive,setAboutActive]=useState(false),[failed,setFailed]=useState(false),[reducedMotion,setReducedMotion]=useState(false);
 useEffect(()=>{
  const root=scene.current!,box=stage.current!,v=video.current;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,last=performance.now(),target=0,current=0,seeking=false,ready=false,active=true;
  let settings=motionSettings();
  const measure=()=>{settings=motionSettings();setLayout(heroLayout(innerWidth));root.style.setProperty('--scene-lead-in',`${Math.max(0,heroLayout(innerWidth).height-(innerHeight-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))))}px`);root.style.setProperty('--scene-scroll',`${innerHeight*settings.video.scrollScreens}px`);root.style.setProperty('--video-position',settings.video.objectPosition);update()};
  const update=()=>{const distance=Math.max(1,root.offsetHeight-heroLayout(innerWidth).height);target=sceneProgress(root.getBoundingClientRect().top,heroLayout(innerWidth).height,innerHeight,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')),distance);if(!raf&&active)raf=requestAnimationFrame(tick)};
  const tick=(now:number)=>{raf=0;const dt=Math.min(64,now-last);last=now;
   current=settings.video.smoothingMs?current+(target-current)*(1-Math.exp(-dt/settings.video.smoothingMs)):target;
   if(Math.abs(current-target)<.0001)current=target;
   // Text follows raw progress, video follows a short deterministic easing to it.
   const hero=1-range(target,settings.heroOut[0],settings.heroOut[1]),about=range(target,settings.aboutIn[0],settings.aboutIn[1]);
   box.style.setProperty('--hero-opacity',String(hero));box.style.setProperty('--about-opacity',String(about));
   root.dataset.about=String(about>.5);setAboutActive(reduced.matches||about>.5);
   if(v&&ready&&!seeking&&!reduced.matches&&animation.enabled.video&&Number.isFinite(v.duration)){
    const t=videoTime(current,v.duration,settings.video);
    if(Math.abs(v.currentTime-t)>1/120){seeking=true;v.currentTime=t;}
   }
   if(current!==target)raf=requestAnimationFrame(tick);
  };
  const loaded=()=>{ready=true;seeking=false;update()};const seeked=()=>{seeking=false;update()};
  const change=()=>{setReducedMotion(reduced.matches);root.dataset.reduced=String(reduced.matches);measure()};
  const visibility=()=>{active=!document.hidden;if(active){last=performance.now();update()}else{cancelAnimationFrame(raf);raf=0}};
  v?.addEventListener('loadedmetadata',loaded);v?.addEventListener('loadeddata',loaded);v?.addEventListener('seeked',seeked);
  if(v&&v.readyState>=1)ready=true;
  const observer=new ResizeObserver(measure);observer.observe(box);
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',measure);reduced.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);change();
  return()=>{active=false;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',measure);reduced.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);v?.removeEventListener('loadedmetadata',loaded);v?.removeEventListener('loadeddata',loaded);v?.removeEventListener('seeked',seeked)};
 },[]);
 const s=motionSettings();
 const tools=['utopia','figma','vscode','chatgpt','claude'];
 const itemStyle=(item:number[])=>({left:`${item[0]/layout.width*100}%`,top:`${item[1]}px`,width:`${item[2]}px`});
 const sceneStyle={'--hero-height':`${layout.height}px`,'--hero-art-top':`${layout.top}px`,'--hero-art-height':`${layout.artHeight}px`,'--hero-metrics-top':`${layout.metricsTop}px`,'--scene-background':media.background,'--scene-max-height':`${Math.max(layout.height,layout.about.height)}px`,'--about-height':`${layout.about.height}px`,'--about-art-top':`${layout.about.top}px`,'--about-art-height':`${layout.about.artHeight}px`,'--about-label-top':`${layout.about.labelTop}px`,'--about-copy-top':`${layout.about.copyTop}px`,'--about-tags-top':`${layout.about.tagsTop}px`,'--about-button-top':`${layout.about.buttonTop}px`,'--about-lead-width':`${layout.about.leadWidth}px`} as CSSProperties;
 return <section ref={scene} style={sceneStyle} className="video-scene" aria-label="Introduction"><span id="about" className="about-anchor"/><div ref={stage} className="scene-stage">
  <div className="scene-media" aria-hidden="true"><img className={`scene-poster ${media.videoSrc?'scene-poster--video':''}`} src={media.poster} alt="" fetchPriority="high" width="1920" height="760"/>{media.videoSrc&&!failed&&<video ref={video} className="scene-video" src={media.videoSrc} poster={media.poster} muted playsInline preload="auto" onError={()=>setFailed(true)} />}</div>
  <div className="hero-layer" inert={aboutActive&&!reducedMotion}><h1 className={animation.enabled.hero?'hero-title enter-title':'hero-title'} style={{'--duration':`${s.title.durationMs}ms`,'--delay':`${s.title.delayMs}ms`} as CSSProperties}><span className="hero-wide-lines">I design and build websites<br/>with <span className="accent">AI agents</span></span><span className="hero-desktop-lines"><span>I design and build</span><span>websites with</span><span className="accent">AI agents</span></span><span className="hero-mobile-lines">I design and<br/>build websites<br/>with<br/><span className="accent">AI agents</span></span></h1>
   <div className="scene-tools" aria-hidden="true">{tools.map((name,i)=><div key={name} className={`tool tool-${i} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.tools[i]),'--delay':`${s.stickers.delaysMs[i]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/${name}.png`} alt=""/></div>)}{['ui','ai','motion'].map((name,i)=>layout.stickers[i]&&<div key={name} className={`hero-sticker sticker-${name} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.stickers[i]!), '--delay':`${s.stickers.delaysMs[i+5]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/sticker-${name}.${name==='motion'?'png':'svg'}`} alt=""/></div>)}</div>
   <div className="metrics container">{[['7 years','in web design'],['40+','websites launched'],['12','awards & features'],['3 weeks','average project time']].map(([number,label])=><div key={label}><strong><Odometer value={number} hero/></strong><span>{label}</span></div>)}</div>
  </div>
  <div className="about-layer container" inert={!aboutActive&&!reducedMotion}><Label>About</Label><div className="about-copy"><h2>Hi, I'm <span className="accent highlight">Mira</span></h2><p className="lead">AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.</p></div><div className="tags">{['Veter agency · 4 years','UPROCK · AI Fullstack Designer','Utopia AI','Teaching web design','Figma','Claude Code','Codex','Blender','Spline'].map(tag=><Tag key={tag}>{tag}</Tag>)}</div><Button variant="secondary" href={links.cv??undefined} onClick={()=>{if(!links.cv)missing('CV PDF')}}><img src="/assets/download.svg" width="16" height="16" alt=""/>Download CV (PDF)</Button></div>
 </div></section>
}

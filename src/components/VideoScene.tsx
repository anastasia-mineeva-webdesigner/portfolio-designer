import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
import {animation,motionSettings} from '../config/animation';
import {staticHeroLayout} from '../config/hero-layout.mjs';
import {introCues,introSceneProgress} from '../config/intro-scene.mjs';
import {links} from '../config/links';
import {HeroVideo} from './HeroVideo';
import {HeroMetrics} from './HeroMetrics';
import {DesktopMotionDemo} from './DesktopMotionDemo';
import {Button,Label,Tag} from './UI';

export default function VideoScene({missing}:{missing:(label:string)=>void}){
 const [layout,setLayout]=useState(()=>staticHeroLayout(innerWidth));
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [aboutActive,setAboutActive]=useState(false);
 const root=useRef<HTMLElement>(null),pin=useRef<HTMLDivElement>(null),heading=useRef<HTMLHeadingElement>(null),panel=useRef<HTMLElement>(null);
 const demo=new URLSearchParams(location.search).get('demo')==='motion'&&layout.width>=1200;
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),resize=()=>setLayout(staticHeroLayout(innerWidth)),change=()=>setReduced(preference.matches);
  window.addEventListener('resize',resize);preference.addEventListener('change',change);
  return()=>{window.removeEventListener('resize',resize);preference.removeEventListener('change',change)};
 },[]);
 useLayoutEffect(()=>{
  if(reduced||demo||!root.current||!pin.current||!panel.current||!heading.current)return;
  const el=root.current,box=pin.current,title=heading.current,about=panel.current,settings=animation.introScene;
  const metrics=box.querySelector<HTMLElement>('.metrics')!;
  let raf=0,disposed=false,initialTop=0,initialHeight=0,finalTop=16,finalHeight=0,aboutTop=0,distance=1,portraitScale=1.24;
  const render=()=>{
   raf=0;if(disposed||document.hidden)return;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const c=introCues(introSceneProgress(el.getBoundingClientRect().top,header,distance),settings);
   box.style.setProperty('--intro-hero-opacity',String(c.hero));box.style.setProperty('--intro-hero-y',`${(1-c.hero)*-settings.heroTravelPx}px`);
   box.style.setProperty('--intro-portrait-scale',String(1+(portraitScale-1)*(1-c.lift)));
   box.style.setProperty('--intro-media-top',`${initialTop+(finalTop-initialTop)*c.lift}px`);
   box.style.setProperty('--intro-media-height',`${initialHeight+(finalHeight-initialHeight)*c.lift}px`);
   box.style.setProperty('--intro-about-opacity',String(c.about));box.style.setProperty('--intro-about-y',`${aboutTop+(1-c.about)*settings.aboutTravelPx}px`);
   setAboutActive(c.about>.15);
  };
  const schedule=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(render)};
  const measure=()=>{
   if(disposed)return;
   const mobile=innerWidth<600,header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const gap=mobile?16:24,bottom=80,minMedia=mobile?180:220;
   const titleHeight=title.offsetHeight,aboutHeight=about.offsetHeight,metricHeight=metrics.offsetHeight;
   portraitScale=mobile?1.12:1.24;
   const heroReserve=mobile?metricHeight+48:0;
   const height=Math.max(innerHeight-header,aboutHeight+minMedia+finalTop+gap+bottom,titleHeight+24+heroReserve+220);
   initialTop=titleHeight+24;initialHeight=height-initialTop-heroReserve;
   finalHeight=height-aboutHeight-finalTop-gap-bottom;aboutTop=finalTop+finalHeight+gap;
   distance=innerHeight*(mobile?settings.mobileScrollScreens:settings.desktopScrollScreens);
   const decorHeight=Math.max(100,initialHeight-(mobile?0:metricHeight+88));
   el.style.setProperty('--intro-pin-height',`${height}px`);el.style.setProperty('--intro-scroll-distance',`${distance}px`);
   box.style.setProperty('--intro-decor-top',`${initialTop}px`);box.style.setProperty('--intro-decor-height',`${decorHeight}px`);
   box.style.setProperty('--intro-tool-scale',String(Math.min(1,decorHeight/layout.artHeight)));
   render();
  };
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else measure()};
  const observer=new ResizeObserver(measure);observer.observe(title);observer.observe(about);observer.observe(metrics);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);document.addEventListener('visibilitychange',visibility);
  document.fonts.ready.then(()=>{if(!disposed)measure()});measure();
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility)};
 },[layout.width,reduced,demo]);
 const s=motionSettings(),tools=['utopia','figma','vscode','chatgpt','claude'];
 const itemStyle=(item:number[],fluid:boolean)=>({left:`${item[0]/layout.width*100}%`,top:fluid?`${item[1]/layout.artHeight*100}%`:`${item[1]}px`,width:fluid?`calc(${item[2]}px * var(--intro-tool-scale,1))`:`${item[2]}px`});
 const sceneStyle={'--hero-height':`${layout.height}px`,'--hero-art-top':`${layout.top}px`,'--hero-art-height':`${layout.artHeight}px`,'--hero-metrics-top':`${layout.metricsTop}px`,'--intro-scroll-distance':`${innerHeight*(layout.width<600?animation.introScene.mobileScrollScreens:animation.introScene.desktopScrollScreens)}px`} as CSSProperties;
 const title=<h1 ref={heading} className={animation.enabled.hero?'hero-title enter-title':'hero-title'} style={{'--duration':`${s.title.durationMs}ms`,'--delay':`${s.title.delayMs}ms`} as CSSProperties}><span className="hero-wide-lines">I design and build websites<br/>with <span className="accent">AI agents</span></span><span className="hero-desktop-lines"><span>I design and build</span><span>websites with <span className="accent">AI agents</span></span></span><span className="hero-mobile-lines">I design and<br/>build websites<br/>with<br/><span className="accent">AI agents</span></span></h1>;
 const decorations=(fluid:boolean)=><>{tools.map((name,i)=><div key={name} className={`tool tool-${i} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.tools[i],fluid),'--delay':`${s.stickers.delaysMs[i]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/tool-${name}.svg`} alt=""/></div>)}{['ui','ai','motion'].map((name,i)=>layout.stickers[i]&&<div key={name} className={`hero-sticker sticker-${name} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.stickers[i]!,fluid),'--delay':`${s.stickers.delaysMs[i+5]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/sticker-${name}.svg`} alt=""/></div>)}</>;
 const aboutContent=<><Label>About</Label><div className="about-copy"><h2 id="intro-about-title">Hi, I'm <span className="accent highlight">Mira</span></h2><p className="lead">AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.</p></div><div className="tags">{['Veter agency · 4 years','UPROCK · AI Fullstack Designer','Utopia AI','Teaching web design','Figma','Claude Code','Codex','Blender','Spline'].map(tag=><Tag key={tag}>{tag}</Tag>)}</div><Button variant="secondary" href={links.cv??undefined} onClick={()=>{if(!links.cv)missing('CV PDF')}}><img src="/assets/download.svg" width="16" height="16" alt=""/>Download CV (PDF)</Button></>;
 if(demo)return <DesktopMotionDemo missing={missing}/>;
 if(reduced)return <><section className="static-hero" style={sceneStyle} aria-label="Introduction">{title}<div className="scene-tools" aria-hidden="true"><HeroVideo/>{decorations(false)}</div><HeroMetrics/></section><section id="about" className="static-about intro-static-about container" aria-labelledby="intro-about-title">{aboutContent}</section></>;
 return <section ref={root} className="intro-scroll" style={sceneStyle} aria-label="Introduction and About"><span id="about" className="intro-about-anchor" aria-hidden="true"/><div ref={pin} className="intro-pin">
  <div className="intro-video-slot" aria-hidden="true"><HeroVideo/></div>
  <div className="intro-hero static-hero" inert={aboutActive}>{title}<div className="intro-decorations" aria-hidden="true">{decorations(true)}</div><HeroMetrics/></div>
  <section ref={panel} className="intro-about container" inert={!aboutActive} aria-labelledby="intro-about-title">{aboutContent}</section>
 </div></section>;
}

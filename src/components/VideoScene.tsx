import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
import {animation} from '../config/animation';
import {staticHeroLayout} from '../config/hero-layout.mjs';
import {introCues,introSceneProgress,introAboutGroups,mobileIntroScene} from '../config/intro-scene.mjs';

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
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),resize=()=>setLayout(previous=>{
   const next=staticHeroLayout(innerWidth);
   return previous.width===next.width?previous:next;
  }),change=()=>setReduced(preference.matches);
  window.addEventListener('resize',resize);preference.addEventListener('change',change);
  return()=>{window.removeEventListener('resize',resize);preference.removeEventListener('change',change)};
 },[]);
 useLayoutEffect(()=>{
  if(reduced||demo||!root.current||!pin.current||!panel.current||!heading.current)return;
  const el=root.current,box=pin.current,title=heading.current,about=panel.current;
  const mobile=layout.width<600,settings=mobile?mobileIntroScene:animation.introScene;
  const metrics=box.querySelector<HTMLElement>('.metrics');
  const mobileViewport=box.querySelector<HTMLElement>('.intro-mobile-viewport');
  const aboutGroups=Array.from(about.querySelectorAll<HTMLElement>(':scope > .label, .about-copy > h2, .about-copy > .lead, :scope > .tags, :scope > .button'));
  let raf=0,disposed=false,initialTop=0,initialHeight=0,finalTop=16,finalHeight=0,aboutTop=0,distance=1,portraitScale=1.04;
  const render=()=>{
   raf=0;if(disposed||document.hidden)return;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const pinTop=mobile?parseFloat(getComputedStyle(box).top):Math.min(header,innerHeight-box.offsetHeight);
   const progress=introSceneProgress(el.getBoundingClientRect().top,pinTop,distance);
   const c=introCues(progress,settings);
   const opacities=introAboutGroups(progress,mobile);
   aboutGroups.forEach((group,index)=>{group.style.opacity=String(opacities[index]);group.inert=opacities[index]===0});
   box.style.setProperty('--intro-hero-opacity',String(c.hero));box.style.setProperty('--intro-hero-y',`${(1-c.hero)*-settings.heroTravelPx}px`);
   box.style.setProperty('--intro-portrait-offset',String(1-c.lift));
   box.style.setProperty('--intro-portrait-scale',String(1+(portraitScale-1)*(1-c.lift)));
   box.style.setProperty('--intro-media-top',`${initialTop+(finalTop-initialTop)*c.lift}px`);
   box.style.setProperty('--intro-media-height',`${initialHeight+(finalHeight-initialHeight)*c.lift}px`);
   box.style.setProperty('--intro-about-opacity','1');box.style.setProperty('--intro-about-y',`${aboutTop+(1-c.about)*settings.aboutTravelPx}px`);
   setAboutActive(c.about>.15);
  };
  let active=true;
  const gate=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){window.addEventListener('scroll',schedule,{passive:true});schedule()}else window.removeEventListener('scroll',schedule)});
  const observed=el;if(observed)gate.observe(observed);
  const schedule=()=>{if(active&&!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(render)};
  const measure=()=>{
   if(disposed)return;
   const tablet=!mobile&&innerWidth<1200;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const titleHeight=title.offsetHeight,aboutHeight=about.offsetHeight;
   const decorTop=titleHeight+24;
   let height:number,decorHeight:number,toolScale:number;
   if(mobile&&mobileViewport){
    const viewportHeight=mobileViewport.offsetHeight;
    const availableHeight=viewportHeight-header;
    const gap=12,bottom=16,portraitInset=24;
    const textSpace=portraitInset+gap+aboutHeight+bottom;
    const aboutPortraitHeight=Math.max(128,Math.min(innerWidth*.92,availableHeight-textSpace));
    portraitScale=1;
    initialTop=decorTop;
    finalHeight=aboutPortraitHeight;
    height=textSpace+finalHeight;
    initialHeight=Math.max(finalHeight,availableHeight-initialTop);
    finalTop=portraitInset;
    aboutTop=finalTop+finalHeight+gap;
    distance=viewportHeight*settings.mobileScrollScreens;
    decorHeight=initialHeight;
    toolScale=Math.max(.82,Math.min(1,initialHeight/320));
   }else{
    const gap=24,bottom=parseFloat(getComputedStyle(el).getPropertyValue('--intro-end-space'));
    const metricHeight=metrics?.offsetHeight??0,heroReserve=tablet?metricHeight+40:0;
    portraitScale=innerWidth>=1700?1.3:1.25;
    finalTop=16;
    height=Math.max(innerHeight-header,aboutHeight+220+finalTop+gap+bottom,decorTop+heroReserve+220);
    initialTop=innerWidth<1200?(decorTop+(portraitScale-1)*(height-heroReserve))/portraitScale:decorTop;
    initialHeight=height-initialTop-heroReserve;
    finalHeight=height-aboutHeight-finalTop-gap-bottom;
    aboutTop=finalTop+finalHeight+gap;
    distance=innerHeight*settings.desktopScrollScreens;
    const decorMediaHeight=tablet?(height-heroReserve-decorTop)/1.24:initialHeight;
    decorHeight=Math.max(100,decorMediaHeight-(tablet?0:metricHeight+88));
    toolScale=Math.min(1,decorHeight/layout.artHeight)*(tablet?1.2:1);
   }
   el.style.setProperty('--intro-pin-height',`${height}px`);el.style.setProperty('--intro-timeline-distance',`${distance}px`);el.style.setProperty('--intro-scroll-distance',`${distance*settings.releaseAt}px`);
   box.style.setProperty('--intro-decor-top',`${decorTop}px`);box.style.setProperty('--intro-decor-height',`${decorHeight}px`);
   box.style.setProperty('--intro-tool-scale',String(toolScale));
   render();
  };
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else measure()};
  const observer=new ResizeObserver(measure);observer.observe(title);observer.observe(about);
  if(metrics)observer.observe(metrics);
  if(mobileViewport)observer.observe(mobileViewport);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);document.addEventListener('visibilitychange',visibility);
  document.fonts.ready.then(()=>{if(!disposed)measure()});measure();
  return()=>{gate.disconnect();disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility)};
 },[layout.width,reduced,demo]);
 const tools=['utopia','figma','vscode','chatgpt','claude'];
 const itemStyle=(item:number[],fluid:boolean)=>({left:`${item[0]/layout.width*100}%`,top:fluid?`${item[1]/layout.artHeight*100}%`:`${item[1]}px`,width:fluid?`calc(${item[2]}px * var(--intro-tool-scale,1))`:`${item[2]}px`});
 const settings=layout.width<600?mobileIntroScene:animation.introScene;
 const timelineDistance=innerHeight*(layout.width<600?settings.mobileScrollScreens:settings.desktopScrollScreens);
 const sceneStyle={'--hero-height':`${layout.height}px`,'--hero-art-top':`${layout.top}px`,'--hero-art-height':`${layout.artHeight}px`,'--hero-metrics-top':`${layout.metricsTop}px`,'--intro-timeline-distance':`${timelineDistance}px`,'--intro-scroll-distance':`${timelineDistance*settings.releaseAt}px`,'--intro-about-stop':layout.width<600?.69:.88} as CSSProperties;
 const title=<h1 ref={heading} className="hero-title"><span className="hero-wide-lines">I design and build websites<br/>with <span className="accent">AI agents</span></span><span className="hero-desktop-lines"><span>I design and build</span><span>websites with <span className="accent">AI agents</span></span></span><span className="hero-mobile-lines">I design and<br/>build websites<br/>with <span className="accent">AI agents</span></span></h1>;
 const decorations=(fluid:boolean)=><>{tools.map((name,i)=><div key={name} className={`tool tool-${i}`} style={itemStyle(layout.tools[i],fluid)}><img src={`/assets/tool-${name}.svg`} alt=""/></div>)}{['ui','ai','motion'].map((name,i)=>layout.stickers[i]&&<div key={name} className={`hero-sticker sticker-${name}`} style={itemStyle(layout.stickers[i]!,fluid)}><img src={`/assets/sticker-${name}.svg`} alt=""/></div>)}</>;
 const aboutText=layout.width<600
  ? 'AI Full Stack designer with 7 years in web design, 40+ projects launched and 12 awards and features. I take projects from structure to launch with AI agents.'
  : 'AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.';
 const aboutContent=<><Label plain>About</Label><div className="about-copy"><h2 id="intro-about-title">Hi, I'm <span className="accent highlight">Mira</span></h2><p className="lead">{aboutText}</p></div><div className="tags">{['Veter agency · 4 years','UPROCK · AI Fullstack Designer','Utopia AI','Teaching web design','Figma','Claude Code','Codex','Blender','Spline'].map(tag=><Tag key={tag}>{tag}</Tag>)}</div><Button variant="secondary" href="/cv/">Read more</Button></>;
 if(demo)return <DesktopMotionDemo missing={missing}/>;
 if(reduced)return <><section className="static-hero" style={sceneStyle} aria-label="Introduction">{title}<div className="scene-tools" aria-hidden="true"><HeroVideo/>{decorations(false)}</div><HeroMetrics/></section><section id="about" className="static-about intro-static-about container" aria-labelledby="intro-about-title">{aboutContent}</section></>;
 return <section ref={root} className="intro-scroll" style={sceneStyle} aria-label="Introduction and About"><span id="about" className="intro-about-anchor" aria-hidden="true"/><div ref={pin} className="intro-pin intro-entrance">
  {layout.width<600&&<span className="intro-mobile-viewport" aria-hidden="true"/>}
  <div className="intro-video-slot" aria-hidden="true"><HeroVideo/></div>
  <div className="intro-hero static-hero" inert={aboutActive}>{title}<div className="intro-decorations" aria-hidden="true">{decorations(true)}</div><HeroMetrics/></div>
  <section ref={panel} className="intro-about container" inert={!aboutActive} aria-labelledby="intro-about-title">{aboutContent}</section>
 </div></section>;
}

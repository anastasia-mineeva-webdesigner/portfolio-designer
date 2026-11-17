import {useEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
import {animation,motionSettings} from '../config/animation';
import {staticHeroLayout} from '../config/hero-layout.mjs';
import {Reveal} from './Reveal';

import {HeroVideo} from './HeroVideo';
import {HeroMetrics} from './HeroMetrics';
import {DesktopMotionDemo} from './DesktopMotionDemo';
import {Button,Label,Tag} from './UI';

export default function VideoScene({missing}:{missing:(label:string)=>void}){
 const [layout,setLayout]=useState(()=>staticHeroLayout(innerWidth));
 const heading=useRef<HTMLHeadingElement>(null);
 const demo=new URLSearchParams(location.search).get('demo')==='motion'&&layout.width>=1200;
 useEffect(()=>{
  const resize=()=>setLayout(staticHeroLayout(innerWidth));
  window.addEventListener('resize',resize);
  return()=>{window.removeEventListener('resize',resize)};
 },[]);
 const s=motionSettings(),tools=['utopia','figma','vscode','chatgpt','claude'];
 const itemStyle=(item:number[],fluid:boolean)=>({left:`${item[0]/layout.width*100}%`,top:fluid?`${item[1]/layout.artHeight*100}%`:`${item[1]}px`,width:fluid?`calc(${item[2]}px * var(--intro-tool-scale,1))`:`${item[2]}px`});
 const sceneStyle={'--hero-height':`${layout.height}px`,'--hero-art-top':`${layout.top}px`,'--hero-art-height':`${layout.artHeight}px`,'--hero-metrics-top':`${layout.metricsTop}px`,'--intro-scroll-distance':`${innerHeight*(layout.width<600?animation.introScene.mobileScrollScreens:animation.introScene.desktopScrollScreens)}px`} as CSSProperties;
 const title=<h1 ref={heading} className={animation.enabled.hero?'hero-title enter-title':'hero-title'} style={{'--duration':`${s.title.durationMs}ms`,'--delay':`${s.title.delayMs}ms`} as CSSProperties}><span className="hero-wide-lines">I design and build websites<br/>with <span className="accent">AI agents</span></span><span className="hero-desktop-lines"><span>I design and build</span><span>websites with <span className="accent">AI agents</span></span></span><span className="hero-mobile-lines">I design and<br/>build websites<br/>with<br/><span className="accent">AI agents</span></span></h1>;
 const decorations=(fluid:boolean)=><>{tools.map((name,i)=><div key={name} className={`tool tool-${i} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.tools[i],fluid),'--delay':`${s.stickers.delaysMs[i]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/tool-${name}.svg`} alt=""/></div>)}{['ui','ai','motion'].map((name,i)=>layout.stickers[i]&&<div key={name} className={`hero-sticker sticker-${name} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.stickers[i]!,fluid),'--delay':`${s.stickers.delaysMs[i+5]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/sticker-${name}.svg`} alt=""/></div>)}</>;
 const aboutContent=<><Label>About</Label><div className="about-copy"><h2 id="intro-about-title">Hi, I'm <span className="accent highlight">Mira</span></h2><p className="lead">AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.</p></div><div className="tags">{['Veter agency · 4 years','UPROCK · AI Fullstack Designer','Utopia AI','Teaching web design','Figma','Claude Code','Codex','Blender','Spline'].map(tag=><Tag key={tag}>{tag}</Tag>)}</div><Button variant="secondary" href="/cv/">View CV ↗</Button></>;
 if(demo)return <DesktopMotionDemo missing={missing}/>;
 return <><section className="static-hero" style={sceneStyle} aria-label="Introduction">{title}<div className="scene-tools" aria-hidden="true"><HeroVideo/>{decorations(false)}</div><HeroMetrics/></section><section id="about" className="static-about intro-static-about container" aria-labelledby="intro-about-title"><Reveal kind="headings">{aboutContent}</Reveal></section></>;
}

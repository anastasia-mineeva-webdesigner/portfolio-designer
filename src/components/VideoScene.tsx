import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {animation,motionSettings} from '../config/animation';
import {staticHeroLayout} from '../config/hero-layout.mjs';
import {media} from '../config/media';
import {links} from '../config/links';
import {HeroMetrics} from './HeroMetrics';
import {DesktopMotionDemo} from './DesktopMotionDemo';
import {Button,Label,Tag} from './UI';

// The video is parked for a later iteration. Both blocks now have normal flow.
export default function VideoScene({missing}:{missing:(label:string)=>void}){
 const [layout,setLayout]=useState(()=>staticHeroLayout(innerWidth));
 useEffect(()=>{const resize=()=>setLayout(staticHeroLayout(innerWidth));window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
 const s=motionSettings(),tools=['utopia','figma','vscode','chatgpt','claude'];
 const itemStyle=(item:number[])=>({left:`${item[0]/layout.width*100}%`,top:`${item[1]}px`,width:`${item[2]}px`});
 const sceneStyle={'--hero-height':`${layout.height}px`,'--hero-art-top':`${layout.top}px`,'--hero-art-height':`${layout.artHeight}px`,'--hero-metrics-top':`${layout.metricsTop}px`,'--about-art-height':`${layout.about.artHeight}px`,'--about-lead-width':`${layout.about.leadWidth}px`} as CSSProperties;
 if(new URLSearchParams(location.search).get('demo')==='motion'&&layout.width>=1200)return <DesktopMotionDemo missing={missing}/>;
 return <><section style={sceneStyle} className="static-hero" aria-label="Introduction"><h1 className={animation.enabled.hero?'hero-title enter-title':'hero-title'} style={{'--duration':`${s.title.durationMs}ms`,'--delay':`${s.title.delayMs}ms`} as CSSProperties}><span className="hero-wide-lines">I design and build websites<br/>with <span className="accent">AI agents</span></span><span className="hero-desktop-lines"><span>I design and build</span><span>websites with <span className="accent">AI agents</span></span></span><span className="hero-mobile-lines">I design and<br/>build websites<br/>with<br/><span className="accent">AI agents</span></span></h1>
   <div className="scene-tools" aria-hidden="true"><img className="static-hero-image" src={media.poster} width="1920" height="760" alt="" fetchPriority="high"/>{tools.map((name,i)=><div key={name} className={`tool tool-${i} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.tools[i]),'--delay':`${s.stickers.delaysMs[i]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/tool-${name}.svg`} alt=""/></div>)}{['ui','ai','motion'].map((name,i)=>layout.stickers[i]&&<div key={name} className={`hero-sticker sticker-${name} ${animation.enabled.stickers?'enter-item':''}`} style={{...itemStyle(layout.stickers[i]!), '--delay':`${s.stickers.delaysMs[i+5]}ms`,'--duration':`${s.stickers.durationMs}ms`,'--offset':`${s.stickers.offsetPx}px`,'--scale':s.stickers.scale} as CSSProperties}><img src={`/assets/sticker-${name}.svg`} alt=""/></div>)}</div>
   <HeroMetrics/>
 </section><section id="about" className="static-about container" style={sceneStyle}><Label>About</Label><img className="static-about-image" src={media.aboutPoster} width="1312" height="570" alt="Mira smiling and waving" loading="lazy"/><div className="about-copy"><h2>Hi, I'm <span className="accent highlight">Mira</span></h2><p className="lead">AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.</p></div><div className="tags">{['Veter agency · 4 years','UPROCK · AI Fullstack Designer','Utopia AI','Teaching web design','Figma','Claude Code','Codex','Blender','Spline'].map(tag=><Tag key={tag}>{tag}</Tag>)}</div><Button variant="secondary" href={links.cv??undefined} onClick={()=>{if(!links.cv)missing('CV PDF')}}><img src="/assets/download.svg" width="16" height="16" alt=""/>Download CV (PDF)</Button></section></>;
}

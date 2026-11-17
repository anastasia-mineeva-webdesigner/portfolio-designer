import {useEffect,useRef,useState} from 'react';
import {animation} from '../config/animation';
import {media} from '../config/media';
import {introCues,introSceneProgress} from '../config/intro-scene.mjs';
import {demoTime,heroVideoProgress} from '../config/demo-motion.mjs';

export function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null);
 // Safari can decode VP9 without its alpha plane; use the same matte on our exact page colour.
 const appleWebKit=/Apple/.test(navigator.vendor)||/iPad|iPhone|iPod/.test(navigator.userAgent);
 const [source,setSource]=useState(()=>appleWebKit||matchMedia('(pointer: coarse)').matches?media.mobileVideoSrc:media.videoSrc);
 const [failed,setFailed]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const v=ref.current,preference=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,target=0,ready=false,disposed=false;
  const render=()=>{raf=0;if(!v||!ready||preference.matches||document.hidden)return;
   const hero=v.closest('section');if(!hero)return;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const shared=v.closest<HTMLElement>('.intro-scroll');
   const progress=shared?introCues(introSceneProgress(shared.getBoundingClientRect().top,header,parseFloat(getComputedStyle(shared).getPropertyValue('--intro-scroll-distance'))),animation.introScene).video:heroVideoProgress(hero.getBoundingClientRect().top,hero.offsetHeight,innerHeight,header);
   target=demoTime(progress,v.duration);
   if(!v.seeking&&Math.abs(v.currentTime-target)>.025)v.currentTime=target;
  };
  const schedule=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(render)};
  const loaded=()=>{ready=!!v&&Number.isFinite(v.duration);schedule()};
  // Mobile browsers may defer decoding despite preload. A muted inline play
  // primes the decoder; scroll remains the sole owner of the displayed time.
  const prime=()=>{if(!v||preference.matches||disposed)return;v.muted=true;const play=v.play();play?.then(()=>{if(disposed)return;v.pause();loaded()}).catch(()=>{loaded()})};
  window.addEventListener('touchstart',prime,{once:true,passive:true});
  v?.addEventListener('loadedmetadata',loaded);v?.addEventListener('canplay',loaded);
  prime();
  const seeked=()=>{if(v&&Math.abs(v.currentTime-target)>.025)schedule()};
  const change=()=>{setReduced(preference.matches);schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
  v?.addEventListener('loadeddata',loaded);v?.addEventListener('seeked',seeked);if(v&&v.readyState>=2)loaded();schedule();
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);v?.pause();window.removeEventListener('touchstart',prime);v?.removeEventListener('loadedmetadata',loaded);v?.removeEventListener('canplay',loaded);v?.removeEventListener('loadeddata',loaded);v?.removeEventListener('seeked',seeked)};
 },[failed,reduced,source]);
 if(failed||reduced||!animation.enabled.video||!media.videoSrc)return <img className="hero-current-media" src={media.poster} width="1920" height="1080" alt="" fetchPriority="high"/>;
 return <video ref={ref} className="hero-current-media" src={source} poster={media.poster} width="1920" height="1080" muted playsInline preload="auto" aria-hidden="true" onError={()=>{if(source!==media.fallbackVideoSrc)setSource(media.fallbackVideoSrc);else setFailed(true)}}/>;
}

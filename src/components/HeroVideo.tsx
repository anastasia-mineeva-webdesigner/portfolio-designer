import {useEffect,useRef,useState} from 'react';
import {createVideoPrimer} from '../config/video-primer.mjs';
import {animation} from '../config/animation';
import {media} from '../config/media';
import {introVideoProgress,mobileIntroScene,tabletIntroScene} from '../config/intro-scene.mjs';
import {demoTime,heroVideoProgress} from '../config/demo-motion.mjs';

// Static hosting may return the whole file to a byte-range request. Loading it
// once as a Blob gives the decoder a seekable source on the first visit.
const clipRequests=new Map<string,Promise<Blob|null>>();
function loadClip(source:string){
 const pending=clipRequests.get(source);
 if(pending)return pending;
 const request=fetch(source,{priority:'high'})
  .then(response=>response.ok?response.blob():null)
  .catch(()=>null);
 clipRequests.set(source,request);
 return request;
}

export function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null);
 // Safari can decode VP9 without its alpha plane; use the same matte on our exact page colour.
 const appleWebKit=/Apple/.test(navigator.vendor)||/iPad|iPhone|iPod/.test(navigator.userAgent);
 const [source,setSource]=useState(()=>appleWebKit||matchMedia('(pointer: coarse), (width < 1200px)').matches?media.mobileVideoSrc:media.videoSrc);
 const [clip,setClip]=useState<{source:string,url:string}|null>(null);
 const [failed,setFailed]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const activeSource=clip?.source===source?clip.url:null;
 useEffect(()=>{
  if(reduced||failed||!animation.enabled.video||!source)return;
  let disposed=false,url:string|undefined;
  void loadClip(source).then(blob=>{
   if(disposed)return;
   url=blob?.size?URL.createObjectURL(blob):undefined;
   setClip({source,url:url??source});
  });
  return()=>{disposed=true;if(url)URL.revokeObjectURL(url)};
 },[failed,reduced,source]);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>setReduced(preference.matches);
  preference.addEventListener('change',change);
  return()=>preference.removeEventListener('change',change);
 },[]);
 useEffect(()=>{
  const v=ref.current,preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(!v)return;
  let raf=0,target=0,ready=false,disposed=false;
  const render=()=>{raf=0;if(!v||!ready||preference.matches||document.hidden)return;
   const hero=v.closest('section');if(!hero)return;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
   const shared=v.closest<HTMLElement>('.intro-scroll');
   const pin=shared?.querySelector<HTMLElement>('.intro-pin');
   const settings=innerWidth<600?mobileIntroScene:innerWidth<1200?tabletIntroScene:animation.introScene;
   const progress=shared?introVideoProgress(
    shared.getBoundingClientRect().top,header,
    pin&&innerWidth<1200?parseFloat(getComputedStyle(pin).top):Math.min(header,innerHeight-(pin?.offsetHeight??innerHeight-header)),
    parseFloat(getComputedStyle(shared).getPropertyValue('--intro-timeline-distance')),settings.videoRange,
   ):heroVideoProgress(hero.getBoundingClientRect().top,hero.offsetHeight,innerHeight,header);
   target=demoTime(progress,v.duration);
   if(!v.seeking&&Math.abs(v.currentTime-target)>.025)v.currentTime=target;
  };
  let active=true;
  const gate=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){window.addEventListener('scroll',schedule,{passive:true});schedule()}else window.removeEventListener('scroll',schedule)});
  const observed=v?.closest('section');if(observed)gate.observe(observed);
  const schedule=()=>{if(active&&!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(render)};
  const loaded=()=>{ready=!!v&&Number.isFinite(v.duration);schedule()};
  const primer=v?createVideoPrimer(v,loaded):null;
  const prime=()=>{if(!preference.matches&&!document.hidden)void primer?.prime()};
  const mediaReady=()=>{loaded();prime()};
  // Keep gesture retries until a decoded frame has actually been presented.
  for(const event of ['pointerdown','touchstart','touchend'])window.addEventListener(event,prime,{passive:true});
  v?.addEventListener('loadedmetadata',loaded);v?.addEventListener('canplay',mediaReady);
  prime();
  const seeked=()=>{if(v&&Math.abs(v.currentTime-target)>.025)schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else {prime();schedule()}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',visibility);
  v?.addEventListener('loadeddata',mediaReady);v?.addEventListener('seeked',seeked);if(v&&v.readyState>=2)loaded();schedule();
  return()=>{gate.disconnect();disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',visibility);primer?.dispose();for(const event of ['pointerdown','touchstart','touchend'])window.removeEventListener(event,prime);v?.removeEventListener('loadedmetadata',loaded);v?.removeEventListener('canplay',mediaReady);v?.removeEventListener('loadeddata',mediaReady);v?.removeEventListener('seeked',seeked)};
 },[activeSource,failed,reduced]);
 if(!activeSource||failed||reduced||!animation.enabled.video||!media.videoSrc)return <img className="hero-current-media" src={media.poster} srcSet="/media/hero-poster-640.webp 640w, /media/hero-poster-960.webp 960w, /media/hero-poster-1280.webp 1280w" sizes="(max-width: 599px) 100vw, 90vw" width="1920" height="1080" alt="" fetchPriority="high"/>;
 return <video ref={ref} className="hero-current-media" src={activeSource} poster={media.poster} width="1920" height="1080" muted playsInline preload="auto" aria-hidden="true" onError={()=>{if(source!==media.fallbackVideoSrc)setSource(media.fallbackVideoSrc);else setFailed(true)}}/>;
}

import {useEffect, useRef} from 'react';
import {animation} from '../config/animation';

export function Odometer({value,hero=false}:{value:string;hero?:boolean}) {
 const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const el=ref.current!, reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false, played=false;
  const running:Animation[]=[];
  const finish=()=>{running.forEach(a=>a.cancel());el.dataset.played='true'};
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.5))start()}, {threshold:.5});
  const start=()=>{if(disposed||played)return;played=true;observer.disconnect();el.dataset.played='true';if(reduced.matches||!animation.odometer.enabled)return;
   el.querySelectorAll<HTMLElement>('.odometer-strip').forEach((strip,i)=>{
    const end=Number(strip.dataset.end),count=Number(strip.dataset.count);
    running.push(strip.animate([{transform:'translateY(0)'},{transform:`translateY(-${end/count*100}%)`}],{duration:hero?animation.odometer.heroMs:animation.odometer.experienceMs,delay:i*animation.odometer.staggerMs,easing:'cubic-bezier(.18,.7,.2,1)',fill:'backwards'}));
   });
  };
  const change=()=>{if(reduced.matches){played=true;observer.disconnect();finish()}};
  reduced.addEventListener('change',change);
  document.fonts.ready.then(()=>{if(disposed)return;if(reduced.matches||!animation.odometer.enabled)start();else observer.observe(el)});
  return()=>{disposed=true;observer.disconnect();running.forEach(a=>a.cancel());reduced.removeEventListener('change',change)};
 },[hero,value]);
 return <span ref={ref} className="odometer"><span className="sr-only">{value}</span><span aria-hidden="true">{Array.from(value).map((c,i)=>{
  if(!/\d/.test(c))return <span key={i} className="odometer-static">{c}</span>;
  const end=animation.odometer.turns*10+Number(c),count=end+1;
  return <span key={i} className="odometer-digit"><span className="odometer-reserve">{c}</span><span className="odometer-strip" data-end={end} data-count={count} style={{transform:`translateY(-${end/count*100}%)`}}>{Array.from({length:count},(_,n)=><span key={n}>{n%10}</span>)}</span></span>;
 })}</span></span>;
}

export function HighlightText({text}:{text:string;numbers?:string[]}) {
 return <h3 className="highlight-text">{text}</h3>;
}

export function CursorTrail(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext('2d');if(!ctx)return;
  const root=document.documentElement;
  if(!root.style.getPropertyValue('--cursor-trail-color'))root.style.setProperty('--cursor-trail-color',animation.cursorTrail.color);
  if(!root.style.getPropertyValue('--cursor-trail-width'))root.style.setProperty('--cursor-trail-width',`${animation.cursorTrail.width}px`);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mouse=matchMedia('(hover: hover) and (pointer: fine)'),s=animation.cursorTrail;
  let points:{x:number;y:number;t:number}[]=[],raf=0,color='',width=0;
  const enabled=()=>!reduced.matches&&s.mode!=='off'&&(s.mode==='on'||mouse.matches);
  const clear=()=>{cancelAnimationFrame(raf);raf=0;points=[];ctx.clearRect(0,0,innerWidth,innerHeight)};
  const resize=()=>{clear();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
  const draw=(now:number)=>{raf=0;points=points.filter(p=>now-p.t<s.lifetimeMs);ctx.clearRect(0,0,innerWidth,innerHeight);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;ctx.lineWidth=width;
   for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],prev=points[Math.max(0,i-2)];ctx.globalAlpha=Math.pow(Math.max(0,1-(now-a.t)/s.lifetimeMs),1.5);ctx.beginPath();ctx.moveTo((prev.x+a.x)/2,(prev.y+a.y)/2);ctx.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);ctx.stroke()}
   ctx.globalAlpha=1;if(points.length)raf=requestAnimationFrame(draw);
  };
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse'||!enabled()||document.hidden){clear();return}const css=getComputedStyle(document.documentElement);color=css.getPropertyValue('--cursor-trail-color').trim()||s.color;width=parseFloat(css.getPropertyValue('--cursor-trail-width'))||s.width;
   points.push({x:e.clientX,y:e.clientY,t:performance.now()});if(points.length>s.maxPoints)points.splice(0,points.length-s.maxPoints);if(!raf)raf=requestAnimationFrame(draw);
  };
  resize();window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',clear);window.addEventListener('blur',clear);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',clear);reduced.addEventListener('change',clear);mouse.addEventListener('change',clear);
  return()=>{clear();window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',clear);window.removeEventListener('blur',clear);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',clear);reduced.removeEventListener('change',clear);mouse.removeEventListener('change',clear)};
 },[]);
 return <canvas ref={ref} className="cursor-trail" aria-hidden="true"/>;
}

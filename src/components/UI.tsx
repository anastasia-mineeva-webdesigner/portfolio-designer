import {useEffect,useRef} from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {animation} from '../config/animation';
const underlinePaths=['M2 10 Q24 3 49 9 T98 7','M2 11 Q50 0 98 10','M2 7 Q45 10 98 5 M6 12 Q51 7 94 12','M2 10 L24 6 L46 11 L70 5 L98 9','M2 8 C20 1 30 14 49 8 S80 2 98 9','M2 11 C32 11 66 3 98 6'];
export function Button({children, href, download, variant='primary', onClick, disabled=false, loading=false, className=''}:{children:ReactNode;href?:string;download?:string;variant?:'primary'|'secondary'|'navigation';onClick?:()=>void;disabled?:boolean;loading?:boolean;className?:string}) {
  const ref=useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useEffect(()=>{
    const el=ref.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)'),mouse=matchMedia('(hover: hover) and (pointer: fine)');
    let running:Animation[]=[],busy=false,last=-1;
    const path=el.querySelector<SVGPathElement>('.menu-underline path');
    const reset=()=>{running.forEach(a=>a.cancel());running=[];busy=false;if(path){path.style.strokeDashoffset='1';path.style.opacity='0'}};
    const underline=()=>{const s=animation.underline;if(!path||reduced.matches||s.mode==='off'||(s.mode==='auto'&&(!mouse.matches||innerWidth<s.desktopMin)))return;
      running.forEach(a=>a.cancel());const next=(last+1+Math.floor(Math.random()*(underlinePaths.length-1)))%underlinePaths.length;last=next;path.setAttribute('d',underlinePaths[next]);path.style.opacity='1';path.style.strokeDashoffset='0';running=[path.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:s.drawMs,easing:'ease-out'})];
    };
    const roll=()=>{if(busy||reduced.matches||!animation.buttonRoll.enabled||el.matches(':disabled,[aria-busy=true]'))return;
      const chars=Array.from(el.querySelectorAll<HTMLElement>('.roll-char'));if(!chars.length)return;busy=true;
      const s=animation.buttonRoll,delay=Math.min(s.staggerMs,Math.max(0,(s.maxTotalMs-s.durationMs)/Math.max(1,chars.length-1)));
      running=chars.map((char,i)=>char.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}],{duration:s.durationMs,delay:i*delay,easing:'cubic-bezier(.22,.65,.3,1)'}));
      Promise.all(running.map(a=>a.finished.catch(()=>{}))).then(()=>{busy=false});
    };
    const enter=()=>{if(mouse.matches){if(variant==='navigation')underline();if(variant!=='navigation')roll()}};
    const focus=()=>{if(el.matches(':focus-visible')){if(variant==='navigation')underline();if(variant!=='navigation')roll()}};
    const leave=()=>{if(!path||el.matches(':focus-visible'))return;path.style.opacity='0'};
    const touch=()=>{if(animation.underline.mode==='on')underline()};
    const resize=()=>{if(animation.underline.mode!=='on'&&(innerWidth<animation.underline.desktopMin||!mouse.matches))reset()};
    el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);el.addEventListener('focus',focus);el.addEventListener('blur',leave);el.addEventListener('pointerdown',touch);reduced.addEventListener('change',reset);mouse.addEventListener('change',resize);window.addEventListener('resize',resize);
    return()=>{reset();el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);el.removeEventListener('focus',focus);el.removeEventListener('blur',leave);el.removeEventListener('pointerdown',touch);reduced.removeEventListener('change',reset);mouse.removeEventListener('change',resize);window.removeEventListener('resize',resize)};
  },[variant,children,disabled,loading]);
  let content=children;
  if(variant!=='navigation'&&typeof children==='string'){
    const match=children.match(/^([^\p{L}\p{N}]+\s)(.*)$/u),icon=match?.[1],text=match?.[2]??children;
    content=<>{icon&&<span aria-hidden="true">{icon.trim()}</span>}<span className="sr-only">{text}</span><span className="roll-label" aria-hidden="true">{Array.from(text).map((c,i)=><span key={i} className="roll-char">{c===' '?'\u00a0':c}<span className="roll-copy">{c===' '?'\u00a0':c}</span></span>)}</span></>;
  }
  if(variant==='navigation')content=<>{children}<svg className="menu-underline" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true" style={{color:animation.underline.color,strokeWidth:animation.underline.width, bottom:`-${animation.underline.offsetPx+12}px`, '--underline-fade':`${animation.underline.fadeMs}ms`} as CSSProperties}><path d={underlinePaths[0]} pathLength="1"/></svg></>;
  const cls=`button button--${variant} ${className}`;
  return href && !disabled && !loading ? <a ref={ref} className={cls} href={href} download={download} onClick={onClick}>{content}</a> : <button ref={ref} className={cls} type="button" onClick={onClick} disabled={disabled||loading} aria-busy={loading||undefined}>{loading&&<span className="spinner"/>}{content}</button>;
}
export function Label({children,dark=false}:{children:ReactNode;dark?:boolean}){return <span className={`label ${dark?'label--dark':''}`}><span className="dot"/>{children}</span>}
export function Tag({children}:{children:ReactNode}){return <span className="tag">{children}</span>}
export function Decoration({name,className='',style}:{name:string;className?:string;style?:CSSProperties}){return <img className={`decoration ${className}`} style={style} src={`/assets/${name}.png`} alt="" aria-hidden="true" loading="lazy"/>}

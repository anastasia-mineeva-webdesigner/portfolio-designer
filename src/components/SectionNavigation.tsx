import {useEffect,useRef,useState} from 'react';

type SectionLink = {
 id: string;
 title: string;
 shortTitle?: string;
};

export function useSectionNavigation(links:readonly SectionLink[]){
 const [active,setActive]=useState(links[0].id);
 const [showCompact,setShowCompact]=useState(false);

 useEffect(()=>{
  const sections=links.map(link=>document.getElementById(link.id)).filter(element=>element!==null);
  const first=sections[0];
  if(!first)return;
  const narrow=matchMedia('(max-width: 1199px)');
  let frame=0;
  const update=()=>{
   frame=0;
   const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
   const margin=parseFloat(getComputedStyle(first).scrollMarginTop)||0;
   const line=Math.max(padding+margin+2,innerHeight*.3);
   let current=first.id;
   for(const section of sections){
    if(section.getBoundingClientRect().top<=line)current=section.id;
   }
   setActive(current);
   setShowCompact(narrow.matches&&first.getBoundingClientRect().top<=innerHeight-24);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const observer=new ResizeObserver(schedule);
  sections.forEach(section=>observer.observe(section));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('hashchange',schedule);
  narrow.addEventListener('change',schedule);
  update();
  return()=>{
   cancelAnimationFrame(frame);
   observer.disconnect();
   window.removeEventListener('scroll',schedule);
   window.removeEventListener('resize',schedule);
   window.removeEventListener('hashchange',schedule);
   narrow.removeEventListener('change',schedule);
  };
 },[links]);

 return {active,showCompact};
}

const number=(index:number)=>String(index+1).padStart(2,'0');

export function CompactSectionNavigation({links,active,label}:{links:readonly SectionLink[];active:string;label:string}){
 const details=useRef<HTMLDetailsElement>(null);
 const index=Math.max(0,links.findIndex(link=>link.id===active));
 const current=links[index];

 function close(restoreFocus:boolean){
  const el=details.current;
  if(!el?.open)return;
  el.open=false;
  if(restoreFocus)el.querySelector('summary')?.focus({preventScroll:true});
 }

 useEffect(()=>{
  const dismiss=(event:PointerEvent)=>{
   const el=details.current;
   if(el?.open&&event.target instanceof Node&&!el.contains(event.target))el.open=false;
  };
  document.addEventListener('pointerdown',dismiss);
  return()=>document.removeEventListener('pointerdown',dismiss);
 },[]);

 return <details className="compact-section-menu" ref={details}
  onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))close(false)}}
  onKeyDown={event=>{
   if(event.key==='Escape'&&event.currentTarget.open){
    event.preventDefault();
    close(true);
   }
  }}>
  <summary aria-label={`${label}: ${current.shortTitle??current.title}`}>
   <span className="compact-section-number">{number(index)}</span>
   <span>{current.shortTitle??current.title}</span>
  </summary>
  <nav aria-label={label}>
   {links.map((link,i)=><a key={link.id} href={`#${link.id}`} aria-current={active===link.id?'location':undefined} onClick={()=>close(true)}>
    <span className="compact-section-number">{number(i)}</span>
    <span>{link.shortTitle??link.title}</span>
   </a>)}
  </nav>
 </details>;
}

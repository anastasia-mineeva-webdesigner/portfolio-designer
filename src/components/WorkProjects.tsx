import {useEffect,useRef,useState} from 'react';
import {cases} from '../data/cases';
import {FlipProjectCard} from './FlipProjectCard';
import {ProjectArrow} from './RelatedProjects';

export function WorkProjects(){
 const track=useRef<HTMLDivElement>(null);
 const gesture=useRef({x:0,y:0,moved:false});
 const [edges,setEdges]=useState({start:true,end:false});

 useEffect(()=>{
  const el=track.current!;
  const update=()=>setEdges({start:el.scrollLeft<=1,end:el.scrollLeft>=el.scrollWidth-el.clientWidth-1});
  const resize=new ResizeObserver(update);
  resize.observe(el);
  const first=el.firstElementChild;
  if(first)resize.observe(first);
  el.addEventListener('scroll',update,{passive:true});
  update();
  return()=>{resize.disconnect();el.removeEventListener('scroll',update)};
 },[]);

 function move(direction:number){
  const el=track.current!;
  const card=el.firstElementChild as HTMLElement;
  const gap=parseFloat(getComputedStyle(el).columnGap);
  el.scrollBy({left:direction*(card.offsetWidth+gap),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }

 return <div className="work-projects">
  <div ref={track} id="work-project-track" className="project-grid" role="region" aria-label="Selected projects" tabIndex={0}
   onKeyDown={event=>{
    if(event.target!==event.currentTarget||!matchMedia('(max-width: 719px)').matches)return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}
   }}
   onPointerDownCapture={event=>{gesture.current={x:event.clientX,y:event.clientY,moved:false}}}
   onPointerMoveCapture={event=>{
    if(event.buttons&&Math.hypot(event.clientX-gesture.current.x,event.clientY-gesture.current.y)>10)gesture.current.moved=true;
   }}
   onClickCapture={event=>{
    if(event.detail>0&&gesture.current.moved){event.preventDefault();event.stopPropagation()}
   }}>
   {cases.map(project=><FlipProjectCard key={project.slug} project={project}/>)}
  </div>
  <div className="work-project-controls related-controls" role="group" aria-label="Selected project controls">
   <button type="button" className="related-control" aria-label="Previous selected project" aria-controls="work-project-track" disabled={edges.start} onClick={()=>move(-1)}><ProjectArrow direction="left"/></button>
   <button type="button" className="related-control" aria-label="Next selected project" aria-controls="work-project-track" disabled={edges.end} onClick={()=>move(1)}><ProjectArrow direction="right"/></button>
  </div>
 </div>;
}

import {ProjectPreview} from './ProjectPreview';
import {useEffect,useRef,useState} from 'react';
import {cases} from '../data/cases';
import {Label} from './UI';

function Arrow({direction}:{direction:'left'|'right'|'diagonal'}){
 return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{transform:direction==='left'?'rotate(180deg)':direction==='diagonal'?'rotate(-45deg)':undefined}}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function RelatedProjects({current}:{current:string}){
 const track=useRef<HTMLDivElement>(null);
 const [edges,setEdges]=useState({start:true,end:false});
 useEffect(()=>{
  const el=track.current!;
  const update=()=>setEdges({start:el.scrollLeft<=1,end:el.scrollLeft>=el.scrollWidth-el.clientWidth-1});
  const resize=new ResizeObserver(update);resize.observe(el);Array.from(el.children).forEach(child=>resize.observe(child));
  el.addEventListener('scroll',update,{passive:true});update();
  return()=>{resize.disconnect();el.removeEventListener('scroll',update)};
 },[current]);
 const move=(direction:number)=>{
  const el=track.current!,card=el.firstElementChild as HTMLElement|null;
  const step=card?card.offsetWidth+parseFloat(getComputedStyle(el).columnGap):el.clientWidth;
  el.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 return <section className="related-projects" aria-labelledby="related-title"><div className="related-heading"><div><Label>Selected work</Label><h2 id="related-title">Explore more projects</h2></div><div className="related-controls" role="group" aria-label="Project slider controls"><button type="button" className="related-control" aria-label="Previous projects" aria-controls="related-track" disabled={edges.start} onClick={()=>move(-1)}><Arrow direction="left"/></button><button type="button" className="related-control" aria-label="Next projects" aria-controls="related-track" disabled={edges.end} onClick={()=>move(1)}><Arrow direction="right"/></button></div></div><div ref={track} id="related-track" className="related-track" tabIndex={0} role="region" aria-label="More projects">{cases.filter(item=>item.slug!==current).map(item=><a className="related-card" key={item.slug} href={`/cases/${item.slug}/`} aria-label={`View ${item.title}`}><ProjectPreview project={item} sizes="auto, (max-width: 599px) 85vw, 400px"/><div className="related-card-caption"><div><span>{item.category}</span><h3>{item.title}</h3></div><span className="related-card-arrow"><Arrow direction="diagonal"/></span></div></a>)}</div></section>;
}

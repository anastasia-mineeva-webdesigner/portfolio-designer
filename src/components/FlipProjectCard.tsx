import {useEffect,useRef,useState} from 'react';
import {ProjectPreview} from './ProjectPreview';
import type {CaseStudy} from '../data/cases';

const directMedia = '(max-width: 719px), (hover: none)';

export function FlipProjectCard({project}:{project:CaseStudy}){
 const [direct,setDirect]=useState(()=>matchMedia(directMedia).matches);
 const [flipped,setFlipped]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null);
 const back=useRef<HTMLAnchorElement>(null);
 const href=`/cases/${project.slug}/`;

 useEffect(()=>{
  const query=matchMedia(directMedia);
  const update=()=>{setDirect(query.matches);setFlipped(false)};
  query.addEventListener('change',update);
  return()=>query.removeEventListener('change',update);
 },[]);

 function unflip(restoreFocus:boolean){
  setFlipped(false);
  if(restoreFocus) requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}));
 }

 if(direct) return <a className="project-card project-card--direct" href={href} aria-label={`View ${project.title} case`}>
  <ProjectPreview project={project}/>
 </a>;

 return <div className={`project-card project-card--flip${flipped?' is-flipped':''}`}
  onMouseEnter={()=>{if(matchMedia('(hover: hover) and (pointer: fine)').matches)setFlipped(true)}}
  onMouseLeave={event=>unflip(event.currentTarget.contains(document.activeElement))}
  onKeyDown={event=>{if(event.key==='Escape'&&flipped){event.preventDefault();unflip(true)}}}>
  <div className="project-flip-inner">
   <div className="project-flip-front" aria-hidden={flipped} inert={flipped}>
    <button ref={trigger} className="project-flip-trigger" type="button" aria-label={`About ${project.title}`} aria-expanded={flipped}
     onClick={()=>{setFlipped(true);requestAnimationFrame(()=>back.current?.focus({preventScroll:true}))}}>
     <ProjectPreview project={project}/>
    </button>
   </div>
   <a ref={back} className="project-flip-back" href={href} aria-label={`View ${project.title} case`} aria-hidden={!flipped} inert={!flipped}
    onBlur={event=>{if(!event.currentTarget.closest('.project-card')?.matches(':hover'))unflip(false)}}>
    <div className="project-flip-copy">
     <span className="project-flip-category">{project.category}</span>
     <h3 className="project-flip-title section-subheading">{project.title}</h3>
     <p><strong>Goal:</strong> {project.summary}</p>
     <p><strong>Results:</strong> {project.results}</p>
    </div>
    <div className="project-flip-footer">
     <div className="project-flip-tags">{project.tags.map(tag=><span key={tag} className="tag">{tag}</span>)}</div>
     <span className="project-flip-arrow" aria-hidden="true"><span>↗</span></span>
    </div>
   </a>
  </div>
 </div>;
}

import {useState} from 'react';
import type {CaseStudy} from '../data/cases';

export function FlipProjectCard({project}:{project:CaseStudy}){
 const [touchOpen,setTouchOpen]=useState(false);
 return <a className={`project-card project-card--flip ${touchOpen?'is-flipped':''}`} href={`/cases/${project.slug}/`} aria-label={`View ${project.title} — ${project.category}`} onBlur={()=>setTouchOpen(false)} onClick={event=>{if(event.detail>0&&matchMedia('(hover: none)').matches&&!touchOpen){event.preventDefault();setTouchOpen(true)}}}><span className="project-flip-inner"><span className="project-flip-front"><img src={`/assets/${project.image??'all-projects.png'}`} width="560" height="880" alt={`${project.title} website preview`} loading="lazy"/></span><span className="project-flip-back"><span className="project-flip-copy"><span className="tag">{project.category}</span><span className="project-flip-title">{project.title}</span></span><svg className="project-flip-arrow" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m8 24 16-16M8 8h16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></span></a>;
}

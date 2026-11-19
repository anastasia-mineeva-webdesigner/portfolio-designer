import {useEffect,useMemo} from 'react';
import type {CaseStudy} from '../data/cases';
import {Button,Tag} from './UI';
import {RelatedProjects} from './RelatedProjects';
import {CompactSectionNavigation,useSectionNavigation} from './SectionNavigation';
import '../case.css';

const shortChapterTitles=['Overview','Challenge','Direction','Design','Outcome'];

export default function CasePage({project}:{project:CaseStudy}){
 const {chapters}=project;
 const sectionLinks=useMemo(()=>chapters.map((chapter,i)=>({
  id:chapter.id,title:chapter.title,shortTitle:shortChapterTitles[i],
 })),[chapters]);
 const {active,showCompact}=useSectionNavigation(sectionLinks);
 const facts=[
  ['Project',project.category],
  ['Scope',project.scope],
  ['Role','Designer'],
  ['Timeline',project.timeline],
  ['Collaboration',project.collaboration],
 ];

 useEffect(()=>{
  const previous=document.title;
  document.title=`${project.title} — Mira Smirnova`;
  return()=>{document.title=previous};
 },[project]);

 return <article className="case-page container">
  {showCompact&&<CompactSectionNavigation links={sectionLinks} active={active} label="Case chapters"/>}
  <header className="case-intro">
   <h1>{project.title}</h1><p>{project.summary}</p><div className="case-tags"><Tag>{project.category}</Tag></div>
  </header>
  <div className="case-cover"><img src={project.coverImage} alt={`${project.title} — cover image`} fetchPriority="high"/></div>
  <dl className="case-facts">{facts.map(([label,value])=><div key={label}>
   <dt>{label}</dt><dd>{label==='Collaboration'?<a className="case-collaboration-link" href={project.behance} target="_blank" rel="noopener noreferrer">{value}</a>:value}</dd>
  </div>)}</dl>
  <div className="case-body">
   <aside className="case-index">
    <p>Inside the case</p>
    <nav aria-label="Case chapters">{chapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={active===chapter.id?'location':undefined}>
     <span>{String(i+1).padStart(2,'0')}</span>{chapter.title}
    </a>)}</nav>
   </aside>
   <div className="case-chapters">{chapters.map((chapter,i)=><section className="case-chapter" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
    <div className="case-chapter-copy"><span className="case-step">{String(i+1).padStart(2,'0')} / {chapter.title}</span>
     <h2 id={`${chapter.id}-title`}>{chapter.heading}</h2><p>{chapter.text}</p>
    </div>
    {chapter.images.map(image=><figure className="case-figure case-figure--project" key={image.src}>
     <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async"/>
    </figure>)}
   </section>)}</div>
  </div>
  <div className="case-behance-action"><Button href={project.behance}>↗ View project on Behance</Button></div>
  <RelatedProjects current={project.slug}/>
 </article>;
}

import {useEffect,useRef,useState} from 'react';
import type {CaseStudy} from '../data/cases';
import {Button,Tag} from './UI';
import {RelatedProjects} from './RelatedProjects';
import '../case.css';

const shortChapterTitles=['Overview','Challenge','Direction','Design','Outcome'];

export default function CasePage({project}:{project:CaseStudy}){
 const {chapters}=project;
 const [active,setActive]=useState(chapters[0].id);
 const [showMobileIndex,setShowMobileIndex]=useState(false);
 const mobileIndex=useRef<HTMLDetailsElement>(null);
 const activeIndex=Math.max(0,chapters.findIndex(chapter=>chapter.id===active));
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

 useEffect(()=>{
  const sections=chapters.map(chapter=>document.getElementById(chapter.id)!).filter(Boolean);
  const narrow=matchMedia('(max-width: 1199px)');
  let frame=0;
  const update=()=>{
   frame=0;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||80;
   const readingLine=Math.max(header+48,innerHeight*.3);
   let current=chapters[0].id;
   for(const section of sections){
    if(section.getBoundingClientRect().top<=readingLine)current=section.id;
   }
   setActive(current);
   const first=sections[0];
   setShowMobileIndex(narrow.matches&&Boolean(first&&first.getBoundingClientRect().top<=innerHeight-24));
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
 },[chapters]);

 function closeMobileIndex(){
  if(mobileIndex.current) mobileIndex.current.open=false;
 }

 return <article className="case-page container">
  {showMobileIndex&&<details ref={mobileIndex} className="case-mobile-index"
   onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))closeMobileIndex()}}
   onKeyDown={event=>{if(event.key==='Escape'&&event.currentTarget.open){event.preventDefault();closeMobileIndex();event.currentTarget.querySelector('summary')?.focus()}}}>
   <summary>{String(activeIndex+1).padStart(2,'0')} <span>{shortChapterTitles[activeIndex]}</span></summary>
   <nav aria-label="Jump to a chapter">
    {chapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={active===chapter.id?'location':undefined} onClick={closeMobileIndex}>
     <span>{String(i+1).padStart(2,'0')}</span> {shortChapterTitles[i]}
    </a>)}
   </nav>
  </details>}
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

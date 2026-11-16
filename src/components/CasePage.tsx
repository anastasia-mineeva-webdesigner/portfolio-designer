import {useEffect} from 'react';
import {cases,caseChapters} from '../data/cases';
import type {CaseStudy} from '../data/cases';
import {Label} from './UI';
import '../case.css';
export default function CasePage({project}:{project:CaseStudy}) {
 const index=cases.indexOf(project),next=cases[(index+1)%cases.length];
 useEffect(()=>{const previous=document.title;document.title=`${project.title} — Mira Smirnova`;return()=>{document.title=previous}},[project]);
 return <article className="case-page container">
  <nav className="case-breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/#work">Selected work</a></li><li aria-current="page">{project.title}</li></ol></nav>
  <header className="case-intro"><div className="case-eyebrow"><Label>{project.category}</Label><span>Case {String(index+1).padStart(2,'0')} / 06</span></div><h1>{project.title}</h1><p>{project.summary}</p><span className="case-draft">Layout preview · draft content</span></header>
  <div className="case-cover">{project.image?<img src={`/assets/${project.image}.png`} alt={`${project.title} — project presentation`} width="560" height="880" fetchPriority="high"/>:<div className="case-empty"><span>06</span><p>Your next story goes here</p></div>}</div>
  <dl className="case-facts">{[['Project',project.category],['Scope','Add project scope'],['Role','Add responsibilities'],['Timeline','To be confirmed']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  <div className="case-body"><aside className="case-index"><p>Inside the case</p><nav aria-label="Case chapters">{caseChapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`}><span>0{i+1}</span>{chapter.title}</a>)}</nav><a className="case-back" href="/#work">← All selected work</a></aside>
  <div className="case-chapters">{caseChapters.map((chapter,i)=><section className="case-chapter" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-title`}><div className="case-chapter-copy"><span className="case-step">0{i+1} / {chapter.title}</span><h2 id={`${chapter.id}-title`}>{chapter.heading}</h2><p>{chapter.text}</p></div><figure className="case-figure"><div className="case-media-slot"><span className="case-project-logo">{project.title}</span></div><figcaption>{chapter.caption} · replace with project photography or screens</figcaption></figure>{chapter.id==='design'&&<div className="case-image-pair">{['Desktop screen','Mobile screen'].map(label=><div key={label} className="case-screen-slot"><span className="case-project-logo">{project.title}</span></div>)}</div>}</section>)}</div></div>
  <nav className="case-next" aria-label="Project navigation"><a className="case-back" href="/#work">← Back to selected work</a><a href={`/cases/${next.slug}/`}><span>Next case ↗</span><strong>{next.title}</strong></a></nav>
 </article>
}

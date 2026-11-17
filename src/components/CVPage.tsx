import {useEffect,useState} from 'react';
import {Button,Tag} from './UI';
import {useContact} from './ContactDialog';
import '../case.css';
import '../cv.css';
const cvSections=[['profile','Profile'],['experience','Experience'],['education','Education & development'],['expertise','Expertise'],['tools','Tools & languages']];
const experience=[
 {period:'2024 — Present',title:'Independent designer',role:'AI Full Stack Designer',text:'I lead websites from the first brief to launch, combining UX, visual direction and development with AI agents.',items:['Structure, user journeys and interactive prototypes.','Responsive websites, design systems and production-ready interfaces.','AI-generated imagery, 3D and motion as part of a coherent visual direction.']},
 {period:'4 years',title:'Veter agency',role:'Web & digital design',text:'Agency experience across fintech, e-commerce, beauty brands and sound studios. Working with developers and project teams shaped the way I connect visual decisions to business goals.',items:['Landing pages, multi-page websites and digital experiences.','Collaboration with marketing, development and project management.','Design reviews, clear handoffs and attention to responsive details.']},
 {period:'Alongside project work',title:'Teaching & mentoring',role:'Web design',text:'Sharing design practice, reviewing work and helping designers turn an idea into a clear, considered interface.',items:[]},
];
export default function CVPage(){
 const openContact=useContact();
 const [activeSection,setActiveSection]=useState('profile');
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||80;
   const line=Math.max(header+48,innerHeight*.3);
   let current=cvSections[0][0];
   for(const [id] of cvSections){const section=document.getElementById(`cv-${id}`);if(section&&section.getBoundingClientRect().top<=line)current=id;}
   setActiveSection(current);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[]);
 useEffect(()=>{const title=document.title;document.title='CV — Mira Smirnova, AI Full Stack Designer';return()=>{document.title=title}},[]);
 return <article className="cv-page container">
  <header className="cv-intro"><div className="cv-intro-copy"><h1>Mira<br/><span className="accent">Smirnova.</span></h1><p className="cv-role">AI Full Stack Designer</p><p className="cv-summary">From a clear structure to a website with character. I bring design, technology and AI into one continuous process.</p><div className="cv-intro-tags"><Tag>Curriculum vitae</Tag></div><div className="cv-actions"><Button onClick={openContact}>✦ Get in touch</Button><Button variant="secondary" onClick={()=>window.print()}>Print CV</Button><Button variant="secondary" href="/downloads/mira-smirnova-cv.pdf" download="Mira-Smirnova-CV.pdf">↓ Download CV</Button></div></div><div className="cv-profile-panel"><span className="cv-monogram" aria-hidden="true">M<span>✦</span></span><div className="cv-profile-caption"><span>Design. Build. Launch.</span><span>Moscow · Remote</span></div><div className="cv-profile-note"><span className="dot"/>Available for projects</div></div></header>
  <dl className="cv-facts"><div><dt>Experience</dt><dd>7 years</dd></div><div><dt>Focus</dt><dd>Web · AI · Motion</dd></div><div><dt>Collaboration</dt><dd>Project & ongoing</dd></div><div><dt>Based in</dt><dd>Moscow, GMT+3</dd></div></dl>
  <div className="case-body cv-body"><aside className="case-index"><p>Inside the CV</p><nav aria-label="CV sections">{cvSections.map(([id,title],i)=><a key={id} href={`#cv-${id}`} aria-current={activeSection===id?'location':undefined}><span>0{i+1}</span>{title}</a>)}</nav><a href="/#work" className="case-back">← View selected work</a></aside><div className="cv-content">
   <section id="cv-profile" aria-labelledby="cv-profile-title"><span className="case-step">01 / Profile</span><h2 id="cv-profile-title">One designer.<br/>The whole <span className="accent">picture.</span></h2><p>I spent 7 years in studios and agencies. Since 2024, I have been running projects independently, from structure and visual direction to build, 3D, video and launch.</p><p>I work across fintech, e-commerce, beauty and creative businesses. I care about readable interfaces, considered typography and a digital experience that helps people take the next step.</p><p>AI is part of my toolkit: it helps me explore and build, while I stay responsible for the design decisions and the finished result.</p></section>
   <section id="cv-experience" aria-labelledby="cv-experience-title"><span className="case-step">02 / Experience</span><h2 id="cv-experience-title">Built through <span className="accent">practice.</span></h2><div className="cv-timeline">{experience.map(job=><article className="cv-job" key={job.title}><span className="cv-period">{job.period}</span><div><h3>{job.title}</h3><span className="cv-job-role">{job.role}</span><p>{job.text}</p>{job.items.length>0&&<ul>{job.items.map(item=><li key={item}>{item}</li>)}</ul>}</div></article>)}</div></section>
   <section id="cv-education" aria-labelledby="cv-education-title"><span className="case-step">03 / Education & development</span><h2 id="cv-education-title">Always <span className="accent">learning.</span></h2><div className="cv-education-row"><span>UPROCK</span><div><h3>AI Fullstack Designer</h3><p>Design practice at the intersection of visual systems, AI tools and implementation.</p></div></div><div className="cv-education-row"><span>Ongoing practice</span><div><h3>Creative technology</h3><p>Exploring AI workflows, 3D and motion through Utopia AI, Blender, Spline and hands-on project work.</p></div></div></section>
   <section id="cv-expertise" aria-labelledby="cv-expertise-title"><span className="case-step">04 / Expertise</span><h2 id="cv-expertise-title">From the first sketch<br/>to the final <span className="accent">detail.</span></h2><div className="cv-skills">{[['Strategy & UX','Briefs, site structure, user flows, wireframes and interactive prototypes.'],['Visual & UI design','Art direction, typography, responsive layouts, components and design systems.'],['Build & launch','Frontend implementation with AI agents, responsive adaptation and developer collaboration.'],['AI, 3D & motion','Image generation, visual exploration, 3D scenes and motion for digital experiences.']].map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
   <section id="cv-tools" aria-labelledby="cv-tools-title"><span className="case-step">05 / Tools & languages</span><h2 id="cv-tools-title">A flexible <span className="accent">toolkit.</span></h2><div className="cv-tools">{['Figma','Claude Code','Codex','ChatGPT','Utopia AI','Blender','Spline'].map(tool=><Tag key={tool}>{tool}</Tag>)}</div><dl className="cv-languages"><div><dt>Russian</dt><dd>Native</dd></div><div><dt>English</dt><dd>B2 · Upper intermediate</dd></div></dl></section>
  </div></div><div className="cv-end"><p>Have a project or a team in mind?</p><Button onClick={openContact}>✦ Let's work together</Button><a className="case-back" href="/#work">Explore selected work ↗</a></div>
 </article>
}

import {useContact} from './ContactDialog';
import {Button,Decoration,Label} from './UI';
import {HighlightText} from './AnimationEffects';
import {Reveal} from './Reveal';
import {ProcessLabel} from './ProcessLabel';
import {WorkProjects} from './WorkProjects';
import {animation} from '../config/animation';
import {menuContactLinks} from '../config/links';
import type {CSSProperties} from 'react';
const intro='AI Full Stack designer. 7 years in studios and agencies — now I run projects end to end with AI agents, from structure to 3D, video and launch.';
export function Experience(){const openContact=useContact();return <section id="experience" className="section container experience"><Label plain>Experience</Label><h2>Design in Practice</h2><p className="lead">{intro}</p><div className="statement"><HighlightText numbers={['7','2024']} text="7 years in studios and agencies. Since 2024 I run projects end to end — with AI agents, from structure to launch. Fintech, e-commerce, beauty brands, sound studios."/></div><h3 className="section-subheading">Recognition</h3><ul className="awards">{['Awwwards Honorable Mention (2026)','CSS Design Awards — Website of the Day (2026)','Behance Featured in Web Design (2025)','Tagline shortlist — Best small business website (2024)'].map(x=><li key={x}>{x}</li>)}</ul><Button className="compact" onClick={openContact}>✦ Get in touch</Button><Decoration name="award" className="experience-award"/><Decoration name="component-set" className="experience-component"/></section>}
export function Work(){return <section id="work" className="section container work"><Label plain>Selected work</Label><h2>Web Design Projects</h2><p className="lead">Selected projects, from structure to launch.</p><WorkProjects/></section>}
const stages = [
 {title:'Brief', term:'2–3 days', description:'Goals, audience, sitemap and user flow.'},
 {title:'Design Concept', term:'5–7 days', description:'Visual system and key screens.'},
 {title:'Design with AI Agent', term:'4–5 days', description:'Layout, 3D, animation and responsive adaptation with AI agents.'},
 {title:'Launch & support', term:'10–12 days', description:'Domain, analytics and 30 days of revisions.'},
];
export function Process(){return <section id="process" className="section container process"><Label plain>Process</Label><h2>Brief to Launch</h2><p className="lead">Four stages from brief to launch. Landing page from 150,000 ₽, multi-page website from 300,000 ₽.</p><div className="statement"><HighlightText text="One person from brief to launch. Structure, design and build run in parallel with AI agents — the site goes live in 3–4 weeks, with no handoffs between teams."/></div><ol className="process-grid">{stages.map(({title,term,description},i)=><li key={title}><Reveal kind="process" index={i}><ProcessLabel index={i}>{title}</ProcessLabel><div className="stage-title"><h3 className="section-subheading">{title}</h3><span>{term}</span></div><p>{description}</p></Reveal></li>)}</ol><Decoration name="wireframe" className="process-wireframe"/><Decoration name="workflow" className="process-workflow"/></section>}
const faq=[['Built with AI — is it a template?','No. I design the structure and visuals; the agent speeds up layout and routine work.'],['Who supports the site after launch?','I can help with updates after launch or hand over the website with clear documentation.'],['Can I get design only, without development?','Yes. I can deliver a Figma design with components and a developer-ready handoff.'],['How much does a website cost?','Pricing depends on the scope and functionality. I provide an estimate after reviewing the brief.'],['Do you work under a contract?','Yes. The scope, deliverables, timeline and payment terms are agreed before work begins.']];
export function FAQ(){return <section id="faq" className="section container faq"><Label plain>FAQ</Label><h2>Before We Start</h2><p className="lead">Briefly about timing, pricing and working with AI.</p><div className="faq-list">{faq.map(([q,a],i)=><Reveal key={q} kind="faq" index={i}><article className="faq-item"><h3 className="section-subheading">{q}</h3><p>{a}</p><div className="faq-divider"/></article></Reveal>)}</div><Decoration name="question" className="faq-question"/><Decoration name="answer" className="faq-answer"/></section>}
export function Contact({showAvailability=true}:{showAvailability?:boolean}){const openContact=useContact();return <section id="contact" className="contact container"><div className={`contact-card ${animation.enabled.plane?'plane-motion':''}`} style={{'--plane-x':`${animation.plane.xPx}px`,'--plane-y':`${animation.plane.yPx}px`,'--plane-rotation':`${animation.plane.rotationDeg}deg`} as CSSProperties}>{showAvailability&&<Label>Available for projects</Label>}<h2><span>Have a project?</span><span>Let's <span className="accent">talk</span></span></h2><p>Tell me about your task — I'll reply within a day with a format and timeline.</p><Button className="compact" onClick={openContact}>↗ Let’s talk</Button><Decoration name="envelope" className="contact-envelope"/><Decoration name="plane" className="contact-plane"/><img className="contact-fold" src="/assets/fold.svg" width="104" height="103" alt=""/></div></section>}
export function Footer(){
 const {email}=menuContactLinks;
 return <footer id="footer" className="footer container">
  <p>© 2026 Mira Smirnova</p>
  <p className="footer-role">AI Full Stack Designer</p>
  <a className="text-link" href={`mailto:${email}`}>{email}</a>
 </footer>;
}

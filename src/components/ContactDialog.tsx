import {createContext,useContext,useEffect,useRef,useState} from 'react';
import type {FormEvent,ReactNode} from 'react';
import {Button} from './UI';
import {links} from '../config/links';
import {buildEnquiry,scopeOptions,formatOptions,budgetOptions} from '../contact-enquiry.mjs';
import '../contact-form.css';
const ContactContext=createContext<()=>void>(()=>{});
export const useContact=()=>useContext(ContactContext);
export function ContactProvider({children}:{children:ReactNode}) {
 const [open,setOpen]=useState(false),[status,setStatus]=useState(''),[brief,setBrief]=useState('');
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null);
 const openContact=()=>{const active=document.activeElement as HTMLElement;trigger.current=active.closest('.mobile-nav')?document.querySelector<HTMLElement>('.menu-toggle'):active;setOpen(true)};
 useEffect(()=>{
  if(!open)return;
  const el=dialog.current!,previousOverflow=document.body.style.overflow;
  el.showModal();document.body.style.overflow='hidden';
  return()=>{el.close();document.body.style.overflow=previousOverflow;trigger.current?.focus({preventScroll:true})};
 },[open]);
 const submit=(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  const result=buildEnquiry(new FormData(event.currentTarget),links.email!);
  setBrief(result.body);setStatus('Your email draft is ready. Send it from your email app. If it did not open, copy the brief below.');
  window.location.href=result.url;
 };
 const copy=async()=>{try{await navigator.clipboard.writeText(brief);setStatus('Brief copied. Paste it into an email and send it when you are ready.')}catch{setStatus('Copy is unavailable here. Select and copy the brief below.')}};
 return <ContactContext.Provider value={openContact}>{children}<dialog ref={dialog} className="enquiry-dialog" aria-labelledby="enquiry-title" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)}>
  <div className="enquiry-shell"><div className="enquiry-toolbar"><span className="enquiry-kicker"><span className="dot"/>Project enquiry</span><button type="button" className="enquiry-close" onClick={()=>setOpen(false)} autoFocus>Close <span aria-hidden="true">×</span></button></div>
   <div className="enquiry-intro"><h2 id="enquiry-title">Let's build<br/><span className="accent">together.</span></h2><div><p>Tell me what you have in mind.<br/>I'll help shape the next step.</p><span>Websites · Digital design · AI visuals</span></div></div>
   <div className="enquiry-layout"><aside><p>From a first idea<br/>to a website that works.</p><span>A few details are enough to start.<br/>Fields marked * are required.</span><a href={`mailto:${links.email}`}>Prefer a direct email? ↗</a></aside>
    <form onSubmit={submit} className="enquiry-form">
     <fieldset className="enquiry-row"><legend><span>01.</span> Scope</legend><div className="enquiry-choices">{scopeOptions.map(value=><label key={value}><input type="checkbox" name="scope" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <fieldset className="enquiry-row"><legend><span>02.</span> Format</legend><div className="enquiry-choices">{formatOptions.map(value=><label key={value}><input type="radio" name="format" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <fieldset className="enquiry-row"><legend><span>03.</span> Budget</legend><div className="enquiry-choices">{budgetOptions.map(value=><label key={value}><input type="radio" name="budget" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <div className="enquiry-row"><label htmlFor="enquiry-name"><span>04.</span> Name *</label><input id="enquiry-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={100} pattern=".*\S.*"/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-email"><span>05.</span> Email *</label><input id="enquiry-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-company"><span>06.</span> Company</label><input id="enquiry-company" name="company" autoComplete="organization" placeholder="Company or brand name" maxLength={160}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-timeline"><span>07.</span> Timeline</label><input id="enquiry-timeline" name="timeline" placeholder="Start date and deadline" maxLength={200}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-note"><span>08.</span> Your project</label><textarea id="enquiry-note" name="note" placeholder="A few words about your idea, goals or a link to your current website" rows={4} maxLength={2000}/></div>
     <div className="enquiry-submit"><p id="enquiry-send-note">This opens a draft in your email app. Nothing is sent until you send the email.</p><button className="enquiry-send" type="submit" aria-describedby="enquiry-send-note">Create email <span aria-hidden="true">↗</span></button></div>
     <div role="status" aria-live="polite" className="enquiry-status">{status}</div>
     {brief&&<div className="enquiry-fallback"><Button variant="secondary" onClick={copy}>Copy project brief</Button><details><summary>View your brief</summary><pre>{brief}</pre></details></div>}
    </form>
   </div>
  </div>
 </dialog></ContactContext.Provider>
}

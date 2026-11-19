import {createContext,useContext,useEffect,useRef,useState} from 'react';
import type {FormEvent,ReactNode} from 'react';
import {Button} from './UI';
import {scopeOptions,formatOptions,budgetOptions} from '../contact-enquiry.mjs';
import '../contact-form.css';
const ContactContext=createContext<()=>void>(()=>{});
export const useContact=()=>useContext(ContactContext);
export function ContactProvider({children}:{children:ReactNode}) {
 const [open,setOpen]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLElement|null>(null);
 const successTitle=useRef<HTMLHeadingElement>(null);

 const openContact=()=>{
  const active=document.activeElement as HTMLElement;
  trigger.current=active.closest('.mobile-nav,.mobile-menu')?document.querySelector<HTMLElement>('.menu-toggle'):active;
  setSubmitted(false);
  setOpen(true);
 };
 const closeContact=()=>setOpen(false);

 useEffect(()=>{
  if(!open)return;
  const el=dialog.current!,previousOverflow=document.body.style.overflow;
  el.showModal();
  el.scrollTop=0;
  document.body.style.overflow='hidden';
  return()=>{el.close();document.body.style.overflow=previousOverflow;trigger.current?.focus({preventScroll:true})};
 },[open]);

 useEffect(()=>{
  if(open&&submitted)successTitle.current?.focus();
 },[open,submitted]);

 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setSubmitted(true);
 }

 return <ContactContext.Provider value={openContact}>{children}
  <dialog ref={dialog} className={submitted?'enquiry-dialog enquiry-dialog--success':'enquiry-dialog'}
   aria-labelledby="enquiry-title" aria-describedby={submitted?'enquiry-success-note':undefined}
   onCancel={event=>{event.preventDefault();closeContact()}}>
   {submitted?<div className="enquiry-success">
    <button className="enquiry-success-close" type="button" aria-label="Close" onClick={closeContact}>
     <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
     </svg>
    </button>
    <span className="enquiry-success-mark" aria-hidden="true">
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
    <h2 ref={successTitle} id="enquiry-title" tabIndex={-1}>Thank you!</h2>
    <p id="enquiry-success-note">Your request was submitted.</p>
    <Button onClick={closeContact}>Okay</Button>
   </div>:<div className="enquiry-shell">
    <div className="enquiry-toolbar">
     <button type="button" className="enquiry-close" onClick={closeContact} autoFocus>
      <span className="enquiry-close-label">Close</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
       <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
     </button>
    </div>
   <div className="enquiry-intro"><h2 id="enquiry-title">Let's build<br/><span className="accent">together.</span></h2><div><p>Tell me what you have in mind.<br/>I'll help shape the next step.</p><span>Websites · Digital design · AI visuals</span></div></div>
   <div className="enquiry-layout"><aside><p>From a first idea<br/>to a website that works.</p><span>A few details are enough to start.<br/>Fields marked * are required.</span></aside>
    <form onSubmit={submit} className="enquiry-form">
     <fieldset className="enquiry-row"><legend><span>01.</span> Scope</legend><div className="enquiry-choices">{scopeOptions.map(value=><label key={value}><input type="checkbox" name="scope" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <fieldset className="enquiry-row"><legend><span>02.</span> Format</legend><div className="enquiry-choices">{formatOptions.map(value=><label key={value}><input type="radio" name="format" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <fieldset className="enquiry-row"><legend><span>03.</span> Budget</legend><div className="enquiry-choices">{budgetOptions.map(value=><label key={value}><input type="radio" name="budget" value={value}/><span>{value}</span></label>)}</div></fieldset>
     <div className="enquiry-row"><label htmlFor="enquiry-name"><span>04.</span> Name *</label><input id="enquiry-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={100} pattern=".*\S.*"/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-email"><span>05.</span> Email *</label><input id="enquiry-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-company"><span>06.</span> Company</label><input id="enquiry-company" name="company" autoComplete="organization" placeholder="Company or brand name" maxLength={160}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-timeline"><span>07.</span> Timeline</label><input id="enquiry-timeline" name="timeline" placeholder="Start date and deadline" maxLength={200}/></div>
     <div className="enquiry-row"><label htmlFor="enquiry-note"><span>08.</span> Your project</label><textarea id="enquiry-note" name="note" placeholder="A few words about your idea, goals or a link to your current website" rows={4} maxLength={2000}/></div>
     <div className="enquiry-submit"><button className="enquiry-send" type="submit">Send <span aria-hidden="true">↗</span></button></div>
    </form>
   </div>
   </div>}
  </dialog>
 </ContactContext.Provider>
}

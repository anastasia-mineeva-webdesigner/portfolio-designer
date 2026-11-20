import {createContext,useContext,useEffect,useRef,useState} from 'react';
import type {FormEvent,ReactNode} from 'react';
import {Button,Tag} from './UI';
import '../contact-form.css';
const projectTypes=['Website','Mobile app','E-commerce','Other'];
const ContactContext=createContext<()=>void>(()=>{});
export const useContact=()=>useContext(ContactContext);
export function ContactProvider({children}:{children:ReactNode}) {
 const [open,setOpen]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const [showPrivacy,setShowPrivacy]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLElement|null>(null);
 const successTitle=useRef<HTMLHeadingElement>(null);
 const backdropPress=useRef(false);

 const openContact=()=>{
  const active=document.activeElement as HTMLElement;
  trigger.current=active.closest('.mobile-nav,.mobile-menu')?document.querySelector<HTMLElement>('.menu-toggle'):active;
  setSubmitted(false);
  setShowPrivacy(false);
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
  setShowPrivacy(false);
  setSubmitted(true);
 }

 return <ContactContext.Provider value={openContact}>{children}
  <dialog ref={dialog} className={submitted?'enquiry-dialog enquiry-dialog--success':'enquiry-dialog'}
   aria-labelledby="enquiry-title" aria-describedby={submitted?'enquiry-success-note':undefined}
   onCancel={event=>{event.preventDefault();closeContact()}}
   onPointerDown={event=>{backdropPress.current=event.target===event.currentTarget}}
   onClick={event=>{
    if(backdropPress.current&&event.target===event.currentTarget)closeContact();
    backdropPress.current=false;
   }}>
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
    <p id="enquiry-success-note">This demo does not send or save your entries.</p>
    <Button onClick={closeContact}>Okay</Button>
   </div>:<div className="enquiry-shell">
    <div className="enquiry-toolbar">
     <div className="enquiry-tab">
      <img src="/assets/tool-figma.svg" width="24" height="24" alt=""/>
      <span>contact.fig</span>
     </div>
     <button type="button" className="enquiry-close" onClick={closeContact} autoFocus>
      <span className="enquiry-close-label">Close</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
       <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
     </button>
    </div>
    <form onSubmit={submit} className="enquiry-form">
     <h2 id="enquiry-title">Your project</h2>
     <div className="enquiry-row">
      <label htmlFor="enquiry-name">Name *</label>
      <input id="enquiry-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={100} pattern=".*\S.*"/>
     </div>
     <div className="enquiry-row">
      <label htmlFor="enquiry-email">Email *</label>
      <input id="enquiry-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/>
     </div>
     <fieldset className="enquiry-row enquiry-project-type">
      <legend>Project type</legend>
      <div className="enquiry-choices">
       {projectTypes.map(value=><label key={value}>
        <input className="sr-only" type="checkbox" name="scope" value={value}/>
        <Tag>{value}</Tag>
       </label>)}
      </div>
     </fieldset>
     <div className="enquiry-row">
      <label htmlFor="enquiry-note">Subject</label>
      <textarea id="enquiry-note" name="note" placeholder="Tell me about your project" rows={1} maxLength={2000}/>
     </div>
     <div className="enquiry-row">
      <label htmlFor="enquiry-timeline">Timeline</label>
      <input id="enquiry-timeline" name="timeline" placeholder="When would you like to launch?" maxLength={200}/>
     </div>
     <div className="enquiry-consent">
      <div className="enquiry-consent-line">
       <input id="enquiry-consent" type="checkbox" name="privacyConsent" required aria-labelledby="enquiry-consent-label enquiry-privacy-toggle"/>
       <label id="enquiry-consent-label" htmlFor="enquiry-consent">I agree to the</label>
       <button id="enquiry-privacy-toggle" type="button" aria-expanded={showPrivacy} aria-controls="enquiry-privacy" onClick={()=>setShowPrivacy(value=>!value)}>Privacy Policy</button>
       <span aria-hidden="true">*</span>
      </div>
      <p id="enquiry-privacy" hidden={!showPrivacy}>This demo form keeps your entries in the current page. It does not send them or save them after you leave or reload the page.</p>
     </div>
     <Button type="submit" className="enquiry-send">✦ Send message</Button>
    </form>
   </div>}
  </dialog>
 </ContactContext.Provider>
}

import {useState} from 'react';
import type {FormEvent} from 'react';
import {links} from '../config/links';
import {Button} from './UI';
import {media} from '../config/media';
import '../contacts.css';

export default function ContactsPage(){
 const [status,setStatus]=useState('');
 const email=links.email;
 const submit=(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();if(!email)return;
  const data=new FormData(event.currentTarget);
  const body=`Name: ${String(data.get('name')??'').trim()}\nEmail: ${String(data.get('email')??'').trim()}\n\n${String(data.get('message')??'').trim()}`;
  window.location.href=`mailto:${email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(body)}`;
  setStatus('Your email draft is ready. Send it from your email app, or write to the address on this page.');
 };
 return <article className="contacts-page container"><header className="contacts-intro"><div className="contacts-intro-copy"><h1>Good projects<br/>start with a <span className="accent">hello.</span></h1><p>Tell me what you have in mind — I’ll reply within a day with a format and timeline.</p><aside className="contacts-details"><div className="contacts-email"><span>Email me</span>{email&&<a href={`mailto:${email}`}>{email}</a>}<p>Moscow · GMT+3<br/>Working worldwide, remotely.</p></div><nav className="contacts-socials" aria-label="Social profiles">{(['telegram','behance','dribbble','linkedin'] as const).map(key=>{const title={telegram:'Telegram',behance:'Behance',dribbble:'Dribbble',linkedin:'LinkedIn'}[key];return <a key={key} href={links[key]!} target="_blank" rel="noopener noreferrer">{title}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></a>})}</nav></aside></div><div className="contacts-portrait"><img src={media.poster} width="1280" height="720" alt="Mira Smirnova" fetchPriority="high"/></div></header><div className="contacts-layout"><section className="contacts-message" aria-labelledby="contacts-form-title"><h2 id="contacts-form-title">Let’s talk</h2><p>A few words about your project are enough to get started.</p><form onSubmit={submit}><div className="contacts-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="How should I call you?" maxLength={100} required/></div><div className="contacts-field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required/></div><div className="contacts-field"><label htmlFor="contact-message">About your project</label><textarea id="contact-message" name="message" placeholder="The idea, goals and timing — whatever you already know." rows={4} maxLength={4000} required/></div><div className="contacts-submit"><Button disabled={!email}>Prepare email ↗</Button><p>Opens a draft in your email app.<br/>You review and send it there.</p></div><p role="status" className="contacts-form-status">{status}</p></form></section></div></article>;
}

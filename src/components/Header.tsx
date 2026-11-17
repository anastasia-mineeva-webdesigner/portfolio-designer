import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Button} from './UI';
import {links} from '../config/links';
const home=window.location.pathname==='/'?'':'/';
const navigation=[['Work','/#work'],['Resume','/cv/'],['Process','/#process'],['Get in touch','/contacts/']];
export default function Header(){
 const [open,setOpen]=useState(false),[time,setTime]=useState('');
 const toggle=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
 const close=()=>{setOpen(false);toggle.current?.focus({preventScroll:true})};
 useEffect(()=>{const update=()=>setTime(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit'}).format(new Date()));update();const id=setInterval(update,30000);return()=>clearInterval(id)},[]);
 useEffect(()=>{const resize=()=>{if(innerWidth>=1200)setOpen(false)};window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const background=Array.from(document.body.children).filter((el):el is HTMLElement=>el instanceof HTMLElement&&!el.classList.contains('mobile-menu'));
  const inertStates=background.map(el=>el.inert);background.forEach(el=>{el.inert=true});
  panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const keydown=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close()}
   if(e.key!=='Tab')return;
   const items=Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)')??[]),first=items[0],last=items[items.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  };
  window.addEventListener('keydown',keydown);
  return()=>{document.body.style.overflow=previous;background.forEach((el,i)=>{el.inert=inertStates[i]});window.removeEventListener('keydown',keydown);toggle.current?.focus({preventScroll:true})};
 },[open]);
 return <><header className="header"><div className="header-row"><a className="logo" href={`${home}#top`} aria-label="Mira Smirnova, back to top"><span>M</span><span>Mira Smirnova</span></a><span className="header-status"><span className="dot"/>Available for projects</span><span className="clock">Moscow <strong>{time}</strong> GMT+3</span><nav className="desktop-nav" aria-label="Main navigation">{navigation.filter(([title])=>title!=='Get in touch').map(([title,id])=><Button key={id} variant="navigation" href={id}>{title}</Button>)}</nav><Button href="/contacts/" className="compact header-contact">✦ Get in touch</Button><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open menu" onClick={()=>setOpen(true)}><span/><span/><span/></button></div></header>{createPortal(<div className={`mobile-menu ${open?'is-open':''}`} inert={!open} aria-hidden={!open}><div className="mobile-menu-scrim" onClick={close}/><div ref={panel} className="mobile-menu-panel" id="mobile-navigation" role="dialog" aria-modal={open?true:undefined} aria-label="Mobile navigation"><div className="mobile-menu-top"><button className="mobile-menu-close" onClick={close} aria-label="Close menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button></div><nav className="mobile-menu-links" aria-label="Page sections">{navigation.map(([title,id])=><a key={id} href={id} onClick={close}>{title}</a>)}</nav><div className="mobile-menu-contact"><p>Have a project in mind?<br/>Let’s build it together.</p><Button href="/contacts/" onClick={close}>✦ Get in touch</Button><a className="mobile-menu-email" href={links.email?`mailto:${links.email}`:`${home}#contact`} onClick={close}>Email me ↗</a><div className="mobile-menu-socials">{links.telegram&&<a href={links.telegram} onClick={close}>Telegram</a>}{links.behance&&<a href={links.behance} onClick={close}>Behance</a>}</div></div></div></div>,document.body)}</>
}

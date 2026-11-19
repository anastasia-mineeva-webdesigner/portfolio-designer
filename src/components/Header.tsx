import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Button} from './UI';
import {menuContactLinks} from '../config/links';
import {useContact} from './ContactDialog';
const home=window.location.pathname==='/'?'':'/';
const navigation = [
 {title:'Work', href:'/#work'},
 {title:'Process', href:'/#process'},
 {title:'Resume', href:'/cv/', divider:true},
 {title:'Contact', href:'/contacts/'},
];
export default function Header(){
 const openContact=useContact();
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
  panel.current?.querySelector<HTMLButtonElement>('.mobile-menu-close')?.focus();
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
 return <>
  <header className="header">
   <div className="header-row">
    <a className="logo" href={`${home}#top`} aria-label="Mira Smirnova, back to top">
     <span>M</span><span>Mira Smirnova</span>
    </a>
    <span className="header-status"><span className="dot" aria-hidden="true"/>Available for projects</span>
    <span className="clock">Moscow <strong>{time}</strong> GMT+3</span>
    <nav className="desktop-nav" aria-label="Main navigation">
     {navigation.map(({title,href,divider})=><span className="desktop-nav-item" key={href}>
      {divider && <span className="desktop-nav-divider" aria-hidden="true"/>}
      <Button variant="navigation" href={href}>{title}</Button>
     </span>)}
    </nav>
    <Button onClick={openContact} className="compact header-contact">✦ Get in touch</Button>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open menu" onClick={()=>setOpen(true)}>
     <span/><span/><span/>
    </button>
   </div>
  </header>
  {createPortal(<div className={`mobile-menu ${open?'is-open':''}`} inert={!open} aria-hidden={!open}>
   <div className="mobile-menu-scrim" onClick={close}/>
   <div ref={panel} className="mobile-menu-panel" id="mobile-navigation" role="dialog" aria-modal={open?true:undefined} aria-label="Mobile navigation">
    <div className="mobile-menu-top">
     <a className="logo" href={`${home}#top`} onClick={close} aria-label="Mira Smirnova, back to top">
      <span>M</span><span>Mira Smirnova</span>
     </a>
     <button className="mobile-menu-close" onClick={close} aria-label="Close menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
       <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
     </button>
    </div>
    <nav className="mobile-menu-links" aria-label="Page sections">
     {navigation.map(({title,href,divider})=><span className="mobile-menu-link-group" key={href}>
      {divider && <span className="mobile-menu-divider" aria-hidden="true"/>}
      <a href={href} onClick={close}>{title}</a>
     </span>)}
    </nav>
    <div className="mobile-menu-contact">
     <p>Have a project in mind?<br/>Let’s build it together.</p>
     <Button onClick={()=>{close();openContact()}}>✦ Get in touch</Button>
     <a className="mobile-menu-email" href={`mailto:${menuContactLinks.email}`} onClick={close}>{menuContactLinks.email} ↗</a>
     <div className="mobile-menu-socials">
      {menuContactLinks.socials.map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" onClick={close}>{name}</a>)}
     </div>
    </div>
   </div>
  </div>,document.body)}
 </>
}

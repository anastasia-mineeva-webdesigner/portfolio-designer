import {useEffect,useRef,useState} from 'react';
import {useContact} from './ContactDialog';
import {Button} from './UI';
export default function Header(){
 const openContact=useContact();
 const home=window.location.pathname==='/'?'':'/';
 const [open,setOpen]=useState(false),[time,setTime]=useState('');
 const toggle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const update=()=>setTime(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit'}).format(new Date()));update();const id=setInterval(update,30000);return()=>clearInterval(id)},[]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape'&&open&&!document.querySelector('dialog[open]')){setOpen(false);toggle.current?.focus()}};const resize=()=>{if(innerWidth>=1200)setOpen(false)};window.addEventListener('keydown',close);window.addEventListener('resize',resize);return()=>{window.removeEventListener('keydown',close);window.removeEventListener('resize',resize)}},[open]);
 return <header className="header"><div className="header-row"><a className="logo" href={`${home}#top`} aria-label="Mira Smirnova, back to top"><span>M</span><span>Mira Smirnova</span></a><span className="header-status"><span className="dot"/>Available for projects</span><span className="clock">Moscow <strong>{time}</strong> GMT+3</span><nav className="desktop-nav" aria-label="Main navigation">{[['Work','work'],['About','about'],['Process','process']].map(([title,id])=><Button key={id} variant="navigation" href={`${home}#${id}`}>{title}</Button>)}<Button variant="navigation" href="/cv/">CV</Button></nav><Button onClick={openContact} className="compact header-contact">✦ Get in touch</Button><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}><span/ ><span/></button></div><nav id="mobile-navigation" className={`mobile-nav ${open?'is-open':''}`} aria-label="Mobile navigation" inert={!open}>{[['Work','work'],['About','about'],['Process','process']].map(([title,id])=><Button key={id} variant="navigation" href={`${home}#${id}`} onClick={()=>setOpen(false)}>{title}</Button>)}<Button variant="navigation" href="/cv/" onClick={()=>setOpen(false)}>CV</Button><Button variant="navigation" onClick={()=>{setOpen(false);openContact()}}>Get in touch</Button></nav></header>
}

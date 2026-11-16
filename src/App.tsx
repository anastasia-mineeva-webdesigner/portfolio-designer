import {useEffect,useRef,useState} from 'react';
import {CursorTrail} from './components/AnimationEffects';
import Header from './components/Header';
import CasePage from './components/CasePage';
import CVPage from './components/CVPage';
import {ContactProvider} from './components/ContactDialog';
import {cases} from './data/cases';
import VideoScene from './components/VideoScene';
import {Contact,Experience,FAQ,Footer,Process,Work} from './components/Sections';
import {motionSettings} from './config/animation';
export default function App(){
 const caseMatch=window.location.pathname.match(/^\/cases\/([^/]+)\/?$/);
 const project=cases.find(item=>item.slug===caseMatch?.[1]);
 const isCV=/^\/cv\/?$/.test(window.location.pathname);
 const isCase=window.location.pathname.startsWith('/cases/');
 const [notice,setNotice]=useState(''),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const missing=(label:string)=>{setNotice(`${label}: details will be available soon.`);clearTimeout(timer.current);timer.current=setTimeout(()=>setNotice(''),5000)};
 useEffect(()=>{const update=()=>document.documentElement.style.setProperty('--hover-duration',`${motionSettings().hoverMs}ms`);update();window.addEventListener('resize',update);return()=>{window.removeEventListener('resize',update);clearTimeout(timer.current)}},[]);
 return <ContactProvider><CursorTrail/><a className="skip-link" href="#content">Skip to content</a><Header/><main id="top"><div id="content" tabIndex={-1}>{isCV ? <CVPage/> : isCase ? (project ? <CasePage project={project}/> : <section className="case-not-found container"><h1>Case not found</h1><a href="/#work">← Back to selected work</a></section>) : <><VideoScene missing={missing}/><Experience/><Work/><Process/></>}<FAQ/><Contact/></div></main><Footer missing={missing}/><div className="notice" role="status" aria-live="polite">{notice&&<>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification">×</button></>}</div></ContactProvider>
}

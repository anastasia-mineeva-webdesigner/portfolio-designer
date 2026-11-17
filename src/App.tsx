import {useEffect,useRef,useState} from 'react';
import {SectionFades} from './components/SectionFades';
import {CursorTrail} from './components/AnimationEffects';
import Header from './components/Header';
import CasePage from './components/CasePage';
import CVPage from './components/CVPage';
import NotFoundPage from './components/NotFoundPage';
import {ContactProvider} from './components/ContactDialog';
import {cases} from './data/cases';
import VideoScene from './components/VideoScene';
import {Contact,Experience,FAQ,Footer,Process,Work} from './components/Sections';
import {motionSettings} from './config/animation';
export default function App(){
 const caseMatch=window.location.pathname.match(/^\/cases\/([^/]+)\/?$/);
 const project=cases.find(item=>item.slug===caseMatch?.[1]);
 const isCV=/^\/cv\/?$/.test(window.location.pathname);
 const isCase=Boolean(caseMatch);
 const isWork=/^\/work\/?$/.test(window.location.pathname);
 const isNotFound=window.location.pathname!=='/'&&!isWork&&!isCV&&!(isCase&&project);
 const [notice,setNotice]=useState(''),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const missing=(label:string)=>{setNotice(`${label}: details will be available soon.`);clearTimeout(timer.current);timer.current=setTimeout(()=>setNotice(''),5000)};
 useEffect(()=>{const update=()=>document.documentElement.style.setProperty('--hover-duration',`${motionSettings().hoverMs}ms`);update();window.addEventListener('resize',update);return()=>{window.removeEventListener('resize',update);clearTimeout(timer.current)}},[]);
 return <ContactProvider><div className={`site-shell ${isNotFound?'is-not-found':''}`}><CursorTrail/><SectionFades/><a className="skip-link" href="#content">Skip to content</a><Header/><main id="top"><div id="content" tabIndex={-1}>{isNotFound ? <NotFoundPage/> : isWork ? <Work page/> : isCV ? <CVPage/> : isCase&&project ? <CasePage project={project}/> : <><VideoScene missing={missing}/><Experience/><Work/><Process/></>}{!isNotFound&&<><FAQ/><Contact/></>}</div></main><Footer/><div className="notice" role="status" aria-live="polite">{notice&&<>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification">×</button></>}</div></div></ContactProvider>
}

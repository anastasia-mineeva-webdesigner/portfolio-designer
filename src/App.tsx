import {useEffect,useRef,useState} from 'react';
import {CursorTrail} from './components/AnimationEffects';
import Header from './components/Header';
import VideoScene from './components/VideoScene';
import {Contact,Experience,FAQ,Footer,Process,Work} from './components/Sections';
import {motionSettings} from './config/animation';
export default function App(){
 const [notice,setNotice]=useState(''),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const missing=(label:string)=>{setNotice(`${label}: details will be available soon.`);clearTimeout(timer.current);timer.current=setTimeout(()=>setNotice(''),5000)};
 useEffect(()=>{const update=()=>document.documentElement.style.setProperty('--hover-duration',`${motionSettings().hoverMs}ms`);update();window.addEventListener('resize',update);return()=>{window.removeEventListener('resize',update);clearTimeout(timer.current)}},[]);
 return <><CursorTrail/><a className="skip-link" href="#content">Skip to content</a><Header/><main id="top"><div id="content" tabIndex={-1}><VideoScene missing={missing}/><Experience/><Work missing={missing}/><Process/><FAQ/><Contact missing={missing}/></div></main><Footer missing={missing}/><div className="notice" role="status" aria-live="polite">{notice&&<>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification">×</button></>}</div></>
}

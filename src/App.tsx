import {useState} from 'react';
import Header from './components/Header';
import VideoScene from './components/VideoScene';
export default function App(){const [notice,setNotice]=useState('');return <><a className="skip-link" href="#content">Skip to content</a><Header/><main id="top"><div id="content"><VideoScene missing={()=>setNotice('This material will be available soon.')}/></div></main>{notice&&<div role="status" className="notice">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification">×</button></div>}</>}

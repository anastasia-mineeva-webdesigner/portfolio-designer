import {useEffect} from 'react';
import {Button} from './UI';
import '../not-found.css';
export default function NotFoundPage(){
 useEffect(()=>{const robots=document.querySelector('meta[name="robots"]');robots?.setAttribute('content','noindex, follow');const previous=document.title;document.title='404 — Page not found · Mira Smirnova';return()=>{document.title=previous}},[]);
 return <section className="not-found container" aria-labelledby="not-found-title"><div><h1 id="not-found-title">404</h1><p className="not-found-heading">Oops. This page doesn't exist.</p><p className="not-found-copy">Let's get you back to where the work is.</p><Button href="/">↗ Back to home</Button></div></section>
}

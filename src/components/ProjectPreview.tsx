import type {CaseStudy} from '../data/cases';
import {optimizedImages} from '../data/optimized-images';

export function ProjectPreview({project,sizes='auto, (min-width: 1700px) calc((100vw - 240px) / 3), (min-width: 600px) 33vw, 50vw'}:{project:CaseStudy;sizes?:string}){
 const source=optimizedImages[project.image??'all-projects.png'];
 return <img src={source.src} srcSet={source.srcSet} sizes={sizes} width="560" height="880" alt={`${project.title} — ${project.category.toLowerCase()} website design preview`} loading="lazy" decoding="async"/>;
}

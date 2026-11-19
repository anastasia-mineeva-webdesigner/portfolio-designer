import {ProjectPreview} from './ProjectPreview';
import {cases} from '../data/cases';

export function RelatedProjects({current}:{current:string}){
 const related=cases.filter(project=>project.slug!==current).slice(0,4);

 return <section className="related-projects" aria-labelledby="related-title">
  <h2 id="related-title">Explore more projects</h2>
  <div className="related-grid">
   {related.map(project=><a key={project.slug} className="project-card" href={`/cases/${project.slug}/`} aria-label={`View ${project.title} case`}>
    <ProjectPreview project={project}/>
   </a>)}
  </div>
 </section>;
}

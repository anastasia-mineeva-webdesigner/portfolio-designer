import {ProjectPreview} from './ProjectPreview';
import {cases,projectTags} from '../data/cases';
import {Tag} from './UI';

export function RelatedProjects({current}:{current:string}){
 const related=cases.filter(project=>project.slug!==current).slice(0,4);

 return <section className="related-projects" aria-labelledby="related-title">
  <h2 id="related-title">Explore more projects</h2>
  <div className="related-grid">
   {related.map(project=><a key={project.slug} className="related-card" href={`/cases/${project.slug}/`} aria-label={`View ${project.title} case`}>
    <div className="project-card"><ProjectPreview project={project}/></div>
    <div className="related-card-info">
     <h3>{project.title}</h3>
     <div className="related-card-tags">{projectTags(project).map(tag=><Tag key={tag}>{tag}</Tag>)}</div>
    </div>
   </a>)}
  </div>
 </section>;
}

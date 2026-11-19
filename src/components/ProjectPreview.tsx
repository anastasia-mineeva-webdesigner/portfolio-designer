import type {CaseStudy} from '../data/cases';

export function ProjectPreview({project}:{project:CaseStudy}){
 return <img src={project.previewImage} width="560" height="880" alt={`${project.title} — ${project.category.toLowerCase()} website design preview`} loading="lazy" decoding="async"/>;
}

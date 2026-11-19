import projects from './cases.json';

export const cases = projects;
export type CaseStudy = typeof cases[number];


export function projectTags(project:CaseStudy){
 return [...new Set([project.tags[0],project.category,...project.tags.slice(1)])].slice(0,3);
}

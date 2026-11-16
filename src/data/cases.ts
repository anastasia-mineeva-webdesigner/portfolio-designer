export const cases = [
 {slug:'volta',title:'Volta Studio',category:'Creative studio',image:'volta',summary:'A space for ideas, sound and a distinctive digital presence.'},
 {slug:'finly',title:'Finly',category:'Fintech',image:'finly',summary:'A clear, approachable way to explore a financial product.'},
 {slug:'northern-bread',title:'Northern Bread',category:'Food & retail',image:'northern-bread',summary:'An editorial approach to a bakery’s digital presence.'},
 {slug:'aura',title:'Aura',category:'Beauty & lifestyle',image:'aura',summary:'A visual story built around a beauty brand.'},
 {slug:'studio9',title:'Studio 9',category:'Studio website',image:'studio9',summary:'A focused presentation of a studio and its work.'},
 {slug:'next-project',title:'Next project',category:'Case template',image:null,summary:'A space for the sixth project. Content and photography will be added here.'},
];
export type CaseStudy = typeof cases[number];
// Draft structure: replace the copy and media with evidence from each project.
export const caseChapters = [
 {id:'overview',title:'Project overview',heading:'The starting point',text:'Introduce the client, the product and the context behind the project. Explain what needed to change and who the experience is designed for.',caption:'Project context',asset:'poster'},
 {id:'challenge',title:'Business & user challenge',heading:'A clear task before a visual solution',text:'Describe the business goal and the main user task. Add the real constraints: content, timing, platform and scope.',caption:'Brief & starting point',asset:'wireframe'},
 {id:'direction',title:'Structure & visual direction',heading:'From the first idea to a coherent system',text:'Show how the structure supports the user journey. Explain the decisions behind the typography, colour, imagery and layout, with early explorations where useful.',caption:'Structure & exploration',asset:'workflow'},
 {id:'design',title:'Final design & adaptation',heading:'One experience, across screens',text:'Present the key pages and details. Use the image slots for full-width screens, close-ups and desktop–mobile pairs, with a short explanation of each decision.',caption:'Design system & key screens',asset:'component-set'},
 {id:'outcome',title:'Outcome & next steps',heading:'What the project delivered',text:'Add the confirmed deliverables, launch status and feedback. Include results only when they are verified, then close with a lesson or a next step.',caption:'Final presentation',asset:'figma'},
];

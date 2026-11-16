export const scopeOptions=['Website design & build','UX/UI design','Design system','3D & motion','AI visuals & content','Not sure yet'];
export const formatOptions=['One-off project','Ongoing collaboration','Design only','Let’s discuss'];
export const budgetOptions=['150,000–300,000 ₽','300,000–500,000 ₽','500,000 ₽+','Let’s discuss first'];
export function buildEnquiry(data,recipient) {
 const field=name=>String(data.get(name)??'').trim();
 const selected=(name,options)=>data.getAll(name).filter(value=>options.includes(value)).join(', ');
 const body=[`Name: ${field('name')}`,`Email: ${field('email')}`,`Company: ${field('company')||'—'}`,`Scope: ${selected('scope',scopeOptions)||'To discuss'}`,`Format: ${selected('format',formatOptions)||'To discuss'}`,`Budget: ${selected('budget',budgetOptions)||'To discuss'}`,`Timeline: ${field('timeline')||'To discuss'}`,'','About the project:',field('note')||'To discuss'].join('\n');
 const subject=`Project enquiry${field('company')?' — '+field('company'):''}`;
 return {body,url:`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
}

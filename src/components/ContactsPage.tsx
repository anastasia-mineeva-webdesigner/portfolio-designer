import {contactLinks} from '../config/links';
import {cases} from '../data/cases';
import {useContact} from './ContactDialog';
import {ProjectPreview} from './ProjectPreview';
import {Button} from './UI';
import '../contacts.css';

const showcase = [
 {profile:'Behance',title:'Selected case studies',slug:'vireon'},
 {profile:'Dribbble',title:'Design explorations',slug:'art-scale'},
 {profile:'Telegram',title:'Behind the scenes',slug:'epoch'},
 {profile:'Awwwards',title:'Awards & recognition',slug:'veya'},
] as const;

export default function ContactsPage(){
 const openContact=useContact();

 return <article className="contacts-page container">
  <header className="contacts-intro">
   <h1>Good projects<br/>start with a <span className="accent">hello.</span></h1>
   <p>Tell me what you have in mind — I’ll reply within a day with a format and timeline.</p>
   <Button className="contacts-primary-action" onClick={openContact}>✦ Get in touch</Button>
  </header>
  <section className="contacts-showcase" aria-label="Explore my social profiles">
   {showcase.map(({profile,title,slug})=>{
    const project=cases.find(item=>item.slug===slug)!;
    const profileUrl=contactLinks.socials[profile];
    const cardUrl=profile==='Behance'?project.behance:profileUrl;
    return <section className="contacts-profile" key={profile}>
     <h2 className="contacts-profile-heading">
      <a className="contacts-profile-link" href={profileUrl} target="_blank" rel="noopener noreferrer"><span>{profile}</span></a>
     </h2>
     <p className="contacts-profile-description">{title}</p>
     <a className="contacts-project" href={cardUrl} target="_blank" rel="noopener noreferrer" aria-label={profile==='Behance'?`View ${project.title} on Behance`:`${title} on ${profile}`}>
      <div className={`contacts-project-image${profile==='Telegram'?' contacts-project-image--round':''}`}>
       <ProjectPreview project={project}/>
      </div>
     </a>
    </section>;
   })}
  </section>
 </article>;
}

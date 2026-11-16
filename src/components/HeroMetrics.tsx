import {Odometer} from './AnimationEffects';
const groups=[
 [['7 years','in web design'],['40+','websites launched']],
 [['12','awards & features'],['3 weeks','average project time']],
];
export function HeroMetrics(){return <div className="metrics metrics--paired container">{groups.map((items,i)=><div className={`metrics-group metrics-group--${i?'right':'left'}`} key={i}>{items.map(([number,label])=><div className="metric" key={label}><strong><Odometer value={number} hero/></strong><span>{label}</span></div>)}</div>)}</div>}

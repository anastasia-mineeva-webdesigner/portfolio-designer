import type { CSSProperties, ReactNode } from 'react';
export function Button({children, href, variant='primary', onClick, disabled=false, loading=false, className=''}:{children:ReactNode;href?:string;variant?:'primary'|'secondary'|'navigation';onClick?:()=>void;disabled?:boolean;loading?:boolean;className?:string}) {
  const cls=`button button--${variant} ${className}`;
  return href && !disabled && !loading ? <a className={cls} href={href} onClick={onClick}>{children}</a> : <button className={cls} type="button" onClick={onClick} disabled={disabled||loading} aria-busy={loading||undefined}>{loading&&<span className="spinner"/>}{children}</button>;
}
export function Label({children,dark=false}:{children:ReactNode;dark?:boolean}){return <span className={`label ${dark?'label--dark':''}`}><span className="dot"/>{children}</span>}
export function Tag({children}:{children:ReactNode}){return <span className="tag">{children}</span>}
export function Decoration({name,className='',style}:{name:string;className?:string;style?:CSSProperties}){return <img className={`decoration ${className}`} style={style} src={`/assets/${name}.png`} alt="" aria-hidden="true" loading="lazy"/>}

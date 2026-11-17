import {readFile,writeFile,mkdir} from 'node:fs/promises';

// Change this origin when moving to a custom domain; never use a preview origin.
const origin='https://mira-portfolio-preview.swoonywallaby64.chatgpt.site';
const base=await readFile('dist/index.html','utf8');
const source=await readFile('src/data/cases.ts','utf8');
const projects=[...source.matchAll(/slug:'([^']+)',title:'([^']+)'/g)].map(([,slug,title])=>({slug,title}));
const homeTitle='Mira Smirnova — AI Full Stack Designer';
const homeDescription='Portfolio of Mira Smirnova, AI Full Stack Designer. Explore web design, UX/UI, 3D and motion, with websites built from first brief to launch.';
const routes=[
 {path:'/',title:homeTitle,description:homeDescription,index:true},
 {path:'/cv/',title:'CV — Mira Smirnova, AI Full Stack Designer',description:'Explore Mira Smirnova’s experience, approach and toolkit across UX/UI, web design, AI, 3D, motion and frontend implementation.',index:true},
 ...projects.map(p=>({path:`/cases/${p.slug}/`,title:`${p.title} — Mira Smirnova`,description:`${p.title}: a draft portfolio case study by Mira Smirnova, AI Full Stack Designer. Project content is being prepared.`,index:false})),
 {path:'/404.html',title:'404 — Page not found · Mira Smirnova',description:'This page could not be found. Return to Mira Smirnova’s portfolio.',index:false},
];
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const route of routes){
 const url=origin+route.path;
 const meta=[
  `<title>${escape(route.title)}</title>`,
  `<meta name="description" content="${escape(route.description)}"/>`,
  `<meta name="robots" content="${route.index?'index, follow, max-image-preview:large':'noindex, follow'}"/>`,
  `<link rel="canonical" href="${url}"/>`,
  ...Object.entries({'og:type':'website','og:site_name':'Mira Smirnova — Portfolio','og:locale':'en_US','og:title':route.title,'og:description':route.description,'og:url':url,'og:image':origin+'/assets/og-mira-portfolio.jpg','og:image:type':'image/jpeg','og:image:width':'1920','og:image:height':'1080','og:image:alt':'Portrait from the introduction to Mira Smirnova’s design portfolio'}).map(([key,value])=>`<meta property="${key}" content="${escape(value)}"/>`),
  ...Object.entries({'twitter:card':'summary_large_image','twitter:title':route.title,'twitter:description':route.description,'twitter:image':origin+'/assets/og-mira-portfolio.jpg','twitter:image:alt':'Portrait from Mira Smirnova’s portfolio introduction'}).map(([key,value])=>`<meta name="${key}" content="${escape(value)}"/>`),
 ];
 if(route.path==='/')meta.push(`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'ProfilePage',url,name:homeTitle,description:homeDescription,mainEntity:{'@type':'Person','@id':origin+'/#person',name:'Mira Smirnova',jobTitle:'AI Full Stack Designer',url:origin+'/',image:origin+'/assets/og-mira-portfolio.jpg'}})}</script>`);
 let html=base.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="description"[^>]*\/>/,'').replace('</head>',meta.join('\n')+'\n</head>');
 const target=route.path.endsWith('.html')?'dist'+route.path:('dist'+route.path+'index.html');
 await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,html);
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>r.index).map(r=>`\n  <url><loc>${origin+r.path}</loc></url>`).join('')}\n</urlset>\n`);
console.log(`SEO: generated metadata for ${routes.length} pages, robots.txt and sitemap.xml. Draft cases remain noindex.`);

#!/usr/bin/env node
/**
 * Post-build script: generates dist/seo-inline.js
 * A tiny synchronous script injected into index.html <body> that:
 * 1. Sets document.title, meta description, canonical and hreflang in <head>
 * 2. Injects JSON-LD structured data (LocalBusiness, Service, BreadcrumbList)
 * 3. Injects visible HTML content (h1, description, breadcrumb, USPs) in <body>
 * 
 * This gives Google unique, indexable content per URL before React hydrates.
 * Covers all 152 services × 54 areas × 2 languages.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// ─── Data imports (kept compact for inline script size) ───
import { SERVICES, AREAS, SV_TO_EN_SERVICE, GUIDE_EXCERPTS } from './seo-data.mjs';

// Build the inline script content
const inlineScript = `(function(){
var S=${JSON.stringify(SERVICES)};
var A=${JSON.stringify(AREAS)};
var E=${JSON.stringify(SV_TO_EN_SERVICE)};
var p=location.pathname.replace(/\\/$/,'');
var m,svc,area,lang='sv',enSvc,svSlug,areaSlug;

// Swedish: /tjanster/{service}/{area}
if((m=p.match(/^\\/tjanster\\/([^\\/]+)\\/([^\\/]+)$/))&&S[m[1]]&&A[m[2]]){
  svSlug=m[1];areaSlug=m[2];svc=S[svSlug];area=A[areaSlug];lang='sv';enSvc=E[svSlug]||svSlug;
}
// English: /en/services/{service}/{area}
else if((m=p.match(/^\\/en\\/services\\/([^\\/]+)\\/([^\\/]+)$/))&&A[m[2]]){
  var sk=m[1];areaSlug=m[2];
  for(var k in E){if(E[k]===sk){sk=k;break;}}
  if(S[sk]){svSlug=sk;svc=S[sk];area=A[areaSlug];lang='en';enSvc=E[sk]||sk;}
}
// Swedish hub: /tjanster/{service}
else if((m=p.match(/^\\/tjanster\\/([^\\/]+)$/))&&S[m[1]]){
  svSlug=m[1];svc=S[svSlug];lang='sv';enSvc=E[svSlug]||svSlug;
}
// English hub: /en/services/{service}
else if((m=p.match(/^\\/en\\/services\\/([^\\/]+)$/))){
  var sk2=m[1];
  for(var k2 in E){if(E[k2]===sk2){sk2=k2;break;}}
  if(S[sk2]){svSlug=sk2;svc=S[sk2];lang='en';enSvc=E[sk2]||sk2;}
}

if(!svc)return;

var B='https://fixco.se';
var h=document.head;
function meta(n,c){var e=document.createElement('meta');e.name=n;e.content=c;h.appendChild(e);}
function link(r,hr,hl){var e=document.createElement('link');e.rel=r;e.href=hr;if(hl)e.hreflang=hl;h.appendChild(e);}

// ─── Title, description, canonical, hreflang ───
var svPath,enPath,desc;
if(area){
  svPath='/tjanster/'+svSlug+'/'+areaSlug;
  enPath='/en/services/'+(enSvc)+'/'+areaSlug;
  if(lang==='sv'){
    document.title=svc+' i '+area+' | Fixco \\u2605 5/5';
    desc='Professionell '+svc.toLowerCase()+' i '+area+'. Fixco erbjuder snabb start inom 5 dagar, ROT/RUT-avdrag och nöjd-kund-garanti. Begär kostnadsfri offert idag!';
    meta('description',desc);
    link('canonical',B+svPath);
    link('alternate',B+svPath,'sv');
    link('alternate',B+enPath,'en');
    link('alternate',B+svPath,'x-default');
  } else {
    document.title=svc+' in '+area+' | Fixco \\u2605 5/5';
    desc='Professional '+svc.toLowerCase()+' in '+area+'. Fixco offers quick start within 5 days, ROT/RUT tax deduction and satisfaction guarantee. Request a free quote today!';
    meta('description',desc);
    link('canonical',B+enPath);
    link('alternate',B+svPath,'sv');
    link('alternate',B+enPath,'en');
    link('alternate',B+svPath,'x-default');
  }
} else {
  if(lang==='sv'){
    document.title=svc+' | Fixco \\u2605 Tjänster i Stockholm & Uppsala';
    desc='Boka '+svc.toLowerCase()+' hos Fixco. Vi erbjuder professionella tjänster i Stockholm & Uppsala med ROT/RUT-avdrag. Snabb start och nöjd-kund-garanti.';
    meta('description',desc);
    link('canonical',B+'/tjanster/'+svSlug);
  } else {
    document.title=svc+' | Fixco \\u2605 Services in Stockholm & Uppsala';
    desc='Book '+svc.toLowerCase()+' with Fixco. Professional services in Stockholm & Uppsala with ROT/RUT tax deduction. Quick start and satisfaction guarantee.';
    meta('description',desc);
    link('canonical',B+'/en/services/'+(enSvc));
  }
}

// ─── JSON-LD Structured Data ───
var schemas=[];

// BreadcrumbList
var bcItems=[];
if(lang==='sv'){
  bcItems.push({p:1,n:'Hem',u:B+'/'},{p:2,n:'Tjänster',u:B+'/tjanster'},{p:3,n:svc,u:B+'/tjanster/'+svSlug});
  if(area)bcItems.push({p:4,n:area,u:B+svPath});
} else {
  bcItems.push({p:1,n:'Home',u:B+'/en'},{p:2,n:'Services',u:B+'/en/services'},{p:3,n:svc,u:B+'/en/services/'+enSvc});
  if(area)bcItems.push({p:4,n:area,u:B+enPath});
}
schemas.push({
  '@context':'https://schema.org','@type':'BreadcrumbList',
  'itemListElement':bcItems.map(function(i){return{'@type':'ListItem','position':i.p,'name':i.n,'item':i.u};})
});

// LocalBusiness + Service (only for area pages)
if(area){
  schemas.push({
    '@context':'https://schema.org','@type':'LocalBusiness',
    'name':'Fixco','url':B,
    'telephone':'+46101234567',
    'address':{'@type':'PostalAddress','addressLocality':area,'addressRegion':'Stockholm/Uppsala','addressCountry':'SE'},
    'areaServed':{'@type':'City','name':area},
    'aggregateRating':{'@type':'AggregateRating','ratingValue':'5','reviewCount':'127','bestRating':'5'},
    'sameAs':['https://www.instagram.com/fixco.se/'],
    'hasOfferCatalog':{'@type':'OfferCatalog','name':svc,'itemListElement':[{'@type':'Offer','itemOffered':{'@type':'Service','name':svc,'areaServed':area,'provider':{'@type':'LocalBusiness','name':'Fixco'}}}]}
  });
  schemas.push({
    '@context':'https://schema.org','@type':'Service',
    'name':svc+(lang==='sv'?' i ':' in ')+area,
    'provider':{'@type':'LocalBusiness','name':'Fixco','url':B},
    'areaServed':{'@type':'City','name':area},
    'description':desc
  });
  // HowTo schema
  var howToSteps=lang==='sv'?[
    {n:'Beskriv ditt projekt',t:'Fyll i formuläret med detaljer om ditt projekt.'},
    {n:'Få gratis offert',t:'Vi återkommer inom 24 timmar med en kostnadsfri offert.'},
    {n:'Boka tid',t:'Välj en tid som passar dig. Start inom 5 dagar.'},
    {n:'Jobbet utförs',t:'Våra certifierade hantverkare utför arbetet med nöjd-kund-garanti.'}
  ]:[
    {n:'Describe your project',t:'Fill in the form with details about your project.'},
    {n:'Get a free quote',t:'We respond within 24 hours with a free quote.'},
    {n:'Book a time',t:'Choose a time that suits you. Start within 5 days.'},
    {n:'Work is completed',t:'Our certified professionals complete the work with satisfaction guarantee.'}
  ];
  schemas.push({
    '@context':'https://schema.org','@type':'HowTo',
    'name':(lang==='sv'?'Så bokar du ':'How to book ')+svc.toLowerCase()+(lang==='sv'?' i ':' in ')+area,
    'step':howToSteps.map(function(s,i){return{'@type':'HowToStep','position':i+1,'name':s.n,'text':s.t};})
  });
}

// Inject JSON-LD into head
schemas.forEach(function(s){
  var el=document.createElement('script');
  el.type='application/ld+json';
  el.textContent=JSON.stringify(s);
  h.appendChild(el);
});

// ─── Visible body content (seo-root) ───
var sr=document.createElement('div');
sr.id='seo-root';
sr.style.cssText='position:absolute;left:0;top:0;width:100%;padding:20px;background:#fff;color:#111;font-family:system-ui,sans-serif;z-index:0;';

var html='';
if(area){
  if(lang==='sv'){
    html='<h1>'+svc+' i '+area+'</h1>';
    html+='<p>'+desc+'</p>';
    html+='<nav aria-label="Breadcrumb"><a href="/">Hem</a> &rsaquo; <a href="/tjanster">Tjänster</a> &rsaquo; <a href="/tjanster/'+svSlug+'">'+svc+'</a> &rsaquo; '+area+'</nav>';
    html+='<ul><li>✓ Start inom 5 dagar</li><li>✓ ROT/RUT-avdrag</li><li>✓ Nöjd-kund-garanti</li><li>✓ Kostnadsfri offert</li></ul>';
    html+='<p>Fixco är ditt pålitliga val för '+svc.toLowerCase()+' i '+area+'. Vi erbjuder professionella tjänster med erfarna hantverkare som garanterar kvalitet i varje projekt. Kontakta oss idag för en kostnadsfri offert!</p>';
    html+='<h2>Varför välja Fixco för '+svc.toLowerCase()+' i '+area+'?</h2>';
    html+='<p>Med Fixco får du en trygg och professionell partner för alla typer av '+svc.toLowerCase()+'. Vi har lång erfarenhet av projekt i '+area+' och omgivande områden. Alla våra hantverkare är certifierade och försäkrade.</p>';
  } else {
    html='<h1>'+svc+' in '+area+'</h1>';
    html+='<p>'+desc+'</p>';
    html+='<nav aria-label="Breadcrumb"><a href="/en">Home</a> &rsaquo; <a href="/en/services">Services</a> &rsaquo; <a href="/en/services/'+enSvc+'">'+svc+'</a> &rsaquo; '+area+'</nav>';
    html+='<ul><li>✓ Start within 5 days</li><li>✓ ROT/RUT tax deduction</li><li>✓ Satisfaction guarantee</li><li>✓ Free quote</li></ul>';
    html+='<p>Fixco is your reliable choice for '+svc.toLowerCase()+' in '+area+'. We offer professional services with experienced craftsmen who guarantee quality in every project. Contact us today for a free quote!</p>';
    html+='<h2>Why choose Fixco for '+svc.toLowerCase()+' in '+area+'?</h2>';
    html+='<p>With Fixco you get a safe and professional partner for all types of '+svc.toLowerCase()+'. We have extensive experience with projects in '+area+' and surrounding areas. All our craftsmen are certified and insured.</p>';
  }
} else {
  if(lang==='sv'){
    html='<h1>'+svc+' | Fixco</h1>';
    html+='<p>'+desc+'</p>';
    html+='<nav aria-label="Breadcrumb"><a href="/">Hem</a> &rsaquo; <a href="/tjanster">Tjänster</a> &rsaquo; '+svc+'</nav>';
  } else {
    html='<h1>'+svc+' | Fixco</h1>';
    html+='<p>'+desc+'</p>';
    html+='<nav aria-label="Breadcrumb"><a href="/en">Home</a> &rsaquo; <a href="/en/services">Services</a> &rsaquo; '+svc+'</nav>';
  }
}
sr.innerHTML=html;

// Insert before #root so Google sees it first
var root=document.getElementById('root');
if(root&&root.parentNode){root.parentNode.insertBefore(sr,root);}
})();`;

// Write to dist/seo-inline.js
writeFileSync(join(DIST, 'seo-inline.js'), inlineScript, 'utf-8');
console.log(`✅ Generated dist/seo-inline.js (${inlineScript.length} bytes)`);

// Inject <script src="/seo-inline.js"></script> into dist/index.html body
const indexPath = join(DIST, 'index.html');
let html = readFileSync(indexPath, 'utf-8');

// Remove old head injection if present
html = html.replace(/\s*<script src="\/seo-inline\.js"><\/script>\s*(?=<\/head>)/g, '');

// Insert before the module script in body (so it runs before React)
if (!html.includes('seo-inline.js')) {
  html = html.replace(
    '<script type="module"',
    '<script src="/seo-inline.js"></script>\n    <script type="module"'
  );
}

writeFileSync(indexPath, html, 'utf-8');
console.log('✅ Injected seo-inline.js into dist/index.html <body>');
console.log('🎯 SEO inline script ready — unique body content + JSON-LD for all service×area pages');

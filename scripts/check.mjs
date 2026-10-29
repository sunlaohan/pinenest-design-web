import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const pages=walk(dist).filter(file=>file.endsWith('.html')&&!file.includes('__responsive'));
const issues=[];
let checkedLinks=0;
let checkedImages=0;
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  const relative=path.relative(dist,file);
  if((html.match(/<h1\b/g)||[]).length!==1)issues.push(`${relative}: needs exactly one H1`);
  for(const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*\b(?:href|src)="([^"]+)"/g)){
    const url=match[1];
    if(!url.startsWith('/'))continue;
    const pathname=url.split(/[?#]/)[0];
    let target=path.join(dist,pathname);
    if(pathname.endsWith('/'))target=path.join(target,'index.html');
    if(!fs.existsSync(target))issues.push(`${relative}: missing target ${url}`);
    checkedLinks++;
    const fragment=url.split('#')[1];
    if(fragment&&fs.existsSync(target)&&target.endsWith('.html')){
      const targetHtml=fs.readFileSync(target,'utf8');
      if(!targetHtml.includes(`id="${fragment}"`))issues.push(`${relative}: missing anchor ${url}`);
    }
  }
  for(const img of html.matchAll(/<img\b[^>]*>/g)){
    if(!/\balt="[^"]*"/.test(img[0]))issues.push(`${relative}: image without alt attribute`);
    checkedImages++;
  }
  if(/hello@studio\.com|Forma Studio|Emma Carter|\$20k/.test(html))issues.push(`${relative}: reference placeholder left behind`);
  if(/xiaohongshu|Xiaohongshu|小红书/i.test(html))issues.push(`${relative}: old contact channel remains`);
  if(!html.includes('id="wechat-qr"')||!html.includes('data-wechat'))issues.push(`${relative}: WeChat contact bubble missing`);
}
const contactHtml=fs.readFileSync(path.join(dist,'contact/index.html'),'utf8');
assert.match(contactHtml,/<form[^>]+name="project-enquiry"[^>]+method="POST"[^>]+data-netlify="true"/);
assert.match(contactHtml,/name="form-name" value="project-enquiry"/);
assert.match(contactHtml,/name="contact" required/);
assert.match(contactHtml,/name="email"/);
assert.match(contactHtml,/netlify-honeypot="company"/);
assert.match(contactHtml,/1291362786@qq\.com/);
const projects=JSON.parse(fs.readFileSync(path.join(root,'content/projects.json'),'utf8'));
assert.equal(projects.length,6);
assert.equal(projects.reduce((n,p)=>n+p.photos,0),65);
assert.equal(new Set(projects.map(p=>p.slug)).size,6);
assert.equal(issues.length,0,issues.join('\n'));
console.log(`Verified ${pages.length} pages, ${checkedLinks} local links/assets, ${checkedImages} image elements, and all 65 original project photographs.`);

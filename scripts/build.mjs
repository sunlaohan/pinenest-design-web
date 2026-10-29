import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
const enquiryEmail = '1291362786@qq.com';
const origin = new URL(process.env.SITE_URL || process.env.URL || 'https://pinenest-design.netlify.app').origin;
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const tr = (v, tag = 'span', attrs = '') => `<${tag} data-zh="${escape(v[0])}" data-en="${escape(v[1])}" ${attrs}>${escape(v[0])}</${tag}>`;
const t = (zh, en, tag = 'span', attrs = '') => tr([zh, en], tag, attrs);
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const image = (file, alt, cls = '', eager = false, pos = '50% 50%') => `<img src="/assets/${file}" alt="${escape(alt)}" class="${cls}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''} style="object-position:${pos}">`;
const label = (zh, en) => `<div class="eyebrow"><i aria-hidden="true"></i>${t(zh, en)}</div>`;
const link = (zh, en, url = '/contact/', cls = '', extra = '') => `<a class="text-link ${cls}" href="${url}" ${extra}>${t(zh, en)}${arrow}</a>`;
const wechat = (zh = '微信联系', en = 'Chat on WeChat', cls = '') => `<button type="button" class="wechat-trigger ${cls}" data-wechat aria-haspopup="dialog" aria-controls="wechat-qr" aria-expanded="false">${t(zh,en)}${arrow}</button>`;
const wechatPopover = () => `<aside id="wechat-qr" class="qr-popover" role="dialog" aria-modal="false" aria-label="微信二维码 / WeChat QR code" hidden><div class="qr-popover-heading"><button type="button" class="qr-close" aria-label="关闭二维码 / Close QR code">×</button></div><img src="/assets/wechat.jpg" alt="成都松木设计微信好友二维码" width="689" height="692"><a class="qr-download" href="/assets/wechat.jpg" download="松木设计-微信二维码.jpg">${t('保存二维码','Save QR Code')} ↓</a></aside>`;
const masthead = (cls = '', tag = 'div') => `<${tag} class="masthead ${cls}" aria-label="Pinenest Studio">Pinenest Studio<span class="masthead-mark" aria-hidden="true">✳</span></${tag}>`;
const navItems = [
  ['首页', 'Home', '/'], ['关于', 'About', '/about/'], ['项目', 'Projects', '/projects/'], ['服务', 'Services', '/#services'], ['联系', 'Contact', '/contact/'],
];
function header(home) {
  return `<a href="#main" class="skip-link">跳至内容 / Skip to content</a>
    <header class="site-header ${home ? 'on-hero' : 'compact'}" data-home="${home}">
      <a class="brand" href="/" aria-label="Pinenest 松木设计 首页"><img src="/assets/logo.svg" width="25" height="19" alt=""><span>Pinenest<span class="brand-dot">✳</span></span></a>
      <nav class="desktop-nav" aria-label="主导航">${navItems.map(([zh,en,url]) => `<a class="nav-link" href="${url}">${t(zh,en)}</a>`).join('')}</nav>
      <div class="header-contact"><span>松木设计 · ${t('因你而不同','Spaces for you')}</span>${wechat('添加微信，聊聊你的家','Let’s talk on WeChat')}</div>
      <div class="header-actions"><button class="language-button" aria-label="Switch to English">EN</button><button class="menu-button" aria-label="打开菜单 / Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button></div>
    </header>
    <dialog id="menu" class="menu-dialog"><div class="menu-inner"><div class="menu-top"><a class="brand" href="/">Pinenest<span class="brand-dot">✳</span></a><button class="menu-close" aria-label="关闭菜单 / Close menu">×</button></div><nav aria-label="展开导航">${navItems.map(([zh,en,url], i) => `<a href="${url}"><span class="menu-number">0${i+1}</span>${t(zh,en)}${arrow}</a>`).join('')}</nav><div class="menu-bottom"><span>松木设计 · Pinenest Studio</span>${wechat('微信联系','WeChat')}<button class="language-button">EN</button></div></div></dialog>`;
}
function footer() {
  return `<footer class="footer wrap"><div class="footer-top"><div class="footer-intro"><h3>${t('关于生活，关于设计。','Life, considered.')}</h3><p>${t('把关于家的美好想象，慢慢变成日常。','Turning your ideas of home into everyday life.')}</p>${wechat('与松木聊聊','Let’s talk','text-link')}</div><nav aria-label="页脚导航">${navItems.map(([zh,en,url]) => `<a href="${url}">${t(zh,en)}</a>`).join('')}</nav><div class="footer-list"><a href="/privacy/">${t('隐私说明','Privacy Policy')}</a><a href="/contact/#brief">${t('项目咨询','Project Enquiry')}</a></div><div class="footer-list">${wechat('微信联系','WeChat')}<button class="language-button">EN</button></div><div class="footer-list footer-location"><span>${t('中国 · 成都','Chengdu, China')}</span><span>${t('住宅 / 改造 / 民宿','Homes / Renovations / Stays')}</span><a href="/contact/">${t('开启新的空间故事','Start your space story')} ↗</a></div></div>${masthead()}<div class="footer-bottom"><span>© 2026 Pinenest Studio. ${t('保留所有权利。','All rights reserved.')}</span><a href="#top" data-top>${t('回到顶部','Back to top')} ↑</a></div></footer>`;
}
function cta() {
  return `<section class="cta"><div class="cta-background">${image('zhongzhou-04.webp', '中洲锦城湖岸，柔和灯光下的起居空间')}</div><div class="cta-content reveal"><h2>${t('关于家的想象，','A new perspective,')}<br>${t('从这里开始。','a place to call home.')}</h2><p>${t('和我们一起，让理想生活有迹可循。','Let’s create a space that feels like you.')}</p>${link('开始你的项目','Start a Project')}</div></section>`;
}
function stats(extended = false) {
  const data = [
    ['2019', '开始空间实践', 'Design journey began', '从贵阳到成都，在一次次真实的委托中，理解空间与人的关系。', 'From Guiyang to Chengdu, each real brief deepens our understanding of people and places.'],
    ['06', '精选项目故事', 'Selected project stories', '从住宅全案到局部改造，从小型公寓到精品民宿，每个项目都有自己的答案。', 'From complete homes to focused renovations and guesthouses, each project finds its own answer.'],
    ['03', '城市中的生活', 'Cities, different lives', '成都、阿克苏、贵阳。不同的城市，相同的用心。', 'Chengdu, Aksu, and Guiyang. Different cities, the same care.'],
  ];
  return `<div class="stats">${data.map(([n,zh,en,detail,dEn]) => `<div class="stat reveal"><div class="stat-number" ${n !== '2019' ? `data-count="${Number(n)}"` : ''}>${n}</div><p>${t(extended?detail:zh,extended?dEn:en)}</p></div>`).join('')}</div>`;
}
function projectCard(p, cls = '') {
  return `<a class="project-card ${cls} reveal" href="/projects/${p.slug}/" data-category="${p.category}" aria-label="${escape(p.title[0])} ${p.year}">${image(p.cover, `${p.city[0]}·${p.title[0]}，${p.service[0]}`, '', false, p.position)}<div class="project-card-shade"></div><div class="project-card-info"><div><h3>${tr(p.title)}</h3><p>${tr(p.city)} · ${tr(p.service)} · ${p.area}</p></div><span>${p.year}</span><span class="project-arrow">${arrow}</span></div><span class="project-view">${t('查看项目','View project')} ${arrow}</span></a>`;
}
function projectGrid(all = false) {
  return `<div class="projects-grid ${all?'all-projects':''}">${(all ? projects : projects.slice(0,5)).map((p,i) => projectCard(p, `project-${i+1}`)).join('')}</div>`;
}
function aboutPreview() {
  return `<section class="about-preview wrap" id="about">${label('关于松木','About Us')}<div class="about-preview-grid"><a href="/about/" class="about-photo reveal">${image('zhongzhou-04.webp','中洲锦城湖岸的阅读与会客空间')}</a><div class="about-preview-text"><h2 class="reveal">${t('我们不定义风格，','We don’t define a style.')}<br>${t('我们一起发现，','Together, we discover')}<br>${t('属于你的生活。','the way you live.')}</h2><p class="reveal">${t('将功能需求、审美偏好与真实体验相融，让关于家的一切美好愿景，落地为日常。','Bringing function, personal taste, and lived experience together, we turn your ideas of home into everyday life.')}</p>${link('读我们的故事','Read Our Story','/about/')}</div></div>${stats()}</section>`;
}
function sectionHeading(zhLabel,enLabel,zh,en,descZh,descEn,cls='') {
  return `<div class="section-heading ${cls}"><div>${label(zhLabel,enLabel)}<h2>${t(zh,en)}</h2></div>${descZh?`<p>${t(descZh,descEn)}</p>`:''}</div>`;
}
const services = [
  ['住宅全案', 'Interior Design', '从第一张平面图到最后一盏灯，让家适应你的生活方式。', 'From the first floor plan to the final light, we create a home around the way you live.', '空间规划 · 材料选择 · 软装搭配','Space planning · Materials · Furnishings','wanda-01.webp'],
  ['旧房新生', 'Renovation', '重新理解已有空间，以恰当的改变，打开新的生活可能。','A fresh look at an existing space. Considered changes make room for new possibilities.','现场勘测 · 布局优化 · 材质更新','Site assessment · Layout updates · Finishes','golden-01.webp'],
  ['局部改造', 'Space Planning', '不必推倒重来。让灯光、收纳与动线回应当下的需求。','A focused update to light, storage, and flow, shaped around what you need today.','灯光设计 · 柜体设计 · 家具配置','Lighting · Custom joinery · Furniture','zhongzhou-05.webp'],
  ['精品民宿', 'Hospitality Design', '在有限面积与预算中，为旅人创造有记忆点的停留。','Distinctive, comfortable places to stay, with a thoughtful approach to space and budget.','公寓全案 · LOFT 设计 · 旧物新用','Guest rooms · Lofts · Reclaimed materials','rongsheng-01.webp'],
];
function servicesSection() {
  return `<section class="services dark wrap" id="services"><div class="services-intro">${label('设计服务','Services')}<h2>${t('我们设计的，','What we design')}<br>${t('是生活。','is a way of living.')}</h2><p>${t('从完整的家到恰好的改变，在空间与日常之间，找到属于你的平衡。','From a complete home to a focused transformation, we find a balance between space and everyday life.')}</p></div><div class="services-stack">${services.map(([zh,en,desc,dEn,tags,tEn,img],i)=>`<article class="service-card" style="--card-index:${i}"><div class="service-copy"><span class="service-number">/0${i+1}</span><h3>${t(zh,en)}</h3><p>${t(desc,dEn)}</p><p class="service-tags">${t(tags,tEn)}</p></div><a href="/contact/?service=${i+1}" class="service-photo" aria-label="${escape(zh)}咨询">${image(img,zh+'设计项目')}<span>${arrow}</span></a></article>`).join('')}</div></section>`;
}
const steps = [
  ['倾听生活','Discover','了解你的生活习惯、期待与空间需求。','We understand your vision, lifestyle, and spatial requirements.'],
  ['描绘可能','Concept','梳理动线、布局与空间氛围，找到设计方向。','We define the layout, atmosphere, and overall design direction.'],
  ['打磨细节','Development','细化材料、灯光、家具与每一处日常使用。','We refine materials, lighting, furniture, and spatial details.'],
  ['让想象落地','Execution','在实施中沟通与协调，让设计逐步成为现实。','We coordinate the details as the design becomes a lived-in reality.'],
];
function processSection() {
  const cells = [];
  const textCell = i => `<div class="process-cell process-text reveal"><span>/0${i+1}</span><div><h3>${t(steps[i][0],steps[i][1])}</h3><p>${t(steps[i][2],steps[i][3])}</p></div></div>`;
  const imgCell = i => `<div class="process-cell process-image reveal">${image(`process-${i+1}.webp`, `${steps[i][0]}：空间设计流程示意`)}</div>`;
  cells.push(textCell(0),imgCell(0),textCell(1),imgCell(1),imgCell(2),textCell(2),imgCell(3),textCell(3));
  return `<section class="process dark wrap">${sectionHeading('合作流程','Process','好空间，一步一步来。','How We Work','清晰的沟通，让每一次选择有依据，让每一个阶段有方向。','A clear process keeps every step thoughtful, structured, and easy to follow.')}${link('开始你的项目','Start a Project')}<div class="process-grid">${cells.join('')}</div></section>`;
}
const faq = [
  ['可以委托哪些类型的项目？','What kinds of projects do you work on?','我们关注住宅全案、旧房改造、局部更新与精品民宿。无论是一个家的重新规划，还是灯光、柜体与软装的局部调整，都可以先聊聊你的想法。','We focus on complete residential interiors, home renovations, focused updates, and guesthouses. From rethinking a whole home to updating light, cabinetry, and furniture, we can start with a conversation.'],
  ['一定要先确定喜欢的风格吗？','Do I need to choose a style first?','不需要。我们不会先为你的家贴上风格标签。你可以带来喜欢的图片，也可以从日常习惯、收藏的物件和对家的期待说起，一起找到适合你的方向。','No. We don’t begin with a style label. Bring images you like, or simply tell us about your routines, favorite objects, and hopes for your home. We’ll find the direction together.'],
  ['只想做局部改造，也可以吗？','Can we work on a partial renovation?','可以。中洲·锦城湖岸就是一次围绕灯光、软装与柜体展开的局部更新。我们会结合房屋现状与预算，判断哪些改变真正有价值。','Yes. Jincheng Lakeside is an example of a focused update to lighting, furniture, and cabinetry. We consider the existing space and your budget to identify the changes that matter.'],
  ['项目周期和费用如何确定？','How are timelines and fees determined?','周期和费用会根据项目面积、改造范围、现场条件与服务内容确定。先整理户型图、房屋现状、预算范围和期望入住时间，有助于我们更准确地沟通。','Timelines and fees depend on floor area, scope, existing conditions, and the services required. A floor plan, current photos, a budget range, and your preferred move-in date help us discuss the brief clearly.'],
  ['怎样开始与松木合作？','How do we get started?','点击「开始你的项目」填写并提交咨询，内容会发送到松木设计的邮箱。你也可以点击「微信联系」，通过二维码添加好友，直接聊聊你的想法。','Choose “Start a Project” to send your enquiry to our inbox. Or choose “WeChat” to open our QR code, add us, and start a conversation.'],
];
function faqSection() {
  return `<section class="faq wrap"><div class="faq-intro">${label('常见问题','FAQ')}<h2>${t('关于合作，','Your Questions,')}<br>${t('你想了解的。','Answered')}</h2><p>${t('在开始之前，先回答几个你可能关心的问题。','A few things you may want to know before we begin.')}</p></div><div class="faq-list">${faq.map(([zh,en,desc,dEn],i)=>`<details ${i===0?'open':''}><summary>${t(zh,en)}<span class="faq-symbol" aria-hidden="true"></span></summary><div class="faq-answer"><p>${t(desc,dEn)}</p></div></details>`).join('')}</div></section>`;
}
function philosophy() {
  const slides = [
    ['设计的起点','Our starting point','适合自己的，就是最好的风格。','The best style is the one that feels like you.','每个人都是独立的个体，对自己的家都有不同的理解和定义。','Every person has a different understanding of home.'],
    ['让改变有意义','A reason for every change','比起推倒重来，我们更在意改变了什么。','What a change brings matters more than how much is changed.','从原有条件出发，把精力与预算用在真正影响生活的地方。','Working with what is there, we focus on what makes a difference to daily life.'],
    ['生活先于风格','Life before labels','家，不只是一张好看的照片。','A home is more than a beautiful photograph.','一处舒服的坐席、一条顺畅的动线，以及每天都用得顺手的细节。','A comfortable seat, a natural flow, and details that feel right every day.'],
  ];
  return `<section class="philosophy wrap">${sectionHeading('设计理念','Our Perspective','关于家，我们相信。','What We Believe','','')}<div class="philosophy-slides" aria-live="polite">${slides.map(([zh,en,q,qEn,desc,dEn],i)=>`<article class="philosophy-slide ${i===0?'active':''}" ${i!==0?'hidden':''}><div class="philosophy-meta">${image('logo.svg','松木设计标志')}<div>${t(zh,en)}<small>Pinenest Studio</small></div></div><blockquote>${t(q,qEn)}</blockquote><p>${t(desc,dEn)}</p></article>`).join('')}</div><div class="philosophy-controls"><span class="slide-count">01 / 03</span><button data-slide="-1" aria-label="上一条理念 / Previous perspective">←</button><button data-slide="1" aria-label="下一条理念 / Next perspective">→</button></div></section>`;
}
function home() {
  return `<section class="hero" id="hero"><div class="hero-background">${image('wanda-01.webp','万达华庭住宅：黑色石材、木饰面与暖光交织的餐厅','',true,'50% 57%')}</div><div class="hero-content wrap"><div class="hero-description"><p>${t('我们从生活出发，','We design spaces around you,')}<br>${t('让功能、审美与日常相融，','bringing function, feeling, and everyday life together')}<br>${t('让家，成为你自己的样子。','to create a place that feels like home.')}</p>${link('开始你的项目','Start a Project')}</div>${masthead('hero-masthead','h1')}</div></section>${aboutPreview()}<section class="selected-projects wrap" id="projects">${sectionHeading('精选项目','Projects','空间，各有答案。','Selected Works','从成都到阿克苏，从家到旅居。每个空间，都从具体的生活开始。','From Chengdu to Aksu, from homes to stays. Every space begins with a way of living.')}${projectGrid()}<div class="see-all">${link('查看全部项目','See All Works','/projects/')}</div></section>${servicesSection()}${processSection()}${philosophy()}${faqSection()}${cta()}`;
}
function about() {
  return `<section class="about-hero wrap"><div class="about-hero-text"><h1>${t('每个人，对家都有','Everyone has a different')}<br>${t('自己的理解。','idea of home.')}<br>${t('我们让它成为现实。','We bring yours to life.')}</h1>${link('与我们聊聊','Get in Touch')}</div><div class="about-hero-image reveal">${image('zhongzhou-01.webp','中洲锦城湖岸，围绕书籍、艺术与日常的生活空间','',true)}</div></section><section class="our-story wrap">${label('我们的故事','Our Story')}<div class="story-grid"><div>${image('zhongzhou-07.webp','温暖木色与不同纹理织物的细节','reveal')}<p>${t('家不需要被定义成某一种风格。它应该容纳你的习惯、收藏、相聚与独处，以及那些不断变化的日常。','A home doesn’t need a single style label. It should hold your habits, your collections, time together and time alone, and the everyday life that keeps changing.')}</p></div><div><p class="story-lead">${t('松木设计从来不会去定义风格，因为每个人都是独立的个体，对自己的家都有不同的理解和定义，适合自己的就是最好的风格。','At Pinenest, we don’t begin by defining a style. Everyone is an individual, with a different understanding of home. The best style is the one that feels like you.')}</p><p>${t('我们做的，是和你一起将功能需求、审美偏好与用户体验更好地融合，让关于家的一切美好愿景落地为现实。','Our work brings your functional needs, personal taste, and experience of living together, turning the possibilities you imagine for your home into reality.')}</p>${image('golden-01.webp','金茂黄金海岸，明亮通透的起居空间','reveal')}</div></div></section><section class="impact wrap">${sectionHeading('实践足迹','Our Practice','在真实的生活中，理解设计。','Grounded in real lives.','','')}${stats(true)}</section><section class="design-values wrap">${sectionHeading('设计关注','Our Focus','不止于好看。','More than appearances.','在每一个项目中，我们反复思考这些日常而重要的事。','Simple, important questions we return to with every project.')}<div class="value-grid">${[['功能与动线','Function & Flow','让每一个动作更顺畅，让空间照顾真实的生活。','Spaces that support real routines, with a natural flow.','golden-03.webp'],['材料与触感','Materials & Feeling','在木、石、织物与光之间，找到舒适的平衡。','Finding comfort between wood, stone, fabric, and light.','zhongzhou-07.webp'],['尺度与预算','Scale & Budget','让有限的空间与投入，带来有意义的改变。','Making a meaningful difference with the space and resources available.','konggang-05.webp'],['个性与日常','Personality & Life','尊重每一种偏好，让房子逐渐成为自己的家。','Respecting personal taste as a place becomes your own.','rongsheng-03.webp']].map(([zh,en,desc,dEn,img],i)=>`<article class="value-card reveal">${image(img,zh)}<span>/0${i+1}</span><h3>${t(zh,en)}</h3><p>${t(desc,dEn)}</p></article>`).join('')}</div></section><section class="milestones wrap">${sectionHeading('项目足迹','Selected Milestones','每一段生活，都值得认真对待。','Every way of living deserves care.','','')}<div class="milestone-list">${projects.map(p=>`<a href="/projects/${p.slug}/"><div class="milestone-row"><h3>${tr(p.title)}</h3><span>${tr(p.service)}</span><span>${p.year}</span>${arrow}</div></a>`).join('')}</div></section>${processSection()}${faqSection()}${cta()}`;
}
function projectsPage() {
  return `<section class="project-index wrap"><div class="page-heading">${label('作品集 · 2019—2025','Portfolio · 2019—2025')}<h1>${t('不同的空间，','Different spaces,')}<br>${t('同样的用心。','the same care.')}</h1><p>${t('六个项目，六段生活。从家的日常，到旅途中的短暂停留。','Six projects, six ways of living. From the everyday at home to a brief stay along the way.')}</p></div><div class="project-filters" role="group" aria-label="项目分类 / Project categories"><button data-filter="all" class="active" aria-pressed="true">${t('全部项目','All Projects')}<sup>06</sup></button><button data-filter="residential" aria-pressed="false">${t('住宅空间','Residential')}<sup>03</sup></button><button data-filter="hospitality" aria-pressed="false">${t('旅居空间','Hospitality')}<sup>03</sup></button><span class="filter-count">06 ${t('个项目','projects')}</span></div>${projectGrid(true)}</section>${cta()}`;
}
function projectPage(p) {
  const morePhotos = Array.from({length:p.photos-1},(_,i)=>`${p.slug}-${String(i+2).padStart(2,'0')}.webp`);
  const related = projects.filter(other=>other.slug!==p.slug).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,2);
  const cover = p.comparisons ? '' : `<button class="project-cover lightbox-trigger" data-image="/assets/${p.slug}-01.webp" data-alt="${escape(p.title[0])}" aria-label="放大项目图片 / Enlarge project image">${image(`${p.slug}-01.webp`,p.title[0]+'项目全景','',true,p.position)}<span class="enlarge">↗</span></button>`;
  const leadGallery = p.comparisons ? comparisonGallery(p, p.comparisons.slice(0,1)) : morePhotos.length ? `<div class="detail-gallery">${morePhotos.slice(0,2).map((file,i)=>photoButton(file,p,i)).join('')}</div>` : '';
  const bodyGallery = p.comparisons ? comparisonGallery(p, p.comparisons.slice(1)) : morePhotos.length > 2 ? `<div class="detail-gallery">${morePhotos.slice(2).map((file,i)=>photoButton(file,p,i+2)).join('')}</div>` : `<div class="project-focus-image">${image(p.cover, p.title[0]+'：材料与空间细节','','', '50% 74%')}</div>`;
  return `<article class="project-detail wrap${p.comparisons ? ' has-comparisons' : ''}"><div class="project-detail-heading"><div>${label('项目故事','Project')}<h1>${tr(p.title)}</h1><p>${tr(p.intro)}</p></div>${link('开始你的项目','Start a Project')}</div><dl class="project-metadata"><div><dt>${t('年份','Year')}</dt><dd>${p.year}</dd></div><div><dt>${t('服务','Service')}</dt><dd>${tr(p.service)}</dd></div><div><dt>${t('面积','Area')}</dt><dd>${p.area}</dd></div><div><dt>${t('地点','Location')}</dt><dd>${tr(p.city)}</dd></div></dl>${cover}<div class="project-story-row">${t('项目故事','Overview','h2')}<div><p>${tr(p.story)}</p><p class="project-location">${tr(p.location)}</p></div></div>${leadGallery}<div class="project-story-row">${t('设计回应','Our Approach','h2')}<p>${tr(p.approach)}</p></div>${bodyGallery}<div class="project-story-row outcome">${t('回到生活','Back to Life','h2')}<p>${tr(p.focus)}</p></div><a href="/projects/" class="back-projects">← ${t('返回全部项目','Back to all projects')}</a></article><section class="related-projects wrap">${sectionHeading('更多空间故事','Projects','继续发现。','Related Work','每一个家，都有自己的答案。','Every home has its own answer.')}<div class="related-grid">${related.map(p=>projectCard(p)).join('')}</div></section>${cta()}<dialog id="lightbox" class="lightbox"><div class="lightbox-bar"><span class="lightbox-caption"></span><button class="lightbox-close" aria-label="关闭图片 / Close image">×</button></div><div class="lightbox-stage"><button class="lightbox-prev" aria-label="上一张 / Previous image">←</button><img alt=""><button class="lightbox-next" aria-label="下一张 / Next image">→</button></div><span class="lightbox-count"></span></dialog>`;
}
function comparisonGallery(p, pairs) {
  return `<div class="comparison-gallery">${pairs.map(pair => `<section class="comparison-pair reveal"><h2>${tr(pair.title)}</h2><div class="comparison-images${pair.portrait ? ' portrait' : ''}">${[['before','改造前','Before'],['after','改造后','After']].map(([stage,zh,en]) => {
    const caption = `${p.title[0]} · ${pair.title[0]} · ${zh}`;
    return `<figure><figcaption>${t(zh,en)}</figcaption><button class="comparison-photo lightbox-trigger" data-comparison-stage="${stage}" data-image="/assets/${pair[stage]}" data-alt="${escape(caption)}" aria-label="放大：${escape(caption)}">${image(pair[stage],caption,'',pair === p.comparisons[0])}<span class="enlarge">↗</span></button></figure>`;
  }).join('')}</div></section>`).join('')}</div>`;
}
function photoButton(file,p,i) {
  return `<button class="gallery-photo lightbox-trigger reveal ${i%5===4?'wide':''}" data-image="/assets/${file}" data-alt="${escape(p.title[0])} · ${i+2}" aria-label="放大${escape(p.title[0])}项目图片 ${i+2}">${image(file,p.title[0]+'空间细节 '+(i+2))}<span class="enlarge">↗</span></button>`;
}
function contact() {
  return `<section class="contact-page wrap" id="brief">
    <div class="contact-intro">
      ${label('联系松木','Contact')}
      <h1>${t('好的空间，','Good spaces begin')}<br>${t('从一次聊天开始。','with a conversation.')}</h1>
      <p>${t('无论是一套新房、一处旧居，还是一个尚未成形的想法，都欢迎和我们聊聊。','A new home, an existing space, or an idea still taking shape. We’d love to hear about it.')}</p>
      <div class="contact-details">
        <div>${t('微信联系','WeChat','small')}${wechat('扫码添加松木设计','Add Pinenest on WeChat','text-link')}</div>
        <div>${t('咨询邮箱','Project Enquiries','small')}<a class="contact-email" href="mailto:${enquiryEmail}">${enquiryEmail}</a></div>
        <div>${t('项目足迹','Our Footprint','small')}${t('成都 / 阿克苏 / 贵阳','Chengdu / Aksu / Guiyang','p')}</div>
        <div>${t('设计方向','Our Focus','small')}${t('住宅全案 · 局部改造 · 精品民宿','Residential · Renovations · Hospitality','p')}</div>
      </div>
      <div class="contact-image">${image('zhongzhou-07.webp','中洲锦城湖岸，围坐交流的空间','',true)}</div>
    </div>
    <div class="brief-area">
      <div class="brief-heading"><h2>${t('说说你的空间。','Tell us about your space.')}</h2><p>${t('填写你的需求，咨询将直接发送至松木设计邮箱。','Send us your ideas. Your enquiry will be forwarded to the Pinenest inbox.')}</p></div>
      <form id="brief-form" name="project-enquiry" method="POST" action="/contact/success/" data-netlify="true" netlify-honeypot="company">
        <input type="hidden" name="form-name" value="project-enquiry">
        <input type="hidden" name="subject" value="松木设计｜新的项目咨询" data-remove-prefix>
        <p class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="company" tabindex="-1" autocomplete="off"></label></p>
        <div class="form-row">
          <label>${t('怎么称呼你','Your name')}<input name="name" required maxlength="80" autocomplete="name" data-placeholder-zh="你的称呼" data-placeholder-en="Your name" placeholder="你的称呼"></label>
          <label>${t('项目所在城市','Project city')}<input name="city" required maxlength="100" data-placeholder-zh="例如：成都" data-placeholder-en="e.g. Chengdu" placeholder="例如：成都"></label>
        </div>
        <div class="form-row">
          <label>${t('联系方式','Contact details')}<input name="contact" required maxlength="120" data-placeholder-zh="微信号或手机号码" data-placeholder-en="WeChat ID or phone number" placeholder="微信号或手机号码"></label>
          <label>${t('电子邮箱（选填）','Email (optional)')}<input type="email" name="email" maxlength="160" autocomplete="email" data-placeholder-zh="方便通过邮件回复你" data-placeholder-en="For replies by email" placeholder="方便通过邮件回复你"></label>
        </div>
        <div class="form-row">
          <label>${t('项目类型','Project type')}<select name="service" required><option value="" data-zh="请选择项目类型" data-en="Select project type">请选择项目类型</option>${services.map(([zh,en])=>`<option value="${zh}" data-zh="${zh}" data-en="${en}">${zh}</option>`).join('')}</select></label>
          <label>${t('空间面积','Floor area')}<input name="area" required maxlength="50" data-placeholder-zh="例如：120 m²" data-placeholder-en="e.g. 120 m²" placeholder="例如：120 m²"></label>
        </div>
        <div class="form-row">
          <label>${t('预计投入','Budget range')}<input name="budget" maxlength="80" data-placeholder-zh="设计及装修预算（选填）" data-placeholder-en="Design & renovation budget (optional)" placeholder="设计及装修预算（选填）"></label>
          <label>${t('期待的完成时间','Preferred completion')}<input name="timeline" maxlength="100" data-placeholder-zh="例如：明年春天（选填）" data-placeholder-en="e.g. next spring (optional)" placeholder="例如：明年春天（选填）"></label>
        </div>
        <label class="message-label">${t('关于家的想象','Your ideas of home')}<textarea name="message" required rows="5" maxlength="3000" data-placeholder-zh="谁会住在这里？希望改变什么？也可以告诉我们你喜欢的项目……" data-placeholder-en="Who will use this space? What would you like to change? Tell us about a project you like…" placeholder="谁会住在这里？希望改变什么？也可以告诉我们你喜欢的项目……"></textarea></label>
        <p class="form-note">${t('提交后，联系方式与项目需求将通过 Netlify Forms 接收，并转发至','Your contact details and project brief will be collected through Netlify Forms and forwarded to')} <a href="mailto:${enquiryEmail}">${enquiryEmail}</a>${t('，仅用于本次项目沟通。',' for this project conversation.')} <a href="/privacy/">${t('隐私说明','Privacy Policy')}</a></p>
        <button class="brief-submit" type="submit"><span data-submit-label data-zh="发送项目咨询" data-en="Send Project Enquiry">发送项目咨询</span>${arrow}</button>
        <p id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1" hidden></p>
      </form>
      <section class="brief-result" id="brief-result" hidden aria-live="polite">
        <h3>${t('你的咨询已提交。','Your enquiry has been submitted.')}</h3>
        <p>${t('谢谢你的信任。我们会根据你留下的联系方式，与你沟通项目细节。','Thank you for sharing your ideas. We’ll use the contact details you provided to discuss your project.')}</p>
        <pre id="brief-output"></pre>
        <div class="brief-result-actions"><button class="copy-brief text-link" type="button">${t('复制咨询记录','Copy Enquiry')}<span>↗</span></button>${wechat('添加微信继续聊聊','Continue on WeChat','text-link')}</div>
        <p class="copy-status" role="status"></p>
      </section>
    </div>
  </section>${faqSection()}`;
}
function contactSuccess() {
  return `<section class="privacy-page contact-success wrap">${label('项目咨询','Project Enquiry')}<h1>${t('你的咨询已提交。','Your enquiry has been submitted.')}</h1><p>${t('谢谢你的信任。我们会根据你留下的联系方式，与你沟通项目细节。','Thank you for sharing your ideas. We’ll use the contact details you provided to discuss your project.')}</p><div class="success-actions">${wechat('添加微信继续聊聊','Continue on WeChat','text-link')}${link('返回首页','Back to Home','/')}</div></section>`;
}
function privacy() {
  return `<section class="privacy-page wrap">${label('隐私说明','Privacy')}<h1>${t('你的想法，属于你。','Your ideas belong to you.')}</h1>
    <p>${t('本网站用于展示松木设计的项目与服务。你可以浏览项目，或自愿提交咨询与我们联系。网站不提供账户注册。','This website presents Pinenest projects and services. You can browse the work or choose to submit an enquiry. No account registration is required.')}</p>
    <h2>${t('项目咨询信息','Project enquiry information')}</h2>
    <p>${t('当你主动提交咨询时，姓名、联系方式、选填邮箱、项目城市、面积、预算、时间与需求说明将由 Netlify Forms 接收，并通过邮件转发至松木设计的咨询邮箱：','When you submit an enquiry, your name, contact details, optional email, project city, area, budget, timeline, and brief are collected by Netlify Forms and forwarded to the Pinenest enquiry inbox:')} <a href="mailto:${enquiryEmail}">${enquiryEmail}</a>${t('。这些信息仅用于项目咨询、评估与后续沟通，也会保存在我们可访问的 Netlify 表单后台。',' These details are used for project assessment and follow-up, and are also stored in our Netlify Forms dashboard.')}</p>
    <h2>${t('浏览器中的本地数据','Local browser data')}</h2>
    <p>${t('中英文偏好保存在浏览器本地。网站不会将你填写的咨询表单持久保存在浏览器中；只有你点击发送后，表单内容才会提交。','Your language preference is stored locally in your browser. Form details are not saved persistently in your browser and are submitted only when you choose to send the enquiry.')}</p>
    <h2>${t('微信联系与信息管理','WeChat and managing your information')}</h2>
    <p>${t('点击微信联系入口会在当前页面展示二维码，不会自动添加好友。扫码后，微信中的交流适用微信平台的相关规则。如需了解、更正或删除已提交的咨询信息，可以通过上述邮箱与我们联系。','WeChat contact buttons display a QR code without automatically adding a contact. Conversations on WeChat follow that platform’s policies. To ask about, correct, or remove an enquiry, contact us at the email above.')}</p>
    ${link('返回首页','Back to Home','/')}
  </section>`;
}
function layout(content,title,route,homePage=false) {
  const description = '松木设计 Pinenest Studio：不定义风格，与您一起将功能、审美与日常融合。探索住宅全案、旧房改造与精品民宿项目。';
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="${homePage?'#161511':'#f2f2f2'}"><title>${escape(title)} · 松木设计 Pinenest Studio</title><meta name="description" content="${description}"><meta property="og:title" content="${escape(title)} · Pinenest Studio"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:image" content="${origin}/assets/cover-01.webp"><link rel="icon" type="image/svg+xml" href="/assets/logo.svg"><link rel="preload" href="/assets/mona-sans.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script></head><body id="top" class="${homePage?'home-page':'inner-page'}">${header(homePage)}<main id="main">${content}</main>${footer()}${wechatPopover()}<div class="toast" role="status" aria-live="polite"></div></body></html>`;
}
fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,'public'),out,{recursive:true});
for(const f of ['styles.css','app.js'])fs.copyFileSync(path.join(root,'src',f),path.join(out,f));
const pages = [
  ['', '因你而不同', home(), true],
  ['about','关于松木',about()],
  ['projects','精选项目',projectsPage()],
  ['contact','联系松木',contact()],
  ['contact/success','咨询已提交',contactSuccess()],
  ['privacy','隐私说明',privacy()],
  ...projects.map(p=>[`projects/${p.slug}`,p.title[0],projectPage(p)]),
];
for(const [route,title,content,isHome] of pages){
  const folder=path.join(out,route);fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'index.html'),layout(content,title,route,isHome));
}
const notFound = `<section class="not-found wrap">${label('页面未找到','Page not found')}<h1>404</h1><p>${t('这个空间还没有被打开。','This space hasn’t been opened yet.')}</p>${link('回到首页','Back to Home','/')}</section>`;
fs.writeFileSync(path.join(out,'404.html'),layout(notFound,'页面未找到','404'));
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log(`Built ${pages.length} pages in ${out}`);

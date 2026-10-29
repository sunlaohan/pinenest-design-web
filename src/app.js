const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
let language = 'zh';
try { language = localStorage.getItem('pinenest-language') === 'en' ? 'en' : 'zh'; } catch {}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const text = (zh, en) => language === 'zh' ? zh : en;

function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  $$('[data-zh][data-en]').forEach(el => { el.textContent = el.dataset[language]; });
  $$('[data-placeholder-zh]').forEach(el => { el.placeholder = el.dataset[language === 'zh' ? 'placeholderZh' : 'placeholderEn']; });
  $$('.language-button').forEach(button => {
    button.textContent = language === 'zh' ? 'EN' : '中文';
    button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  });
  try { localStorage.setItem('pinenest-language', language); } catch {}
  if ($('#brief-result') && !$('#brief-result').hidden) makeBrief();
  if ($('.brief-submit')?.disabled) $('[data-submit-label]').textContent = text('正在发送…', 'Sending…');
}
setLanguage(language);
$$('.language-button').forEach(button => button.addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh')));

const header = $('.site-header');
let scrollPending = false;
function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 80);
  scrollPending = false;
}
updateHeader();
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateHeader); }
}, { passive: true });

const menu = $('#menu');
const menuButton = $('.menu-button');
function closeMenu() { closeQrPopover(false); menu?.close(); menuButton?.setAttribute('aria-expanded', 'false'); }
menuButton?.addEventListener('click', () => {
  menu.showModal();
  menuButton.setAttribute('aria-expanded', 'true');
});
$('.menu-close')?.addEventListener('click', closeMenu);
menu?.addEventListener('close', () => { closeQrPopover(false); menuButton?.setAttribute('aria-expanded', 'false'); });
$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));

// One reusable bubble keeps the supplied QR image intact on every contact entry point.
const qrPopover = $('#wechat-qr');
let qrTrigger = null;
function positionQrPopover() {
  if (!qrTrigger || qrPopover.hidden) return;
  const anchor = qrTrigger.getBoundingClientRect();
  const gap = 13;
  const margin = 16;
  const popup = qrPopover.getBoundingClientRect();
  const above = innerHeight - anchor.bottom < popup.height + gap + margin && anchor.top > innerHeight - anchor.bottom;
  const left = Math.max(margin, Math.min(anchor.left + anchor.width / 2 - popup.width / 2, innerWidth - popup.width - margin));
  const targetTop = above ? anchor.top - popup.height - gap : anchor.bottom + gap;
  const top = Math.max(margin, Math.min(targetTop, innerHeight - popup.height - margin));
  qrPopover.style.left = `${left}px`;
  qrPopover.style.top = `${top}px`;
  qrPopover.dataset.placement = above ? 'above' : 'below';
  qrPopover.style.setProperty('--qr-pointer', `${Math.max(20, Math.min(anchor.left + anchor.width / 2 - left, popup.width - 20))}px`);
}
function closeQrPopover(restoreFocus = false) {
  if (!qrTrigger) return;
  const previous = qrTrigger;
  qrPopover.hidden = true;
  previous.setAttribute('aria-expanded', 'false');
  qrTrigger = null;
  if (restoreFocus) previous.focus({ preventScroll: true });
}
$$('[data-wechat]').forEach(button => button.addEventListener('click', e => {
  if (qrTrigger === button && !qrPopover.hidden) { closeQrPopover(true); return; }
  closeQrPopover(false);
  qrTrigger = button;
  // Keep the bubble inside a modal menu when one is open, so it remains interactive.
  (button.closest('dialog[open]') || document.body).append(qrPopover);
  qrPopover.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  positionQrPopover();
  if (e.detail === 0) $('.qr-close', qrPopover).focus({ preventScroll: true });
}));
$('.qr-close', qrPopover)?.addEventListener('click', () => closeQrPopover(true));
$('img', qrPopover)?.addEventListener('load', positionQrPopover);
document.addEventListener('click', e => {
  if (qrTrigger && !qrPopover.contains(e.target) && !qrTrigger.contains(e.target)) closeQrPopover(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && qrTrigger) { e.preventDefault(); e.stopPropagation(); closeQrPopover(true); }
}, { capture: true });
window.addEventListener('resize', positionQrPopover, { passive: true });
window.addEventListener('scroll', () => closeQrPopover(false), { passive: true });

// Content is visible first. Reveal effects are enabled only when the browser supports them.
if ('IntersectionObserver' in window && !reducedMotion) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px 20px 0px' });
  $$('.reveal').forEach(el => observer.observe(el));
}

// Native details preserve keyboard support. Only one answer is expanded at a time.
$$('.faq-list').forEach(list => {
  $$('details', list).forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) $$('details', list).filter(other => other !== detail).forEach(other => { other.open = false; });
  }));
});

const slides = $$('.philosophy-slide');
let slideIndex = 0;
$$('[data-slide]').forEach(button => button.addEventListener('click', () => {
  slideIndex = (slideIndex + Number(button.dataset.slide) + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== slideIndex; slide.classList.toggle('active', i === slideIndex); });
  $('.slide-count').textContent = `${String(slideIndex + 1).padStart(2, '0')} / 03`;
}));

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  const grid = $('.all-projects');
  grid.classList.toggle('is-filtered', filter !== 'all');
  let count = 0;
  $$('[data-category]', grid).forEach(card => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.hidden = !visible;
    if (visible) { count++; card.classList.add('visible'); }
  });
  const countLabel = document.createElement('span');
  countLabel.dataset.zh = '个项目';
  countLabel.dataset.en = 'projects';
  countLabel.textContent = text('个项目', 'projects');
  $('.filter-count').replaceChildren(`${String(count).padStart(2, '0')} `, countLabel);
}));

// Image viewer uses a native modal dialog for Escape, focus trapping, and focus restoration.
const lightbox = $('#lightbox');
const photoButtons = $$('.lightbox-trigger');
let photoIndex = 0;
function renderPhoto() {
  const photo = photoButtons[photoIndex];
  const img = $('.lightbox-stage > img', lightbox);
  img.src = photo.dataset.image;
  img.alt = photo.dataset.alt;
  $('.lightbox-caption', lightbox).textContent = photo.dataset.alt;
  $('.lightbox-count', lightbox).textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photoButtons.length).padStart(2, '0')}`;
  $('.lightbox-prev', lightbox).disabled = photoIndex === 0;
  $('.lightbox-next', lightbox).disabled = photoIndex === photoButtons.length - 1;
}
function movePhoto(delta) {
  const next = photoIndex + delta;
  if (next >= 0 && next < photoButtons.length) { photoIndex = next; renderPhoto(); }
}
photoButtons.forEach((button, i) => button.addEventListener('click', () => { photoIndex = i; renderPhoto(); lightbox.showModal(); }));
$('.lightbox-close')?.addEventListener('click', () => lightbox.close());
$('.lightbox-prev')?.addEventListener('click', () => movePhoto(-1));
$('.lightbox-next')?.addEventListener('click', () => movePhoto(1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) lightbox.close(); });
lightbox?.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); movePhoto(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); movePhoto(1); }
});

const form = $('#brief-form');
let briefText = '';
function makeBrief() {
  if (!form) return;
  const values = new FormData(form);
  const service = $('select[name="service"]', form);
  const selected = service.options[service.selectedIndex];
  const facts = [
    `${text('称呼', 'Name')}：${values.get('name')?.trim()}`,
    `${text('城市', 'City')}：${values.get('city')?.trim()}`,
    `${text('联系方式', 'Contact')}：${values.get('contact')?.trim()}`,
    values.get('email')?.trim() ? `${text('邮箱', 'Email')}：${values.get('email').trim()}` : '',
    `${text('类型', 'Type')}：${selected?.textContent || ''}`,
    `${text('面积', 'Area')}：${values.get('area')?.trim()}`,
    values.get('budget')?.trim() ? `${text('预算', 'Budget')}：${values.get('budget').trim()}` : '',
    values.get('timeline')?.trim() ? `${text('时间', 'Timeline')}：${values.get('timeline').trim()}` : '',
  ].filter(Boolean).join('\n');
  briefText = [
    text('你好，松木设计！我想咨询一个项目。', 'Hello Pinenest! I’d like to discuss a project.'),
    '', facts, '', `${text('我的想法', 'My ideas')}：`, values.get('message')?.trim(),
  ].join('\n');
  $('#brief-output').textContent = briefText;
}
if (form) {
  const serviceParam = new URLSearchParams(location.search).get('service');
  if (['1', '2', '3', '4'].includes(serviceParam)) $('select[name="service"]', form).selectedIndex = Number(serviceParam);
  let submitting = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting) return;
    $$('input:not([type="hidden"]), textarea', form).forEach(input => { input.value = input.value.trim(); });
    if (!form.reportValidity()) return;
    const submitButton = $('.brief-submit', form);
    const submitLabel = $('[data-submit-label]', form);
    const status = $('#form-status');
    submitting = true;
    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitLabel.textContent = text('正在发送…', 'Sending…');
    status.hidden = true;
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
      makeBrief();
      form.hidden = true;
      $('#brief-result').hidden = false;
      $('#brief-result').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    } catch {
      status.dataset.zh = '暂时未能发送，请稍后重试。你填写的内容已保留在当前页面，也可以通过微信联系我们。';
      status.dataset.en = 'Your enquiry could not be sent. Please try again, or contact us on WeChat. Your details are still on this page.';
      status.textContent = status.dataset[language];
      status.hidden = false;
      status.focus({ preventScroll: true });
    } finally {
      submitting = false;
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
      submitLabel.textContent = submitLabel.dataset[language];
    }
  });
  $('.copy-brief')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      $('.copy-status').textContent = text('咨询记录已复制。', 'Your enquiry has been copied.');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents($('#brief-output'));
      selection.removeAllRanges(); selection.addRange(range);
      $('.copy-status').textContent = text('请复制已选中的咨询记录。', 'Copy the selected enquiry text.');
    }
  });
}

// A bfcache restoration may resume at a scrolled position.
window.addEventListener('pageshow', updateHeader);

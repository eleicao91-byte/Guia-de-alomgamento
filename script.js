'use strict';

const config = window.SITE_CONFIG;
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => [...document.querySelectorAll(selector)];
const visitDateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric',
});
let visitDateTimer;
function updateVisitDate() {
  clearTimeout(visitDateTimer);
  const now = new Date();
  const date = visitDateFormat.format(now);
  selectAll('[data-visit-date]').forEach((node) => { node.textContent = date; });
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  visitDateTimer = setTimeout(updateVisitDate, tomorrow.getTime() - now.getTime() + 100);
}
updateVisitDate();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateVisitDate();
});
const isPrice = (value) => Number.isFinite(value) && value > 0;
const prices = { basico: config.PRECO_BASICO, completo: config.PRECO_COMPLETO, downsell: config.PRECO_DOWNSELL };

function readSession(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function writeSession(key, value) {
  try { sessionStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
}

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const inbound = new URLSearchParams(location.search);
const attribution = new URLSearchParams(readSession('guia-utm') || '');
for (const key of utmKeys) {
  if (inbound.has(key)) attribution.set(key, inbound.get(key));
}
writeSession('guia-utm', attribution.toString());

function checkoutURL(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    for (const key of utmKeys) {
      if (attribution.has(key)) url.searchParams.set(key, attribution.get(key));
    }
    return url.href;
  } catch { return null; }
}

const brand = config.NOME_PRODUTO === 'NOME_PRODUTO' ? 'Guia de alongamento' : config.NOME_PRODUTO;
selectAll('[data-brand]').forEach((node) => { node.textContent = brand; });
selectAll('[data-bonus-price]').forEach((node) => {
  const value = config.BONUS_PRECOS_REFERENCIA[Number(node.dataset.bonusPrice) - 1];
  node.textContent = money.format(value);
});
selectAll('[data-plan-count]').forEach((node) => {
  node.textContent = node.dataset.planCount === 'basico' ? config.QTD_ROTINAS_BASICO : config.QTD_ROTINAS;
});
selectAll('[data-routine-count]').forEach((node) => { node.textContent = config.QTD_ROTINAS; });
selectAll('[data-days]').forEach((node) => { node.textContent = config.DIAS_GARANTIA; });
selectAll('[data-plan-reference]').forEach((node) => {
  node.textContent = money.format(config.PRECOS_REFERENCIA_PLANOS[node.dataset.planReference]);
});
selectAll('[data-price]').forEach((node) => {
  const price = prices[node.dataset.price];
  node.textContent = isPrice(price) ? money.format(price) : 'Preço indisponível';
});
if (isPrice(config.PRECO_DE_REFERENCIA) && config.PRECO_DE_REFERENCIA > prices.completo) {
  const reference = select('.offer-complete [data-reference]');
  reference.textContent = 'De ' + money.format(config.PRECO_DE_REFERENCIA);
  reference.hidden = false;
}

function track(event, payload) {
  if (typeof window.fbq === 'function') window.fbq('track', event, payload);
}

// Meta Pixel opcional. Defina PIXEL_ID em config.js para carregar o script oficial.
if (/^\d+$/.test(config.PIXEL_ID)) {
  const queue = function (...args) {
    if (queue.callMethod) queue.callMethod.apply(queue, args);
    else queue.queue.push(args);
  };
  queue.queue = [];
  queue.push = queue;
  queue.loaded = true;
  queue.version = '2.0';
  window.fbq = queue;
  window._fbq = queue;
  const pixel = document.createElement('script');
  pixel.async = true;
  pixel.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.append(pixel);
  window.fbq('init', config.PIXEL_ID);
  track('PageView');
  track('ViewContent', { content_name: brand });
}

for (const link of selectAll('[data-checkout]')) {
  const plan = link.dataset.checkout;
  const url = checkoutURL(config['CHECKOUT_URL_' + plan.toUpperCase()]);
  if (!url || !isPrice(prices[plan])) {
    link.setAttribute('role', 'link');
    link.setAttribute('aria-disabled', 'true');
    continue;
  }
  link.href = url;
  link.addEventListener('click', () => track('InitiateCheckout', {
    plan, content_name: plan === 'completo' ? 'Guia + 3 bônus' : 'Guia de alongamento', currency: 'BRL', value: prices[plan],
  }));
}
for (const link of selectAll('[data-plan-cta]')) {
  link.addEventListener('click', () => {

    select('#plan-title').focus({ preventScroll: true });
  });
}

const routines = [
  ['Pausa de 2 minutos na cadeira', 'Uma sequência curta para fazer sentado.', 'Pessoa alonga um braço na cadeira.', 'M110 76 82 67 65 38m49 38 23-25 3-22', true],
  ['Rotina para quem trabalha em pé', 'Uma sequência para fazer ao lado do posto de trabalho.', 'Pessoa em pé com os dois braços erguidos.', 'M110 77 86 50 81 29m35 47 25-24 4-23'],
  ['Soltar a lombar e o quadril', 'Movimentos com apoio da cadeira.', 'Pessoa sentada gira o tronco com apoio.', 'M110 75 94 90 74 91m41-14 13 22 20 7', true],
  ['Pescoço e ombros do escritório', 'Movimentos com os pés apoiados no chão.', 'Pessoa sentada apoia uma mão perto da cabeça.', 'M110 75 90 61 105 41m11 36 14 25 16 3', true],
  ['Pernas e pés depois de um dia em pé', 'Uma pausa em pé com apoio próximo.', 'Pessoa em pé estende uma perna.', 'M110 77 82 83 67 70m50 8 19 18 15-2', false, 'M111 112 100 139 89 159m26-47 29 22 17 20'],
  ['Mãos e punhos do teclado', 'Uma sequência breve longe das teclas.', 'Pessoa sentada estende as mãos à frente.', 'M110 76 88 84 65 78m51 0-22 20-27-1', true],
  ['Alongamento ao acordar', 'Movimentos para o início do dia.', 'Pessoa se alonga com os braços acima da cabeça.', 'M109 75 86 49 104 27m11 48 23-26-21-22'],
  ['Rotina antes de dormir', 'Uma pausa curta para o fim do dia.', 'Pessoa sentada se inclina com um braço levantado.', 'M110 76 86 59 82 36m32 40 20 18 10 7', true],
];
const colors = ['mint', 'peach', 'cream'];

function scene(routine, index) {
  const [, , alt, arms, seated, customLegs] = routine;
  const legs = customLegs || (seated ? 'M111 112 87 126 81 156m32-42 17 19-7 23' : 'M111 112 101 138 93 157m22-45 13 26 11 19');
  const skin = index % 2 ? 'var(--skin-dark)' : 'var(--skin)';
  return `<svg viewBox="0 0 220 175" role="img" aria-label="${alt}">
    <rect width="220" height="175" fill="var(--${colors[index % colors.length]})"/>
    <circle cx="111" cy="87" r="57" fill="var(--white)" opacity=".62"/>
    <path d="M24 159h169" stroke="var(--teal)" opacity=".22" stroke-width="3"/>
    ${seated ? '<path d="M94 119h42V80m0 39v36m-38-35v35" fill="none" stroke="var(--aqua)" stroke-width="8" stroke-linecap="round"/>' : '<path d="M151 159h31" stroke="var(--aqua)" stroke-width="8" stroke-linecap="round"/>'}
    <path d="${legs}" fill="none" stroke="var(--teal)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${arms}" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M106 70q10-4 16 6l3 41H99l1-33q0-10 6-14" fill="var(--coral)"/>
    <circle cx="111" cy="57" r="14" fill="${skin}"/><path d="M97 55q-1-17 15-16 12 0 14 14-11 1-17-6-5 7-12 8" fill="var(--deep)"/>
    <path d="M38 52v14m-7-7h14m127 19v10m-5-5h10" stroke="var(--teal)" stroke-width="2.5" opacity=".5" stroke-linecap="round"/>
  </svg>`;
}

const icons = {
  chair: 'M8 6v12h16m-14 0v9m12-9v9M8 12h13v6',
  shoe: 'M5 23v-5l8-3 4-8 4 2 1 6 5 3v5zM5 23h22',
  back: 'M16 4c-6 5 5 7 0 12s-3 8 0 12m-8-9 3 3m13-3-3 3',
  neck: 'M12 4a6 6 0 0 0 0 12v5l-7 6m15-23a6 6 0 0 1 0 12v5l7 6',
  clock: 'M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 6v6l4 3',
  moon: 'M21 23A10 10 0 0 1 10 9a11 11 0 1 0 13 14ZM24 5v7m-3-3h6',
  bus: 'M6 24V9q0-3 3-3h14q3 0 3 3v15zM6 15h20M9 24v4m14-4v4M10 19h2m8 0h2',
  phone: 'M9 4h14v24H9zM15 24h2',
  laptop: 'M6 8h20v13H6zM6 21l-3 5h26l-3-5',
  printer: 'M9 12V5h14v7m-15 8H5v-8h22v8h-3M9 18h14v9H9z',
  bolt: 'M18 3 7 18h8l-1 11 11-16h-8z',
  calendar: 'M6 8h20v18H6zM6 13h20M11 5v6m10-6v6m-9 8h8',
  checklist: 'M8 5h16v22H8zM11 13l2 2 3-4m2 3h3m-10 7 2 2 3-4m2 3h3',
  poster: 'M8 4h16v24H8zM12 10h8m-8 5h8m-8 5h5',
};
function icon(key) {
  return `<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><path d="${icons[key]}"/></svg>`;
}
function tile(key, label, background) {
  return `<svg viewBox="0 0 200 110" role="img" aria-label="${label}"><rect width="200" height="110" rx="14" fill="var(--${background})"/><circle cx="100" cy="55" r="38" fill="var(--white)"/><path d="${icons[key]}" transform="translate(72 27) scale(1.75)" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

select('#rotinas').innerHTML = routines.map((routine, index) =>
  `<article class="card"><div data-img="rotina-${index + 1}">${scene(routine, index)}</div><div class="copy"><h3>${routine[0]}</h3><p>${routine[1]}</p></div></article>`
).join('');
const remaining = Math.max(0, config.QTD_ROTINAS - routines.length);
if (remaining) {
  const last = document.createElement('article');
  last.className = 'card';
  last.innerHTML = '<div data-img="outras-rotinas"></div>' + '<div class="copy"><h3></h3><p>Diferentes tipos de alongamento para fazer.</p></div>';
  last.querySelector('h3').textContent = '+ ' + remaining + ' outras rotinas';
  select('#rotinas').append(last);
}
function renderFeedback() {
  const valid = (item) => typeof item?.nome === 'string' && item.nome.trim()
    && typeof item?.texto === 'string' && item.texto.trim();
  const testimonials = config.DEPOIMENTOS.filter(valid);
  const reviews = config.AVALIACOES.filter((item) => valid(item) && Number.isInteger(item.nota) && item.nota >= 1 && item.nota <= 5);
  function render(items, container) {
    for (const { nome, texto, nota } of items) {
      const card = document.createElement('article');
      card.className = 'card';
      const copy = document.createElement('div');
      copy.className = 'copy';
      const title = document.createElement('h3');
      title.textContent = nome;
      const quote = document.createElement('p');
      quote.textContent = texto;
      copy.append(title, quote);
      if (nota) {
        const score = document.createElement('p');
        score.textContent = nota + ' de 5';
        copy.append(score);
      }
      card.append(copy);
      container.append(card);
    }
  }
  if (testimonials.length) {
    select('#depoimentos .rail').replaceChildren();
    render(testimonials, select('#depoimentos .rail'));
    select('#depoimentos').hidden = false;
  }
  if (reviews.length) {
    select('#reviews').replaceChildren();
    select('#review-intro').textContent = 'Veja os relatos de quem adquiriu o guia.';
    select('#rating').hidden = false;
    render(reviews, select('#reviews'));
    const average = reviews.reduce((sum, item) => sum + item.nota, 0) / reviews.length;
    select('#rating').textContent = average.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' de 5';
    select('#avaliacoes').hidden = false;
  }
}
renderFeedback();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
function advance(rail, direction) {
  const card = rail.firstElementChild;
  if (!card) return;
  const gap = parseFloat(getComputedStyle(rail).columnGap);
  rail.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
}
selectAll('[data-step]').forEach((button) => button.addEventListener('click', () => {
  const rail = document.getElementById(button.getAttribute('aria-controls') || 'rotinas');
  if (rail) advance(rail, Number(button.dataset.step));
}));
for (const rail of selectAll('.rail')) {
  let drag = null;
  rail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    advance(rail, event.key === 'ArrowLeft' ? -1 : 1);
  });
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, scroll: rail.scrollLeft };
    rail.classList.add('dragging');
    rail.setPointerCapture(event.pointerId);
  });
  rail.addEventListener('pointermove', (event) => {
    if (drag) rail.scrollLeft = drag.scroll + drag.x - event.clientX;
  });
  rail.addEventListener('lostpointercapture', () => {
    drag = null;
    rail.classList.remove('dragging');
  });
}

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('arrive');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .08 });
  selectAll('main section:not(.hero) .wrap').forEach((node) => reveal.observe(node));
}

const touchDevice = matchMedia('(hover: none) and (pointer: coarse)');
const offer = select('#exit-offer');
if (config.SHOW_EXIT_OFFER && offer.querySelector('a[href]') && !readSession('guia-oferta-vista')) {
  let shown = false;
  let idle;
  function showOffer() {
    if (shown || document.hidden) return;
    shown = true;
    clearTimeout(idle);
    offer.showModal();
    writeSession('guia-oferta-vista', '1');
  }
  function resetIdle() {
    clearTimeout(idle);
    if (touchDevice.matches && !shown && !document.hidden) idle = setTimeout(showOffer, 60000);
  }
  document.addEventListener('mouseout', (event) => {
    if (!touchDevice.matches && !event.relatedTarget && event.clientY <= 0) showOffer();
  });
  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'touchmove', 'visibilitychange'].forEach((event) =>
    document.addEventListener(event, resetIdle, { passive: true }));
  resetIdle();
}















import { SINIFLAR, URUNLER, DERSLER, ALANLAR, KODLAMA_NOTU } from './data.js';

const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const RENK = { maarif: '#3A38B0', aila: '#0E8A9A' };
const TUR_AD = { maarif: 'Maarif grubu', aila: 'AI-LA gruplaması' };

const urunVar = (id, s) => { const [a, b] = URUNLER[id].siniflar; return s >= a && s <= b; };
const dersAdi = (d, s) => (typeof d.ad === 'function' ? d.ad(s) : d.ad);

// Radar düzeni: Alan Becerileri en üstte, saat yönünde diğerleri
const ALAN_BECERI = { id: 'alan', ad: 'Alan Becerileri', maarif: true };
const EKSENLER = [ALAN_BECERI, ...ALANLAR];
const KISA = { alan: 'Alan Becerileri', kavramsal: 'Kavramsal', egilim: 'Eğilimler', sdb: 'Sosyal-Duygusal', okuryazarlik: 'Okuryazarlık', deger: 'Değerler' };
const MERKEZ = [300, 300], YARICAP = 230;
const nokta = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / EKSENLER.length; return [MERKEZ[0] + r * Math.cos(a), MERKEZ[1] + r * Math.sin(a)]; };

let sinif = 2, secili = 'alan';

// Kapsam: o sınıfta alana veri gönderen farklı platform sayısı (en çok 7)
function kapsam(id) {
  const k = new Set();
  if (id === 'alan') DERSLER.filter(d => d.siniflar.includes(sinif)).forEach(d => d.kaynak.forEach(u => urunVar(u, sinif) && k.add(u)));
  else ALANLAR.find(a => a.id === id).kalemler.forEach(x => x.kaynak.forEach(u => urunVar(u, sinif) && k.add(u)));
  return k.size;
}

function el(ad, ozel = {}, ebeveyn) {
  const e = document.createElementNS(NS, ad);
  for (const [k, v] of Object.entries(ozel)) e.setAttribute(k, v);
  if (ebeveyn) ebeveyn.appendChild(e);
  return e;
}

function radarKur() {
  const svg = $('#radar');
  if (innerWidth < 560) svg.setAttribute('viewBox', '-190 -30 980 660');
  [0.25, 0.5, 0.75, 1].forEach(o => el('polygon', { class: 'ag', points: EKSENLER.map((_, i) => nokta(i, YARICAP * o).join(',')).join(' ') }, svg));
  EKSENLER.forEach((_, i) => { const [x, y] = nokta(i, YARICAP); el('line', { class: 'eksen', x1: MERKEZ[0], y1: MERKEZ[1], x2: x, y2: y }, svg); });
  el('polygon', { class: 'kapsam', id: 'kapsamAlan' }, svg);
  EKSENLER.forEach((a, i) => el('circle', { class: 'nokta', id: 'n-' + a.id, r: 6, fill: RENK[a.maarif ? 'maarif' : 'aila'] }, svg));

  EKSENLER.forEach((a, i) => {
    const renk = RENK[a.maarif ? 'maarif' : 'aila'];
    const [x, y] = nokta(i, YARICAP);
    const g = el('g', { class: 'dugum', tabindex: 0, role: 'button', 'data-id': a.id, 'aria-label': a.ad }, svg);
    el('circle', { class: 'halka', cx: x, cy: y, r: 26, stroke: renk }, g);
    const sayi = el('text', { class: 'sayi', x, y: y + 5, 'text-anchor': 'middle', fill: renk }, g);
    sayi.id = 's-' + a.id;
    // etiket: dışarı doğru
    const [lx, ly] = nokta(i, YARICAP + (innerWidth < 560 ? 62 : 48));
    const yon = Math.abs(lx - MERKEZ[0]) < 10 ? 'middle' : lx > MERKEZ[0] ? 'start' : 'end';
    const ex = yon === 'middle' ? lx : lx + (yon === 'start' ? -14 : 14);
    const t = el('text', { x: ex, y: ly + 5, 'text-anchor': yon }, g);
    t.textContent = KISA[a.id];
    const sec = () => { secili = a.id; ciz(); };
    g.addEventListener('click', sec);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sec(); } });
  });
}

const cipler = (kaynak) => {
  const k = kaynak.filter(u => urunVar(u, sinif));
  return k.length
    ? `<div class="urunler">${k.map(u => `<span class="urun"><i style="background:${URUNLER[u].renk}"></i>${URUNLER[u].ad}</span>`).join('')}</div>`
    : '<span class="yok">Veri kaynağı yok</span>';
};

function panel() {
  const a = EKSENLER.find(x => x.id === secili);
  const tur = a.maarif ? 'maarif' : 'aila';
  $('#panelBaslik').textContent = a.ad;
  const t = $('#panelTur'); t.textContent = TUR_AD[tur]; t.style.background = RENK[tur];
  const kodStil = `background:${tur === 'maarif' ? 'var(--maarif-a)' : 'var(--aila-a)'};color:${RENK[tur]}`;

  if (a.id === 'alan') {
    const dersler = DERSLER.filter(d => d.siniflar.includes(sinif))
      .sort((x, y) => (y.kaynak.some(u => urunVar(u, sinif)) ? 1 : 0) - (x.kaynak.some(u => urunVar(u, sinif)) ? 1 : 0));
    $('#liste').innerHTML = dersler.map((d, i) => {
      const bos = !d.kaynak.some(u => urunVar(u, sinif));
      return `<div class="satir${bos ? ' bos' : ''}" style="animation-delay:${i * 25}ms">
        <div class="satir-ust"><b>${dersAdi(d, sinif)}</b>${d.beceriler ? `<span class="alt">${d.beceriler.map(b => b[1]).join(' · ')}</span>` : ''}</div>
        ${cipler(d.kaynak)}</div>`;
    }).join('') + (dersler.some(d => d.id === 'bilisim') ? '' : `<div class="satir bos"><span class="alt">${KODLAMA_NOTU}</span></div>`);
  } else {
    $('#liste').innerHTML = ALANLAR.find(x => x.id === a.id).kalemler.map((k, i) => `
      <div class="satir" style="animation-delay:${i * 40}ms" title="${k.ornek}">
        <div class="satir-ust"><b>${k.ad}</b><span class="kod" style="${kodStil}">${k.kod}</span></div>
        <div class="alt" style="margin:-2px 0 7px">${k.ornek}</div>
        ${cipler(k.kaynak)}</div>`).join('');
  }
}

function ciz() {
  $('#siniflar').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.s) === sinif)));
  const maks = Object.keys(URUNLER).length;
  const pts = EKSENLER.map((a, i) => nokta(i, YARICAP * Math.max(.12, kapsam(a.id) / maks)));
  $('#kapsamAlan').setAttribute('points', pts.map(p => p.join(',')).join(' '));
  EKSENLER.forEach((a, i) => {
    $('#n-' + a.id).setAttribute('cx', pts[i][0]); $('#n-' + a.id).setAttribute('cy', pts[i][1]);
    $('#s-' + a.id).textContent = kapsam(a.id);
    const g = document.querySelector(`.dugum[data-id="${a.id}"]`);
    const ok = a.id === secili, renk = RENK[a.maarif ? 'maarif' : 'aila'];
    g.classList.toggle('secili', ok);
    g.querySelector('.halka').style.fill = ok ? renk : '#fff';
    g.setAttribute('aria-pressed', String(ok));
  });
  panel();
  const url = new URL(location.href); url.searchParams.set('sinif', sinif); history.replaceState(null, '', url);
}

$('#siniflar').insertAdjacentHTML('beforeend', SINIFLAR.map(s => `<button type="button" data-s="${s}" aria-label="${s}. sınıf">${s}</button>`).join(''));
$('#siniflar').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sinif = Number(b.dataset.s); ciz(); } });

const q = Number(new URLSearchParams(location.search).get('sinif'));
if (SINIFLAR.includes(q)) sinif = q;
radarKur();
ciz();

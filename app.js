import { SINIFLAR, URUNLER, DERSLER, ALANLAR, KODLAMA_NOTU } from './data.js';

const $ = s => document.querySelector(s);

const urunVar = (id, sinif) => { const [a, b] = URUNLER[id].siniflar; return sinif >= a && sinif <= b; };
const dersAdi = (d, sinif) => (typeof d.ad === 'function' ? d.ad(sinif) : d.ad);

function urunCipleri(kaynak, sinif) {
  const k = kaynak.filter(id => urunVar(id, sinif));
  if (!k.length) return '<span class="yok">Ekosistemde veri kaynağı yok</span>';
  return `<div class="urunler">${k.map(id => `<span class="urun"><i style="background:${URUNLER[id].renk}"></i>${URUNLER[id].ad}</span>`).join('')}</div>`;
}

function ciz(sinif) {
  $('#siniflar').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.s) === sinif)));

  const dersler = DERSLER.filter(d => d.siniflar.includes(sinif));
  const veriliDers = dersler.filter(d => d.kaynak.some(id => urunVar(id, sinif)));
  const urunSayisi = Object.keys(URUNLER).filter(id => urunVar(id, sinif)).length;
  const bilisimVar = dersler.some(d => d.id === 'bilisim');

  $('#ozet').innerHTML = `<b>${sinif}. sınıf:</b> ${dersler.length} ders, ${veriliDers.length} tanesine ekosistemden veri geliyor · 6 alan · ${urunSayisi} ürün`;

  const alanKart = `
    <article class="alan genis">
      <div class="alan-ust"><h2>Alan Becerileri</h2><span class="rozet maarif">Derse özgü · sınıfa göre değişir</span></div>
      <div class="dersler">${dersler.map(d => {
        const bos = !d.kaynak.some(id => urunVar(id, sinif));
        return `<div class="ders${bos ? ' bos' : ''}">
          <b>${dersAdi(d, sinif)}</b>
          ${d.beceriler ? `<div class="tab">${d.beceriler.map(([k, a]) => `<span title="${k}">${a}</span>`).join('')}</div>` : ''}
          ${urunCipleri(d.kaynak, sinif)}
        </div>`;
      }).join('')}</div>
      ${bilisimVar ? '' : `<p class="not">${KODLAMA_NOTU}</p>`}
    </article>`;

  const digerleri = ALANLAR.map(a => `
    <article class="alan">
      <div class="alan-ust"><h2>${a.ad}</h2><span class="rozet ${a.maarif ? 'maarif' : 'aila'}">${a.maarif ? 'Maarif grupları' : 'AI-LA gruplaması'}</span></div>
      ${a.kalemler.map(k => `
        <div class="kalem">
          <div class="kalem-ust"><b>${k.ad}</b><span class="kod">${k.kod}</span></div>
          <p>${k.ornek}</p>
          ${urunCipleri(k.kaynak, sinif)}
        </div>`).join('')}
    </article>`).join('');

  $('#izgara').innerHTML = alanKart + digerleri;

  const url = new URL(location.href); url.searchParams.set('sinif', sinif);
  history.replaceState(null, '', url);
  try { localStorage.setItem('aila_kapsam_sinif', sinif); } catch (e) {}
}

$('#siniflar').innerHTML = SINIFLAR.map(s => `<button type="button" data-s="${s}" aria-pressed="false" aria-label="${s}. sınıf">${s}</button>`).join('');
$('#siniflar').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ciz(Number(b.dataset.s)); });

let ilk = Number(new URLSearchParams(location.search).get('sinif'));
if (!SINIFLAR.includes(ilk)) { try { ilk = Number(localStorage.getItem('aila_kapsam_sinif')); } catch (e) {} }
ciz(SINIFLAR.includes(ilk) ? ilk : 2);

// AI-LA beceri haritası kapsamı: Türkiye Yüzyılı Maarif Modeli (MEB) bileşenleri.
// Gerçek öğrenci verisi yoktur; yalnızca hangi ürünün hangi beceri kalemine veri gönderdiği gösterilir.
// Veri her zaman Maarif koduyla saklanır (ör. "maarif:KB2.10"); buradaki gruplar yalnızca görünümdür.

export const SINIFLAR = [1, 2, 3, 4, 5, 6, 7, 8];

// Ekosistem ürünleri ve hizmet verdikleri sınıflar
export const URUNLER = {
  okumino:  { ad: 'Okumino',   renk: '#E86A1C', siniflar: [1, 8] },
  readmino: { ad: 'Readmino',  renk: '#1F9D6B', siniflar: [2, 8] },
  bilgin:   { ad: 'Bilgin',    renk: '#D98A00', siniflar: [1, 8] },
  codemino: { ad: 'Codemino',  renk: '#2F86E0', siniflar: [1, 8] },
  aig:      { ad: 'AI-GALAXY', renk: '#B4489A', siniflar: [1, 8] },
  t14:      { ad: 'TALENT14',  renk: '#3A38B0', siniflar: [1, 8] },
  tc:       { ad: 'TALENT CUP', renk: '#5B5A86', siniflar: [1, 8] },
};

const ARALIK = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Alan becerileri derse özgüdür: öğrencinin sınıfında okutulan dersler gösterilir.
// Ders listesi MEB haftalık ders çizelgesinden sadeleştirilmiştir.
export const DERSLER = [
  { id: 'turkce', ad: 'Türkçe', siniflar: ARALIK(1, 8), kaynak: ['okumino', 'bilgin'],
    beceriler: [['TAB1', 'Dinleme/İzleme'], ['TAB2', 'Okuma'], ['TAB3', 'Konuşma'], ['TAB4', 'Yazma']] },
  { id: 'ingilizce', ad: 'İngilizce', siniflar: ARALIK(2, 8), kaynak: ['readmino'] },
  { id: 'matematik', ad: 'Matematik', siniflar: ARALIK(1, 8), kaynak: ['bilgin'] },
  { id: 'hayat', ad: 'Hayat Bilgisi', siniflar: ARALIK(1, 3), kaynak: ['bilgin', 't14'] },
  { id: 'fen', ad: 'Fen Bilimleri', siniflar: ARALIK(3, 8), kaynak: ['bilgin', 't14'] },
  { id: 'sosyal', ad: 'Sosyal Bilgiler', siniflar: ARALIK(4, 7), kaynak: ['bilgin'] },
  { id: 'inkilap', ad: 'T.C. İnkılap Tarihi ve Atatürkçülük', siniflar: [8], kaynak: [] },
  { id: 'bilisim', ad: 'Bilişim Teknolojileri ve Yazılım', siniflar: [5, 6], kaynak: ['codemino', 't14', 'tc'] },
  { id: 'teknoloji', ad: 'Teknoloji ve Tasarım', siniflar: [7, 8], kaynak: ['t14', 'tc'] },
  { id: 'gorsel', ad: 'Görsel Sanatlar', siniflar: ARALIK(1, 8), kaynak: ['aig'] },
  { id: 'din', ad: 'Din Kültürü ve Ahlak Bilgisi', siniflar: ARALIK(4, 8), kaynak: [] },
  { id: 'muzik', ad: 'Müzik', siniflar: ARALIK(1, 8), kaynak: [] },
  { id: 'beden', ad: s => (s <= 4 ? 'Beden Eğitimi ve Oyun' : 'Beden Eğitimi ve Spor'), siniflar: ARALIK(1, 8), kaynak: [] },
];

// Bilişim dersi olmayan sınıflarda kodlama verisinin gittiği yer
export const KODLAMA_NOTU = 'Bu sınıfta Bilişim dersi yok: Codemino ve TALENT14 kodlama verisi Kavramsal Beceriler ile Dijital Okuryazarlığa (OB2) gider.';

// Diğer beş alan: sınıftan bağımsız, her biri 3 alt kalem.
// maarif: true  -> alt gruplar Maarif'in kendi gruplarıdır
// maarif: false -> AI-LA gruplaması (MEB bu alanı 3'e ayırmaz; altında yine Maarif kodu saklanır)
export const ALANLAR = [
  { id: 'kavramsal', ad: 'Kavramsal Beceriler', maarif: true, kalemler: [
    { ad: 'Temel beceriler', kod: 'KB1', ornek: 'Saymak-okumak, bulmak-seçmek, belirlemek-işaret etmek', kaynak: ['okumino', 'bilgin', 'codemino'] },
    { ad: 'Bütünleşik beceriler', kod: 'KB2', ornek: 'Çıkarım, tahmin, karşılaştırma, sınıflandırma, özetleme', kaynak: ['okumino', 'bilgin', 't14'] },
    { ad: 'Üst düzey düşünme', kod: 'KB3', ornek: 'Karar verme, problem çözme', kaynak: ['codemino', 't14', 'tc'] },
  ]},
  { id: 'egilim', ad: 'Eğilimler', maarif: true, kalemler: [
    { ad: 'Benlik eğilimleri', kod: 'E1', ornek: 'Merak, bağımsızlık, öz güven', kaynak: ['okumino', 'aig'] },
    { ad: 'Sosyal eğilimler', kod: 'E2', ornek: 'İş birliği, sorumluluk', kaynak: ['tc', 't14'] },
    { ad: 'Entelektüel eğilimler', kod: 'E3', ornek: 'Muhakeme, odaklanma, yaratıcılık', kaynak: ['okumino', 'codemino', 'aig'] },
  ]},
  { id: 'sdb', ad: 'Sosyal-Duygusal Öğrenme', maarif: true, kalemler: [
    { ad: 'Benlik', kod: 'SDB1', ornek: 'Kendini tanıma, kendini düzenleme', kaynak: ['okumino'] },
    { ad: 'Sosyal yaşam', kod: 'SDB2', ornek: 'İletişim, iş birliği', kaynak: ['tc', 'okumino'] },
    { ad: 'Ortak / uyum', kod: 'SDB3', ornek: 'Uyum, esneklik', kaynak: ['tc'] },
  ]},
  { id: 'okuryazarlik', ad: 'Okuryazarlık Becerileri', maarif: false, kalemler: [
    { ad: 'Bilgi ve veri', kod: 'OB1 · OB7', ornek: 'Bilgi okuryazarlığı, veri okuryazarlığı', kaynak: ['okumino', 'bilgin', 't14'] },
    { ad: 'Dijital, görsel ve sanat', kod: 'OB2 · OB4 · OB9', ornek: 'Dijital, görsel, sanat okuryazarlığı', kaynak: ['aig', 't14', 'codemino'] },
    { ad: 'Yaşam ve toplum', kod: 'OB3 · OB5 · OB6 · OB8', ornek: 'Finansal, kültür, vatandaşlık, sürdürülebilirlik', kaynak: ['bilgin', 'okumino'] },
  ]},
  { id: 'deger', ad: 'Değerler', maarif: false, kalemler: [
    { ad: 'Kendine', kod: 'D16 …', ornek: 'Sorumluluk, çalışkanlık, sabır', kaynak: ['okumino', 'tc'] },
    { ad: 'Başkalarına', kod: 'D14 …', ornek: 'Saygı, sevgi, dostluk, yardımseverlik', kaynak: ['okumino', 'tc'] },
    { ad: 'Topluma ve dünyaya', kod: 'D7 …', ornek: 'Estetik, duyarlılık, vatanseverlik', kaynak: ['okumino', 'aig'] },
  ]},
];

# Zirve Fotoğrafçılık — Tasarım Rehberi

Referans görselden (koyu, sıcak amber ışıklı, yay dizilimli fotoğraf kartları) çıkarılan
tasarım dili ve bu projede nasıl uygulandığı.

## 1. Atmosfer
| Katman | Uygulama |
|---|---|
| Zemin | `#0A0807` (koyu) / `#F2ECE3` (aydınlık) — sıcak, nötr olmayan siyah ve kâğıt tonu |
| Amber çekirdek | Sol üstten radial `rgba(255,122,20,.55)`, sağ üstten ikincil odak |
| WebGL katmanı | Özel fragment shader: fbm gürültü + sıcak çekirdek + prizmatik sızıntı, `mix-blend-mode: screen` |
| Işık sızıntısı (light leak) | 107° diagonal spektral bant (mor→camgöbeği→yeşil→sarı→kırmızı), 34px blur, 26sn yavaş sürüklenme |
| Film grain | SVG `feTurbulence` (baseFrequency .82, 4 oktav), %42 opaklık, 720ms 4 kareli titreşim |
| Vinyet | Merkezden kenara `rgba(0,0,0,.55)` |

## 2. Renk paleti
```
--bg-0   #0A0807   zemin
--bg-2   #151110   yüzey
--ink    #F7F1E8   krem beyaz (referanstaki sıcak beyaz)
--muted  #A2988C   ikincil metin
--amber  #FF8A2B   birincil aksan
--amber-2#E4590B   aksan gradyan bitişi
--ember  #B23C05   şerit/derinlik
--line   rgba(245,235,220,.12)
```
Aydınlık tema aynı token isimleriyle yeniden tanımlanır; hiçbir bileşen sabit renk kullanmaz.

## 3. Tipografi
- **Outfit** (200–600) — referanstaki geometrik sans karakter.
- Display: `clamp(2.6rem, 6.2vw, 5.1rem)`, ağırlık 400, `letter-spacing:-.03em`, satır yüksekliği 1.06.
- Gövde: 0.94–1.02rem, satır yüksekliği 1.62.
- Eyebrow: 0.68rem, `letter-spacing:.26em`, uppercase, amber.
- Vurgu: aynı ailenin 200 ağırlıklı italiği (`.serifish`) — başlıklarda tek kelimeyi ayırmak için.

## 4. Geometri
- Kart yarıçapı: genişliğin **%13’ü** (maks. 30px) — referanstaki yumuşak köşe oranı.
- Bölüm yarıçapları: 16 / 22 / 28 / 36 / 44px kademeli.
- Butonlar tam pill (`999px`), 1px kenarlık, 15px/34px iç boşluk.
- Hero yay: elips üzerinde 13 kart, `rx = .425W`, `ry = .52H`, açı yayılımı **260°**,
  kart dönüşü `açı × 0.4`, merkeze doğru `1 − |açı|/900` ölçek düşüşü.

## 5. Hareket
- Easing: `cubic-bezier(.16,1,.3,1)` (giriş), `cubic-bezier(.65,.05,.36,1)` (perde).
- Hero kartları sırayla 55ms gecikmeyle yaydan açılır (`arcIn`).
- Fare paralaksı: her kartın derinliğine göre 26px yatay / 18px dikey sapma + kaydırma derinliği.
- Başlıklar satır satır maskeden yükselir (`.split`).
- Sayfa geçişi: tam ekran perde yukarı kayar (850ms).
- Mıknatıs butonlar, özel imleç (`mix-blend-mode: difference`), 3B eğim (`data-tilt`).
- `prefers-reduced-motion` tüm animasyonları kapatır.

## 6. Bileşen dili
- **Kart**: 3/3.9 oran, alt gradyan, hoverda 8px yükselme + 1.09 görsel zoom + sağ üstte ok rozeti.
- **Bento**: 12 kolonluk ızgara, 7 farklı span kombinasyonu.
- **Şerit (marquee)**: kenarlarda maske, hoverda durur.
- **Akordeon**: yükseklik animasyonlu, açık başlıkta amber daire ikon.
- **Rezervasyon**: panel → adım numarası → tamamlandığında amber dolgu.

## 7. Erişilebilirlik
- Tüm etkileşimli öğelerde `:focus-visible` amber çerçeve.
- `aria-expanded`, `aria-label`, semantik başlık hiyerarşisi.
- Kontrast: gövde metni koyu temada 7.4:1, aydınlık temada 12:1.

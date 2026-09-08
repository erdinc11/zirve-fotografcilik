# Zirve Fotoğrafçılık — Web Sitesi

Ankara / Cebeci merkezli fotoğraf stüdyosu için hazırlanmış çok sayfalı statik web sitesi.

## Çalıştırma
Herhangi bir derleme adımı yoktur. `index.html` dosyasını doğrudan tarayıcıda açabilirsiniz.
Yerel sunucu tercih ederseniz:

```bash
python3 -m http.server 8080
```

## Sayfalar
| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa — hero yay, tanıtım, hizmetler, vitrin, bento galeri, istatistik, yorumlar, SSS |
| `hizmetler.html` | 27 hizmetin kategori filtreli listesi |
| `hizmet.html?h=<slug>` | Hizmet detayı — kapsam, süre, fiyat, örnek kareler, ilgili hizmetler |
| `galeri.html` | Kategori filtreli masonry galeri + lightbox + kademeli yükleme |
| `bizi-taniyin.html` | Stüdyo hikâyesi, süreç, ekip, mekân |
| `blog.html` / `blog-yazi.html?y=<slug>` | Blog listesi ve yazı detayı |
| `iletisim.html` | İletişim kartları, form, harita, SSS |
| `rezervasyon.html` | Takvim (aylık/yıllık), saat, paket, ek hizmet, konum, ödeme, canlı özet |
| `mesafeli-satis-sozlesmesi.html`, `kullanim-sartlari.html`, `iptal-ve-iade.html`, `kvkk.html` | Yasal metinler |

## Yapı
```
assets/
  css/style.css      tüm tasarım sistemi (token → bileşen → responsive)
  js/data.js         hizmet, galeri, blog, SSS, yorum verileri
  js/site.js         tema, menü, animasyon, lightbox, hero yay, WebGL atmosfer
  js/pages.js        sayfa bazlı içerik üretimi + rezervasyon mantığı
  img/photos/        146 fotoğraf (telifsiz, Pexels)
DESIGN.md            referans görselden çıkarılan tasarım rehberi
```

## İçerik güncelleme
Hizmetler, galeri kategorileri, blog yazıları, SSS ve yorumlar tamamen
`assets/js/data.js` içinden yönetilir; HTML’e dokunmadan içerik ekleyip çıkarabilirsiniz.
Rezervasyon paketleri ve fiyatları `assets/js/pages.js` içindeki `PACKS`, `ADDONS`,
`LOCS` ve `PAYS` dizilerindedir.

## Tema
Karanlık tema varsayılandır. Başlıktaki anahtar ile aydınlık temaya geçilir,
tercih `localStorage` içinde saklanır.

## Notlar
- Fotoğraflar demo amaçlıdır (Pexels, ücretsiz kullanım lisansı). Yayına almadan önce
  stüdyonun kendi arşiviyle değiştirilmelidir.
- Formlar ve rezervasyon akışı ön yüzde çalışır; sunucu tarafı entegrasyonu bekler.

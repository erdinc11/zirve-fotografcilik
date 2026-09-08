/* ZİRVE FOTOĞRAFÇILIK — sayfa mantığı */
(() => {
  'use strict';
  const { $, $$, IMGP, money, qs } = window.Zirve;
  const page = document.body.dataset.page;
  const AR = '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  /* ---------- ORTAK PARÇALAR ---------- */
  const svcCard = (s, i) => `
    <a class="card" href="hizmet.html?h=${s.s}" data-rv data-rv-d="${(i % 4) + 1}">
      <img src="${IMGP}${s.img}" alt="${s.t}" loading="lazy" decoding="async">
      <span class="card__go">${AR}</span>
      <span class="card__body">
        <span class="card__t">${s.t}</span>
        <span class="card__m">${s.c}</span>
      </span>
    </a>`;

  const bento = (items, cls) => items.map((it, i) => `
    <a class="${cls[i]}" href="#" data-lb="${IMGP}${it.f}" data-lb-cap="${it.cap}" data-rv="zoom" data-rv-d="${(i % 4) + 1}">
      <img src="${IMGP}${it.f}" alt="${it.cap}" loading="lazy" decoding="async">
      <span class="bento__cap">${it.cap}</span>
    </a>`).join('');

  const fillFaq = (host, list = FAQ) => {
    if (!host) return;
    host.innerHTML = list.map(([q, a], i) => `
      <div class="faq__i" data-rv="fade" data-rv-d="${(i % 4) + 1}">
        <button class="faq__q" aria-expanded="false"><span>${q}</span><i></i></button>
        <div class="faq__a"><p>${a}</p></div>
      </div>`).join('');
  };

  const fillStats = (host) => {
    if (!host) return;
    host.innerHTML = STATS.map(([n, l], i) => `
      <div class="stat" data-rv data-rv-d="${i + 1}">
        <p class="stat__n"><span data-count="${n}">0</span>${i === 3 ? '<em>★</em>' : i === 1 ? '<em>+</em>' : ''}</p>
        <p class="stat__l">${l}</p>
      </div>`).join('');
  };

  const fillReviews = (host) => {
    if (!host) return;
    const star = '<svg viewBox="0 0 24 24"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6l-5.9 3 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z"/></svg>';
    host.innerHTML = REVIEWS.map((r, i) => `
      <div class="quote" data-rv data-rv-d="${i + 1}">
        <div class="quote__stars">${star.repeat(5)}</div>
        <p>“${r.q}”</p>
        <div class="quote__who">
          <img src="${IMGP}${r.img}" alt="" loading="lazy">
          <span><b>${r.n}</b><span>${r.r}</span></span>
        </div>
      </div>`).join('');
  };

  const fillMText = (host) => {
    if (!host) return;
    const words = ['Düğün', 'Nişan', 'Yenidoğan', 'Aile', 'Gelin', 'Kurumsal', 'Portre', 'Etkinlik'];
    const g = words.map(w => `<span class="mtext__it">${w} <i></i></span>`).join('');
    host.innerHTML = g + g;
  };

  const fillStrip = (host, files) => {
    if (!host) return;
    const t = $('.strip__track', host);
    const g = files.map(f => `<span class="strip__it"><img src="${IMGP}${f}" alt="" loading="lazy" decoding="async"></span>`).join('');
    t.innerHTML = g + g;
  };

  /* ---------- ANA SAYFA ---------- */
  if (page === 'home') {
    const picks = ['dugun-paketleri', 'anne-ve-yenidogan', 'gelin-fotografciligi', 'kurumsal-fotografcilik',
                   'kir-dugunu', 'vesikalik-ve-portre', 'evlilik-teklifi', 'aile-ve-topluluk'];
    $('#homeServices').innerHTML = picks.map(p => SERVICES.find(s => s.s === p)).filter(Boolean).map(svcCard).join('');

    const bItems = [
      { f: 'dugun-19.jpg', cap: 'Düğün · Ankara' }, { f: 'gelin-08.jpg', cap: 'Gelin Portresi' },
      { f: 'yenidogan-08.jpg', cap: 'Anne & Bebek' }, { f: 'dugun-22.jpg', cap: 'Çift Çekimi' },
      { f: 'portre-16.jpg', cap: 'Stüdyo Portre' }, { f: 'etkinlik-05.jpg', cap: 'Etkinlik' },
      { f: 'dugun-15.jpg', cap: 'Kır Düğünü' }
    ];
    $('#homeBento').innerHTML = bento(bItems, ['b-a', 'b-b', 'b-c', 'b-d', 'b-e', 'b-f', 'b-g']);
    fillStrip($('#strip1'), ['dugun-04.jpg','gelin-17.jpg','aile-12.jpg','teklif-01.jpg','portre-12.jpg','dugun-28.jpg','yenidogan-12.jpg','kurumsal-01.jpg','dugun-24.jpg','gelin-15.jpg','etkinlik-08.jpg','dugun-11.jpg']);
    fillMText($('#mtext'));
    fillStats($('#stats'));
    fillReviews($('#reviews'));
    fillFaq($('#faq'));
  }

  /* ---------- HİZMETLER ---------- */
  if (page === 'services') {
    const fh = $('#svcFilters'), gh = $('#svcGrid'), ch = $('#svcCount');
    fh.innerHTML = CATS.map((c, i) => `<button class="chip${i === 0 ? ' is-on' : ''}" data-c="${c}">${c}</button>`).join('');
    const draw = (cat) => {
      const list = cat === 'Tümü' ? SERVICES : SERVICES.filter(s => s.c === cat);
      gh.innerHTML = list.map(svcCard).join('');
      ch.textContent = `${list.length} hizmet gösteriliyor · toplam ${SERVICES.length} başlık`;
      $$('[data-rv]', gh).forEach(el => el.classList.add('is-in'));
    };
    draw('Tümü');
    fh.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', fh).forEach(x => x.classList.toggle('is-on', x === b));
      draw(b.dataset.c);
    });
  }

  /* ---------- HİZMET DETAYI ---------- */
  if (page === 'service') {
    const s = SERVICES.find(x => x.s === qs('h')) || SERVICES[0];
    document.title = `${s.t} | Zirve Fotoğrafçılık`;
    $('#svcCrumb').textContent = s.t;
    $('#svcCat').textContent = s.c;
    $('#svcTitle').textContent = s.t;
    $('#svcLead').textContent = s.x;
    $('#svcHero').src = IMGP + s.img;
    $('#svcHero').alt = s.t;
    $('#svcDesc').textContent = s.d;
    $('#svcBullets').innerHTML = s.b.map(b => `<li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span><b>${b}</b></span></li>`).join('');
    $('#svcDur').textContent = s.dur;
    $('#svcPrice').textContent = s.from ? money(s.from) : 'Teklife göre';
    $('#svcGallery').innerHTML = bento(s.g.map(f => ({ f, cap: s.t })), ['b-a', 'b-b', 'b-c', 'b-d', 'b-e', 'b-f']);
    const rel = SERVICES.filter(x => x.c === s.c && x.s !== s.s).slice(0, 4);
    const fill = rel.length < 4 ? SERVICES.filter(x => x.s !== s.s && !rel.includes(x)).slice(0, 4 - rel.length) : [];
    $('#svcRelated').innerHTML = [...rel, ...fill].map(svcCard).join('');
    const cta = $('#svcBook');
    if (cta) cta.href = `rezervasyon.html?h=${s.s}`;
  }

  /* ---------- GALERİ ---------- */
  if (page === 'gallery') {
    const fh = $('#galFilters'), gh = $('#galGrid'), more = $('#galMore');
    let cat = 'Tümü', shown = 0, STEP = 24;
    fh.innerHTML = GAL_CATS.map((c, i) => `<button class="chip${i === 0 ? ' is-on' : ''}" data-c="${c}">${c}</button>`).join('');
    const list = () => cat === 'Tümü' ? GALLERY : GALLERY.filter(g => g.c === cat);
    const draw = (reset) => {
      const all = list();
      if (reset) { gh.innerHTML = ''; shown = 0; }
      const next = all.slice(shown, shown + STEP);
      gh.insertAdjacentHTML('beforeend', next.map(g => `
        <figure data-lb="${IMGP}${g.f}" data-lb-cap="${g.cap}">
          <img src="${IMGP}${g.f}" alt="${g.cap}" loading="lazy" decoding="async">
          <figcaption>${g.cap}</figcaption>
        </figure>`).join(''));
      shown += next.length;
      more.style.display = shown >= all.length ? 'none' : '';
      more.textContent = `Daha Fazla Göster (${all.length - shown})`;
      if (window.ZirveLB) window.ZirveLB.refresh();
    };
    draw(true);
    more.addEventListener('click', () => draw(false));
    fh.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', fh).forEach(x => x.classList.toggle('is-on', x === b));
      cat = b.dataset.c; draw(true);
    });
  }

  /* ---------- BİZİ TANIYIN ---------- */
  if (page === 'about') {
    fillStats($('#stats'));
    fillReviews($('#reviews'));
    fillMText($('#mtext'));
    const steps = [
      ['01', 'Tanışma', 'Telefonda ya da stüdyoda 20 dakikalık kısa bir görüşme. Beklentiniz, tarihiniz ve bütçeniz netleşir.', 'kurumsal-08.jpg'],
      ['02', 'Rezervasyon', 'Tarih ve paket seçimi online tamamlanır. %30 kapora ile takviminizde yeriniz ayrılır.', 'urun-07.jpg'],
      ['03', 'Ön Hazırlık', 'Lokasyon, kombin ve akış planı birlikte kurulur. Gerekirse keşif çekimi yapılır.', 'gelin-06.jpg'],
      ['04', 'Çekim Günü', 'Ekip belirlenen saatte hazır. Yönlendiriyoruz ama zorlamıyoruz; gün sizin akışınızda geçiyor.', 'dugun-19.jpg'],
      ['05', 'Seçki', 'Ham kareler 24 saat içinde online galeride. Beğendiklerinizi tek tıkla işaretliyorsunuz.', 'portre-05.jpg'],
      ['06', 'Teslim', 'Retouch 7 gün, albüm 21 gün. Dosyalarınız 5 yıl boyunca yedekli arşivde kalıyor.', 'urun-04.jpg']
    ];
    $('#processGrid').innerHTML = steps.map(([n, t, d, img], i) => `
      <div class="card card--wide" style="aspect-ratio:4/3.1" data-rv data-rv-d="${(i % 3) + 1}">
        <img src="${IMGP}${img}" alt="" loading="lazy">
        <span class="card__body">
          <span class="card__m" style="color:var(--amber)">${n}</span>
          <span class="card__t" style="margin-top:4px;display:block">${t}</span>
          <span class="card__m" style="margin-top:8px;display:block;line-height:1.5">${d}</span>
        </span>
      </div>`).join('');
    const team = [
      ['Hakan Zirve', 'Kurucu · Düğün Fotoğrafçısı', 'kurumsal-01.jpg'],
      ['Seda Zirve Aydın', 'Stüdyo & Yenidoğan', 'portre-16.jpg'],
      ['Mert Çalışkan', 'Video Yönetmeni · Drone Pilotu', 'kurumsal-08.jpg'],
      ['Buse Yalın', 'Retouch & Albüm Tasarımı', 'portre-06.jpg']
    ];
    $('#teamGrid').innerHTML = team.map(([n, r, img], i) => `
      <div class="card" data-rv data-rv-d="${i + 1}">
        <img src="${IMGP}${img}" alt="${n}" loading="lazy">
        <span class="card__body"><span class="card__t">${n}</span><span class="card__m">${r}</span></span>
      </div>`).join('');
  }

  /* ---------- BLOG ---------- */
  if (page === 'blog') {
    $('#postGrid').innerHTML = POSTS.map((p, i) => `
      <a class="post${i === 0 ? ' post--wide' : ''}" href="blog-yazi.html?y=${p.s}" data-rv data-rv-d="${(i % 3) + 1}">
        <div class="post__img"><img src="${IMGP}${p.img}" alt="${p.t}" loading="lazy"></div>
        <div>
          <span class="post__meta"><b>${p.cat}</b><span>${p.d}</span></span>
          <h3 class="mt-s">${p.t}</h3>
          <p class="mt-s">${p.x}</p>
          <span class="link-u mt-s" style="margin-top:16px">Devamını Oku ${AR}</span>
        </div>
      </a>`).join('');
  }

  if (page === 'post') {
    const p = POSTS.find(x => x.s === qs('y')) || POSTS[0];
    document.title = `${p.t} | Zirve Fotoğrafçılık`;
    $('#postCrumb').textContent = p.t;
    $('#postMeta').textContent = `${p.cat} · ${p.d}`;
    $('#postTitle').textContent = p.t;
    $('#postLead').textContent = p.x;
    $('#postHero').src = IMGP + p.img;
    $('#postHero').alt = p.t;
    $('#postBody').innerHTML = p.body.map(b => {
      const [k, ...r] = b;
      if (k === 'h2') return `<h2>${r[0]}</h2>`;
      if (k === 'p') return `<p>${r[0]}</p>`;
      if (k === 'q') return `<blockquote>${r[0]}</blockquote>`;
      if (k === 'ul') return `<ul>${r.map(x => `<li>${x}</li>`).join('')}</ul>`;
      return '';
    }).join('');
    $('#postMore').innerHTML = POSTS.filter(x => x.s !== p.s).slice(0, 3).map((x, i) => `
      <a class="post" href="blog-yazi.html?y=${x.s}" data-rv data-rv-d="${i + 1}">
        <div class="post__img"><img src="${IMGP}${x.img}" alt="${x.t}" loading="lazy"></div>
        <div>
          <span class="post__meta"><b>${x.cat}</b><span>${x.d}</span></span>
          <h3 class="mt-s">${x.t}</h3>
        </div>
      </a>`).join('');
  }

  /* ---------- İLETİŞİM ---------- */
  if (page === 'contact') {
    const sel = $('#hizmet');
    if (sel) sel.innerHTML = '<option value="">Seçiniz</option>' + SERVICES.map(s => `<option>${s.t}</option>`).join('');
    fillFaq($('#faq'), FAQ.slice(0, 6));
  }

  /* ---------- REZERVASYON ---------- */
  if (page === 'booking') {
    const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const PACKS = [
      { id:'dijital', t:'Zirve Dijital', p:12900, d:'1 saat çekim · 400–600 kare · 30 kare retouch · online galeri · stüdyo girişi dahil' },
      { id:'klasik',  t:'Zirve Klasik',  p:18900, d:'1,5 saat çekim · 40 kare retouch · 30 sayfalık hikâye dergisi · stüdyo + dış mekân', tag:'En Çok Tercih Edilen' },
      { id:'prestij', t:'Zirve Prestij', p:26900, d:'2 saat · iki fotoğrafçı · 60 kare retouch · 25×70 panoramik albüm · 30×40 kanvas', tag:'Tam Kapsam' }
    ];
    const ADDONS = [
      { id:'album',    t:'Albüm Baskı',            p:4500, d:'25×70 panoramik + 2 adet aile albümü, layflat ciltleme' },
      { id:'video',    t:'Video Çekimi & Drone',   p:7500, d:'İki kamera, SHGM lisanslı drone, 15 günde sinematik klip', tag:'Sinema Kalitesinde' },
      { id:'makyaj',   t:'Saç & Makyaj',           p:3900, d:'Stüdyoda profesyonel saç & makyaj, türban tasarımı dahil' },
      { id:'lokasyon', t:'Ek Dış Mekân Lokasyonu', p:2500, d:'Ankara içi ikinci lokasyon, ulaşım ve ışık kurulumu dahil' },
      { id:'ekspres',  t:'Ekspres Teslimat',       p:1500, d:'Düzenlenmiş kareler 7 gün yerine 48 saat içinde' }
    ];
    const LOCS = [
      { id:'studio', t:'Zirve Stüdyo · Cebeci', p:0,    d:'240 m² stüdyo, 8 fon ve dekor, hazırlık odası. Ek ücret yok.' },
      { id:'dis',    t:'Dış Mekân · Ankara',    p:1750, d:'Birlikte belirlediğimiz lokasyonda çekim, ekip ulaşımı dahil.' }
    ];
    const PAYS = [
      { id:'kart',   t:'Kredi Kartı', d:'Vade farksız 6 taksit · tüm bankalar', disc:0 },
      { id:'havale', t:'Havale / EFT', d:'Peşin ödemede %10 indirim', disc:.10 }
    ];

    const st = { y:null, m:null, date:null, time:null, pack:'klasik', addons:new Set(), loc:'studio', pay:'kart' };
    const today = new Date(); today.setHours(0,0,0,0);
    let vy = today.getFullYear(), vm = today.getMonth();
    st.y = vy;

    const busy = (d) => { const k = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate(); return (k * 2654435761 % 97) < 17; };
    const season = (m) => (m >= 5 && m <= 8) ? 1.15 : (m === 4 || m === 9) ? 1.05 : 1;
    const weekend = (d) => (d.getDay() === 0 || d.getDay() === 6) ? 1.10 : 1;

    /* Yıl seçimi */
    const ySel = $('#yearSel');
    ySel.innerHTML = [vy, vy+1, vy+2].map(y => `<option value="${y}">${y}</option>`).join('');
    ySel.value = vy;
    ySel.addEventListener('change', () => { vy = +ySel.value; if (vy > today.getFullYear()) vm = 0; drawCal(); drawMonths(); });

    /* Sekmeler */
    const tabM = $('#tabMonth'), tabY = $('#tabYear'), vM = $('#viewMonth'), vY = $('#viewYear');
    tabM.addEventListener('click', () => { tabM.classList.add('is-on'); tabY.classList.remove('is-on'); vM.hidden = false; vY.hidden = true; });
    tabY.addEventListener('click', () => { tabY.classList.add('is-on'); tabM.classList.remove('is-on'); vY.hidden = false; vM.hidden = true; drawMonths(); });

    /* Aylık takvim */
    const grid = $('#calGrid'), moLabel = $('#calMonth');
    function drawCal() {
      moLabel.textContent = `${MONTHS[vm]} ${vy}`;
      const first = new Date(vy, vm, 1);
      const startIdx = (first.getDay() + 6) % 7;
      const days = new Date(vy, vm + 1, 0).getDate();
      let html = '';
      for (let i = 0; i < startIdx; i++) html += '<span class="day is-empty"></span>';
      for (let d = 1; d <= days; d++) {
        const dt = new Date(vy, vm, d);
        const past = dt < today;
        const full = !past && busy(dt);
        const on = st.date && dt.getTime() === st.date.getTime();
        const isToday = dt.getTime() === today.getTime();
        const cls = ['day', past ? 'is-off' : '', full ? 'is-full' : '', on ? 'is-on' : '', isToday ? 'is-today' : ''].filter(Boolean).join(' ');
        const pr = Math.round(PACKS.find(p => p.id === st.pack).p * season(vm) * weekend(dt) / 100) * 100;
        html += `<button class="${cls}" data-d="${d}" ${past || full ? 'disabled' : ''}>${d}<small>${(pr/1000).toFixed(1).replace('.',',')}b</small></button>`;
      }
      grid.innerHTML = html;
    }
    grid.addEventListener('click', e => {
      const b = e.target.closest('.day'); if (!b || b.disabled || b.classList.contains('is-empty')) return;
      st.date = new Date(vy, vm, +b.dataset.d);
      drawCal(); drawSlots(); sync();
      $('#panelTime').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $('#calPrev').addEventListener('click', () => { vm--; if (vm < 0) { vm = 11; vy--; } if (vy < today.getFullYear()) { vy = today.getFullYear(); vm = today.getMonth(); } ySel.value = vy; drawCal(); });
    $('#calNext').addEventListener('click', () => { vm++; if (vm > 11) { vm = 0; vy++; } ySel.value = vy; drawCal(); });

    /* Yıllık takvim */
    const moGrid = $('#moGrid');
    function drawMonths() {
      moGrid.innerHTML = MONTHS.map((m, i) => {
        const past = vy === today.getFullYear() && i < today.getMonth();
        const pr = Math.round(PACKS.find(p => p.id === st.pack).p * season(i) / 100) * 100;
        return `<button class="mo ${past ? 'is-off' : ''} ${i === vm ? 'is-on' : ''}" data-m="${i}" ${past ? 'disabled' : ''}>
          <b>${m}</b><span>${money(pr)}</span></button>`;
      }).join('');
    }
    moGrid.addEventListener('click', e => {
      const b = e.target.closest('.mo'); if (!b || b.disabled) return;
      vm = +b.dataset.m; tabM.click(); drawCal();
    });

    /* Saat */
    const slotHost = $('#slotGrid');
    const TIMES = ['09:00','10:00','11:00','12:00','13:30','14:30','15:30','16:30','17:30','18:30'];
    function drawSlots() {
      if (!st.date) { slotHost.innerHTML = `<p class="tiny">Saat seçenekleri için önce takvimden bir gün seçin.</p>`; return; }
      const seed = st.date.getDate() + st.date.getMonth() * 31;
      slotHost.innerHTML = TIMES.map((t, i) => {
        const off = ((seed * 7 + i * 13) % 11) < 3;
        return `<button class="slot ${off ? 'is-off' : ''} ${st.time === t ? 'is-on' : ''}" data-t="${t}" ${off ? 'disabled' : ''}>${t}</button>`;
      }).join('');
      $('#timeHint').textContent = `${st.date.toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })} için uygun saatler`;
    }
    slotHost.addEventListener('click', e => {
      const b = e.target.closest('.slot'); if (!b || b.disabled) return;
      st.time = b.dataset.t; drawSlots(); sync();
    });
    drawSlots();

    /* Paket / ek / konum / ödeme */
    const chk = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
    const optHtml = (o, on, radio) => `
      <label class="opt ${radio ? 'opt--radio' : ''} ${on ? 'is-on' : ''}" data-id="${o.id}">
        ${o.tag ? `<span class="opt__tag">${o.tag}</span>` : ''}
        <span class="opt__box">${chk}</span>
        <span class="opt__main">
          <span class="opt__row"><span class="opt__t">${o.t}</span>
            <span class="opt__p">${o.p === 0 ? 'Dahil' : '+ ' + money(o.p)}</span></span>
          <span class="opt__d">${o.d}</span>
        </span>
      </label>`;

    const packHost = $('#packGrid'), addHost = $('#addonGrid'), locHost = $('#locGrid'), payHost = $('#payGrid');
    const drawOpts = () => {
      packHost.innerHTML = PACKS.map(p => optHtml({ ...p, p: p.p }, st.pack === p.id, true)).join('');
      addHost.innerHTML = ADDONS.map(a => optHtml(a, st.addons.has(a.id), false)).join('');
      locHost.innerHTML = LOCS.map(l => optHtml(l, st.loc === l.id, true)).join('');
      payHost.innerHTML = PAYS.map(p => `
        <label class="opt opt--radio ${st.pay === p.id ? 'is-on' : ''}" data-id="${p.id}">
          <span class="opt__box">${chk}</span>
          <span class="opt__main"><span class="opt__row"><span class="opt__t">${p.t}</span>
            <span class="opt__p">${p.disc ? '%10 indirim' : '6 taksit'}</span></span>
            <span class="opt__d">${p.d}</span></span>
        </label>`).join('');
    };
    packHost.addEventListener('click', e => { const l = e.target.closest('.opt'); if (!l) return; st.pack = l.dataset.id; drawOpts(); drawCal(); sync(); });
    locHost.addEventListener('click', e => { const l = e.target.closest('.opt'); if (!l) return; st.loc = l.dataset.id; drawOpts(); sync(); });
    payHost.addEventListener('click', e => { const l = e.target.closest('.opt'); if (!l) return; st.pay = l.dataset.id; drawOpts(); sync(); });
    addHost.addEventListener('click', e => {
      const l = e.target.closest('.opt'); if (!l) return;
      const id = l.dataset.id;
      st.addons.has(id) ? st.addons.delete(id) : st.addons.add(id);
      drawOpts(); sync();
    });

    /* Özet */
    function sync() {
      const pack = PACKS.find(p => p.id === st.pack);
      const loc = LOCS.find(l => l.id === st.loc);
      const pay = PAYS.find(p => p.id === st.pay);
      const adds = ADDONS.filter(a => st.addons.has(a.id));
      let base = pack.p + loc.p + adds.reduce((s, a) => s + a.p, 0);
      if (st.date) base = base * season(st.date.getMonth()) * weekend(st.date);
      const disc = base * pay.disc;
      const total = Math.round((base - disc) / 100) * 100;

      $('#sDate').textContent = st.date ? st.date.toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric', weekday:'long' }) : '—';
      $('#sTime').textContent = st.time || '—';
      $('#sLoc').textContent = loc.t;
      $('#sPack').textContent = pack.t;
      $('#sAddonCount').textContent = adds.length ? `${adds.length} adet` : 'Yok';
      $('#sAddons').innerHTML = adds.map(a => `<li>${a.t} <span style="margin-left:auto;color:var(--muted-2)">${money(a.p)}</span></li>`).join('');
      $('#sPay').textContent = pay.id === 'kart' ? 'Kredi Kartı · 6 Taksit' : 'Havale / EFT';
      $('#rowDiscount').hidden = !disc;
      $('#sDiscount').textContent = '− ' + money(Math.round(disc / 100) * 100);
      $('#sTotal').textContent = money(total);
      $('#sInstal').textContent = pay.id === 'kart'
        ? `Vade farksız 6 taksit · aylık ${money(Math.round(total / 6 / 10) * 10)}`
        : `Peşin ödeme · %10 indirim uygulandı`;

      $$('#stepsBar .steps-bar__i').forEach((el, i) => {
        const done = [!!st.date, !!st.time, !!st.pack, !!st.pay][i];
        el.classList.toggle('is-on', done);
      });
      $('#panelDate').classList.toggle('is-done', !!st.date);
      $('#panelTime').classList.toggle('is-done', !!st.time);
      $('#panelPack').classList.toggle('is-done', !!st.pack);
      $('#panelPay').classList.toggle('is-done', !!st.pay);
      window._zirveTotal = total;
    }

    $('#bookGo').addEventListener('click', () => {
      if (!st.date) { $('#panelDate').scrollIntoView({ behavior:'smooth', block:'center' }); $('#timeHint').textContent = 'Lütfen önce bir tarih seçin'; return; }
      if (!st.time) { $('#panelTime').scrollIntoView({ behavior:'smooth', block:'center' }); $('#timeHint').textContent = 'Lütfen bir başlangıç saati seçin'; return; }
      const done = $('#bookDone');
      const pack = PACKS.find(p => p.id === st.pack);
      $('#doneText').innerHTML = `<b>${st.date.toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })} · ${st.time}</b> için
        ${pack.t} paketiyle talebiniz oluşturuldu. Koordinatörümüz 40 dakika içinde arayarak
        %30 kapora ödemesi ve sözleşme adımını tamamlayacak. Toplam tutar ${money(window._zirveTotal)}.`;
      done.hidden = false;
      done.scrollIntoView({ behavior:'smooth', block:'center' });
    });

    drawCal(); drawMonths(); drawOpts(); sync();
    fillFaq($('#faq'), FAQ.slice(0, 6));

    /* hizmet detayından gelindiyse not düş */
    const h = qs('h');
    if (h) {
      const s = SERVICES.find(x => x.s === h);
      if (s) {
        const note = document.createElement('p');
        note.className = 'tiny mt-s';
        note.style.color = 'var(--amber)';
        note.textContent = `Seçtiğiniz hizmet: ${s.t} — paket içeriğini bu hizmete göre uyarlıyoruz.`;
        $('#panelPack').appendChild(note);
      }
    }
  }

})();


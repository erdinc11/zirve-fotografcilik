/* ZİRVE FOTOĞRAFÇILIK — etkileşim katmanı */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TL = { tr: 'tr-TR' };

  /* ---------- TEMA ---------- */
  const THEME_KEY = 'zirve-theme';
  const setTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    const m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#F2ECE3' : '#0A0807');
    window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  };
  const initTheme = () => {
    let t = null;
    try { t = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!t) t = 'dark';
    setTheme(t);
  };
  initTheme();

  /* ---------- ORTAK BİLEŞENLER ---------- */
  const boot = () => {
    /* tema anahtarı */
    $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }));

    /* sticky header */
    const header = $('.header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* mobil menü */
    const burger = $('.burger'), menu = $('.menu');
    if (burger && menu) {
      burger.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        document.documentElement.classList.toggle('is-locked', open);
        burger.setAttribute('aria-expanded', String(open));
        $$('.menu__item a', menu).forEach((a, i) => a.style.transitionDelay = open ? `${0.14 + i * 0.06}s` : '0s');
      });
      $$('.menu__item a', menu).forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('is-open'); burger.classList.remove('is-open');
        document.documentElement.classList.remove('is-locked');
      }));
    }

    /* aktif nav */
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('[data-nav]').forEach(a => {
      if (a.getAttribute('data-nav').toLowerCase() === here) a.classList.add('is-active');
    });

    /* scroll reveal */
    const rvs = $$('[data-rv]');
    if (rvs.length) {
      if (rm) rvs.forEach(el => el.classList.add('is-in'));
      else {
        const io = new IntersectionObserver((es) => es.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        rvs.forEach(el => io.observe(el));
      }
    }

    /* başlık satır animasyonu */
    $$('[data-split]').forEach(el => {
      const lines = el.innerHTML.split('<br>');
      el.innerHTML = lines.map(l => `<span class="split"><span>${l.trim()}</span></span>`).join('<br>');
      requestAnimationFrame(() => setTimeout(() => $$('.split', el).forEach((s, i) => {
        s.querySelector('span').style.transitionDelay = `${0.1 + i * 0.11}s`;
        s.classList.add('is-in');
      }), 120));
    });

    /* SSS akordeon */
    $$('.faq__i').forEach(item => {
      const q = $('.faq__q', item), a = $('.faq__a', item);
      if (!q || !a) return;
      q.addEventListener('click', () => {
        const open = item.classList.contains('is-open');
        const sib = item.closest('.faq');
        if (sib) $$('.faq__i.is-open', sib).forEach(o => { if (o !== item) { o.classList.remove('is-open'); $('.faq__a', o).style.height = '0px'; $('.faq__q', o).setAttribute('aria-expanded','false'); } });
        item.classList.toggle('is-open', !open);
        q.setAttribute('aria-expanded', String(!open));
        a.style.height = open ? '0px' : a.scrollHeight + 'px';
      });
    });

    /* mıknatıs butonlar */
    if (!rm && window.matchMedia('(pointer:fine)').matches) {
      $$('[data-magnet]').forEach(el => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        });
        el.addEventListener('pointerleave', () => el.style.transform = '');
      });
    }

    /* özel imleç */
    if (!rm && window.matchMedia('(pointer:fine)').matches) {
      const c = document.createElement('div'); c.className = 'cursor'; document.body.appendChild(c);
      let x = 0, y = 0, cx = 0, cy = 0;
      window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; c.classList.add('is-on'); });
      const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
      loop();
      document.addEventListener('pointerover', e => {
        const h = e.target.closest('a,button,.card,.opt,.day,.slot,figure');
        c.classList.toggle('is-hover', !!h);
      });
    }

    /* alt sabit çubuk */
    const dock = $('.dock');
    if (dock) {
      const closed = sessionStorage.getItem('zirve-dock') === '0';
      const t = () => dock.classList.toggle('is-on', !closed && window.scrollY > 760);
      t(); window.addEventListener('scroll', t, { passive: true });
      const x = $('.dock__x', dock);
      if (x) x.addEventListener('click', () => { dock.classList.remove('is-on'); sessionStorage.setItem('zirve-dock', '0'); });
    }

    /* sayfa geçişi */
    const curtain = $('.curtain');
    if (curtain) {
      requestAnimationFrame(() => setTimeout(() => curtain.classList.add('is-up'), 80));
      if (!rm) document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
        e.preventDefault();
        curtain.classList.remove('is-up');
        setTimeout(() => location.href = href, 520);
      });
    }

    /* formlar (demo) */
    $$('[data-fakeform]').forEach(f => f.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = $('.form-ok', f.parentElement) || $('.form-ok', f);
      if (ok) ok.classList.add('is-on');
      f.reset();
    }));

    initLightbox();
    initTilt();
    initCounters();
  };

  /* ---------- LIGHTBOX ---------- */
  let lbItems = [], lbIdx = 0, lbEl = null;
  const initLightbox = () => {
    const triggers = $$('[data-lb]');
    if (!triggers.length) return;
    lbEl = document.createElement('div');
    lbEl.className = 'lb';
    lbEl.innerHTML = `<button class="lb__x" aria-label="Kapat"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      <button class="lb__nav lb__prev" aria-label="Önceki"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="lb__nav lb__next" aria-label="Sonraki"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
      <div><img alt=""><p class="lb__cap"></p></div>`;
    document.body.appendChild(lbEl);
    const img = $('img', lbEl), cap = $('.lb__cap', lbEl);
    const show = () => {
      const it = lbItems[lbIdx];
      if (!it) return;
      img.src = it.src; img.alt = it.cap || ''; cap.textContent = it.cap || '';
    };
    const open = (list, i) => {
      lbItems = list; lbIdx = i; show();
      lbEl.classList.add('is-on'); document.documentElement.classList.add('is-locked');
    };
    const close = () => { lbEl.classList.remove('is-on'); document.documentElement.classList.remove('is-locked'); };
    window.ZirveLB = { open, refresh: bind };
    $('.lb__x', lbEl).addEventListener('click', close);
    $('.lb__prev', lbEl).addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; show(); });
    $('.lb__next', lbEl).addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbItems.length; show(); });
    lbEl.addEventListener('click', e => { if (e.target === lbEl) close(); });
    document.addEventListener('keydown', e => {
      if (!lbEl.classList.contains('is-on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') $('.lb__prev', lbEl).click();
      if (e.key === 'ArrowRight') $('.lb__next', lbEl).click();
    });
    function bind() {
      const els = $$('[data-lb]');
      els.forEach((el, i) => {
        if (el.dataset.lbBound) return;
        el.dataset.lbBound = '1';
        el.addEventListener('click', (ev) => {
          ev.preventDefault();
          const all = $$('[data-lb]').filter(x => x.offsetParent !== null);
          const list = all.map(x => ({ src: x.getAttribute('data-lb'), cap: x.getAttribute('data-lb-cap') || '' }));
          open(list, all.indexOf(el));
        });
      });
    }
    bind();
  };

  /* ---------- 3B EĞİM ---------- */
  const initTilt = () => {
    if (rm || !window.matchMedia('(pointer:fine)').matches) return;
    $$('[data-tilt]').forEach(el => {
      const p = el.parentElement;
      p.style.perspective = '1200px';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  };

  /* ---------- SAYAÇ ---------- */
  const initCounters = () => {
    const els = $$('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const raw = e.target.getAttribute('data-count');
      const num = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
      if (isNaN(num) || rm) { e.target.textContent = raw; return; }
      const dec = raw.includes(',') ? 1 : 0, t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = num * (1 - Math.pow(1 - k, 3));
        e.target.textContent = dec ? v.toFixed(1).replace('.', ',') : Math.round(v).toLocaleString(TL.tr);
        if (k < 1) requestAnimationFrame(step); else e.target.textContent = raw;
      };
      requestAnimationFrame(step);
    }), { threshold: .4 });
    els.forEach(el => io.observe(el));
  };

  /* ---------- HERO YAY ---------- */
  const HERO_SET = ['gelin-13.jpg','dugun-24.jpg','dugun-05.jpg','gelin-17.jpg','dugun-12.jpg','gelin-06.jpg','dugun-19.jpg','gelin-08.jpg','dugun-22.jpg','dugun-20.jpg','gelin-16.jpg','dugun-27.jpg','dugun-15.jpg'];
  const buildArc = () => {
    const host = $('.hero__arc');
    if (!host) return;
    const draw = () => {
      const W = host.clientWidth, H = host.clientHeight;
      const wide = W > 1080, mid = W > 760;
      const n = wide ? 13 : mid ? 11 : 9;
      const cw = Math.max(88, Math.min(206, W * (wide ? .115 : mid ? .145 : .19)));
      const ch = cw * 1.26;
      const rx = W * (wide ? .425 : mid ? .46 : .52);
      const ry = H * (wide ? .52 : .46);
      const spread = wide ? 260 : 236;          // derece
      const start = -spread / 2;
      host.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const a = start + (spread / (n - 1)) * i;            // tepe merkezli
        const rad = a * Math.PI / 180;
        const x = Math.sin(rad) * rx;
        const y = -Math.cos(rad) * ry + H * 0.02;
        const rot = a * 0.4;
        const sc = 1 - Math.abs(a) / 900;
        const el = document.createElement('div');
        el.className = 'arc-card';
        el.style.cssText = `--w:${cw}px;--h:${ch}px;--x:${x.toFixed(1)}px;--y:${y.toFixed(1)}px;--rot:${rot.toFixed(2)}deg;--sc:${sc.toFixed(3)};--d:${(0.1 + i * 0.055).toFixed(2)}s`;
        const src = HERO_SET[i % HERO_SET.length];
        el.innerHTML = `<img src="assets/img/photos/${src}" alt="" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async">`;
        el.dataset.depth = (0.4 + (Math.abs(a) / spread) * 1.1).toFixed(2);
        host.appendChild(el);
      }
    };
    draw();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 220); });

    /* fare paralaksı + kaydırma derinliği */
    if (!rm) {
      let mx = 0, my = 0, tx = 0, ty = 0, sy = 0;
      window.addEventListener('pointermove', e => {
        tx = (e.clientX / window.innerWidth - .5); ty = (e.clientY / window.innerHeight - .5);
      });
      window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
      const loop = () => {
        mx += (tx - mx) * .06; my += (ty - my) * .06;
        $$('.arc-card', host).forEach(c => {
          const d = parseFloat(c.dataset.depth || 1);
          c.style.setProperty('--px', `${(mx * 26 * d).toFixed(2)}px`);
          c.style.setProperty('--py', `${(my * 18 * d + sy * -0.05 * d).toFixed(2)}px`);
          c.style.translate = `${(mx * 26 * d).toFixed(2)}px ${(my * 18 * d + sy * -0.06 * d).toFixed(2)}px`;
        });
        requestAnimationFrame(loop);
      };
      loop();
    }
  };

  /* ---------- WEBGL ATMOSFER ---------- */
  const initShader = () => {
    const cv = $('.atmos__shader');
    if (!cv || rm) return;
    const gl = cv.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fs = `
precision mediump float;
uniform vec2 u_r; uniform float u_t; uniform float u_light;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/u_r.xy; vec2 q=uv; q.x*=u_r.x/u_r.y;
 float t=u_t*.035;
 float f=fbm(q*2.1+vec2(t,t*.6));
 float f2=fbm(q*3.4-vec2(t*.8,t*.3)+f);
 // sıcak amber çekirdek — sol üst
 float d=distance(uv,vec2(.08,.98));
 float core=smoothstep(1.15,.0,d)*(.55+f*.5);
 vec3 warm=mix(vec3(.72,.24,.03),vec3(1.,.56,.12),f2);
 // ikinci odak — sağ üst
 float d2=distance(uv,vec2(.96,.9));
 float core2=smoothstep(.85,.0,d2)*(.3+f2*.35);
 // prizmatik sızıntı
 float band=smoothstep(.34,.5,fbm(q*1.4+vec2(-t*1.4,t)));
 vec3 prism=vec3(
   sin(band*6.0+0.0)*.5+.5,
   sin(band*6.0+2.1)*.5+.5,
   sin(band*6.0+4.2)*.5+.5);
 float leak=smoothstep(.62,1.,fbm(q*1.1+vec2(t*1.6,-t)))*.34;
 vec3 col=warm*core+vec3(1.,.42,.08)*core2*.8+prism*leak;
 // hafif tanecik
 col+=(hash(gl_FragCoord.xy+u_t)-.5)*.035;
 float alpha=clamp(core*.85+core2*.6+leak*.9,0.,1.);
 if(u_light>.5){ col=1.-col*.55; alpha*=.55; }
 gl_FragColor=vec4(col,alpha*.92);
}`;
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'u_r'), uT = gl.getUniformLocation(pr, 'u_t'), uL = gl.getUniformLocation(pr, 'u_light');
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.4);
      cv.width = Math.floor(innerWidth * dpr * .6); cv.height = Math.floor(innerHeight * dpr * .6);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    size(); window.addEventListener('resize', size);
    let t0 = performance.now(), vis = true;
    document.addEventListener('visibilitychange', () => vis = !document.hidden);
    const frame = () => {
      if (vis) {
        gl.uniform2f(uR, cv.width, cv.height);
        gl.uniform1f(uT, (performance.now() - t0) / 1000);
        gl.uniform1f(uL, document.documentElement.getAttribute('data-theme') === 'light' ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(frame);
    };
    frame();
  };

  /* ---------- YARDIMCI ---------- */
  window.Zirve = {
    $, $$, IMGP: 'assets/img/photos/',
    money: (n) => '₺' + Number(n).toLocaleString(TL.tr),
    qs: (k) => new URLSearchParams(location.search).get(k),
    boot, buildArc
  };

  document.addEventListener('DOMContentLoaded', () => { boot(); buildArc(); initShader(); });
})();

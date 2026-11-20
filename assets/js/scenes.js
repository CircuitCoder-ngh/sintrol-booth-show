/* Sintrol booth showcase: the attract-loop "film" and the Learn more slide layouts.
   Each scene builds its DOM into api.root and adds animation to api.tl (a paused GSAP timeline).
   Anything tagged data-product / data-case / data-app / data-cert / data-country opens the matching view. */
window.Scenes = (function () {
  "use strict";
  const A = window.SINTROL;
  const NS = "http://www.w3.org/2000/svg";

  /* ---------- Image helpers ---------- */
  const PRODUCT = new Set(["s305qal", "s304", "s304qal", "s101", "s201", "s203", "s303", "espy", "s314", "exoqal", "exo", "dumopro", "dumopro-side", "dumopro-ex", "vulcan12mt"]);
  const PLATE = new Set(["dusttool", "dumopro-dusttool", "dustcloud-flow", "dustcloud-views", "dustcloud-multisite", "exoqal-flow"]);
  function src(name) { return "assets/img/" + name + ".webp"; }
  function kind(name) { return PRODUCT.has(name) ? "spot" : PLATE.has(name) ? "plate" : "photo"; }

  /* ---------- DOM helpers ---------- */
  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function pos(e, x, y, w, h) {
    e.style.left = x + "px"; e.style.top = y + "px";
    if (w != null) e.style.width = w + "px";
    if (h != null) e.style.height = h + "px";
    return e;
  }
  function s(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  /* Text with \n line breaks -> word spans for staggered entrances */
  function words(text) {
    return text.split("\n").map(line => line.split(" ").map(w => '<span class="w">' + esc(w) + "</span>").join(" ")).join("<br>");
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fmt = (n, d) => n.toFixed(d);

  /* ---------- Scene API ---------- */
  function makeApi(root, tl) {
    const api = { root, tl, loops: [] };

    api.art = function () { return s("svg", { class: "art", viewBox: "0 0 1920 1080" }, root); };
    api.text = function (tag, cls, x, y, w, html) { return pos(el(tag, cls, root, html), x, y, w); };
    api.title = function (text, x, y, w, cls) { return api.text("h1", cls || "h1", x, y, w, words(text)); };

    api.rise = function (target, at, o) {
      const t = typeof target === "string" ? root.querySelectorAll(target) : target;
      const els = t instanceof Element && t.querySelectorAll(".w").length ? t.querySelectorAll(".w") : t;
      tl.from(els, Object.assign({ y: 46, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.055 }, o || {}), at);
    };
    api.fade = function (target, at, o) {
      tl.from(target, Object.assign({ opacity: 0, y: 24, duration: 0.8, ease: "power2.out" }, o || {}), at);
    };

    /* Product render on a glow, a light plate (screenshots, diagrams) or a photo */
    api.spot = function (name, x, y, w, h, o) {
      o = o || {};
      const k = o.kind || kind(name);
      const d = pos(el("div", "spot " + (k === "spot" ? "" : k), root), x, y, w, h);
      if (o.product) d.dataset.product = o.product;
      if (o.case) d.dataset.case = o.case;
      const im = el("img", "", d); im.src = src(name); im.alt = o.alt || "";
      if (o.badge) { const b = el("span", "badge new", d, esc(o.badge)); b.style.cssText = "position:absolute;top:14px;left:14px"; }
      return d;
    };

    api.cap = function (x, y, w, name, line, product) {
      const c = api.text("div", "cap", x, y, w, "<b>" + esc(name) + "</b>" + (line ? "<span>" + esc(line) + "</span>" : ""));
      if (product) c.dataset.product = product;
      return c;
    };
    api.chips = function (x, y, w, list) {
      return api.text("div", "chips", x, y, w, list.map(c => typeof c === "string" ? '<span class="chip">' + esc(c) + "</span>"
        : '<button class="chip" ' + c[1] + '="' + esc(c[2]) + '">' + esc(c[0]) + "</button>").join(""));
    };

    /* Animate an SVG path drawing on */
    api.draw = function (path, at, dur, ease) {
      const L = path.getTotalLength();
      path.style.strokeDasharray = L + " " + L;
      path.style.strokeDashoffset = L;
      tl.to(path, { strokeDashoffset: 0, duration: dur || 1.2, ease: ease || "power1.inOut" }, at);
    };

    /* Register an endless ambient tween; it starts at `at` on the scene timeline */
    api.loop = function (tw, at) {
      tw.pause();
      const l = { tw, at: at || 0, started: false };
      api.loops.push(l);
      tl.call(() => { l.started = true; tw.play(); }, null, at || 0);
      return l;
    };
    /* Repeating callback (readouts etc.) */
    api.every = function (sec, fn, at) {
      fn();
      return api.loop(gsap.to({}, { duration: sec, repeat: -1, onRepeat: fn }), at);
    };
    /* Per-frame callback with elapsed seconds (frozen while paused) */
    api.frame = function (fn, at) {
      let last = 0;
      const st = { t: 0 };
      return api.loop(gsap.to(st, { t: 1, duration: 1, repeat: -1, ease: "none", onUpdate() {
        const now = performance.now();
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
        last = now; fn(dt);
      }, onRepeat() {} }), at);
    };

    /* Pulses travelling along a path */
    api.flow = function (path, at, o) {
      o = Object.assign({ n: 10, r: 5, color: "#0080C4", dur: 3, halo: true }, o || {});
      const svg = path.ownerSVGElement, L = path.getTotalLength();
      const g = s("g", { opacity: 0 }, svg);
      const dots = [];
      for (let i = 0; i < o.n; i++) {
        const halo = o.halo ? s("circle", { r: o.r * 2.6, fill: o.color, opacity: 0.18 }, g) : null;
        const core = s("circle", { r: o.r, fill: o.color }, g);
        dots.push([halo, core]);
      }
      const st = { t: 0 };
      function upd() {
        for (let i = 0; i < o.n; i++) {
          const u = (st.t + i / o.n) % 1;
          const p = path.getPointAtLength(L * u);
          const a = Math.min(1, u / 0.05, (1 - u) / 0.05);
          for (const c of dots[i]) if (c) { c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); }
          dots[i][1].setAttribute("opacity", a);
          if (dots[i][0]) dots[i][0].setAttribute("opacity", 0.18 * a);
        }
      }
      upd();
      api.loop(gsap.to(st, { t: 1, duration: o.dur, ease: "none", repeat: -1, onUpdate: upd }), at);
      tl.to(g, { opacity: 1, duration: 0.6 }, at);
      return g;
    };

    /* Dust particles drifting through a box. dir: "x" (left to right) or "y" (rising). Returns a handle. */
    api.dust = function (svg, box, at, o) {
      o = Object.assign({ n: 60, speed: 140, r: [1.4, 3.2], color: "#8E7D60", dir: "x", alpha: [0.35, 0.9], wobble: 8 }, o || {});
      const g = s("g", { opacity: 0 }, svg);
      const P = [];
      for (let i = 0; i < o.n; i++) {
        const c = s("circle", { r: rnd(o.r[0], o.r[1]), fill: o.color, opacity: rnd(o.alpha[0], o.alpha[1]) }, g);
        P.push({ c, x: rnd(0, box.w), y: rnd(0, box.h), v: rnd(0.7, 1.3), ph: rnd(0, 6.28), on: true });
      }
      const h = { g, P, density: 1, speed: o.speed, color: o.color, onPass: null };
      function place(p) {
        const wob = Math.sin(p.ph) * o.wobble;
        const x = o.dir === "x" ? box.x + p.x : box.x + p.y + wob;
        const y = o.dir === "x" ? box.y + p.y + wob : box.y + box.h - p.x;
        p.c.setAttribute("cx", x); p.c.setAttribute("cy", y);
        return [x, y];
      }
      P.forEach(place);
      api.frame(dt => {
        const len = o.dir === "x" ? box.w : box.h;
        P.forEach((p, i) => {
          p.x += h.speed * p.v * dt; p.ph += dt * 1.6;
          if (p.x > len) { p.x -= len; p.y = rnd(0, o.dir === "x" ? box.h : box.w); p.on = (i / P.length) < h.density; p.c.style.display = p.on ? "" : "none"; }
          const xy = place(p);
          if (h.onPass && p.on) h.onPass(p, xy);
        });
      }, at);
      tl.to(g, { opacity: 1, duration: 0.8 }, at);
      h.set = function (k) { h.density = k; };
      return h;
    };

    /* A live, scrolling trace (dust trend, AC/DC signal). gen() returns 0..1 for each new sample. */
    api.trace = function (svg, x, y, w, h, at, o) {
      o = Object.assign({ n: 90, dt: 0.12, color: "#0080C4", width: 3, fill: true, gen: () => 0.2 }, o || {});
      const g = s("g", {}, svg);
      s("line", { x1: x, y1: y + h, x2: x + w, y2: y + h, stroke: "#D3DBE3", "stroke-width": 1.5 }, g);
      const area = o.fill ? s("path", { fill: o.color, opacity: 0.12 }, g) : null;
      const line = s("polyline", { fill: "none", stroke: o.color, "stroke-width": o.width, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
      const vals = Array.from({ length: o.n }, () => o.gen(true));
      function draw() {
        const pts = vals.map((v, i) => (x + w * i / (o.n - 1)).toFixed(1) + "," + (y + h - h * Math.max(0, Math.min(1, v))).toFixed(1));
        line.setAttribute("points", pts.join(" "));
        if (area) area.setAttribute("d", "M" + x + " " + (y + h) + " L" + pts.join(" L") + " L" + (x + w) + " " + (y + h) + "Z");
      }
      draw();
      api.every(o.dt, () => { vals.shift(); vals.push(o.gen()); draw(); }, at);
      return { g, line, vals };
    };

    /* Seven-segment style readout with three status LEDs */
    api.lcd = function (x, y, digits, size) {
      const d = api.text("div", "", x, y, null, '<div class="seg"><span style="font-size:' + (size || 110) + 'px">' + "8".repeat(digits || 4) + "</span></div>");
      return { el: d, set(t) { d.querySelector(".seg span").textContent = t; } };
    };
    api.leds = function (x, y) {
      const d = api.text("div", "leds", x, y, null, '<i class="g"></i><i class="o"></i><i class="r"></i>');
      const [g, o, r] = d.querySelectorAll("i");
      return { el: d, set(state) { g.classList.toggle("on", state === "g"); o.classList.toggle("on", state === "o"); r.classList.toggle("on", state === "r"); } };
    };

    return api;
  }

  const product = id => A.products[id];

  /* A tiny monitor glyph for diagrams: round lime enclosure with a probe */
  function monitorGlyph(svg, x, y, sc, probe, attrs) {
    const g = s("g", Object.assign({ transform: "translate(" + x + " " + y + ") scale(" + (sc || 1) + ")" }, attrs || {}), svg);
    if (probe) s("rect", { x: -4, y: 0, width: 8, height: probe, rx: 3, fill: "url(#g-steel)" }, g);
    if (probe) s("rect", { x: -6, y: 0, width: 12, height: 26, rx: 3, fill: "#8A5A2B" }, g);
    s("circle", { cx: 0, cy: -34, r: 38, fill: "#24407A", stroke: "#C9D72B", "stroke-width": 7 }, g);
    s("circle", { cx: 0, cy: -34, r: 20, fill: "#0B2018" }, g);
    const led = s("circle", { cx: 0, cy: -34, r: 6, fill: "#45D483" }, g);
    return { g, led };
  }

  /* World map with distributor countries, HQ and offices. Used by the network scene, Learn more and Explore. */
  function worldMap(parent, w, opts) {
    opts = opts || {};
    const W = window.WORLD, N = window.NETWORK;
    const h = Math.round(w * W.h / W.w);
    const wrap = el("div", "map", parent);
    wrap.style.width = w + "px"; wrap.style.height = h + "px";
    const svg = s("svg", { viewBox: "0 0 " + W.w + " " + W.h }, wrap);
    const on = {};
    N.countries.forEach(c => { on[c.atlas] = c; });
    const paths = {};
    const land = s("g", {}, svg);
    W.countries.forEach(c => {
      const p = s("path", { d: c.d, class: "c" + (on[c.n] ? " on" : "") + (c.n === N.hq.atlas ? " hq" : "") }, land);
      if (on[c.n] && opts.interactive !== false) p.dataset.country = on[c.n].name;
      paths[c.n] = p;
    });
    const arcs = s("g", {}, svg), pins = s("g", {}, svg);
    const arcList = N.countries.map(c => {
      const dx = c.x - N.hq.x, dy = c.y - N.hq.y, len = Math.hypot(dx, dy);
      const mx = (c.x + N.hq.x) / 2 - dy * 0.18, my = (c.y + N.hq.y) / 2 - Math.abs(dx) * 0.12 - len * 0.05;
      return { c, p: s("path", { class: "arc", d: "M" + N.hq.x + " " + N.hq.y + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + c.x + " " + c.y }, arcs) };
    });
    const pinList = N.countries.map(c => {
      const p = s("circle", { class: "pin", cx: c.x, cy: c.y, r: 2.6 }, pins);
      if (opts.interactive !== false) p.dataset.country = c.name;
      return p;
    });
    const offices = N.offices.map(o => s("circle", { class: "pin hq", cx: o.x, cy: o.y, r: 3.6 }, pins));
    const pulse = s("circle", { class: "pulse", cx: N.hq.x, cy: N.hq.y, r: 4 }, pins);
    const hq = s("circle", { class: "pin hq", cx: N.hq.x, cy: N.hq.y, r: 5 }, pins);
    return { wrap, svg, paths, arcs: arcList, pins: pinList, offices, pulse, hq, h, scale: w / W.w };
  }

  /* =====================================================================
     Scenes
     ===================================================================== */
  const list = [];

  /* 1. Opening: Measuring matters */
  list.push({ id: "intro", family: null, dur: 16, build(a) {
    const svg = a.art();
    // a duct the dust travels through, behind the monitor
    const duct = s("g", {}, svg);
    s("rect", { x: 900, y: 610, width: 1100, height: 210, fill: "url(#g-duct)", opacity: 0.75 }, duct);
    s("line", { x1: 900, y1: 610, x2: 2000, y2: 610, stroke: "rgba(40,62,86,.25)", "stroke-width": 2 }, duct);
    s("line", { x1: 900, y1: 820, x2: 2000, y2: 820, stroke: "rgba(40,62,86,.25)", "stroke-width": 2 }, duct);
    const dust = a.dust(svg, { x: 900, y: 625, w: 1100, h: 180 }, 1.2, { n: 70, speed: 170 });
    const mon = a.spot("s304", 1150, 140, 600, 500, { product: "s304" });
    // the signal the monitor makes, drawn out along the floor
    const sig = s("path", { d: "M1300 600 C1250 690 1150 860 980 860 L96 860", stroke: "url(#g-brand)", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, svg);
    const sigGlow = s("path", { d: sig.getAttribute("d"), stroke: "url(#g-brand)", "stroke-width": 14, fill: "none", opacity: 0.15 }, svg);

    const kick = a.text("div", "kick", 96, 168, 900, "Sintrol &nbsp;·&nbsp; Dust Monitoring Solutions");
    const h = a.title("Measuring\nmatters.", 96, 214, 1000, "display");
    const lede = a.text("p", "lede", 96, 450, 900, "Sintrol dust monitors catch filter failures early, prove emissions compliance and warn of airborne dust. Finnish-engineered by Sintrol's own R&D team.");
    const tags = A.company.facts.map((f, i) => a.text("div", "tag", 96 + i * 240, 660, 220, "<b>" + esc(f.big) + "</b><span>" + esc(f.small) + "</span>"));
    const ro = a.text("div", "status", 1480, 846, null, '<i></i><span class="v">0.42 mg/m³</span>');
    ro.dataset.product = "s304";
    a.every(0.9, () => { ro.querySelector(".v").textContent = fmt(rnd(0.38, 0.47), 2) + " mg/m³"; }, 3);

    a.tl.from(duct, { opacity: 0, duration: 1 }, 0.2);
    a.fade(kick, 0.2, { y: -10 });
    a.rise(h, 0.4, { stagger: 0.12 });
    a.tl.from(mon, { x: 120, opacity: 0, duration: 1.4, ease: "power3.out" }, 0.8);
    a.fade(lede, 1.4);
    a.draw(sig, 2.4, 2.2); a.draw(sigGlow, 2.4, 2.2);
    a.flow(sig, 4.6, { n: 8, dur: 3.4, r: 4.5, color: "#0080C4" });
    tags.forEach((t, i) => a.fade(t, 2.8 + i * 0.35, { y: 18 }));
    a.fade(ro, 3.2, { y: -10 });
  } });

  /* 2. The measuring principle: Inductive Electrification */
  list.push({ id: "principle", family: "tech", dur: 18, build(a) {
    const svg = a.art();
    const D = { x: 760, y: 560, w: 1160, h: 260 }, PX = 1240, TIP = 760;
    const duct = s("g", {}, svg);
    s("rect", { x: D.x, y: D.y, width: D.w, height: D.h, fill: "url(#g-duct)", opacity: 0.85 }, duct);
    s("line", { x1: D.x, y1: D.y, x2: D.x + D.w, y2: D.y, stroke: "rgba(40,62,86,.35)", "stroke-width": 3 }, duct);
    s("line", { x1: D.x, y1: D.y + D.h, x2: D.x + D.w, y2: D.y + D.h, stroke: "rgba(40,62,86,.35)", "stroke-width": 3 }, duct);
    const flowLbl = s("text", { x: D.x + 20, y: D.y + D.h - 18, fill: "#6B6B6B", "font-size": 19 }, duct); flowLbl.textContent = "Gas flow with particles  →";
    // probe from the top wall: insulator, then the sensing rod
    const probe = s("g", { "data-product": "s304" }, svg);
    s("rect", { x: PX - 9, y: D.y - 40, width: 18, height: 70, rx: 4, fill: "#8A5A2B" }, probe);
    s("rect", { x: PX - 5, y: D.y + 28, width: 10, height: TIP - D.y - 28, rx: 5, fill: "url(#g-steel)" }, probe);
    const head = monitorGlyph(svg, PX, D.y - 40, 1.25, 0);
    const dust = a.dust(svg, { x: D.x, y: D.y + 18, w: D.w, h: D.h - 50 }, 0.8, { n: 80, speed: 230, wobble: 4 });
    const rings = s("g", {}, svg);
    // signal traces above the duct
    let pulse = 0, dc = 0.35;
    // particles that hit the probe (contact, DC) or pass just below its tip (induction, AC) light up
    dust.onPass = (p, xy) => {
      if (Math.abs(xy[0] - PX) >= 4 || p.hit === Math.round(p.x / 50) || Math.random() < 0.4) return;
      const contact = xy[1] < TIP;
      if (!contact && xy[1] > TIP + 44) return;
      p.hit = Math.round(p.x / 50);
      const r = s("circle", { cx: PX, cy: contact ? xy[1] : TIP + 4, r: 4, fill: "none", stroke: contact ? "#0080C4" : "#00A696", "stroke-width": 2.5 }, rings);
      gsap.to(r, { attr: { r: 28 }, opacity: 0, duration: 0.6, ease: "power1.out", onComplete: () => r.remove() });
      pulse = Math.min(1, pulse + (contact ? 0.35 : 0.6));
      if (contact) dc = Math.min(0.62, dc + 0.02);
    };
    const T = { x: 1360, w: 460 };
    const lab = (t, x, y, c) => { const e = s("text", { x, y, fill: c || "#4D4D4D", "font-size": 20, "font-weight": 600 }, svg); e.textContent = t; return e; };
    const l1 = lab("DC: contact charge", T.x, 196, "#0080C4"), l2 = lab("AC: induced as particles pass", T.x, 336, "#00A696");
    const acT = a.trace(svg, T.x, 350, T.w, 110, 2.2, { color: "#00A696", fill: false, dt: 0.06, n: 110, gen: () => { const v = 0.5 + (Math.random() - 0.5) * 0.25 * (0.3 + pulse) + (Math.random() < pulse * 0.4 ? (Math.random() < 0.5 ? 0.4 : -0.4) : 0); pulse *= 0.86; return v; } });
    const dcT = a.trace(svg, T.x, 210, T.w, 100, 2.0, { color: "#0080C4", fill: true, dt: 0.12, n: 70, gen: () => { dc += (Math.random() - 0.48) * 0.05; dc = Math.max(0.2, Math.min(0.6, dc)); return dc; } });
    const box = a.text("div", "readout", 1000, 168, 300, '<div><span>Signal</span><b class="v1">Processed</b></div><div class="hl"><span>Dust</span><b class="v2">2.14 mg/m³</b></div>');
    box.dataset.product = "s304";
    a.every(0.7, () => { box.querySelector(".v2").textContent = fmt(rnd(2.05, 2.25), 2) + " mg/m³"; }, 4);
    const toBox = s("path", { d: "M1355 260 C1320 260 1320 230 1300 230", stroke: "#D3DBE3", "stroke-width": 2, fill: "none" }, svg);

    const kick = a.text("div", "kick", 96, 168, 600, "Inductive Electrification");
    const h = a.title("One probe.\nNo optics.\nNo consumables.", 96, 214, 640);
    const lede = a.text("p", "lede", 96, 470, 620, "Particles that touch or pass the insulated probe create a charge. Sintrol's algorithms filter it into a reading proportional to dust concentration.");
    const chips = a.chips(96, 760, 620, ["Detection limit 0.01 mg/m³", "Ducts up to 7 m", "Process up to 700 °C (option)", "No alignment"]);

    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3);
    a.tl.from(duct, { opacity: 0, duration: 0.9 }, 0.4);
    a.tl.from([probe, head.g], { opacity: 0, y: -40, duration: 0.9, ease: "power3.out" }, 0.9);
    a.fade(lede, 1.3);
    a.tl.from([l1, l2, dcT.g, acT.g], { opacity: 0, duration: 0.8, stagger: 0.15 }, 1.8);
    a.fade(box, 3.6, { y: 0 }); a.tl.from(toBox, { opacity: 0, duration: 0.5 }, 3.6);
    a.rise(chips.children, 4.4, { stagger: 0.14, y: 20 });
  } });

  /* 3. Auto Setup: commissioned in 500 seconds */
  list.push({ id: "autosetup", family: "tech", dur: 15, build(a) {
    const mon = a.spot("s303", 1240, 150, 560, 480, { product: "s303" });
    const lcd = a.lcd(1000, 650, 4, 120);
    const leds = a.leds(1330, 715);
    const st = a.text("div", "status", 1000, 830, null, "<i></i><span>Waiting for Auto Setup</span>");
    st.querySelector("i").style.background = "#B3B3B3"; st.querySelector("i").style.boxShadow = "none";
    const kick = a.text("div", "kick", 96, 168, 700, "Auto Setup");
    const h = a.title("Commissioned\nin 500 seconds.", 96, 214, 860);
    const lede = a.text("p", "lede", 96, 392, 820, "Press Auto Setup in normal process conditions. The monitor learns the process, sets its own measuring range and alarms, and goes green.");
    const steps = [["Install", "through a single opening"], ["Press Auto Setup", "the LED blinks, a countdown runs"], ["Learn", "range and alarm levels set automatically"], ["Run", "green light, output at 5 % of range"]];
    const ol = a.text("ol", "steps", 96, 560, 820, steps.map((t, i) => "<li><i>" + (i + 1) + "</i><span><b>" + esc(t[0]) + "</b>" + esc(t[1]) + "</span></li>").join("") + '<div class="rail" style="height:' + (3 * 84) + 'px"><span></span></div>');
    ol.querySelectorAll("li").forEach(li => { li.style.marginBottom = "18px"; });
    ol.dataset.product = "s303";
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.tl.from(mon, { x: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, 0.5);
    a.fade([lcd.el, leds.el, st], 1.4);
    a.fade(ol, 1.6);
    const lis = ol.querySelectorAll("li"), bar = ol.querySelector(".rail span");
    lcd.set("----"); leds.set("");
    a.tl.call(() => lis[0].classList.add("on"), null, 2.2);
    a.tl.call(() => { lis[1].classList.add("on"); st.querySelector("span").textContent = "Auto Setup running"; st.querySelector("i").style.cssText = ""; }, null, 3.6);
    a.tl.to(bar, { height: 84, duration: 0.6 }, 3.2);
    const cd = { v: 500 };
    a.tl.to(cd, { v: 0, duration: 4.2, ease: "none", onUpdate: () => lcd.set(String(Math.round(cd.v)).padStart(4, " ")) }, 3.8);
    let blink = false;
    const bl = gsap.to({}, { duration: 0.35, repeat: 12, onRepeat: () => { blink = !blink; leds.set(blink ? "g" : ""); } });
    bl.pause(); a.tl.call(() => bl.restart(), null, 3.8);
    a.loops.push({ tw: bl, at: 99, started: false });
    a.tl.call(() => lis[2].classList.add("on"), null, 5.6);
    a.tl.to(bar, { height: 168, duration: 0.6 }, 5.2);
    a.tl.call(() => { lis[3].classList.add("on"); leds.set("g"); lcd.set(" 5.0"); st.querySelector("span").textContent = "Normal: range and alarms set, output 5 %"; }, null, 8.2);
    a.tl.to(bar, { height: 252, duration: 0.6 }, 7.8);
  } });

  /* 4. S305QAL: certified for official reporting */
  list.push({ id: "qal", family: "emission", dur: 16, build(a) {
    const sp = a.spot("s305qal", 90, 180, 720, 620, { product: "s305qal" });
    const kick = a.text("div", "", 900, 166, 900, '<span class="model">S305QAL / S305QAL Ex</span>&nbsp;&nbsp;<span class="badge new">QAL1</span>');
    const h = a.title("Certified for\nofficial reporting.", 900, 222, 940);
    const lede = a.text("p", "lede", 900, 400, 920, "QAL1 to EN 15267-3 and compliant with EN 14181 and EN 13284-2, for waste incineration, combustion plants and industrial emissions.");
    const ranges = [["0–7.5 mg/m³", 0.16], ["0–15 mg/m³", 0.32], ["0–100 mg/m³", 1]];
    const rb = a.text("div", "", 900, 560, 900, '<div class="small" style="margin-bottom:14px">Certified measuring ranges</div>' + ranges.map(r =>
      '<div style="display:flex;align-items:center;gap:18px;margin:0 0 12px"><div style="flex:none;width:180px;font-size:24px;font-weight:700;color:var(--mist)">' + r[0] + '</div><div style="flex:1;height:14px;border-radius:7px;background:#E2E9F0;overflow:hidden"><i style="display:block;height:100%;width:' + (r[1] * 100) + '%;background:var(--brand)"></i></div></div>').join(""));
    rb.dataset.product = "s305qal";
    const chips = a.chips(900, 770, 920, [["QAL1, TÜV SÜD", "data-cert", "qal1"], ["MCERTS", "data-cert", "mcerts"], ["NPL India", "data-cert", "npl"], ["US EPA PS-11", "data-cert", "epa"], ["ATEX, IECEx", "data-cert", "atex"]]);
    const zs = a.text("div", "readout", 120, 790, 330, '<div><span>Zero check</span><b class="z">OK</b></div><div class="hl"><span>Span check</span><b class="sp">OK</b></div>');
    zs.dataset.product = "s305qal";
    a.tl.from(sp, { x: -80, opacity: 0, duration: 1.2, ease: "power3.out" }, 0.2);
    a.fade(kick, 0.3); a.rise(h, 0.5); a.fade(lede, 1.3);
    a.fade(rb, 2.1);
    a.tl.from(rb.querySelectorAll("i"), { width: 0, duration: 1.1, stagger: 0.25, ease: "power2.out" }, 2.4);
    a.rise(chips.children, 3.4, { stagger: 0.12, y: 20 });
    a.fade(zs, 4.2);
    a.every(2.4, () => { zs.querySelector(".z").textContent = "Checking"; setTimeout(() => { if (zs.isConnected) zs.querySelector(".z").textContent = "OK"; }, 900); }, 6);
  } });

  /* 5. Dry stack or wet stack */
  list.push({ id: "stacks", family: "emission", dur: 17, build(a) {
    const svg = a.art();
    const stack = (x, label) => {
      const g = s("g", {}, svg);
      s("rect", { x, y: 250, width: 120, height: 620, fill: "#E2E9F0", stroke: "rgba(40,62,86,.25)", "stroke-width": 2 }, g);
      s("rect", { x: x - 10, y: 236, width: 140, height: 18, rx: 3, fill: "#CBD5DF" }, g);
      const t = s("text", { x: x + 60, y: 910, "text-anchor": "middle", fill: "#4D4D4D", "font-size": 22, "font-weight": 700 }, g); t.textContent = label;
      return g;
    };
    const dry = stack(940, "Dry stack"), wet = stack(1400, "Wet stack");
    const dryDust = a.dust(svg, { x: 950, y: 260, w: 100, h: 600 }, 1.4, { n: 34, dir: "y", speed: 120, wobble: 6 });
    const wetDust = a.dust(svg, { x: 1410, y: 260, w: 100, h: 600 }, 2.2, { n: 22, dir: "y", speed: 110, wobble: 6 });
    const drops = a.dust(svg, { x: 1410, y: 260, w: 100, h: 600 }, 2.2, { n: 26, dir: "y", speed: 90, color: "#3BA6DD", r: [3, 5], wobble: 10 });
    // steam plume on the wet stack
    for (let i = 0; i < 8; i++) {
      const c = s("circle", { cx: 1460, cy: 240, r: 20, fill: "url(#g-steam)" }, svg);
      const t = gsap.timeline({ repeat: -1, delay: i * 0.6 });
      t.fromTo(c, { attr: { cy: 240, r: 20, cx: 1460 }, opacity: 0 }, { attr: { cy: 110, r: 70, cx: 1460 + rnd(30, 110) }, duration: 5, ease: "sine.out" }, 0).to(c, { opacity: 1, duration: 0.8 }, 0).to(c, { opacity: 0, duration: 3, ease: "sine.in" }, 2);
      a.loop(t, 2.2);
    }
    const m1 = a.spot("s305qal", 1040, 470, 150, 130, { product: "s305qal" });
    // EXO QAL cabinet with the sample loop
    const cab = s("g", { "data-product": "exoqal" }, svg);
    s("rect", { x: 1610, y: 430, width: 210, height: 230, rx: 12, fill: "#24407A", stroke: "#C9D72B", "stroke-width": 3 }, cab);
    s("rect", { x: 1630, y: 450, width: 70, height: 46, rx: 4, fill: "#0B2018", stroke: "#3B5B80" }, cab);
    const heat = s("circle", { cx: 1680, cy: 590, r: 46, fill: "url(#g-heat)" }, cab);
    const beam = s("line", { x1: 1730, y1: 540, x2: 1800, y2: 610, stroke: "#FFF6B0", "stroke-width": 3, opacity: 0.8 }, cab);
    const ct = s("text", { x: 1715, y: 690, "text-anchor": "middle", fill: "#005CA9", "font-size": 20, "font-weight": 700 }, cab); ct.textContent = "EXO QAL";
    const out = s("path", { d: "M1520 520 H1610", stroke: "#3BA6DD", "stroke-width": 5, fill: "none" }, svg);
    const back = s("path", { d: "M1610 640 C1570 640 1560 700 1520 700", stroke: "#4D4D4D", "stroke-width": 4, fill: "none", "stroke-dasharray": "8 8" }, svg);
    a.loop(gsap.to(heat, { attr: { r: 56 }, opacity: 0.6, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" }), 4);
    a.loop(gsap.to(beam, { opacity: 0.25, duration: 0.25, yoyo: true, repeat: -1 }), 4);

    const h = a.title("Dry stack or wet stack?\nThe stack decides.", 96, 150, 820);
    const lede = a.text("p", "lede", 96, 320, 800, "In-situ monitors suit dry, non-condensing stacks. After a wet scrubber or wet ESP, droplets get in the way, so EXO QAL extracts and conditions the sample first.");
    const steps = (product("exoqal").steps || []).map(s0 => s0[0]);
    const ol = a.text("ol", "steps", 96, 540, 780, steps.map((t, i) => "<li><i>" + (i + 1) + "</i><span>" + esc(t) + "</span></li>").join(""));
    ol.querySelectorAll("li").forEach(li => { li.style.marginBottom = "16px"; });
    ol.dataset.product = "exoqal";

    a.rise(h, 0.2); a.fade(lede, 1.0);
    a.tl.from(dry, { opacity: 0, y: 30, duration: 0.8 }, 0.6);
    a.tl.from(m1, { opacity: 0, x: 30, duration: 0.8 }, 1.3);
    a.tl.from(wet, { opacity: 0, y: 30, duration: 0.8 }, 1.6);
    a.draw(out, 3.0, 0.6); a.tl.from(cab, { opacity: 0, x: 40, duration: 0.8 }, 3.3); a.draw(back, 3.9, 0.6);
    a.flow(out, 4.2, { n: 4, dur: 1.4, r: 4, color: "#3BA6DD" });
    a.flow(back, 4.6, { n: 4, dur: 1.6, r: 3.5, color: "#4D4D4D", halo: false });
    a.fade(ol, 2.2);
    const lis = ol.querySelectorAll("li");
    lis.forEach((li, i) => a.tl.call(() => lis.forEach((x, j) => x.classList.toggle("on", j <= i)), null, 4.2 + i * 1.5));
  } });

  /* 6. Baghouse: see the broken bag before the dust */
  list.push({ id: "baghouse", family: "filtration", dur: 19, build(a) {
    const svg = a.art();
    const B = { x: 830, y: 460, w: 640, h: 340 };
    const house = s("g", {}, svg);
    s("rect", { x: B.x, y: B.y, width: B.w, height: B.h, rx: 14, fill: "#F4F7FA", stroke: "rgba(40,62,86,.3)", "stroke-width": 2 }, house);
    s("path", { d: "M" + B.x + " " + (B.y + B.h) + " L" + (B.x + 90) + " " + (B.y + B.h + 70) + " H" + (B.x + B.w - 90) + " L" + (B.x + B.w) + " " + (B.y + B.h) + "Z", fill: "#E8EEF4", stroke: "rgba(40,62,86,.25)", "stroke-width": 2 }, house);
    const bags = [];
    for (let c = 0; c < 4; c++) {
      if (c) s("line", { x1: B.x + c * B.w / 4, y1: B.y, x2: B.x + c * B.w / 4, y2: B.y + B.h, stroke: "rgba(40,62,86,.18)", "stroke-width": 2 }, house);
      const t = s("text", { x: B.x + (c + 0.5) * B.w / 4, y: B.y - 12, "text-anchor": "middle", fill: "#6B6B6B", "font-size": 17 }, house); t.textContent = "Compartment " + (c + 1);
      for (let k = 0; k < 3; k++) {
        const x = B.x + c * B.w / 4 + 22 + k * 46;
        bags.push(s("rect", { x, y: B.y + 36, width: 30, height: 236, rx: 15, fill: "#CBD5DF", stroke: "rgba(0,128,196,.45)", "stroke-width": 2 }, house));
      }
    }
    const dirty = a.dust(svg, { x: B.x + 10, y: B.y + 270, w: B.w - 20, h: 110 }, 1.0, { n: 60, speed: 90, wobble: 14 });
    // clean outlet duct along the top, out to the right
    const ductPath = "M" + (B.x + B.w / 2) + " " + B.y + " V" + (B.y - 60) + " H1840";
    const duct = s("path", { d: ductPath, stroke: "#D5DEE7", "stroke-width": 44, fill: "none", "stroke-linejoin": "round" }, svg);
    const clean = a.dust(svg, { x: 1200, y: B.y - 78, w: 640, h: 36 }, 1.0, { n: 40, speed: 260, wobble: 2, r: [1.4, 2.6] });
    clean.set(0.08);
    const mon = monitorGlyph(svg, 1660, B.y - 82, 0.85, 34, { "data-product": "s201" });
    // trend of outlet dust
    let level = 0.1;
    const tr = a.trace(svg, 1080, 160, 740, 110, 1.5, { color: "#0080C4", dt: 0.1, n: 100, gen: () => level + rnd(-0.015, 0.015) });
    const tl1 = s("text", { x: 1080, y: 148, fill: "#6B6B6B", "font-size": 19 }, svg); tl1.textContent = "Outlet dust trend";
    const alarmLine = s("line", { x1: 1080, y1: 160 + 110 * 0.55, x2: 1820, y2: 160 + 110 * 0.55, stroke: "#D95757", "stroke-width": 1.5, "stroke-dasharray": "6 6", opacity: 0.7 }, svg);
    const st = a.text("div", "status", 1080, 292, null, "<i></i><span>Normal</span>");
    st.dataset.product = "s201";
    const kick = a.text("div", "kick", 96, 168, 680, "Filtration monitoring");
    const h = a.title("See the broken bag\nbefore the dust.", 96, 214, 700);
    const lede = a.text("p", "lede", 96, 392, 680, "Differential pressure tells you about the filter. A Sintrol monitor in the outlet duct measures the dust that actually gets through.");
    const chips = a.chips(96, 640, 680, [["Broken bag detection", "data-app", "brokenbag"], ["Filter performance trends", "data-app", "trend"], ["Find the compartment", "data-case", "steel"]]);
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.tl.from(house, { opacity: 0, y: 30, duration: 0.9 }, 0.5);
    a.draw(duct, 1.2, 1.0);
    a.tl.from(mon.g, { opacity: 0, y: -20, duration: 0.6 }, 2.0);
    a.tl.from([tr.g, tl1, alarmLine, st], { opacity: 0, duration: 0.6, stagger: 0.1 }, 1.6);
    a.rise(chips.children, 2.4, { stagger: 0.14, y: 20 });
    const broken = bags[7];
    a.tl.call(() => { broken.setAttribute("stroke", "#D95757"); broken.setAttribute("fill", "#F8DCDC"); clean.set(0.9); }, null, 7.0);
    const L = { v: 0.1 };
    a.tl.to(L, { v: 0.7, duration: 1.4, ease: "power1.in", onUpdate: () => { level = L.v; } }, 7.2);
    a.tl.call(() => { st.classList.add("alarm"); st.querySelector("span").textContent = "Alarm: broken bag, compartment 3"; mon.led.setAttribute("fill", "#D95757"); }, null, 8.4);
    a.tl.fromTo(broken, { x: 0 }, { x: 3, duration: 0.08, repeat: 7, yoyo: true }, 7.0);
  } });

  /* 7. Filtration lineup */
  list.push({ id: "lineup", family: "filtration", dur: 14, build(a) {
    const h = a.title("A monitor for every duct.", 96, 150, 1720);
    const lede = a.text("p", "lede", 96, 250, 1500, "From a simple broken-bag alarm to EN 15859-certified filter monitoring, all on the same proven measuring principle.");
    const items = [["s101", "S101 / S103", "Leak alarm, ducts to 800 mm"], ["s201", "S201", "Two adjustable relays"], ["s203", "S203", "Trend output plus relays"],
      ["s303", "S303", "Process monitor, display"], ["s304", "S304", "Mass concentration, mg/m³"], ["s304qal", "S304QAL-L / -D", "Certified to EN 15859"]];
    const spots = items.map((it, i) => a.spot(it[0], 96 + i * 290, 370, 260, 260, { product: it[0] }));
    const caps = items.map((it, i) => { const c = a.cap(96 + i * 290, 650, 260, it[1], it[2], it[0]); c.querySelector("b").style.fontSize = "26px"; return c; });
    const svg = a.art();
    const arrow = s("path", { d: "M110 800 H1770 M1750 788 L1772 800 L1750 812", stroke: "url(#g-brand)", "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    const lab = [["Leak detection", 360], ["Trend and process", 960], ["Certified monitoring", 1560]].map(([t, x]) => { const e = a.text("div", "small", x - 180, 818, 360, esc(t)); e.style.textAlign = "center"; return e; });
    a.rise(h, 0.2); a.fade(lede, 0.8);
    a.rise(spots, 1.2, { y: 60, stagger: 0.2, duration: 1 });
    a.fade(caps, 1.7, { stagger: 0.2 });
    a.draw(arrow, 3.4, 1.4);
    a.fade(lab, 3.9, { stagger: 0.3 });
  } });

  /* 8. S314 split architecture */
  list.push({ id: "split", family: "filtration", dur: 15, build(a) {
    const svg = a.art();
    // elevated duct on a structure
    const st = s("g", {}, svg);
    s("rect", { x: 1560, y: 150, width: 260, height: 90, rx: 10, fill: "url(#g-duct)", stroke: "rgba(40,62,86,.3)", "stroke-width": 2 }, st);
    s("path", { d: "M1600 240 V880 M1780 240 V880 M1600 400 H1780 M1600 560 H1780 M1600 720 H1780 M1600 400 L1780 560 M1780 400 L1600 560 M1600 560 L1780 720 M1780 560 L1600 720", stroke: "rgba(40,62,86,.22)", "stroke-width": 3, fill: "none" }, st);
    s("line", { x1: 900, y1: 880, x2: 1880, y2: 880, stroke: "rgba(40,62,86,.3)", "stroke-width": 3 }, st);
    const dsu = monitorGlyph(svg, 1690, 168, 0.8, 0, { "data-product": "s314" });
    const dsuL = s("text", { x: 1690, y: 290, "text-anchor": "middle", fill: "#005CA9", "font-size": 19, "font-weight": 700 }, svg); dsuL.textContent = "Dust Sensor Unit";
    const cu = a.spot("s314", 1040, 520, 380, 360, { product: "s314" });
    const cable = s("path", { d: "M1650 180 C1500 180 1520 420 1460 560 S1420 700 1330 700", stroke: "#00A696", "stroke-width": 4, fill: "none", "stroke-dasharray": "2 10", "stroke-linecap": "round" }, svg);
    const cl = a.text("div", "readout", 1170, 300, 270, '<div style="display:block"><span>Interconnection cable</span><b style="display:block;font-size:34px;color:var(--blue)">up to 500 m</b></div>');
    const cuL = a.text("div", "small", 1040, 890, 380, "Connection Unit at ground level"); cuL.style.textAlign = "center"; cuL.style.color = "var(--soft)";
    const kick = a.text("div", "", 96, 166, 900, '<span class="model">S314 / S314 Ex</span>&nbsp;&nbsp;<span class="badge new">New</span>');
    const h = a.title("The sensor at the duct.\nThe electronics where\nyou can reach them.", 96, 222, 860);
    const lede = a.text("p", "lede", 96, 470, 800, "Split architecture keeps routine checks at ground level: less scaffolding, fewer permits, values and device health in view.");
    const chips = a.chips(96, 660, 820, ["Gas Zone 0, 1, 2 (Ex)", "Dust Zone 20, 21, 22 (Ex)", "Ducts 0.2 to 7 m", "Probe up to 1,750 mm"]);
    a.fade(kick, 0.2); a.rise(h, 0.3); a.fade(lede, 1.2);
    a.tl.from(st, { opacity: 0, duration: 0.9 }, 0.4);
    a.tl.from([dsu.g, dsuL], { opacity: 0, y: -20, duration: 0.7 }, 1.0);
    a.tl.from(cu, { opacity: 0, x: -40, duration: 0.9, ease: "power3.out" }, 1.4);
    a.draw(cable, 2.4, 1.4);
    a.flow(cable, 3.8, { n: 6, dur: 2.4, r: 4, color: "#0080C4" });
    a.fade([cl, cuL], 3.4);
    a.rise(chips.children, 3.0, { stagger: 0.14, y: 20 });
  } });

  /* 9. E-SPY after the ESP */
  list.push({ id: "esp", family: "filtration", dur: 14, build(a) {
    const svg = a.art();
    const E = { x: 820, y: 420, w: 560, h: 330 };
    const esp = s("g", {}, svg);
    s("rect", { x: E.x, y: E.y, width: E.w, height: E.h, rx: 14, fill: "#F4F7FA", stroke: "rgba(40,62,86,.3)", "stroke-width": 2 }, esp);
    for (let i = 0; i < 7; i++) s("line", { x1: E.x + 50 + i * 76, y1: E.y + 30, x2: E.x + 50 + i * 76, y2: E.y + E.h - 30, stroke: "rgba(40,62,86,.45)", "stroke-width": 4 }, esp);
    const bolts = s("g", {}, svg);
    for (let i = 0; i < 6; i++) {
      const b = s("path", { d: "M" + (E.x + 88 + i * 76) + " " + (E.y + 80) + " l-10 40 h14 l-12 44", stroke: "#0080C4", "stroke-width": 2.5, fill: "none", opacity: 0.2 }, bolts);
      a.loop(gsap.to(b, { opacity: 0.9, duration: 0.12, yoyo: true, repeat: -1, repeatDelay: rnd(0.4, 1.4) }), 1.5);
    }
    const lab = s("text", { x: E.x + E.w / 2, y: E.y - 18, "text-anchor": "middle", fill: "#6B6B6B", "font-size": 19 }, svg); lab.textContent = "Electrostatic precipitator";
    const inDust = a.dust(svg, { x: E.x - 160, y: E.y + 40, w: E.w + 160, h: E.h - 80 }, 1.0, { n: 70, speed: 150, wobble: 8 });
    const duct = s("rect", { x: E.x + E.w, y: E.y + 110, width: 460, height: 110, fill: "url(#g-duct)" }, svg);
    const outDust = a.dust(svg, { x: E.x + E.w, y: E.y + 120, w: 460, h: 90 }, 1.0, { n: 14, speed: 220, wobble: 4, r: [1.2, 2.2] });
    const sp = a.spot("espy", 1440, 300, 420, 220, { product: "espy" });
    // rapping-cycle trend
    let t = 0;
    const tr = a.trace(svg, 1420, 740, 420, 120, 1.4, { color: "#0080C4", dt: 0.08, n: 120, gen: () => { t += 0.08; const c = t % 3; return 0.15 + (c < 0.35 ? c * 1.6 : Math.max(0, 0.56 - (c - 0.35) * 0.5)) + rnd(-0.02, 0.02); } });
    const trl = s("text", { x: 1420, y: 724, fill: "#6B6B6B", "font-size": 19 }, svg); trl.textContent = "Relative dust trend: rapping cycles";
    const h = a.title("Reliable dust trends\nafter the ESP.", 96, 150, 700);
    const lede = a.text("p", "lede", 96, 330, 660, "E-SPY neutralises the electrostatic field in the outlet duct, where optics suffer from vibration and need clean purge air.");
    const res = a.text("div", "bigstat", 96, 560, 660, "<b>1 → 4</b><span>A one-month trial at a coal-fired power plant ended with the opacity monitor removed and three more E-SPY units ordered.</span>");
    res.dataset.case = "power";
    a.rise(h, 0.2); a.fade(lede, 1.0);
    a.tl.from(esp, { opacity: 0, y: 30, duration: 0.8 }, 0.5); a.fade(lab, 1.0);
    a.tl.from(duct, { opacity: 0, duration: 0.6 }, 1.0);
    a.tl.from(sp, { opacity: 0, x: 60, duration: 1, ease: "power3.out" }, 1.4);
    a.tl.from([tr.g, trl], { opacity: 0, duration: 0.6 }, 1.6);
    a.fade(res, 3.0);
  } });

  /* 10. DumoPro: airborne dust, watched 24/7 */
  list.push({ id: "ambient", family: "ambient", dur: 17, build(a) {
    const svg = a.art();
    const floor = s("g", {}, svg);
    s("line", { x1: 820, y1: 860, x2: 1880, y2: 860, stroke: "rgba(40,62,86,.3)", "stroke-width": 3 }, floor);
    // conveyor and transfer point
    s("rect", { x: 860, y: 700, width: 560, height: 26, rx: 13, fill: "#CBD5DF", stroke: "rgba(40,62,86,.3)" }, floor);
    for (let i = 0; i < 8; i++) s("circle", { cx: 880 + i * 74, cy: 713, r: 9, fill: "#F4F7FA", stroke: "rgba(40,62,86,.4)" }, floor);
    s("path", { d: "M900 726 V860 M1380 726 V860", stroke: "rgba(40,62,86,.25)", "stroke-width": 4 }, floor);
    s("path", { d: "M1400 560 L1470 560 L1450 690 L1420 690 Z", fill: "#E2E9F0", stroke: "rgba(40,62,86,.3)" }, floor);
    s("rect", { x: 1700, y: 300, width: 34, height: 560, fill: "#E2E9F0" }, floor);
    const mon = a.spot("dumopro", 1430, 250, 340, 290, { product: "dumopro" });
    const puffs = s("g", { opacity: 0 }, svg);
    for (let i = 0; i < 14; i++) {
      const c = s("circle", { cx: 1430, cy: 700, r: 20, fill: "url(#g-puff)" }, puffs);
      const t = gsap.timeline({ repeat: -1, delay: i * 0.35 });
      t.fromTo(c, { attr: { cy: 700, r: 18, cx: 1430 + rnd(-30, 20) }, opacity: 0 }, { attr: { cy: rnd(420, 520), r: rnd(70, 120), cx: 1430 + rnd(-200, 120) }, duration: 4.5, ease: "sine.out" }, 0)
        .to(c, { opacity: 1, duration: 0.6 }, 0).to(c, { opacity: 0, duration: 2.6, ease: "sine.in" }, 1.8);
      a.loop(t, 5.5);
    }
    const lcd = a.lcd(1430, 590, 4, 64), leds = a.leds(1640, 615);
    lcd.el.dataset.product = "dumopro";
    let lev = 1;
    const st = a.text("div", "status", 860, 880, null, "<i></i><span>Normal dust level</span>");
    a.every(0.4, () => { lcd.set(fmt(lev * rnd(0.95, 1.05), lev > 10 ? 0 : 1).padStart(4, " ")); leds.set(lev >= 20 ? "r" : lev >= 5 ? "o" : "g"); }, 1.5);
    const kick = a.text("div", "kick", 96, 168, 700, "DumoPro / DumoPro Ex");
    const h = a.title("Airborne dust,\nwatched 24/7.", 96, 214, 700);
    const lede = a.text("p", "lede", 96, 392, 680, "DumoPro detects dust releases around conveyors, silos and mills, including Zone 20, 21 and 22 areas, so you act before dust builds up.");
    const chips = a.chips(96, 620, 700, ["Auto Setup alarms at 5× and 20× normal", "Fan-driven measuring channel", ["ATEX, IECEx, HazLoc", "data-cert", "atex"], ["Explosion prevention", "data-app", "explosion"]]);
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.tl.from(floor, { opacity: 0, duration: 0.8 }, 0.4);
    a.tl.from(mon, { opacity: 0, x: 60, duration: 1.1, ease: "power3.out" }, 0.8);
    a.fade([lcd.el, leds.el, st], 1.4);
    a.rise(chips.children, 2.2, { stagger: 0.14, y: 20 });
    a.tl.to(puffs, { opacity: 1, duration: 1 }, 5.5);
    const L = { v: 1 };
    a.tl.to(L, { v: 6, duration: 2, ease: "power1.in", onUpdate: () => { lev = L.v; } }, 6.0);
    a.tl.call(() => { st.classList.add("alarm"); st.querySelector("i").style.background = "var(--orange)"; st.querySelector("i").style.boxShadow = "0 0 12px var(--orange)"; st.querySelector("span").textContent = "Alarm 1: five times the normal level"; }, null, 7.6);
    a.tl.to(L, { v: 24, duration: 1.8, ease: "power1.in", onUpdate: () => { lev = L.v; } }, 8.4);
    a.tl.call(() => { st.querySelector("i").style.cssText = ""; st.querySelector("span").textContent = "Alarm 2: twenty times normal. Investigate the transfer point"; }, null, 10.0);
  } });

  /* 11. Reference: grain tunnel, Brazil */
  list.push({ id: "tunnel", family: "ambient", dur: 15, build(a) {
    const ph = a.spot("case-grain", 900, 150, 924, 520, { case: "grain" });
    const svg = a.art();
    let lev = 0.12;
    const tr = a.trace(svg, 940, 700, 840, 140, 1.4, { color: "#0080C4", dt: 0.1, n: 100, gen: () => lev + rnd(-0.02, 0.02) });
    const trl = s("text", { x: 940, y: 870, fill: "#6B6B6B", "font-size": 19 }, svg); trl.textContent = "Tunnel dust level, DumoPro to the PLC";
    const kick = a.text("div", "kick", 96, 168, 760, "Reference case · Grain handling, Brazil");
    const h = a.title("A hidden leak,\nfound in time.", 96, 214, 760);
    const steps = ["Dust slowly rises in an unattended conveyor tunnel", "DumoPro sees the trend; the PLC flags it", "Maintenance finds a ruptured grain spout seal", "Staff enter only when levels are safe again"];
    const ol = a.text("ol", "steps", 96, 420, 760, steps.map((t, i) => "<li><i>" + (i + 1) + "</i><span>" + esc(t) + "</span></li>").join(""));
    ol.querySelectorAll("li").forEach(li => { li.style.marginBottom = "20px"; });
    ol.dataset.case = "grain";
    const note = a.text("p", "small", 96, 830, 760, "Supplied through Grunn do Brasil, Sintrol's local representative.");
    a.tl.from(ph, { opacity: 0, scale: 1.04, duration: 1.4, ease: "power2.out" }, 0.2);
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3);
    a.fade(ol, 1.2); a.fade(note, 1.6);
    a.tl.from([tr.g, trl], { opacity: 0, duration: 0.6 }, 1.2);
    const lis = ol.querySelectorAll("li");
    const L = { v: 0.12 };
    a.tl.call(() => lis[0].classList.add("on"), null, 2.0);
    a.tl.to(L, { v: 0.62, duration: 3, ease: "power1.in", onUpdate: () => { lev = L.v; } }, 2.2);
    a.tl.call(() => lis[1].classList.add("on"), null, 4.6);
    a.tl.call(() => lis[2].classList.add("on"), null, 6.6);
    a.tl.to(L, { v: 0.1, duration: 2.4, ease: "power2.out", onUpdate: () => { lev = L.v; } }, 7.2);
    a.tl.call(() => lis[3].classList.add("on"), null, 9.0);
  } });

  /* 12. DustCloud and DustTool */
  list.push({ id: "cloud", family: "software", dur: 16, build(a) {
    const svg = a.art();
    const Y = 300;
    const mon = a.spot("dumopro", 840, Y - 90, 210, 180, { product: "dumopro" });
    const node = (x, label, icon) => {
      const g = s("g", { "data-product": "dustcloud" }, svg);
      s("circle", { cx: x, cy: Y, r: 70, fill: "#F4F7FA", stroke: "#D3DBE3", "stroke-width": 2 }, g);
      g.appendChild(icon(x));
      const t = s("text", { x, y: Y + 108, "text-anchor": "middle", fill: "#4D4D4D", "font-size": 20, "font-weight": 600 }, g); t.textContent = label;
      return g;
    };
    const iconGw = x => { const g = document.createElementNS(NS, "g"); s("rect", { x: x - 30, y: Y - 14, width: 60, height: 34, rx: 6, fill: "none", stroke: "#00A696", "stroke-width": 3 }, g); s("path", { d: "M" + (x + 16) + " " + (Y - 14) + " V" + (Y - 36), stroke: "#00A696", "stroke-width": 3 }, g); s("path", { d: "M" + (x + 6) + " " + (Y - 44) + " q10 -10 20 0 M" + (x) + " " + (Y - 52) + " q16 -16 32 0", stroke: "#00A696", "stroke-width": 2.5, fill: "none" }, g); return g; };
    const iconCloud = x => { const g = document.createElementNS(NS, "g"); s("path", { d: "M" + (x - 34) + " " + (Y + 18) + " h66 a20 20 0 0 0 -4 -39 a26 26 0 0 0 -50 -6 a18 18 0 0 0 -12 45z", fill: "none", stroke: "#0080C4", "stroke-width": 3.5, "stroke-linejoin": "round" }, g); return g; };
    const iconUser = x => { const g = document.createElementNS(NS, "g"); s("rect", { x: x - 36, y: Y - 26, width: 50, height: 34, rx: 4, fill: "none", stroke: "#4D4D4D", "stroke-width": 3 }, g); s("path", { d: "M" + (x - 44) + " " + (Y + 14) + " h66", stroke: "#4D4D4D", "stroke-width": 3 }, g); s("rect", { x: x + 18, y: Y - 18, width: 22, height: 38, rx: 4, fill: "#FFFFFF", stroke: "#00A696", "stroke-width": 3 }, g); return g; };
    const n1 = node(1260, "4G or LoRaWAN", iconGw), n2 = node(1500, "DustCloud", iconCloud), n3 = node(1740, "Web, Android, iOS", iconUser);
    const p1 = s("path", { d: "M1060 " + Y + " H1190", stroke: "#B8C4D0", "stroke-width": 3, fill: "none" }, svg);
    const p2 = s("path", { d: "M1330 " + Y + " H1430", stroke: "#B8C4D0", "stroke-width": 3, fill: "none" }, svg);
    const p3 = s("path", { d: "M1570 " + Y + " H1670", stroke: "#B8C4D0", "stroke-width": 3, fill: "none" }, svg);
    const dash = a.spot("dustcloud-views", 860, 470, 960, 420, { product: "dustcloud" });
    const alert = a.text("div", "status alarm", 1250, 500, null, "<i></i><span>Alert: threshold exceeded, Silo 2 (email and SMS)</span>");
    const kick = a.text("div", "kick", 96, 168, 680, "DustCloud · DustTool");
    const h = a.title("Every monitor.\nEvery site.\nOne view.", 96, 214, 680);
    const lede = a.text("p", "lede", 96, 470, 660, "DustCloud gathers dust data, alarms and device health over 4G or LoRaWAN, for browsers and the Android and iOS apps.");
    const chips = a.chips(96, 680, 700, ["Data every 20 s on 4G", "15-min, hourly, daily averages", "Excel and CSV export", ["DustTool 2: free set-up software", "data-product", "dusttool"]]);
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.1);
    a.tl.from(mon, { opacity: 0, x: -30, duration: 0.8 }, 0.6);
    [n1, n2, n3].forEach((n, i) => a.tl.from(n, { opacity: 0, scale: 0.85, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(1.6)" }, 1.0 + i * 0.3));
    [p1, p2, p3].forEach((p, i) => a.draw(p, 1.2 + i * 0.3, 0.5));
    a.flow(p1, 2.4, { n: 3, dur: 1.2, r: 4.5, color: "#00A696" });
    a.flow(p2, 2.6, { n: 3, dur: 1.1, r: 4.5, color: "#0080C4" });
    a.flow(p3, 2.8, { n: 3, dur: 1.1, r: 4.5, color: "#4D4D4D" });
    a.tl.from(dash, { opacity: 0, y: 40, duration: 1.1, ease: "power3.out" }, 2.4);
    a.rise(chips.children, 3.0, { stagger: 0.14, y: 20 });
    a.tl.fromTo(alert, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, 7.0);
  } });

  /* 13. Applications */
  list.push({ id: "apps", family: "apps", dur: 15, build(a) {
    const h = a.title("Where do you need\nto know?", 96, 150, 700);
    const lede = a.text("p", "lede", 96, 330, 660, "Nine ways plants use Sintrol dust monitors, from stack compliance to blockage alarms. Tap one to see the monitors behind it.");
    const chips = a.chips(96, 560, 680, A.industries.slice(0, 10));
    chips.querySelectorAll(".chip").forEach(c => { c.style.fontSize = "18px"; c.style.padding = "8px 14px"; });
    const W = 316, H = 236, G = 22;
    const tiles = A.apps.map((ap, i) => {
      const b = pos(el("button", "apptile", a.root, '<img src="' + src(ap.img) + '" alt=""><div><b>' + esc(ap.name) + "</b><span>" + esc(ap.sub) + "</span></div>"), 820 + (i % 3) * (W + G), 150 + Math.floor(i / 3) * (H + G), W, H);
      b.dataset.app = ap.id;
      return b;
    });
    a.rise(h, 0.2); a.fade(lede, 0.9);
    a.tl.from(tiles, { opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.4)", stagger: 0.09 }, 0.8);
    a.rise(chips.children, 2.0, { stagger: 0.06, y: 14 });
    tiles.forEach((t, i) => a.tl.call(() => tiles.forEach(x => x.classList.toggle("hl", x === t)), null, 3.4 + i * 1.1));
  } });

  /* 14. Reference results */
  list.push({ id: "results", family: "cases", dur: 19, build(a) {
    const picks = [["wood", "3 → 30", "trial plants to installations, for a German baghouse maker in wood processing"],
      ["flour", "21", "Sintrol monitors watch every critical filter outlet at a Finnish flour mill"],
      ["cement", "4 countries", "a multinational cement producer rolled Sintrol out after the first plant"],
      ["metal", "2 → all", "from a two-monitor trial to a Dumo in every workshop of a metallurgical plant"],
      ["steel", "3–5 a month", "bag-filter shutdowns at a European steel plant, now found faster"],
      ["sugar", "6 points", "ambient monitors wired into the DCS and fire alarm at a European sugar plant"]];
    const frame = pos(el("div", "", a.root), 900, 150, 924, 560);
    frame.style.cssText += "border-radius:0 0 96px 0;overflow:hidden";
    const imgs = picks.map((p, i) => { const c = A.cases.find(x => x.id === p[0]); const im = el("img", "", frame); im.src = src(c.img); im.alt = c.title; im.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:" + (i ? 0 : 1); return im; });
    frame.dataset.case = picks[0][0];
    const kick = a.text("div", "kick", 96, 168, 760, "Reference cases");
    const stat = a.text("div", "bigstat", 96, 250, 760, "");
    const ttl = a.text("div", "h2", 96, 560, 760, "");
    ttl.style.fontSize = "34px";
    stat.dataset.case = picks[0][0]; ttl.dataset.case = picks[0][0];
    const show = i => {
      const p = picks[i], c = A.cases.find(x => x.id === p[0]);
      stat.innerHTML = "<b>" + esc(p[1]) + "</b><span>" + esc(p[2]) + "</span>";
      ttl.textContent = c.title;
      stat.dataset.case = ttl.dataset.case = frame.dataset.case = p[0];
    };
    show(0);
    const thumbs = A.cases.map((c, i) => {
      const b = pos(el("button", "", a.root), 96 + i * 157, 760, 145, 110);
      b.style.cssText += "padding:0;border-radius:0 0 24px 0;overflow:hidden;border:0;background:#F2F2F2;cursor:pointer";
      const im = el("img", "", b); im.src = src(c.sq); im.alt = ""; im.style.cssText = "width:100%;height:100%;object-fit:cover";
      b.dataset.case = c.id; b.title = c.title;
      return b;
    });
    let cur = 0;
    a.fade(kick, 0.2, { y: -10 });
    a.tl.from(frame, { opacity: 0, x: 60, duration: 1.1, ease: "power3.out" }, 0.3);
    a.fade([stat, ttl], 0.6, { stagger: 0.2 });
    a.tl.from(thumbs, { opacity: 0, y: 24, duration: 0.5, stagger: 0.05 }, 1.4);
    a.every(2.6, () => {
      const prev = cur; cur = (cur + 1) % picks.length;
      gsap.to(imgs[prev], { opacity: 0, duration: 0.8 });
      gsap.fromTo(imgs[cur], { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" });
      gsap.fromTo([stat, ttl], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, onStart: () => show(cur) });
    }, 3.2);
  } });

  /* 15. Certifications */
  list.push({ id: "certs", family: "certs", dur: 14, build(a) {
    const h = a.title("Certified where\nit counts.", 96, 150, 700);
    const lede = a.text("p", "lede", 96, 330, 680, "European QAL1 and EN 15859, UK MCERTS, NPL India, US EPA PS-11, and hazardous-area approvals on three continents. Tap one for the certificates.");
    const W = 340, H = 168, G = 20;
    const tiles = A.certs.map((c, i) => {
      const b = pos(el("button", "certtile", a.root, "<b>" + esc(c.name) + "</b><em>" + esc(c.std) + "</em><span>" + esc(c.body) + "</span>"), 820 + (i % 3) * (W + G), 150 + Math.floor(i / 3) * (H + G), W, H);
      b.dataset.cert = c.id;
      return b;
    });
    const iso = a.text("div", "small", 96, 620, 680, "Sintrol Oy is certified to ISO 9001:2015, and holds the Finland Chamber of Commerce \"Carbon Footprint Calculated\" label (2026).");
    a.rise(h, 0.2); a.fade(lede, 0.9); a.fade(iso, 1.6);
    a.tl.from(tiles, { opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.8);
    tiles.forEach((t, i) => a.tl.call(() => tiles.forEach(x => x.classList.toggle("hl", x === t)), null, 2.6 + i * 0.95));
  } });

  /* 16. Global network */
  list.push({ id: "network", family: "network", dur: 16, build(a) {
    const m = worldMap(a.root, 1110, {});
    pos(m.wrap, 760, 200);
    const N = window.NETWORK;
    const h = a.title("Local partners\nin 40 countries.", 96, 150, 660);
    const lede = a.text("p", "lede", 96, 330, 640, "Head office and R&D in Helsinki, sales offices in New Delhi and Beijing, and distributors from Brazil to New Zealand.");
    const count = a.text("div", "bigstat", 96, 560, 600, "<b>0</b><span>countries with a Sintrol partner</span>");
    const btn = pos(el("button", "btn primary", a.root, "Find your local distributor"), 96, 800); btn.dataset.tab = "network";
    a.rise(h, 0.2); a.fade(lede, 0.9);
    a.tl.from(m.wrap, { opacity: 0, duration: 1 }, 0.4);
    Object.values(m.paths).forEach(p => { if (p.classList.contains("on")) p.classList.remove("on"); });
    const order = m.arcs.slice().sort((x, y) => Math.hypot(x.c.x - N.hq.x, x.c.y - N.hq.y) - Math.hypot(y.c.x - N.hq.x, y.c.y - N.hq.y));
    const cnt = { v: 0 };
    order.forEach((o, i) => {
      const t = 1.6 + i * 0.12;
      a.draw(o.p, t, 0.7, "power2.out");
      a.tl.call(() => { m.paths[o.c.atlas].classList.add("on"); }, null, t + 0.5);
      a.tl.from(m.pins[m.arcs.indexOf(o)], { opacity: 0, duration: 0.3 }, t + 0.5);
    });
    a.tl.to(cnt, { v: N.countries.length, duration: order.length * 0.12, ease: "none", onUpdate: () => { count.querySelector("b").textContent = Math.round(cnt.v); } }, 2.1);
    a.loop(gsap.fromTo(m.pulse, { attr: { r: 4 }, opacity: 1 }, { attr: { r: 26 }, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }), 1.0);
    a.fade(count, 1.6); a.fade(btn, 3.0);
  } });

  /* 17. Vulcan furnace cameras */
  list.push({ id: "furnace", family: "furnace", dur: 13, build(a) {
    const ph = a.spot("vulcan-thermal", 880, 150, 944, 496, { product: "vulcan" });
    const cam = a.spot("vulcan12mt", 1000, 650, 760, 200, { product: "vulcan" });
    const ro = a.text("div", "readout", 1490, 180, 310, '<div><span>Bed max</span><b class="t1">1,084 °C</b></div><div class="hl"><span>Area avg</span><b class="t2">912 °C</b></div>');
    ro.dataset.product = "vulcan";
    a.every(0.8, () => { ro.querySelector(".t1").textContent = Math.round(rnd(1060, 1110)).toLocaleString("en-US") + " °C"; ro.querySelector(".t2").textContent = Math.round(rnd(900, 925)) + " °C"; }, 2);
    const kick = a.text("div", "kick", 96, 168, 700, "Also from Sintrol: Vulcan cameras");
    const h = a.title("See inside\nthe furnace.", 96, 214, 700);
    const lede = a.text("p", "lede", 96, 400, 700, "Live video and a temperature map of the whole image, through smoke and ash, for safer and more efficient combustion control.");
    const chips = a.chips(96, 620, 720, ["Recovery boilers", "Lime and cement kilns", "BFB boilers", "Grate firing", "Smelters", "600 to 2,000 °C"]);
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.tl.from(ph, { opacity: 0, scale: 1.04, duration: 1.3, ease: "power2.out" }, 0.3);
    a.tl.from(cam, { opacity: 0, x: 80, duration: 1.1, ease: "power3.out" }, 1.4);
    a.fade(ro, 1.8);
    a.rise(chips.children, 2.2, { stagger: 0.12, y: 20 });
  } });

  /* 18. Close: contact details, and the QR code in a green box as on the sintrol.fi front page */
  list.push({ id: "outro", family: null, dur: 15, build(a) {
    const h = a.title("Let's talk about\nyour dust.", 96, 170, 1240, "display");
    const lede = a.text("p", "lede", 96, 410, 1100, "Ask us here at the booth, or reach the team any time.");
    const rows = [[A.company.email, "Enquiries"], [A.company.phone, "Sintrol Oy, Helsinki"], [A.company.web, "Products, brochures and certificates"]]
      .map(([b, t], i) => a.text("div", "", 96, 492 + i * 84, 1100, '<b style="font-size:40px;font-weight:800;color:' + (i ? "var(--text)" : "var(--blue)") + '">' + esc(b) + '</b><span class="small" style="margin-left:22px">' + esc(t) + "</span>"));
    const dist = a.text("p", "body", 96, 790, 1100, "Looking for your local distributor, or want to become one? We would like to hear from you.");
    const box = pos(el("div", "gbox", a.root), 1384, 150, 480, 610);
    const qr = pos(el("div", "qr", a.root), 1424, 190, 400, 400);
    const q = el("img", "", qr); q.src = "assets/img/qr-sintrol.svg"; q.alt = "QR code for sintrol.fi/international";
    const qc = a.text("div", "", 1424, 616, 400, '<b style="display:block;font-size:26px;font-weight:700;color:#fff">Scan for sintrol.fi</b><span style="display:block;margin-top:6px;font-size:19px;line-height:1.35;color:rgba(255,255,255,.9)">Brochures, certificates and your local distributor</span>');
    qc.style.textAlign = "center";
    const svg = a.art();
    const line = s("path", { d: "M96 760 H1384", stroke: "url(#g-brand)", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, svg);
    a.rise(h, 0.3); a.fade(lede, 1.2);
    a.rise(rows, 1.8, { stagger: 0.25, y: 24 });
    a.tl.from(box, { opacity: 0, y: 60, duration: 1, ease: "power3.out" }, 2.2);
    a.tl.from(qr, { opacity: 0, scale: 0.9, duration: 0.9, ease: "back.out(1.4)" }, 2.6); a.fade(qc, 3.0);
    a.draw(line, 3.0, 1.8);
    a.flow(line, 4.8, { n: 8, dur: 3.6, color: "#0080C4" });
    a.fade(dist, 4.0);
  } });

  /* =====================================================================
     Learn more: slide layouts for the deep-dive loops (content in data.js, "deep").
     Each layout builds one slide into api.root, exactly like a scene, and returns
     its length in seconds. The deep-dive panel has its own header, so slides use
     the band between DY0 and DY1.
     ===================================================================== */
  const DY0 = 136, DY1 = 1036;
  const sizes = {};

  function loadSizes(names, timeout) {
    const todo = names.filter(n => n && !sizes[n]);
    if (!todo.length) return Promise.resolve();
    return new Promise(res => {
      let left = todo.length;
      const one = () => { if (--left <= 0) res(); };
      todo.forEach(n => {
        const im = new Image();
        im.onload = () => { sizes[n] = [im.naturalWidth, im.naturalHeight]; one(); };
        im.onerror = one;
        im.src = src(n);
      });
      setTimeout(res, timeout || 2000);
    });
  }

  function deepImages(def) {
    const out = [];
    def.slides.forEach(sl => {
      const p = sl.p && A.products[sl.p];
      if (sl.img) out.push(sl.img); else if (p && p.images[0]) out.push(p.images[0]);
      if (Array.isArray(sl.items)) sl.items.forEach(it => { const im = it.img || (Array.isArray(it) && it[2]); if (im) out.push(im); });
      if (sl.c) { const c = A.cases.find(x => x.id === sl.c); if (c) out.push(c.img); }
    });
    return out;
  }

  const prodOf = sl => (sl.p && A.products[sl.p]) || null;
  function specTable(rows) {
    return '<table class="dspecs">' + rows.map(r => "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>").join("") + "</table>";
  }
  function headHtml(sl, p, defTitle) {
    const kicker = sl.kicker != null ? sl.kicker : p ? p.name : "";
    const badge = sl.kicker == null && p && p.badge ? ' <span class="badge new">' + esc(p.badge) + "</span>" : "";
    const title = sl.title || defTitle || (p ? p.tagline : "");
    return (kicker ? '<div class="dkick"' + (p ? ' data-product="' + p.id + '"' : "") + ">" + esc(kicker) + badge + "</div>" : "") +
      (title ? '<h2 class="dh">' + words(title) + "</h2>" : "") +
      (sl.lede ? '<p class="dlede">' + esc(sl.lede) + "</p>" : "");
  }
  function column(a, x, w, html) {
    const c = a.text("div", "dcol", x, DY0, w, html);
    c.style.height = (DY1 - DY0) + "px";
    return c;
  }
  function reveal(a, c, at, step) {
    let t = at;
    step = step || 0.5;
    Array.from(c.children).forEach(ch => {
      if (ch.classList.contains("dh")) {
        a.rise(ch, t);
        t += 0.3 + ch.querySelectorAll(".w").length * 0.045;
      } else if (ch.matches("ul, ol") && !ch.classList.contains("steps")) {
        const items = Array.from(ch.children).filter(n => n.tagName === "LI");
        a.tl.from(items, { opacity: 0, x: -20, duration: 0.5, ease: "power2.out", stagger: step }, t);
        t += items.length * step + 0.1;
      } else if (ch.matches("table")) {
        const rows = ch.querySelectorAll("tr");
        a.tl.from(rows, { opacity: 0, duration: 0.45, ease: "power1.out", stagger: 0.2 }, t);
        t += rows.length * 0.2 + 0.1;
      } else if (ch.classList.contains("seq")) {
        a.tl.from(ch.children, { opacity: 0, y: 18, duration: 0.45, ease: "power2.out", stagger: 0.1 }, t);
        t += ch.children.length * 0.1 + 0.25;
      } else {
        a.fade(ch, t, { y: 16 });
        t += 0.3;
      }
    });
    return t;
  }
  function drift(a, target, at) {
    a.loop(gsap.fromTo(target, { scale: 1 }, { scale: 1.025, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 }), at);
  }
  function picture(a, name, p, x, y, w, h, at) {
    if (!name) {
      const t = pos(el("div", "dtypo", a.root, "<b>" + esc(p ? p.name : "") + "</b>"), x, y + 60, w, h - 120);
      if (p) t.dataset.product = p.id;
      a.tl.from(t, { opacity: 0, scale: 0.97, duration: 0.9, ease: "power2.out" }, at);
      return t;
    }
    const sp = a.spot(name, x, y, w, h, { product: p ? p.id : null });
    a.tl.from(sp, { x: -70, opacity: 0, duration: 1.1, ease: "power3.out" }, at);
    drift(a, sp.querySelector("img"), at + 1.1);
    return sp;
  }

  /* Feature callouts drawn on a product picture (content rect r, in stage pixels) */
  function drawCallouts(a, list, r, onPlate) {
    const svg = a.art();
    const BOTTOM = DY1 - 10;
    const items = list.map(c => ({ c, px: r.x + r.w * c.x / 100, py: r.y + r.h * c.y / 100, side: c.x < 50 ? "left" : "right" }));
    ["left", "right"].forEach(side => {
      const it = items.filter(i => i.side === side).sort((m, n) => m.py - n.py);
      it.forEach(i => {
        const l = el("div", "co-label " + side, a.root, esc(i.c.text));
        l.style.left = (side === "left" ? Math.max(0, r.x - 36 - 230) : r.x + r.w + 36) + "px";
        i.label = l; i.h = l.offsetHeight;
      });
      let y = DY0 + 10;
      it.forEach(i => { i.ly = Math.max(i.py, y + i.h / 2 + 12); y = i.ly + i.h / 2; });
      const over = y - BOTTOM;
      if (over > 0) {
        let floor = BOTTOM;
        for (let j = it.length - 1; j >= 0; j--) { const i = it[j]; i.ly = Math.min(i.ly - over, floor - i.h / 2); floor = i.ly - i.h / 2 - 12; }
      }
      it.forEach(i => {
        i.label.style.top = (i.ly - i.h / 2) + "px";
        const elbow = side === "left" ? r.x - 14 : r.x + r.w + 14;
        const edge = side === "left" ? r.x - 36 : r.x + r.w + 36;
        i.path = s("path", { d: "M" + i.px + " " + i.py + " L" + elbow + " " + i.py + " L" + edge + " " + i.ly, fill: "none", stroke: onPlate ? "#0080C4" : "#0080C4", "stroke-width": 2.5 }, svg);
        i.ring = s("circle", { cx: i.px, cy: i.py, r: 8, fill: "none", stroke: "#0080C4", "stroke-width": 2, opacity: 0 }, svg);
        i.dot = s("circle", { cx: i.px, cy: i.py, r: 7, fill: "#FFFFFF", stroke: "#0080C4", "stroke-width": 3 }, svg);
      });
    });
    let t0 = 0.4;
    items.sort((m, n) => m.py - n.py || m.px - n.px).forEach((i, n) => {
      t0 = 1.1 + n * 0.8;
      a.tl.from(i.dot, { opacity: 0, attr: { r: 0 }, duration: 0.35, ease: "back.out(2)" }, t0);
      a.draw(i.path, t0 + 0.2, 0.45, "power2.out");
      a.tl.from(i.label, { opacity: 0, x: i.side === "left" ? 14 : -14, duration: 0.45, ease: "power2.out" }, t0 + 0.45);
      a.loop(gsap.fromTo(i.ring, { attr: { r: 8 }, opacity: 0.9 }, { attr: { r: 24 }, opacity: 0, duration: 1.6, repeat: -1, ease: "power1.out", immediateRender: false }), t0 + 0.3);
    });
    return t0 + 1;
  }

  /* Cross-fade a stack of pictures on the timeline, marking the matching list row */
  function sequence(a, frames, rows, start, per) {
    frames.forEach((f, i) => { if (i) gsap.set(f, { opacity: 0 }); });
    const mark = (row, on, t) => {
      if (!row) return;
      a.tl.to(row, { opacity: on ? 1 : 0.45, duration: 0.4 }, t);
      const bar = row.querySelector("i");
      if (bar) a.tl.to(bar, { scaleX: on ? 1 : 0, duration: 0.4, ease: "power2.out" }, t);
    };
    mark(rows[0], true, start);
    for (let i = 1; i < frames.length; i++) {
      const t = start + i * per;
      a.tl.to(frames[i - 1], { opacity: 0, duration: 0.8, ease: "power1.inOut" }, t);
      a.tl.fromTo(frames[i], { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, t);
      mark(rows[i - 1], false, t); mark(rows[i], true, t);
    }
    return start + frames.length * per;
  }

  /* Centre a block of tiles (already placed from y=top) vertically in the slide band */
  function centreBlock(els, top, bottom) {
    const b = Math.max(...els.map(e => parseFloat(e.style.top) + e.offsetHeight));
    const shift = Math.max(0, Math.floor(((DY1 - 10) - b) / 2));
    if (shift) els.forEach(e => { e.style.top = (parseFloat(e.style.top) + shift) + "px"; });
  }

  const layouts = {};

  layouts.callouts = function (a, sl) {
    const p = prodOf(sl), name = sl.img || p.images[0], list = sl.callouts || p.callouts || [];
    const k = kind(name), sz = sizes[name] || [1000, 1000];
    const box = { x: 302, y: 176, w: 600, h: 820 };
    const padd = k === "plate" ? 44 : 0;
    let x = box.x, y = box.y, w = box.w, h = box.h;
    if (k !== "photo") {
      const sc = Math.min((box.w - padd) / sz[0], (box.h - padd) / sz[1]);
      w = sz[0] * sc + padd; h = sz[1] * sc + padd;
      x = box.x + (box.w - w) / 2; y = box.y + (box.h - h) / 2;
    }
    const sp = a.spot(name, x, y, w, h, { product: p.id });
    a.tl.from(sp, { opacity: 0, y: 30, duration: 0.9, ease: "power3.out" }, 0.1);
    const end = drawCallouts(a, list, { x: x + padd / 2, y: y + padd / 2, w: w - padd, h: h - padd }, padd > 0);
    const c = column(a, 1240, 600, headHtml(sl, p) + '<p class="dbody">' + esc(sl.body || p.summary) + "</p>");
    reveal(a, c, 0.4);
    return Math.max(end, 4) + 5;
  };

  layouts.features = function (a, sl) {
    const p = prodOf(sl);
    const img = sl.img !== undefined ? sl.img : p && p.images[0];
    let feats = sl.features || (p ? p.features : []);
    if (sl.pick) feats = sl.pick.map(i => feats[i]).filter(Boolean);
    feats = feats.slice(0, sl.n || 7);
    const specs = p && sl.specs === true ? p.specs.slice(0, 4) : [];
    picture(a, img, p, 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p) +
      (feats.length ? '<ul class="ticks">' + feats.map(f => "<li>" + esc(f) + "</li>").join("") + "</ul>" : "") +
      (specs.length ? specTable(specs) : ""));
    return reveal(a, c, 0.4, 0.5) + 6;
  };

  layouts.specs = function (a, sl) {
    const p = prodOf(sl);
    const rows = sl.rows || p.specs;
    picture(a, sl.img || (p && p.images[0]), p, 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p, "Specifications") + specTable(rows.slice(0, 13)));
    if (rows.length > 10) c.querySelectorAll("table.dspecs th, table.dspecs td").forEach(td => { td.style.fontSize = "19px"; td.style.padding = "8px 0"; });
    return reveal(a, c, 0.4) + 6;
  };

  layouts.gallery = function (a, sl) {
    const p = prodOf(sl), items = sl.items;
    const F = { x: 860, y: 176, w: 964, h: 780 };
    const frames = items.map(it => a.spot(it.img, F.x, F.y, F.w, F.h, { product: it.p || (p && p.id) }));
    const c = column(a, 96, 700, headHtml(sl, p) +
      '<ol class="dlist">' + items.map(it => "<li" + ((it.p || p) ? ' data-product="' + (it.p || p.id) + '"' : "") + "><i></i><span>" + esc(it.cap) + "</span></li>").join("") + "</ol>");
    const t1 = reveal(a, c, 0.3, 0.15);
    a.tl.from(frames[0], { opacity: 0, x: 60, duration: 1, ease: "power3.out" }, 0.4);
    return sequence(a, frames, c.querySelectorAll(".dlist li"), Math.max(1.4, t1), sl.per || 3.8) + 0.4;
  };

  layouts.compare = function (a, sl) {
    const items = sl.items.filter(it => A.products[it.p]), n = items.length;
    const gap = 40, colW = Math.min(520, (1728 - gap * (n - 1)) / n), total = colW * n + gap * (n - 1), x0 = 96 + (1728 - total) / 2;
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const top = DY0 + 14 + head.offsetHeight + 34;
    const placed = [head];
    items.forEach((it, i) => {
      const p = A.products[it.p], x = x0 + i * (colW + gap), img = it.img || p.images[0];
      const ph = a.spot(img, x + 10, top, colW - 20, 280, { product: p.id });
      const lines = it.lines || p.features.slice(0, 3);
      const tx = a.text("div", "dcomp", x, top + 300, colW,
        '<b data-product="' + p.id + '">' + esc(p.name) + "</b><span>" + esc(it.tag || p.tagline) + '</span><ul class="ticks">' + lines.map(l => "<li>" + esc(l) + "</li>").join("") + "</ul>");
      const at = t + i * 0.3;
      a.tl.from(ph, { opacity: 0, y: 50, duration: 0.9, ease: "power3.out" }, at);
      a.tl.from([tx.children[0], tx.children[1]], { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", stagger: 0.1 }, at + 0.35);
      a.tl.from(tx.querySelectorAll("li"), { opacity: 0, x: -14, duration: 0.45, ease: "power2.out", stagger: 0.18 }, t + n * 0.3 + 0.5 + i * 0.55);
      placed.push(ph, tx);
    });
    centreBlock(placed);
    return t + n * 0.3 + 0.5 + n * 0.55 + 6;
  };

  layouts.steps = function (a, sl) {
    const p = prodOf(sl);
    const steps = typeof sl.steps === "string" ? A.products[sl.steps].steps : sl.steps;
    const n = steps.length;
    picture(a, sl.img || (p && p.images[0]), p, 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p) +
      '<ol class="steps">' + steps.map((st, i) => "<li><i>" + (i + 1) + "</i><span>" + (Array.isArray(st) ? "<b>" + esc(st[0]) + "</b>" + esc(st[1]) : esc(st)) + "</span></li>").join("") +
      '<div class="rail"><span></span></div></ol>');
    const t = reveal(a, c, 0.4, 0.25);
    const lis = c.querySelectorAll(".steps li"), bar = c.querySelector(".steps .rail span"), railEl = c.querySelector(".steps .rail");
    const offs = Array.from(lis).map(li => li.offsetTop);
    railEl.style.height = (offs[n - 1] - offs[0]) + "px";
    lis.forEach((li, i) => {
      a.tl.call(() => li.classList.add("on"), null, t + 0.4 + i * 1.8);
      if (i) a.tl.to(bar, { height: offs[i] - offs[0], duration: 0.6, ease: "power2.inOut" }, t - 0.2 + i * 1.8);
    });
    return t + n * 1.8 + 4;
  };

  layouts.facts = function (a, sl) {
    const py = Math.round((DY0 + DY1 - 520) / 2);
    const ph = a.spot(sl.img, 980, py, 844, 520, {});
    const c = column(a, 96, 800, headHtml(sl, null) +
      '<div class="dfacts seq">' + A.company.facts.map(f => "<div><b>" + esc(f.big) + "</b><span>" + esc(f.small) + "</span></div>").join("") + "</div>");
    a.tl.from(ph, { opacity: 0, x: 60, duration: 1.1, ease: "power3.out" }, 0.3);
    drift(a, ph.querySelector("img"), 1.4);
    return reveal(a, c, 0.3) + 7;
  };

  layouts.timeline = function (a, sl) {
    const c = column(a, 96, 640, headHtml(sl, null) + '<p class="dlede">Founded by Mauri Sinervä in 1975. Family-owned, with about 50 people and an ISO 9001:2015 certified quality system.</p>');
    const t = reveal(a, c, 0.2);
    const ol = a.text("ol", "tl", 800, DY0 + 40, 1024, A.company.timeline.map(r => "<li><b>" + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></li>").join(""));
    centreBlock([ol]);
    const lis = ol.querySelectorAll("li");
    a.tl.from(lis, { opacity: 0, x: 30, duration: 0.55, ease: "power2.out", stagger: 0.7 }, 0.6);
    return Math.max(t, 0.6 + lis.length * 0.7) + 6;
  };

  layouts.cards = function (a, sl) {
    const items = sl.items === "reasons" ? A.reasons : sl.items;
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const cols = sl.cols || 3, G = 22, n = items.length, rows = Math.ceil(n / cols);
    const top = DY0 + 14 + head.offsetHeight + 34;
    const W = (1728 - G * (cols - 1)) / cols;
    const withImg = items.some(it => it[2]);
    const H = Math.min(withImg ? 380 : 240, (DY1 - 20 - top - G * (rows - 1)) / rows);
    const cards = items.map((it, i) => {
      const d = pos(el("div", "dcard", a.root, (it[2] ? '<img src="' + src(it[2]) + '" alt="">' : "") + "<div>" + (it[2] ? "" : "<i></i>") + "<b>" + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></div>"),
        96 + (i % cols) * (W + G), top + Math.floor(i / cols) * (H + G), W, H);
      if (it[2] && H < 300) d.querySelector("img").style.height = "40%";
      return d;
    });
    centreBlock([head].concat(cards));
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", stagger: 0.18 }, t);
    return t + n * 0.18 + Math.max(8, n * 1.4);
  };

  layouts.matrix = function (a, sl) {
    const M = A.matrices[sl.m];
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null, M.title));
    const t = reveal(a, head, 0.2);
    const isFilter = sl.m === "filter";
    const cols = isFilter ? ["Monitor"].concat(M.cols) : [""].concat(M.cols);
    const html = '<table class="mtx"><thead><tr>' + cols.map((c, i) => "<th" + (!isFilter && i ? ' data-product="' + M.products[i - 1] + '" style="color:var(--blue);font-size:22px;cursor:pointer"' : "") + ">" + esc(c) + "</th>").join("") + "</tr></thead><tbody>" +
      M.rows.map((r, ri) => "<tr" + (isFilter ? ' data-product="' + M.rowProducts[ri] + '"' : "") + ">" + r.map((c, i) => i === 0 ? "<th>" + esc(c) + "</th>" : '<td class="' + (c.startsWith("✓") ? "y" : c === "–" ? "n" : "") + '">' + esc(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
    const tb = a.text("div", "", 96, DY0 + 14 + head.offsetHeight + 30, 1728, html);
    tb.querySelectorAll("td, th").forEach(x => { x.style.padding = isFilter ? "12px 16px" : "17px 18px"; x.style.fontSize = isFilter ? "21px" : "24px"; });
    tb.querySelectorAll("thead th").forEach(x => { x.style.fontSize = isFilter ? "18px" : "22px"; });
    centreBlock([head, tb]);
    const rows = tb.querySelectorAll("tbody tr");
    a.tl.from(tb.querySelector("thead"), { opacity: 0, duration: 0.5 }, t);
    a.tl.from(rows, { opacity: 0, x: -20, duration: 0.45, stagger: 0.32, ease: "power2.out" }, t + 0.3);
    return t + rows.length * 0.32 + 8;
  };

  layouts.case = function (a, sl) {
    const c = A.cases.find(x => x.id === sl.c);
    const ph = a.spot(c.img, 96, DY0 + 20, 820, 420, { case: c.id });
    const stats = a.text("div", "", 96, DY0 + 470, 820, c.stats.map(st => '<div class="tag" style="margin:0 0 20px"><b style="font-size:42px;color:var(--blue)">' + esc(st[0]) + '</b><span style="max-width:none">' + esc(st[1]) + "</span></div>").join(""));
    stats.dataset.case = c.id;
    const col = column(a, 1000, 824, '<div class="dkick" data-case="' + c.id + '">Reference case · ' + esc(c.short) + '</div><h2 class="dh" style="font-size:50px">' + words(c.title) + "</h2>" +
      '<p class="dbody" style="margin-bottom:16px"><b style="color:var(--mist)">Challenge.</b> ' + esc(c.challenge) + "</p>" +
      '<p class="dbody" style="margin-bottom:20px"><b style="color:var(--mist)">Solution.</b> ' + esc(c.solution) + "</p>" +
      '<ul class="ticks">' + c.results.slice(0, 4).map(r => "<li>" + esc(r) + "</li>").join("") + "</ul>");
    col.querySelectorAll(".dbody").forEach(p => { p.style.fontSize = "21px"; });
    col.querySelectorAll(".ticks li").forEach(li => { li.style.fontSize = "21px"; li.style.marginBottom = "10px"; });
    a.tl.from(ph, { opacity: 0, x: -50, duration: 1.1, ease: "power3.out" }, 0.2);
    drift(a, ph.querySelector("img"), 1.3);
    a.tl.from(stats.children, { opacity: 0, y: 20, duration: 0.5, stagger: 0.3 }, 0.9);
    return reveal(a, col, 0.4, 0.5) + 9;
  };

  layouts.cases = function (a, sl) {
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const ids = sl.ids || A.cases.map(c => c.id);
    const cols = 6, G = 20, W = (1728 - G * (cols - 1)) / cols, H = 320, top = DY0 + 14 + head.offsetHeight + 30;
    const cards = ids.map((id, i) => {
      const c = A.cases.find(x => x.id === id);
      const b = pos(el("button", "casecard", a.root, '<div class="ph" style="height:160px"><img src="' + src(c.sq) + '" alt=""><em>' + esc(c.industry) + '</em></div><div class="tx" style="padding:12px 16px"><b style="font-size:19px">' + esc(c.title) + '</b><div class="st" style="margin-top:6px"><strong style="font-size:26px">' + esc(c.stats[0][0]) + "</strong></div></div>"),
        96 + (i % cols) * (W + G), top + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.case = c.id;
      return b;
    });
    centreBlock([head].concat(cards));
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.5, stagger: 0.09 }, t);
    return t + cards.length * 0.09 + 12;
  };

  layouts.apps = function (a, sl) {
    const c = column(a, 96, 600, headHtml(sl, null));
    const t = reveal(a, c, 0.2);
    const W = 360, H = 250, G = 22;
    const y0 = DY0 + (DY1 - DY0 - (3 * H + 2 * G)) / 2;
    const tiles = A.apps.map((ap, i) => {
      const b = pos(el("button", "apptile", a.root, '<img src="' + src(ap.img) + '" alt=""><div><b>' + esc(ap.name) + "</b><span>" + esc(ap.sub) + "</span></div>"), 740 + (i % 3) * (W + G), y0 + Math.floor(i / 3) * (H + G), W, H);
      b.dataset.app = ap.id;
      return b;
    });
    a.tl.from(tiles, { opacity: 0, scale: 0.9, duration: 0.5, ease: "back.out(1.4)", stagger: 0.08 }, 0.5);
    const t2 = Math.max(t, 0.5 + tiles.length * 0.08 + 0.5);
    tiles.forEach((b, i) => a.tl.call(() => tiles.forEach(x => x.classList.toggle("hl", x === b)), null, t2 + i * 0.9));
    return t2 + tiles.length * 0.9 + 3;
  };

  layouts.certs = function (a, sl) {
    const ids = sl.ids || A.certs.map(c => c.id);
    const c = column(a, 96, 620, headHtml(sl, null));
    const t = reveal(a, c, 0.2);
    const cols = ids.length > 6 ? 3 : 2, W = cols === 3 ? 340 : 480, H = 180, G = 20, rows = Math.ceil(ids.length / cols);
    const gw = cols * W + (cols - 1) * G, x0 = 780 + (1044 - gw) / 2, y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const tiles = ids.map((id, i) => {
      const ce = A.certs.find(x => x.id === id);
      const b = pos(el("button", "certtile", a.root, "<b>" + esc(ce.name) + "</b><em>" + esc(ce.std) + "</em><span>" + esc(ce.text) + "</span>"), x0 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.cert = id;
      return b;
    });
    a.tl.from(tiles, { opacity: 0, y: 24, duration: 0.5, stagger: 0.08 }, 0.5);
    const t2 = Math.max(t, 0.5 + tiles.length * 0.08 + 0.5);
    tiles.forEach((b, i) => a.tl.call(() => tiles.forEach(x => x.classList.toggle("hl", x === b)), null, t2 + i * 0.9));
    return t2 + tiles.length * 0.9 + 3;
  };

  layouts.map = function (a, sl) {
    const c = column(a, 96, 560, headHtml(sl, null) + '<p class="dbody">Head office: Helsinki, Finland. Sales offices: New Delhi and Beijing.</p>');
    const t = reveal(a, c, 0.2);
    const m = worldMap(a.root, 1150, {});
    pos(m.wrap, 700, DY0 + (DY1 - DY0 - m.h) / 2);
    a.tl.from(m.wrap, { opacity: 0, duration: 0.9 }, 0.3);
    m.arcs.forEach((o, i) => a.draw(o.p, 1 + i * 0.06, 0.6));
    a.loop(gsap.fromTo(m.pulse, { attr: { r: 4 }, opacity: 1 }, { attr: { r: 26 }, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }), 1);
    return Math.max(t, 1 + m.arcs.length * 0.06) + 10;
  };

  layouts.team = function (a, sl) {
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const box = a.text("div", "team", 96, DY0 + 14 + head.offsetHeight + 30, 1728, A.team.map(p => "<div><b>" + esc(p.name) + "</b><em>" + esc(p.role) + "</em><span>" + esc(p.phone) + "<br>" + esc(p.email) + "</span></div>").join("") +
      "<div><b>Sintrol Oy</b><em>Head office, Helsinki</em><span>" + esc(A.company.phone) + "<br>" + esc(A.company.email) + "</span></div>");
    box.style.gridTemplateColumns = "1fr 1fr 1fr";
    centreBlock([head, box]);
    a.tl.from(box.children, { opacity: 0, y: 24, duration: 0.5, stagger: 0.15 }, t);
    return t + 8;
  };

  layouts.docs = function (a, sl) {
    const ids = sl.ids.filter(id => A.docs[id]);
    const c = column(a, 96, 680, headHtml(sl, null, "Brochures and manuals") + '<p class="dlede">' + esc(sl.hint || "Tap a document to open it.") + "</p>");
    const t = reveal(a, c, 0.2);
    const cols = Math.min(4, ids.length), rows = Math.ceil(ids.length / cols), W = 214, G = 30, H = 214 + 100;
    const y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const rowX = r => { const k = Math.min(cols, ids.length - r * cols); return 840 + (984 - (k * W + (k - 1) * G)) / 2; };
    const cards = ids.map((id, i) => {
      const d = A.docs[id];
      const b = pos(el("button", "ddoc", a.root, '<div class="th" style="background-image:url(\'' + encodeURI(d.thumb) + '\')"></div><b>' + esc(d.title) + "</b><span>" + esc(d.note || "PDF") + "</span>"),
        rowX(Math.floor(i / cols)) + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.doc = id;
      return b;
    });
    a.tl.from(cards, { opacity: 0, y: 40, duration: 0.6, ease: "power2.out", stagger: 0.12 }, 0.6);
    return Math.max(t, 0.6 + cards.length * 0.12) + 7;
  };

  layouts.articles = function (a, sl) {
    const ART = window.ARTICLES || [];
    const items = sl.ids.map(id => ART.find(x => x.id === id)).filter(Boolean);
    const c = column(a, 96, 620, headHtml(sl, null) + '<p class="dlede">Tap an article to read it. The full library is under Explore, Knowledge.</p>');
    const t = reveal(a, c, 0.2);
    const W = 500, G = 18, H = 150, cols = 2, rows = Math.ceil(items.length / cols);
    const y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const cards = items.map((ar, i) => {
      const b = pos(el("button", "artcard", a.root, "<em>" + esc(ar.topic) + "</em><b>" + esc(ar.title) + "</b><span>" + Math.max(1, Math.round(ar.words / 220)) + " min read</span>"), 790 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.article = ar.id;
      return b;
    });
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.5, stagger: 0.12 }, 0.5);
    return Math.max(t, 0.5 + cards.length * 0.12) + 8;
  };

  function buildDeep(a, sl) {
    const f = layouts[sl.type];
    if (!f) throw new Error("Unknown slide layout: " + sl.type);
    return f(a, sl);
  }

  /* Images the scenes use, for preloading */
  const images = ["s304", "s303", "s305qal", "exoqal", "s101", "s201", "s203", "s304qal", "s314", "espy", "dumopro", "case-grain", "dustcloud-views", "vulcan-thermal", "vulcan12mt"]
    .concat(A.apps.map(x => x.img), A.cases.map(x => x.img), A.cases.map(x => x.sq));

  return { list, makeApi, src, kind, esc, words, images, buildDeep, deepImages, loadSizes, sizes, worldMap };
})();

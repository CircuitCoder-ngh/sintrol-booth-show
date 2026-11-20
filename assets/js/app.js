/* Sintrol booth showcase: player, chapter rail, product pages, explore, drawer, reader, documents, idle return. */
(function () {
  "use strict";
  const A = window.SINTROL, SC = window.Scenes, NET = window.NETWORK, ART = window.ARTICLES || [];
  const $ = (q, r) => (r || document).querySelector(q);
  const $$ = (q, r) => Array.from((r || document).querySelectorAll(q));
  const esc = SC.esc;
  const stage = $("#stage");

  const IDLE_OVERLAY = 90;   // seconds before an open panel returns to the showcase
  const IDLE_LONG = 240;     // documents, videos and articles get longer
  const IDLE_PAUSED = 120;   // a paused showcase resumes after this
  const COUNTDOWN = 10;

  const ICON = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/></svg>'
  };
  const DEEP = A.deep || {};
  const caseById = id => A.cases.find(c => c.id === id);
  const appById = id => A.apps.find(x => x.id === id);
  const certById = id => A.certs.find(x => x.id === id);
  const famById = id => A.families.find(f => f.id === id);

  /* ---------- Stage scaling ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Background: drifting dust ---------- */
  const DUST = (function () {
    const cv = $("#dust"), ctx = cv.getContext("2d");
    const P = Array.from({ length: 120 }, () => ({ x: Math.random() * 1920, y: Math.random() * 1080, z: Math.random(), ph: Math.random() * 6.28 }));
    let last = 0, running = true;
    function frame(t) {
      requestAnimationFrame(frame);
      if (!running || document.hidden) { last = t; return; }
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of P) {
        p.x += (8 + p.z * 26) * dt; p.y -= (2 + p.z * 6) * dt; p.ph += dt * 0.7;
        if (p.x > 1940) p.x = -20; if (p.y < -20) p.y = 1100;
        const r = 0.6 + p.z * 2.2, a = 0.05 + p.z * 0.22 + Math.sin(p.ph) * 0.04;
        ctx.beginPath(); ctx.arc(p.x, p.y + Math.sin(p.ph) * 6, r, 0, 6.283);
        ctx.fillStyle = "rgba(120,110,92," + (a * 0.55).toFixed(3) + ")"; ctx.fill();
      }
    }
    requestAnimationFrame(frame);
    return { set(on) { running = on; } };
  })();

  /* ---------- Event label ---------- */
  if (A.event.name) {
    $("#ev-name").textContent = A.event.name + (A.event.booth ? ", " + A.event.booth : "");
    $("#ev-sub").textContent = [A.event.place, A.event.dates].filter(Boolean).join(", ");
  } else {
    $("#ev-name").textContent = A.company.tagline; $("#ev-name").className = "tagline";
    $("#ev-sub").textContent = "Dust Monitoring Solutions";
  }

  /* ---------- Rail: chapters on a dust trend ---------- */
  const fams = A.families;
  const X0 = 110, X1 = 1600, Y = 52;
  const nodeX = fams.map((f, i) => 200 + i * (1340 / (fams.length - 1)));
  const TRACE = (function () {
    const pts = [];
    let v = 0;
    for (let x = X0; x <= X1; x += 6) {
      v = v * 0.82 + (Math.random() - 0.5) * 3.2;
      const spike = Math.random() < 0.035 ? -(6 + Math.random() * 10) : 0;
      pts.push([x, Y + Math.max(-16, Math.min(8, v + spike))]);
    }
    const d = "M" + pts.map(p => p[0] + " " + p[1].toFixed(1)).join(" L");
    $$("#rail .trace").forEach(p => p.setAttribute("d", d));
    return pts;
  })();
  const traceY = x => { const i = Math.max(0, Math.min(TRACE.length - 1, Math.round((x - X0) / 6))); return TRACE[i][1]; };
  (function buildRail() {
    const g = $("#rail .nodes"), NS = "http://www.w3.org/2000/svg", labels = $("#rail .labels");
    fams.forEach((f, i) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", nodeX[i]); c.setAttribute("cy", Y); c.setAttribute("r", 7);
      c.setAttribute("fill", "#FFFFFF"); c.setAttribute("stroke", "#B3B3B3"); c.setAttribute("stroke-width", 3);
      c.dataset.fam = f.id; g.appendChild(c);
      const b = document.createElement("button");
      b.className = "node"; b.style.left = nodeX[i] + "px"; b.textContent = f.name; b.dataset.railFam = f.id;
      b.setAttribute("aria-label", f.title);
      labels.appendChild(b);
    });
  })();

  // Map each scene to an x-range on the rail
  const sceneRange = (function () {
    const out = [], famScenes = {};
    SC.list.forEach((sc, i) => { if (sc.family) (famScenes[sc.family] = famScenes[sc.family] || []).push(i); });
    SC.list.forEach((sc, i) => {
      if (!sc.family) { out[i] = i === 0 ? [X0, nodeX[0] - 20] : [nodeX[nodeX.length - 1], X1]; return; }
      const k = fams.findIndex(f => f.id === sc.family);
      const a = nodeX[k], b = k + 1 < nodeX.length ? nodeX[k + 1] : X1;
      const list = famScenes[sc.family], j = list.indexOf(i), n = list.length;
      out[i] = [a + (b - a) * j / n, a + (b - a) * (j + 1) / n];
    });
    return out;
  })();

  function setRailFamily(fam) {
    $$("#rail .nodes circle").forEach(c => {
      const on = c.dataset.fam === fam;
      c.setAttribute("fill", on ? "#0080C4" : "#FFFFFF");
      c.setAttribute("stroke", on ? "#0080C4" : "#B3B3B3");
      c.setAttribute("r", on ? 9 : 7);
    });
    $$("#rail .node").forEach(b => b.classList.toggle("on", b.dataset.railFam === fam));
  }

  /* ---------- Player ---------- */
  const P = { i: -1, cur: null, playing: true };

  function destroy(sc) {
    sc.tl.kill();
    sc.api.loops.forEach(l => l.tw.kill());
    sc.root.remove();
  }

  function playScene(i) {
    const N = SC.list.length;
    i = ((i % N) + N) % N;
    const def = SC.list[i];
    const old = P.cur;
    const root = document.createElement("div");
    root.className = "scene";
    root.dataset.scene = def.id;
    root.style.opacity = 0;
    $("#scenes").appendChild(root);
    const tl = gsap.timeline({ paused: true });
    const api = SC.makeApi(root, tl);
    try { def.build(api); } catch (e) { console.error("Scene " + def.id + " failed", e); }
    const dur = Math.max(def.dur, tl.duration());
    tl.set({}, {}, dur);
    tl.eventCallback("onComplete", () => { if (P.cur && P.cur.tl === tl) playScene(i + 1); });
    P.cur = { i, def, root, tl, api, dur };
    P.i = i;
    if (old) {
      old.tl.pause();
      old.api.loops.forEach(l => l.tw.pause());
      gsap.to(old.root, { opacity: 0, duration: 0.6, ease: "power2.in", onComplete: () => destroy(old) });
    }
    gsap.to(root, { opacity: 1, duration: 0.9, delay: old ? 0.25 : 0, ease: "power2.out" });
    setRailFamily(def.family);
    moveGlow(def.id);
    setLearnButton(def.id);
    if (P.playing && !anyOpen()) tl.play(0);
    else { tl.seek(dur * 0.62, true); tl.pause(); }
  }

  function pauseScene() {
    if (!P.cur) return;
    P.cur.tl.pause();
    P.cur.api.loops.forEach(l => l.tw.pause());
  }
  function resumeScene() {
    if (!P.cur || !P.playing || anyOpen()) return;
    const t = P.cur.tl.time();
    P.cur.api.loops.forEach(l => { if (l.started || l.at <= t) { l.started = true; l.tw.play(); } });
    P.cur.tl.play();
  }
  function setPlaying(on) {
    P.playing = on;
    $("#c-play .i-pause").style.display = on ? "" : "none";
    $("#c-play .i-play").style.display = on ? "none" : "";
    $("#c-play").setAttribute("aria-label", on ? "Pause" : "Play");
    if (on) resumeScene(); else pauseScene();
  }
  function next(d) { playScene(P.i + d); if (!P.playing && P.cur) P.cur.api.loops.forEach(l => l.tw.pause()); }

  function playFamily(fam) {
    const i = SC.list.findIndex(s => s.family === fam);
    if (i < 0) return;
    closeAll(true);
    setPlaying(true);
    playScene(i);
  }

  function moveGlow(id) {
    const g = $("#bg .glow");
    const pos = { intro: [700, -160], principle: [700, 0], autosetup: [600, -100], qal: [-200, -60], stacks: [700, -100], baghouse: [500, -40], lineup: [300, 0],
      split: [800, -200], esp: [500, 0], ambient: [600, -120], tunnel: [700, -200], cloud: [600, -260], apps: [700, -100], results: [700, -200], certs: [700, -60],
      network: [500, -100], furnace: [700, -160], outro: [700, -120] }[id] || [600, -80];
    g.style.left = pos[0] + "px"; g.style.top = pos[1] + "px";
  }

  const learnBtn = $("#learn-btn");
  function setLearnButton(id) {
    const has = !!DEEP[id];
    learnBtn.classList.toggle("off", !has);
    learnBtn.tabIndex = has ? 0 : -1;
    learnBtn.setAttribute("aria-label", has ? "Learn more: " + DEEP[id].title : "Learn more");
    learnBtn.classList.remove("nudge");
    if (has) { void learnBtn.offsetWidth; learnBtn.classList.add("nudge"); }
  }

  // Rail slug follows playback; the deep-dive progress bar follows its slide
  gsap.ticker.add(() => {
    if (O.deep && DP.cur && DP.bars[DP.cur.i]) DP.bars[DP.cur.i].style.width = Math.min(100, DP.cur.tl.time() / DP.cur.dur * 100) + "%";
    if (!P.cur) return;
    const r = sceneRange[P.cur.i];
    const x = r[0] + (r[1] - r[0]) * Math.min(1, P.cur.tl.time() / P.cur.dur);
    const y = traceY(x);
    $("#rail .slug").setAttribute("cx", x); $("#rail .slug").setAttribute("cy", y);
    $("#rail .slug-halo").setAttribute("cx", x); $("#rail .slug-halo").setAttribute("cy", y);
    $("#rail .clip").setAttribute("width", x);
  });

  /* ---------- Overlay state ---------- */
  const O = { explore: false, history: [], drawer: null, reader: null, pdf: null, vid: null, deep: null };
  function anyOpen() { return O.explore || O.history.length > 0 || !!O.drawer || !!O.reader || !!O.pdf || !!O.vid || !!O.deep; }
  function deepOnly() { return !!O.deep && !O.explore && !O.history.length && !O.drawer && !O.reader && !O.pdf && !O.vid; }
  function afterClose() {
    if (!anyOpen()) { DUST.set(true); resumeScene(); }
    else if (deepOnly()) resumeDeep();
  }
  function beforeOpen() { pauseScene(); pauseDeep(); DUST.set(false); document.body.classList.remove("cursor-hidden", "show-controls"); }

  function closeAll(silent) {
    killDetailAnim();
    O.history = []; O.explore = false;
    $("#detail").hidden = true; $("#detail").innerHTML = "";
    $("#explore").hidden = true; $("#explore").innerHTML = "";
    closeDrawer(true); closeReader(true); closePdf(true); closeVid(true); closeDeep(true);
    hideToast();
    if (!silent) afterClose();
  }

  /* ---------- Shared renderers ---------- */
  const imgKind = n => SC.kind(n);
  function card(p) {
    const im = p.images[0], k = im ? imgKind(im) : "none";
    const inner = im ? '<img src="' + SC.src(im) + '" alt="" loading="lazy">' : "";
    return '<button class="card" data-product="' + p.id + '"><div class="im ' + (k === "plate" ? "plate" : "") + '"' + (k === "photo" ? ' style="padding:0"' : "") + ">" +
      (k === "photo" ? inner.replace("<img ", '<img style="width:100%;height:100%;object-fit:cover;filter:none" ') : inner) +
      (p.badge ? '<span class="badge new">' + esc(p.badge) + "</span>" : "") + '</div><div class="tx"><b>' + esc(p.name) + "</b><span>" + esc(p.tagline) + "</span></div></button>";
  }
  function docCard(id) {
    const d = A.docs[id]; if (!d) return "";
    return '<button class="doc" data-doc="' + id + '"><div class="th" style="background-image:url(\'' + encodeURI(d.thumb) + '\')"></div><div><b>' + esc(d.title) + "</b><span>" + esc(d.note || d.group) + "</span></div></button>";
  }
  function caseCard(c) {
    return '<button class="casecard" data-case="' + c.id + '"><div class="ph"><img src="' + SC.src(c.sq) + '" alt="" loading="lazy"><em>' + esc(c.industry) + '</em></div><div class="tx"><b>' + esc(c.title) + '</b><div class="st"><strong>' + esc(c.stats[0][0]) + "</strong><span>" + esc(c.stats[0][1]) + "</span></div></div></button>";
  }
  function appTile(ap) {
    return '<button class="apptile" data-app="' + ap.id + '"><img src="' + SC.src(ap.img) + '" alt="" loading="lazy"><div><b>' + esc(ap.name) + "</b><span>" + esc(ap.sub) + "</span></div></button>";
  }
  function certTile(c) {
    return '<button class="certtile" data-cert="' + c.id + '"><b>' + esc(c.name) + "</b><em>" + esc(c.std) + " · " + esc(c.body) + "</em><span>" + esc(c.text) + "</span></button>";
  }
  function videoCard(v) {
    return '<button class="vcard" data-video="' + v.id + '"><div class="ph"><img src="' + v.thumb + '" alt="" loading="lazy"><i>' + ICON.play + '</i></div><div class="tx"><b>' + esc(v.title) + "</b><span>" + (v.file ? "Plays here" : "YouTube, needs internet") + "</span></div></button>";
  }
  function artCard(a) {
    return '<button class="artcard" data-article="' + a.id + '"><em>' + esc(a.topic) + "</em><b>" + esc(a.title) + "</b><span>" + (a.date ? fmtDate(a.date) + " · " : "") + Math.max(1, Math.round(a.words / 220)) + " min read</span></button>";
  }
  function fmtDate(d) {
    const [y, m, day] = d.split("-").map(Number);
    return day + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1] + " " + y;
  }
  const chip = (label, attr, val) => '<button class="chip" ' + attr + '="' + esc(val) + '">' + esc(label) + "</button>";

  /* ---------- Product detail ---------- */
  let D = { tl: null, cycle: null, rings: [], idx: 0, p: null, auto: true };
  function killDetailAnim() {
    if (D.tl) D.tl.kill();
    if (D.cycle) D.cycle.kill();
    D.rings.forEach(r => r.kill());
    D.tl = null; D.cycle = null; D.rings = [];
  }

  function openProduct(id, push) {
    const p = A.products[id];
    if (!p) return;
    beforeOpen();
    if (push !== false && O.history[O.history.length - 1] !== id) O.history.push(id);
    closeDrawer(true); closeReader(true);
    renderDetail(p);
  }

  function renderDetail(p) {
    killDetailAnim();
    const fam = famById(p.family);
    const el = $("#detail");
    el.hidden = false;
    const canBack = O.history.length > 1 || O.explore || !!O.deep;
    const usedIn = A.cases.filter(c => c.products.includes(p.id));
    el.innerHTML =
      '<div class="ov-head">' +
        (canBack ? '<button class="btn" data-act="back">' + ICON.back + "Back</button>" : "") +
        '<span class="spacer"></span>' +
        '<button class="btn" data-act="explore">' + ICON.grid + "All products</button>" +
        '<button class="btn primary" data-act="close-all">' + ICON.play + "Back to showcase</button>" +
      "</div>" +
      '<div class="hero"><div class="glow"></div><svg class="co"></svg></div>' +
      '<div class="gallery"></div>' +
      '<div class="info">' +
        '<div class="fam">' + esc(fam ? fam.title : "") + "</div>" +
        "<h1>" + esc(p.name) + (p.badge ? ' <span class="badge new" style="font-size:18px;vertical-align:14px">' + esc(p.badge) + "</span>" : "") + "</h1>" +
        '<p class="full">' + esc(p.full) + "</p>" +
        '<p class="tagline">' + esc(p.tagline) + "</p>" +
        '<p class="summary">' + esc(p.summary) + "</p>" +
        (p.features.length ? '<h2>Features</h2><ul class="ticks">' + p.features.map(f => "<li>" + esc(f) + "</li>").join("") + "</ul>" : "") +
        (p.steps ? '<h2>How it works</h2><ol class="steps">' + p.steps.map((st, i) => '<li class="on"><i>' + (i + 1) + "</i><span><b>" + esc(st[0]) + "</b>" + esc(st[1]) + "</span></li>").join("") + "</ol>" : "") +
        (p.specs.length ? '<h2>Specifications</h2><table class="specs">' + p.specs.map(r => "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>").join("") + "</table>" : "") +
        (p.regs ? '<h2>Approved for plants under</h2><ul class="ticks">' + p.regs.map(r => "<li>" + esc(r) + "</li>").join("") + "</ul>" : "") +
        (p.apps.length ? '<h2>Applications</h2><div class="chips">' + p.apps.map(id => chip(appById(id).name, "data-app", id)).join("") + "</div>" : "") +
        (p.uses ? '<h2>Typical uses</h2><div class="chips">' + p.uses.map(u => '<span class="chip">' + esc(u) + "</span>").join("") + "</div>" : "") +
        (p.certs.length ? '<h2>Certifications</h2><div class="chips">' + p.certs.map(id => chip(certById(id).name, "data-cert", id)).join("") + "</div>" : "") +
        (p.docs.length ? '<h2>Documents</h2><div class="doclist">' + p.docs.map(docCard).join("") + "</div>" : "") +
        (p.videos.length ? '<h2>Videos</h2><div class="vlist">' + p.videos.map(id => videoCard(A.videos.find(v => v.id === id))).join("") + "</div>" : "") +
        (usedIn.length ? '<h2>Reference cases</h2><div class="rel">' + usedIn.slice(0, 6).map(caseCard).join("") + "</div>" : "") +
        (p.related.length ? '<h2>Related products</h2><div class="rel">' + p.related.filter(r => A.products[r]).map(r => card(A.products[r])).join("") + "</div>" : "") +
      "</div>";
    $(".info", el).scrollTop = 0;
    const gal = $(".gallery", el);
    if (p.images.length > 1 || (p.callouts && p.callouts.length)) {
      gal.innerHTML = p.images.map((n, i) => '<button data-gal="' + i + '" class="' + (imgKind(n) === "plate" ? "plate" : "") + '" aria-label="Image ' + (i + 1) + '"><img src="' + SC.src(n) + '" alt=""' + (imgKind(n) === "photo" ? ' style="object-fit:cover"' : "") + "></button>").join("") +
        (p.callouts && p.callouts.length ? '<button class="btn" data-act="replay">' + ICON.replay + "Replay highlights</button>" : "");
    }
    D.p = p; D.auto = true;
    showImage(0, true);
    gsap.from($$(".info > *", el), { y: 18, opacity: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" });
  }

  function showImage(idx, withCallouts) {
    const p = D.p, el = $("#detail"), hero = $(".hero", el);
    if (!p) return;
    killDetailAnim();
    D.idx = idx;
    $$(".gallery [data-gal]", el).forEach(b => b.classList.toggle("on", +b.dataset.gal === idx));
    $$(".co-label, img.main, .typo", hero).forEach(n => n.remove());
    const svg = $("svg.co", hero); svg.innerHTML = "";
    const name = p.images[idx];
    if (!name) {
      const t = document.createElement("div"); t.className = "typo"; t.innerHTML = "<b>" + esc(p.name) + "</b>";
      hero.appendChild(t); gsap.from(t, { opacity: 0, scale: 0.97, duration: 0.6 });
      return;
    }
    const k = imgKind(name);
    const co = withCallouts && idx === 0 && p.callouts && p.callouts.length ? p.callouts : null;
    const img = new Image();
    img.className = "main" + (k === "plate" ? " plate" : k === "photo" ? " photo" : "");
    img.alt = p.full;
    img.onload = () => {
      const box = co ? { x: 262, y: 40, w: 556, h: 660 } : { x: 40, y: 20, w: 1000, h: 700 };
      const padd = k === "plate" ? 44 : 0;
      let w, h, x, y;
      const sc = Math.min((box.w - padd) / img.naturalWidth, (box.h - padd) / img.naturalHeight);
      w = img.naturalWidth * sc + padd; h = img.naturalHeight * sc + padd;
      x = box.x + (box.w - w) / 2; y = box.y + (box.h - h) / 2;
      Object.assign(img.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
      hero.insertBefore(img, svg);
      gsap.fromTo(img, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      if (co) drawCallouts(co, { x: x + padd / 2, y: y + padd / 2, w: w - padd, h: h - padd }, 760, hero, svg);
      else scheduleCycle(5.5);
    };
    img.src = SC.src(name);
  }

  function scheduleCycle(sec) {
    const p = D.p;
    if (!p || p.images.length < 2 || !D.auto) return;
    D.cycle = gsap.delayedCall(sec, () => showImage((D.idx + 1) % p.images.length, false));
  }

  function drawCallouts(list, r, HH, hero, svg) {
    const NS = "http://www.w3.org/2000/svg";
    const items = list.map(c => ({ c, px: r.x + r.w * c.x / 100, py: r.y + r.h * c.y / 100, side: c.x < 50 ? "left" : "right" }));
    const tl = gsap.timeline();
    D.tl = tl;
    ["left", "right"].forEach(side => {
      const it = items.filter(i => i.side === side).sort((a, b) => a.py - b.py);
      it.forEach(i => {
        const l = document.createElement("div");
        l.className = "co-label " + side; l.textContent = i.c.text;
        l.style.left = (side === "left" ? Math.max(0, r.x - 36 - 230) : r.x + r.w + 36) + "px";
        hero.appendChild(l);
        i.label = l; i.h = l.offsetHeight;
      });
      let y = -Infinity;
      it.forEach(i => { i.ly = Math.max(i.py, y + i.h / 2 + 12); y = i.ly + i.h / 2; });
      const over = y - (HH - 10);
      if (over > 0) {
        let floor = HH - 10;
        for (let j = it.length - 1; j >= 0; j--) { const i = it[j]; i.ly = Math.min(i.ly - over, floor - i.h / 2); floor = i.ly - i.h / 2 - 12; }
      }
      it.forEach(i => {
        i.label.style.top = (i.ly - i.h / 2) + "px";
        const elbow = side === "left" ? r.x - 14 : r.x + r.w + 14, edge = side === "left" ? r.x - 36 : r.x + r.w + 36;
        const path = document.createElementNS(NS, "path");
        path.setAttribute("d", "M" + i.px + " " + i.py + " L" + elbow + " " + i.py + " L" + edge + " " + i.ly);
        path.setAttribute("fill", "none"); path.setAttribute("stroke", "#0080C4"); path.setAttribute("stroke-width", 2.5);
        svg.appendChild(path);
        const ring = document.createElementNS(NS, "circle");
        ring.setAttribute("cx", i.px); ring.setAttribute("cy", i.py); ring.setAttribute("r", 8);
        ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#0080C4"); ring.setAttribute("stroke-width", 2);
        svg.appendChild(ring);
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", i.px); dot.setAttribute("cy", i.py); dot.setAttribute("r", 7);
        dot.setAttribute("fill", "#FFFFFF"); dot.setAttribute("stroke", "#0080C4"); dot.setAttribute("stroke-width", 3);
        svg.appendChild(dot);
        i.path = path; i.dot = dot; i.ring = ring;
      });
    });
    items.sort((a, b) => a.py - b.py || a.px - b.px).forEach((i, n) => {
      const L = i.path.getTotalLength();
      i.path.style.strokeDasharray = L + " " + L; i.path.style.strokeDashoffset = L;
      gsap.set([i.dot, i.ring, i.label], { opacity: 0 });
      const t0 = 0.6 + n * 0.8;
      tl.to(i.dot, { opacity: 1, duration: 0.01 }, t0)
        .from(i.dot, { attr: { r: 0 }, duration: 0.35, ease: "back.out(2)" }, t0)
        .to(i.path, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, t0 + 0.2)
        .fromTo(i.label, { opacity: 0, x: i.side === "left" ? 14 : -14 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, t0 + 0.45)
        .call(() => {
          i.ring.setAttribute("opacity", 1);
          D.rings.push(gsap.fromTo(i.ring, { attr: { r: 8 }, opacity: 0.9 }, { attr: { r: 24 }, opacity: 0, duration: 1.6, repeat: -1, ease: "power1.out" }));
        }, null, t0 + 0.3);
    });
    tl.call(() => scheduleCycle(6), null, "+=0.5");
  }

  function back() {
    if (O.drawer) { closeDrawer(); return; }
    if (O.reader) { closeReader(); return; }
    if (O.history.length > 1) { O.history.pop(); renderDetail(A.products[O.history[O.history.length - 1]]); return; }
    if (O.history.length === 1) {
      O.history = []; killDetailAnim();
      $("#detail").hidden = true; $("#detail").innerHTML = "";
      afterClose(); return;
    }
    if (O.explore) closeExplore();
  }

  /* ---------- Learn more: a self-running deep dive into the chapter on screen ---------- */
  const DP = { def: null, i: -1, cur: null, bars: [], live: new Set(), passes: 0, warnAt: 0, paused: false, token: 0 };

  function openLearn() { if (P.cur && !anyOpen() && DEEP[P.cur.def.id]) openDeep(P.cur.def.id); }

  function openDeep(id, start) {
    const def = DEEP[id];
    if (!def || !def.slides || !def.slides.length) return;
    beforeOpen();
    closeDeep(true);
    O.deep = id;
    Object.assign(DP, { def, i: -1, cur: null, passes: 0, warnAt: 0, paused: false });
    const token = ++DP.token;
    const el = $("#deep");
    el.innerHTML =
      '<div class="ov-head">' +
        '<div class="dtitle"><span>Learn more</span><b>' + esc(def.title) + "</b></div>" +
        '<span class="spacer"></span>' +
        '<span class="dpaused" hidden>Paused</span>' +
        '<div class="dprog">' + def.slides.map((s, i) => '<button data-deep-go="' + i + '" aria-label="Slide ' + (i + 1) + " of " + def.slides.length + '"><i><b></b></i></button>').join("") + "</div>" +
        '<button class="btn primary" data-act="deep-return">' + ICON.play + "Return to Slideshow</button>" +
      "</div>" +
      '<div class="dslides"></div>';
    DP.bars = $$(".dprog i b", el);
    el.hidden = false;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    $('[data-act="deep-return"]', el).focus({ preventScroll: true });
    SC.loadSizes(SC.deepImages(def), 1500).then(() => {
      if (DP.token === token && O.deep === id && !DP.cur) playDeep(start || 0);
    });
  }

  function playDeep(i) {
    const N = DP.def.slides.length;
    i = ((i % N) + N) % N;
    const sl = DP.def.slides[i];
    const old = DP.cur;
    const root = document.createElement("div");
    root.className = "scene dslide";
    root.style.opacity = 0;
    $("#deep .dslides").appendChild(root);
    const tl = gsap.timeline({ paused: true });
    const api = SC.makeApi(root, tl);
    let len = 10;
    try { len = SC.buildDeep(api, sl) || len; } catch (e) { console.error("Learn more slide " + (i + 1) + " (" + sl.type + ") failed", e); }
    const dur = Math.max(sl.dur || len, tl.duration() + 0.5);
    tl.set({}, {}, dur);
    tl.eventCallback("onComplete", () => { if (DP.cur && DP.cur.tl === tl) stepDeep(1, true); });
    const cur = { i, root, tl, api, dur };
    DP.cur = cur; DP.i = i;
    DP.live.add(cur);
    DP.bars.forEach((b, j) => { b.style.width = j < i ? "100%" : "0%"; });
    if (old) {
      old.tl.pause();
      old.api.loops.forEach(l => l.tw.pause());
      gsap.to(old.root, { opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => destroyDeepSlide(old) });
    }
    gsap.to(root, { opacity: 1, duration: 0.7, delay: old ? 0.2 : 0, ease: "power2.out" });
    if (deepOnly() && !DP.paused) tl.play(0);
    else { tl.seek(dur * 0.62, true); tl.pause(); }
  }

  function destroyDeepSlide(sc) {
    if (sc.dead) return;
    sc.dead = true;
    gsap.killTweensOf(sc.root);
    sc.tl.kill();
    sc.api.loops.forEach(l => l.tw.kill());
    sc.root.remove();
    DP.live.delete(sc);
  }

  function stepDeep(d, auto) {
    if (!O.deep) return;
    const N = DP.def.slides.length;
    if (auto && DP.i + d >= N) {
      DP.passes++;
      if (DP.passes >= 2 && !DP.warnAt) DP.warnAt = Date.now();
    }
    playDeep(DP.i + d);
  }
  function pauseDeep() {
    if (!DP.cur) return;
    DP.cur.tl.pause();
    DP.cur.api.loops.forEach(l => l.tw.pause());
  }
  function resumeDeep() {
    if (!DP.cur || DP.paused || !deepOnly()) return;
    const t = DP.cur.tl.time();
    DP.cur.api.loops.forEach(l => { if (l.started || l.at <= t) { l.started = true; l.tw.play(); } });
    DP.cur.tl.play();
  }
  function toggleDeepPause() {
    DP.paused = !DP.paused;
    const tag = $("#deep .dpaused");
    if (tag) tag.hidden = !DP.paused;
    if (DP.paused) pauseDeep(); else resumeDeep();
  }
  function closeDeep(silent) {
    if (!O.deep && !DP.live.size) return;
    const wasWarning = !!DP.warnAt;
    O.deep = null;
    DP.token++;
    DP.live.forEach(destroyDeepSlide);
    Object.assign(DP, { def: null, i: -1, cur: null, bars: [], passes: 0, warnAt: 0, paused: false });
    const el = $("#deep");
    gsap.killTweensOf(el);
    el.hidden = true; el.innerHTML = ""; el.style.opacity = "";
    if (wasWarning) { counting = false; hideToast(); }
    if (!silent) afterClose();
  }
  function returnFromDeep() {
    closeDeep();
    if (!anyOpen()) setPlaying(true);
  }

  /* ---------- Explore ---------- */
  const TABS = [["products", "Products"], ["apps", "Applications"], ["cases", "References"], ["certs", "Certificates"], ["docs", "Documents"], ["network", "Distributors"], ["videos", "Videos"], ["knowledge", "Knowledge"]];
  let exploreTab = "products";
  const XS = { docGroup: "All", topic: "All", q: "", kq: "", country: null };

  function openExplore(tab, anchor) {
    beforeOpen();
    killDetailAnim();
    O.history = []; $("#detail").hidden = true; $("#detail").innerHTML = "";
    closeDrawer(true); closeReader(true);
    O.explore = true;
    exploreTab = tab || exploreTab || "products";
    const el = $("#explore");
    el.hidden = false;
    el.innerHTML =
      '<div class="ov-head"><h1 class="title">Explore</h1><div class="tabs" role="tablist">' +
      TABS.map(([k, t]) => '<button role="tab" data-tab="' + k + '" class="' + (k === exploreTab ? "on" : "") + '" aria-selected="' + (k === exploreTab) + '">' + t + "</button>").join("") +
      '</div><span class="spacer"></span><button class="btn primary" data-act="close-all">' + ICON.play + "Back to showcase</button></div>" +
      '<div class="body"></div>';
    const body = $(".body", el);
    if (exploreTab === "products") body.innerHTML = renderProducts();
    if (exploreTab === "apps") body.innerHTML = renderApps();
    if (exploreTab === "cases") body.innerHTML = renderCases();
    if (exploreTab === "certs") body.innerHTML = renderCerts();
    if (exploreTab === "docs") { body.innerHTML = '<div class="searchrow"><input class="search" id="doc-q" type="search" placeholder="Search documents, e.g. S305QAL or ATEX" aria-label="Search documents"><div class="chips filter" id="doc-groups"></div></div><div class="docs-out"></div>'; $("#doc-q").value = XS.q; renderDocs(); }
    if (exploreTab === "network") renderNetwork(body, anchor || XS.country);
    if (exploreTab === "videos") body.innerHTML = renderVideos();
    if (exploreTab === "knowledge") { body.innerHTML = '<div class="searchrow"><input class="search" id="kn-q" type="search" placeholder="Search articles, e.g. triboelectric, baghouse, cement" aria-label="Search articles"><div class="chips filter" id="kn-topics"></div></div><div class="kn-out"></div>'; $("#kn-q").value = XS.kq; renderKnowledge(); }
    body.scrollTop = 0;
    if (anchor && exploreTab === "products") { const t = $("#fam-" + anchor, body); if (t) body.scrollTop = t.offsetTop - 10; }
    gsap.from(body, { opacity: 0, y: 16, duration: 0.4, ease: "power2.out" });
  }
  function closeExplore() {
    O.explore = false;
    $("#explore").hidden = true; $("#explore").innerHTML = "";
    afterClose();
  }

  function renderProducts() {
    return fams.filter(f => Object.values(A.products).some(p => p.family === f.id)).map(f => {
      const ps = Object.values(A.products).filter(p => p.family === f.id);
      const hasScene = SC.list.some(s => s.family === f.id);
      return '<section class="fam" id="fam-' + f.id + '"><header><h2>' + esc(f.title) + "</h2><p>" + esc(f.blurb) + "</p>" +
        (hasScene ? '<button class="btn" data-family-play="' + f.id + '">' + ICON.play + "Play this chapter</button>" : "") +
        '</header><div class="grid">' + ps.map(card).join("") + "</div></section>";
    }).join("");
  }
  function renderApps() {
    return '<section class="fam"><header><h2>Application finder</h2><p>What do you need to know about your dust? Tap an application for the monitors and reference cases behind it.</p><button class="btn" data-family-play="apps">' + ICON.play + 'Play this chapter</button></header><div class="grid3">' +
      A.apps.map(appTile).join("") + "</div></section>" +
      '<section class="fam"><header><h2>Industries we serve</h2></header><div class="chips">' + A.industries.map(i => '<span class="chip">' + esc(i) + "</span>").join("") + "</div></section>" +
      '<section class="fam"><header><h2>Seven reasons to monitor dust</h2><p>From "Detect dust before it becomes a safety, production or environmental problem".</p></header><div class="grid4">' +
      A.reasons.map(r => '<div class="photo-card" style="cursor:default;height:300px"><img src="' + SC.src(r[2]) + '" alt="" loading="lazy" style="height:52%"><div><b>' + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></div></div>").join("") +
      '<button class="photo-card" data-article="detect-dust-before-it-becomes-a-safety-production-or-environmental-problem" style="height:300px;text-align:left;padding:0"><img src="' + SC.src("dust-worker") + '" alt="" style="height:52%"><div><b>Read the full article</b><span>Seven reasons, and where dust monitoring can be used</span></div></button></div></section>';
  }
  function renderCases() {
    return '<section class="fam"><header><h2>Reference cases</h2><p>How customers use Sintrol monitors to meet emission standards, keep processes running and protect people. Tap a case to read it.</p><button class="btn" data-family-play="cases">' + ICON.play + 'Play this chapter</button></header><div class="grid4">' +
      A.cases.map(caseCard).join("") + "</div></section>" +
      '<section class="fam"><header><h2>Application notes</h2><p>Two-page PDFs for eight of the cases.</p></header><div class="dgrid">' +
      Object.values(A.docs).filter(d => d.group === "Application notes").map(d => docCard(d.id)).join("") + "</div></section>";
  }
  function renderCerts() {
    return '<section class="fam"><header><h2>Certifications and approvals</h2><p>Tap a certification to see the products it covers and the certificates.</p><button class="btn" data-family-play="certs">' + ICON.play + 'Play this chapter</button></header><div class="grid3">' +
      A.certs.map(certTile).join("") + "</div></section>" +
      ["Certificates", "Declarations"].map(g => '<section class="fam"><header><h2>' + (g === "Declarations" ? "EU declarations of conformity" : "Certificates") + '</h2></header><div class="dgrid">' +
        Object.values(A.docs).filter(d => d.group === g).map(d => docCard(d.id)).join("") + "</div></section>").join("");
  }
  const DOC_GROUPS = ["Company", "Brochures", "User manuals", "Certificates", "Declarations", "Application notes"];
  function renderDocs() {
    const out = $("#explore .docs-out"); if (!out) return;
    const gs = $("#doc-groups");
    gs.innerHTML = ["All"].concat(DOC_GROUPS).map(g => '<button class="chip' + (XS.docGroup === g ? " on" : "") + '" data-docgroup="' + esc(g) + '">' + esc(g) + "</button>").join("");
    const words = XS.q.toLowerCase().split(/\s+/).filter(Boolean);
    const all = Object.values(A.docs).filter(d => (XS.docGroup === "All" || d.group === XS.docGroup) && words.every(w => (d.title + " " + d.group + " " + d.note + " " + d.file).toLowerCase().includes(w)));
    if (!all.length) { out.innerHTML = '<p class="empty">No documents match "' + esc(XS.q) + '". Try a model such as S304, or a word such as manual or ATEX.</p>'; return; }
    out.innerHTML = DOC_GROUPS.map(g => {
      const ds = all.filter(d => d.group === g);
      return ds.length ? '<section class="fam"><header><h2>' + esc(g) + "</h2><p>" + ds.length + ' documents</p></header><div class="dgrid">' + ds.map(d => docCard(d.id)).join("") + "</div></section>" : "";
    }).join("");
  }
  function renderVideos() {
    const groups = ["Products", "Webinars"];
    return '<p class="intro"><span>Sintrol videos are on YouTube and open in a new browser window when the booth has internet. Close it with Ctrl+W to come back. To play one offline, see the README.</span></p>' +
      groups.map(g => '<section class="fam"><header><h2>' + (g === "Webinars" ? "Partner webinars" : "Product videos") + '</h2></header><div class="grid4">' + A.videos.filter(v => v.group === g).map(videoCard).join("") + "</div></section>").join("");
  }
  const TOPICS = ["All", "How it works", "Emissions and compliance", "Filters and process", "Safety and workplace", "Industries", "News"];
  function renderKnowledge() {
    const out = $("#explore .kn-out"); if (!out) return;
    $("#kn-topics").innerHTML = TOPICS.map(t => '<button class="chip' + (XS.topic === t ? " on" : "") + '" data-topic="' + esc(t) + '">' + esc(t) + (t === "All" ? " (" + ART.length + ")" : "") + "</button>").join("");
    const words = XS.kq.toLowerCase().split(/\s+/).filter(Boolean);
    const list = ART.filter(a => (XS.topic === "All" || a.topic === XS.topic) && (!words.length || words.every(w => (a.title + " " + a.topic).toLowerCase().includes(w) || JSON.stringify(a.blocks).toLowerCase().includes(w))));
    out.innerHTML = list.length ? '<div class="arts">' + list.map(artCard).join("") + "</div>" : '<p class="empty">No articles match "' + esc(XS.kq) + '".</p>';
  }

  /* Distributors: map, country list, partner cards */
  function renderNetwork(body, country) {
    body.innerHTML = '<div class="netwrap"><div><div class="mapbox"></div><h2 style="font-size:26px;margin:26px 0 12px">Countries with a Sintrol partner</h2><div class="maplist">' +
      NET.countries.map(c => '<button data-country="' + esc(c.name) + '">' + esc(c.name) + "<em>" + c.partners.length + "</em></button>").join("") +
      '</div></div><div class="partners"></div></div>';
    const m = SC.worldMap($(".mapbox", body), 1090, {});
    m.pulse.remove();
    selectCountry(country);
  }
  function selectCountry(name) {
    XS.country = name || null;
    const body = $("#explore .body"); if (!body || exploreTab !== "network") return;
    const c = NET.countries.find(x => x.name === name);
    $$(".map path.c", body).forEach(p => p.classList.toggle("sel", !!c && p.dataset.country === c.name));
    $$(".maplist button", body).forEach(b => b.classList.toggle("sel", !!c && b.dataset.country === c.name));
    const box = $(".partners", body);
    const off = o => '<div class="pcard hq"><b>' + esc(o.name) + "</b><div>" + esc(o.address) + "<br><span>" + esc(o.phone) + " · " + esc(o.email) + "</span></div></div>";
    if (!c) {
      box.innerHTML = "<h3>Find your local distributor</h3><p>Tap a country on the map or in the list. If your country is not listed, the Sintrol sales team can help directly.</p>" +
        off(Object.assign({}, NET.hq, { name: "Sintrol Oy, head office" })) + NET.offices.map(off).join("") +
        '<h3 style="font-size:26px;margin-top:30px">Become a Sintrol distributor</h3><p>Sintrol is looking for distributors with experience in process measurement, air quality and emissions, or industrial safety, selling to cement, power, food, mining and manufacturing. Partners get technical training, marketing materials, exclusive pricing and priority support.</p>' +
        '<h3 style="font-size:26px;margin-top:10px">International sales</h3>' + A.team.map(t => '<div class="pcard"><b>' + esc(t.name) + "</b><div>" + esc(t.role) + "<br><span>" + esc(t.phone) + " · " + esc(t.email) + "</span></div></div>").join("");
    } else {
      box.innerHTML = "<h3>" + esc(c.name) + "</h3><p>" + c.partners.length + " Sintrol partner" + (c.partners.length > 1 ? "s" : "") + "</p>" +
        c.partners.map(pt => '<div class="pcard"><b>' + esc(pt.name) + "</b><div>" + (pt.address ? esc(pt.address) + "<br>" : "") + "<span>" + [pt.phone, pt.web].filter(Boolean).map(esc).join(" · ") + "</span></div></div>").join("") +
        '<p style="margin-top:20px">Head office: ' + esc(NET.hq.phone) + " · " + esc(NET.hq.email) + '</p><button class="btn" data-country="">' + ICON.back + "All countries</button>";
    }
    gsap.from(box.children, { opacity: 0, y: 12, duration: 0.35, stagger: 0.03 });
  }

  /* ---------- Drawer: application or certification ---------- */
  function openDrawer(kind, id) {
    beforeOpen();
    O.drawer = kind + ":" + id;
    const el = $("#drawer");
    let html = '<button class="btn close" data-act="close-drawer">' + ICON.close + "Close</button>";
    if (kind === "app") {
      const ap = appById(id); if (!ap) return;
      const cs = ap.cases.map(caseById).filter(Boolean);
      html += '<img class="banner" src="' + SC.src(ap.img) + '" alt=""><div class="small">Application</div><h2>' + esc(ap.name) + "</h2><p>" + esc(ap.desc) + "</p>" +
        '<h3>Sintrol monitors for this</h3><div class="grid3">' + ap.products.filter(p => A.products[p]).map(p => card(A.products[p])).join("") + "</div>" +
        (cs.length ? '<h3>Reference cases</h3><div class="cases2">' + cs.map(caseCard).join("") + "</div>" : "");
    } else {
      const c = certById(id); if (!c) return;
      html += '<div class="small">' + esc(c.std) + " · " + esc(c.body) + "</div><h2>" + esc(c.name) + "</h2><p>" + esc(c.text) + "</p>" +
        (c.products.length ? '<h3>Products</h3><div class="grid3">' + c.products.filter(p => A.products[p]).map(p => card(A.products[p])).join("") + "</div>" : "") +
        (c.docs.length ? '<h3>Certificates</h3><div class="doclist">' + c.docs.map(docCard).join("") + "</div>" : "");
    }
    el.innerHTML = html;
    el.hidden = false; el.scrollTop = 0;
    gsap.fromTo(el, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  }
  function closeDrawer(silent) {
    if (!O.drawer && $("#drawer").hidden) return;
    O.drawer = null;
    $("#drawer").hidden = true; $("#drawer").innerHTML = "";
    if (!silent) afterClose();
  }

  /* ---------- Reader: reference case or article ---------- */
  function openCase(id) {
    const c = caseById(id); if (!c) return;
    beforeOpen(); closeDrawer(true);
    O.reader = "case:" + id;
    const el = $("#reader");
    el.innerHTML = readerHead() + '<div class="rbody">' +
      '<div class="rhero"><img src="' + SC.src(c.img) + '" alt=""><div><em>Reference case · ' + esc(c.industry) + "</em><h1>" + esc(c.title) + "</h1><p>" + esc(c.where) + "</p></div></div>" +
      '<div class="rstats">' + c.stats.map(st => "<div><b>" + esc(st[0]) + "</b><span>" + esc(st[1]) + "</span></div>").join("") + "</div>" +
      '<div class="rcols"><div><h2>The challenge</h2><p>' + esc(c.challenge) + "</p><h2>The solution</h2><p>" + esc(c.solution) + "</p><h2>How it works</h2><p>" + esc(c.how) + "</p>" +
        (c.table ? '<h2>What different dust measurements tell you</h2><table class="mtx"><thead><tr>' + c.table.head.map(h => "<th>" + esc(h) + "</th>").join("") + "</tr></thead><tbody>" + c.table.rows.map(r => "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + '</td><td class="y">' + esc(r[2]) + "</td></tr>").join("") + "</tbody></table>" : "") +
      '</div><div><h2>Results</h2><p class="headline">' + esc(c.headline) + '</p><ul class="ticks">' + c.results.map(r => "<li>" + esc(r) + "</li>").join("") + "</ul>" +
        (c.doc ? '<h2 style="margin-top:34px">Application note</h2><div class="doclist" style="grid-template-columns:1fr">' + docCard(c.doc) + "</div>" : "") +
        (c.video ? '<h2 style="margin-top:34px">Video</h2><div class="vlist" style="grid-template-columns:1fr 1fr">' + videoCard(A.videos.find(v => v.id === c.video)) + "</div>" : "") +
        '<h2 style="margin-top:34px">Sintrol solutions today</h2><div class="rel">' + c.products.filter(p => A.products[p]).map(p => card(A.products[p])).join("") + "</div>" +
        '<p class="small" style="margin-top:14px;font-size:16px">Some products referenced in a case may be earlier-generation models; these are Sintrol\'s current solutions for the application.</p>' +
      "</div></div></div>";
    showReader();
  }
  function openArticle(id) {
    const a = ART.find(x => x.id === id); if (!a) return;
    beforeOpen(); closeDrawer(true);
    O.reader = "article:" + id;
    const el = $("#reader");
    const body = a.blocks.map(b => b.h ? "<h2>" + esc(b.h) + "</h2>" : b.p ? "<p>" + esc(b.p) + "</p>" : b.ul ? "<ul>" + b.ul.map(li => "<li>" + esc(li) + "</li>").join("") + "</ul>" :
      b.table ? "<table>" + b.table.map(r => "<tr>" + r.map(c => "<td>" + esc(c) + "</td>").join("") + "</tr>").join("") + "</table>" : "").join("");
    el.innerHTML = readerHead() + '<div class="rbody"><article class="article"><div class="meta">' + esc(a.topic) + (a.date ? " · " + fmtDate(a.date) : "") + "</div><h1>" + esc(a.title) + "</h1>" + body +
      '<p class="small" style="margin-top:40px;font-size:17px">From sintrol.fi/international.</p></article></div>';
    showReader();
  }
  function readerHead() {
    return '<div class="ov-head"><button class="btn" data-act="close-reader">' + ICON.back + 'Back</button><span class="spacer"></span><button class="btn primary" data-act="close-all">' + ICON.play + "Back to showcase</button></div>";
  }
  function showReader() {
    const el = $("#reader");
    el.hidden = false;
    $(".rbody", el).scrollTop = 0;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35 });
  }
  function closeReader(silent) {
    if (!O.reader && $("#reader").hidden) return;
    O.reader = null;
    $("#reader").hidden = true; $("#reader").innerHTML = "";
    if (!silent) afterClose();
  }

  /* ---------- Documents and videos ---------- */
  function openDoc(id) {
    const d = A.docs[id]; if (!d) return;
    beforeOpen();
    O.pdf = id;
    $("#pdf-title").textContent = d.title;
    $("#pdf-frame").src = encodeURI(d.file) + "#view=FitH";
    $("#pdf").hidden = false;
    $("#pdf-close").focus();
  }
  function closePdf(silent) {
    if (!O.pdf && $("#pdf").hidden) return;
    O.pdf = null;
    $("#pdf").hidden = true;
    $("#pdf-frame").src = "about:blank";
    if (!silent) afterClose();
  }
  $("#pdf-close").addEventListener("click", () => closePdf());

  function openVideo(id) {
    const v = A.videos.find(x => x.id === id); if (!v) return;
    if (!v.file) {
      if (navigator.onLine === false) { toast("This video is on YouTube and needs an internet connection.", 6); return; }
      window.open(v.url, "_blank", "noopener");
      toast("Opened on YouTube in a new window. Close it with Ctrl+W to come back.", 6);
      return;
    }
    beforeOpen();
    O.vid = id;
    $("#vid-title").textContent = v.title;
    const pl = $("#vid-player");
    pl.src = v.file; pl.play().catch(() => {});
    $("#vid").hidden = false;
  }
  function closeVid(silent) {
    if (!O.vid && $("#vid").hidden) return;
    O.vid = null;
    const pl = $("#vid-player"); pl.pause(); pl.removeAttribute("src"); pl.load();
    $("#vid").hidden = true;
    if (!silent) afterClose();
  }
  $("#vid-close").addEventListener("click", () => closeVid());

  /* ---------- Toast + idle ---------- */
  let toastTimer = null;
  function toast(msg, sec) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    if (O.pdf && A.docs[O.pdf]) $("#pdf-title").textContent = A.docs[O.pdf].title + "   (" + msg.replace("Touch anywhere", "Tap here") + ")";
    clearTimeout(toastTimer);
    if (sec) toastTimer = setTimeout(hideToast, sec * 1000);
  }
  function hideToast() {
    $("#toast").hidden = true; clearTimeout(toastTimer);
    if (O.pdf && A.docs[O.pdf]) $("#pdf-title").textContent = A.docs[O.pdf].title;
  }

  let lastInput = Date.now(), counting = false;
  function activity() {
    lastInput = Date.now();
    if (counting) { counting = false; hideToast(); }
    DP.passes = 0; DP.warnAt = 0;
  }
  setInterval(() => {
    if (O.vid && !$("#vid-player").paused) lastInput = Date.now();
    const idle = (Date.now() - lastInput) / 1000;
    if (deepOnly() && !DP.paused) {
      if (DP.warnAt) {
        const left = COUNTDOWN - (Date.now() - DP.warnAt) / 1000;
        if (left <= 0) { counting = false; closeAll(); setPlaying(true); }
        else { counting = true; toast("Going back to the showcase in " + Math.ceil(left) + " s. Touch anywhere to stay."); }
      }
    } else if (anyOpen()) {
      const limit = O.pdf || O.vid || (O.reader && O.reader.startsWith("article")) ? IDLE_LONG : IDLE_OVERLAY;
      if (idle >= limit + COUNTDOWN) { counting = false; closeAll(); setPlaying(true); }
      else if (idle >= limit) {
        counting = true;
        toast("Going back to the showcase in " + Math.ceil(limit + COUNTDOWN - idle) + " s. Touch anywhere to stay.");
      }
    } else if (!P.playing && idle >= IDLE_PAUSED) {
      setPlaying(true);
    }
  }, 500);

  let hideTimer = null;
  function pointerSeen() {
    document.body.classList.remove("cursor-hidden");
    // the film controls share the top centre with panel headers, so they only show over the film
    document.body.classList.toggle("show-controls", !anyOpen());
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      document.body.classList.remove("show-controls");
      if (!anyOpen()) document.body.classList.add("cursor-hidden");
    }, 3500);
  }
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(ev => window.addEventListener(ev, activity, { passive: true }));
  window.addEventListener("pointermove", () => { activity(); pointerSeen(); }, { passive: true });

  /* ---------- Clicks ---------- */
  stage.addEventListener("click", e => {
    const t = e.target.closest("[data-act],[data-product],[data-case],[data-app],[data-cert],[data-country],[data-doc],[data-article],[data-video],[data-family-play],[data-rail-fam],[data-tab],[data-gal],[data-deep-go],[data-topic],[data-docgroup]");
    if (!t) return;
    const ds = t.dataset;
    if (ds.act) {
      const a = ds.act;
      if (a === "close-all") { closeAll(); setPlaying(true); }
      else if (a === "back") back();
      else if (a === "explore") openExplore("products", D.p ? D.p.family : null);
      else if (a === "replay") { D.auto = true; showImage(0, true); }
      else if (a === "close-drawer") closeDrawer();
      else if (a === "close-reader") closeReader();
      else if (a === "deep-return") returnFromDeep();
      return;
    }
    if (ds.deepGo != null) { if (O.deep) playDeep(+ds.deepGo); return; }
    if (ds.gal != null) { D.auto = false; showImage(+ds.gal, +ds.gal === 0); return; }
    if (ds.tab) { openExplore(ds.tab); return; }
    if (ds.docgroup) { XS.docGroup = ds.docgroup; renderDocs(); return; }
    if (ds.topic) { XS.topic = ds.topic; renderKnowledge(); return; }
    if (ds.familyPlay) { playFamily(ds.familyPlay); return; }
    if (ds.railFam) { const f = famById(ds.railFam); if (f.open.deep) openDeep(f.open.deep); else openExplore(f.open.tab, f.open.tab === "products" ? f.id : null); return; }
    if (ds.country != null) { if (O.explore && exploreTab === "network") selectCountry(ds.country); else openExplore("network", ds.country); return; }
    if (ds.doc) { openDoc(ds.doc); return; }
    if (ds.video) { openVideo(ds.video); return; }
    if (ds.article) { openArticle(ds.article); return; }
    if (ds.case) { openCase(ds.case); return; }
    if (ds.app) { openDrawer("app", ds.app); return; }
    if (ds.cert) { openDrawer("cert", ds.cert); return; }
    if (ds.product) { openProduct(ds.product); return; }
  });
  stage.addEventListener("input", e => {
    if (e.target.id === "doc-q") { XS.q = e.target.value; renderDocs(); }
    if (e.target.id === "kn-q") { XS.kq = e.target.value; renderKnowledge(); }
  });
  $("#explore-btn").addEventListener("click", e => { e.stopPropagation(); openExplore("products"); });
  learnBtn.addEventListener("click", e => { e.stopPropagation(); openLearn(); });
  $("#c-prev").addEventListener("click", () => next(-1));
  $("#c-next").addEventListener("click", () => next(1));
  $("#c-play").addEventListener("click", () => setPlaying(!P.playing));
  $("#c-fs").addEventListener("click", toggleFs);
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  /* ---------- Keyboard ---------- */
  window.addEventListener("keydown", e => {
    if (e.target.matches && e.target.matches("input, textarea")) {
      if (e.key === "Escape") e.target.blur();
      return;
    }
    const k = e.key;
    if (k === "Escape") {
      if (O.pdf) closePdf();
      else if (O.vid) closeVid();
      else if (O.drawer) closeDrawer();
      else if (O.reader) closeReader();
      else if (O.history.length) back();
      else if (O.explore) closeExplore();
      else if (O.deep) returnFromDeep();
      return;
    }
    if (O.pdf || O.vid) return;
    const key = k.toLowerCase();
    if (key === "f") { toggleFs(); return; }
    const tabKeys = { e: "products", a: "apps", c: "cases", q: "certs", d: "docs", n: "network", v: "videos", k: "knowledge" };
    if (tabKeys[key]) { openExplore(tabKeys[key]); return; }
    if (deepOnly()) {
      if (k === " ") { e.preventDefault(); toggleDeepPause(); }
      else if (k === "ArrowRight") stepDeep(1);
      else if (k === "ArrowLeft") stepDeep(-1);
      return;
    }
    if (anyOpen()) return;
    if (k === " ") { e.preventDefault(); setPlaying(!P.playing); }
    else if (key === "l") openLearn();
    else if (k === "ArrowRight") next(1);
    else if (k === "ArrowLeft") next(-1);
    else if (/^[0-9]$/.test(k)) { const f = fams[(+k + 9) % 10]; if (f) playFamily(f.id); }
  });

  /* ---------- Start ---------- */
  function preload() {
    const names = new Set(SC.images);
    Object.values(A.products).forEach(p => p.images.forEach(n => names.add(n)));
    Object.values(DEEP).forEach(def => SC.deepImages(def).forEach(n => names.add(n)));
    names.forEach(n => {
      const i = new Image();
      i.onload = () => { SC.sizes[n] = [i.naturalWidth, i.naturalHeight]; };
      i.src = SC.src(n);
    });
  }
  preload();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    const q = new URLSearchParams(location.search);
    const byId = SC.list.findIndex(s => s.id === q.get("scene"));
    const start = parseInt(q.get("scene") || "0", 10);
    playScene(byId >= 0 ? byId : (isNaN(start) ? 0 : start));
    if (q.get("deep") && DEEP[q.get("deep")]) openDeep(q.get("deep"), Math.max(0, (parseInt(q.get("slide"), 10) || 1) - 1));
    if (q.get("explore")) openExplore(q.get("explore"));
    if (q.get("product")) openProduct(q.get("product"));
    if (q.get("case")) openCase(q.get("case"));
  });

  // Hooks for testing from the console
  window.Show = { playScene, setPlaying, openProduct, openExplore, openDrawer, openCase, openArticle, openDoc, openDeep, closeDeep, closeAll, selectCountry, state: P, overlays: O, deep: DP };
})();

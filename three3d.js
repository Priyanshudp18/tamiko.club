/* Tamiko — 3D moments (needs three.js r128 loaded first) */
(() => {
  if (!window.THREE) return;
  const T = THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = { navy: 0x1A2352, navy2: 0x2B3678, rose: 0xCF6A86, roseDeep: 0xB24A6A, blush: 0xF6DCE4, cream: 0xF4EEF2, gold: 0xD9A88F, sky: 0xC9D7F2 };

  const glWorks = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (_) { return false; } })();
  if (!glWorks) return;

  const mat = (color, o = {}) => new T.MeshPhysicalMaterial(Object.assign({ color, roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 }, o));
  const glass = (color) => mat(color, { transparent: true, opacity: 0.62, roughness: 0.04, metalness: 0, clearcoat: 1, side: T.DoubleSide });
  const metal = (color) => mat(color, { metalness: 0.75, roughness: 0.28 });
  const lathe = (pts, seg = 48) => new T.LatheGeometry(pts.map(([x, y]) => new T.Vector2(x, y)), seg);
  const cyl = (rt, rb, h, seg = 48) => new T.CylinderGeometry(rt, rb, h, seg);
  const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); return o; };
  const centered = (inner, h) => { const g = new T.Group(); inner.position.y = -h / 2; g.add(inner); return g; };

  /* ---------- product models ---------- */
  const P = {
    perfume() {
      const g = new T.Group();
      g.add(mesh(lathe([[0, 0], [0.44, 0], [0.5, 0.06], [0.52, 0.5], [0.5, 0.86], [0.32, 1.0], [0.13, 1.04], [0.13, 1.1], [0, 1.1]], 8), glass(C.rose)));
      g.add(mesh(lathe([[0, 0.05], [0.4, 0.05], [0.44, 0.1], [0.45, 0.56], [0, 0.56]], 8), mat(C.roseDeep, { roughness: 0.2 })));
      g.add(mesh(cyl(0.2, 0.2, 0.34, 8), metal(C.navy), 0, 1.26));
      return centered(g, 1.43);
    },
    lipstick() {
      const g = new T.Group();
      g.add(mesh(cyl(0.22, 0.22, 0.6), metal(C.navy), 0, 0.3));
      g.add(mesh(cyl(0.2, 0.2, 0.14), metal(C.gold), 0, 0.67));
      const bullet = mesh(lathe([[0, 0], [0.155, 0], [0.155, 0.3], [0.1, 0.4], [0.02, 0.46], [0, 0.46]]), mat(C.roseDeep, { roughness: 0.25 }), 0, 0.74);
      bullet.rotation.z = 0.08; g.add(bullet);
      return centered(g, 1.2);
    },
    jar() {
      const g = new T.Group();
      g.add(mesh(cyl(0.46, 0.44, 0.42), mat(C.blush), 0, 0.21));
      g.add(mesh(cyl(0.49, 0.49, 0.2), metal(C.navy), 0, 0.52));
      g.add(mesh(cyl(0.3, 0.3, 0.02), metal(C.gold), 0, 0.63));
      return centered(g, 0.64);
    },
    serum() {
      const g = new T.Group();
      g.add(mesh(lathe([[0, 0], [0.27, 0], [0.31, 0.04], [0.31, 0.64], [0.2, 0.74], [0.11, 0.76], [0, 0.76]]), glass(C.gold)));
      g.add(mesh(cyl(0.12, 0.12, 0.12), metal(C.gold), 0, 0.82));
      const bulb = mesh(new T.SphereGeometry(0.14, 32, 16), mat(C.navy, { roughness: 0.45 }), 0, 1.02); bulb.scale.y = 1.5; g.add(bulb);
      return centered(g, 1.2);
    },
    tube() {
      const g = new T.Group();
      const body = mesh(cyl(0.3, 0.2, 1.0), mat(C.cream), 0, 0.68); body.scale.z = 0.62; g.add(body);
      const band = mesh(cyl(0.285, 0.27, 0.12), mat(C.rose), 0, 0.92); band.scale.z = 0.64; g.add(band);
      g.add(mesh(cyl(0.22, 0.22, 0.2), metal(C.navy), 0, 0.1));
      const crimp = mesh(new T.BoxGeometry(0.62, 0.06, 0.12), mat(C.cream), 0, 1.2); g.add(crimp);
      return centered(g, 1.23);
    },
    compact() {
      const g = new T.Group();
      g.add(mesh(cyl(0.48, 0.48, 0.12), metal(C.navy), 0, 0.06));
      g.add(mesh(cyl(0.48, 0.48, 0.1), metal(C.navy2), 0, 0.17));
      g.add(mesh(cyl(0.3, 0.3, 0.012), metal(C.rose), 0, 0.226));
      return centered(g, 0.23);
    },
    applicators() {
      const g = new T.Group();
      g.add(mesh(new T.BoxGeometry(0.9, 0.06, 0.6), mat(0xFFFFFF, { roughness: 0.6, clearcoat: 0.4 }), 0, 0.03));
      g.add(mesh(new T.BoxGeometry(0.9, 0.065, 0.1), mat(C.rose), 0, 0.03, -0.18));
      for (let i = 0; i < 4; i++) {
        const s = mesh(cyl(0.025, 0.025, 0.7, 12), mat(0xFFFFFF, { roughness: 0.7, clearcoat: 0 }), -0.25 + i * 0.16, 0.09, 0.06);
        s.rotation.z = Math.PI / 2; s.rotation.y = Math.PI / 2; g.add(s);
        g.add(mesh(new T.SphereGeometry(0.05, 12, 8), mat(0xFFFFFF, { roughness: 0.9, clearcoat: 0 }), -0.25 + i * 0.16, 0.09, 0.41));
      }
      return centered(g, 0.12);
    },
    pearl() { return mesh(new T.SphereGeometry(0.16, 32, 16), mat(0xFFF4F8, { roughness: 0.15 })); },
  };

  const lights = (scene, strength = 1) => {
    scene.add(new T.AmbientLight(0xffffff, 0.45 * strength));
    scene.add(new T.HemisphereLight(0xE3EAF6, 0xF5D7E0, 0.7 * strength));
    const key = new T.DirectionalLight(0xffffff, 1.15 * strength); key.position.set(3, 6, 5); scene.add(key);
    const r = new T.PointLight(0xFF8FB0, 0.9 * strength, 40); r.position.set(-5, -2, 4); scene.add(r);
    const b = new T.PointLight(0x8FB0FF, 0.7 * strength, 40); b.position.set(5, 3, -3); scene.add(b);
  };

  const makeRenderer = (canvas) => {
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    r.setPixelRatio(Math.min(1.75, devicePixelRatio || 1));
    r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    return r;
  };

  const visibleLoop = (el, frame) => {
    let on = false, raf = 0;
    const tick = (t) => { frame(t); if (on) raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting && !reduce; if (on && !was) raf = requestAnimationFrame(tick); if (!on) cancelAnimationFrame(raf); }).observe(el);
  };

  /* ---------- floating products (hero backgrounds) ---------- */
  function floatScene(canvas, layout) {
    const renderer = makeRenderer(canvas), scene = new T.Scene();
    const cam = new T.PerspectiveCamera(32, 1, 0.1, 100); cam.position.set(0, 0, 15);
    lights(scene, 0.8);
    scene.environment = envFor(renderer);
    const items = layout.map(([type, nx, ny, z, s, mob]) => {
      const o = P[type](); o.scale.setScalar(s); o.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * 6.28, Math.random() * 0.5 - 0.25);
      scene.add(o);
      return { o, s, nx, ny, z, mob, sp: 0.15 + Math.random() * 0.25, ph: Math.random() * 6.28, tilt: Math.random() * 0.4 - 0.2 };
    });
    let W = 1, H = 1, mx = 0, my = 0, cx = 0, cy = 0;
    const place = () => {
      const r = canvas.getBoundingClientRect(); W = r.width || 1; H = r.height || 1;
      renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
      const mobile = W < 760;
      items.forEach((it) => {
        const hz = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * (cam.position.z - it.z);
        const [nx, ny] = mobile && it.mob ? it.mob : [it.nx, it.ny];
        it.o.visible = !(mobile && it.mob === null);
        it.o.scale.setScalar(it.s * (mobile ? 0.62 : 1));
        it.bx = nx * hz * cam.aspect; it.by = ny * hz;
        it.o.position.set(it.bx, it.by, it.z);
      });
    };
    addEventListener("resize", place); place();
    canvas.parentElement.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; });
    const frame = (t) => {
      const s = t / 1000;
      cx += (mx - cx) * 0.05; cy += (my - cy) * 0.05;
      cam.position.x = cx * 1.4; cam.position.y = -cy * 1.0; cam.lookAt(0, 0, 0);
      const sc = Math.min(1, scrollY / (H || 1));
      items.forEach((it) => {
        it.o.rotation.y += 0.004 * (1 + it.sp);
        it.o.rotation.x = it.tilt + Math.sin(s * it.sp + it.ph) * 0.15;
        it.o.position.y = it.by + Math.sin(s * it.sp * 1.6 + it.ph) * 0.18 + sc * 1.6 * (it.z + 4) / 6;
      });
      renderer.render(scene, cam);
    };
    frame(0);
    visibleLoop(canvas, frame);
    canvas.classList.add("ready");
  }

  /* ---------- shared studio reflections (soft boxes) ---------- */
  const envCache = new WeakMap();
  function envFor(renderer) {
    if (envCache.has(renderer)) return envCache.get(renderer);
    const s = new T.Scene();
    const room = new T.Mesh(new T.SphereGeometry(20, 32, 16), new T.MeshBasicMaterial({ color: 0x241C26, side: T.BackSide }));
    s.add(room);
    const box = (c, w, h, x, y, z, ry = 0, rx = 0) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m); };
    box(0xFFFFFF, 14, 4, 0, 12, 0, 0, Math.PI / 2);     // big overhead softbox
    box(0xFFE9DE, 5, 9, -11, 2, 3, Math.PI / 2);        // warm left strip
    box(0xFFB8CC, 4, 8, 11, 1, -4, -Math.PI / 2);       // rose right strip
    box(0xFFE2C8, 10, 3, 0, 1, -14);                    // cool back strip
    const pm = new T.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.035).texture;
    pm.dispose(); envCache.set(renderer, tex);
    return tex;
  }

  /* ---------- the Tamiko case that opens on scroll ---------- */
  function kitScene(section) {
    section.classList.add("live");
    const canvas = section.querySelector("canvas"), steps = [...section.querySelectorAll("[data-at]")];
    const renderer = makeRenderer(canvas), scene = new T.Scene();
    renderer.toneMappingExposure = 1.0;
    scene.environment = envFor(renderer);
    const cam = new T.PerspectiveCamera(30, 1, 0.1, 100);

    scene.add(new T.AmbientLight(0x8890C0, 0.18));
    const key = new T.SpotLight(0xFFEBD8, 1.7, 40, 0.5, 0.8, 1.2); key.position.set(3, 9, 7); scene.add(key); scene.add(key.target);
    const rim = new T.PointLight(0xFF9DBA, 1.4, 30); rim.position.set(-6, 3, -5); scene.add(rim);
    const fill = new T.PointLight(0x9DB2FF, 0.6, 30); fill.position.set(6, 1, 4); scene.add(fill);

    /* textures drawn on canvas */
    const cnv = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); draw(x, w, h); const t = new T.CanvasTexture(c); t.anisotropy = 8; t.encoding = T.sRGBEncoding; return t; };
    const grain = cnv(512, 512, (x, w, h) => {
      const d = x.createImageData(w, h);
      for (let i = 0; i < d.data.length; i += 4) { const v = 118 + Math.random() * 22 + (Math.random() < 0.02 ? 30 : 0); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      x.putImageData(d, 0, 0);
    });
    grain.encoding = T.LinearEncoding; grain.wrapS = grain.wrapT = T.RepeatWrapping; grain.repeat.set(1.6, 1.6);
    const wordTex = (opts) => cnv(2048, 512, (x, w, h) => {
      x.clearRect(0, 0, w, h); x.fillStyle = "#fff"; x.strokeStyle = "#fff";
      if (opts.frame) { x.lineWidth = 6; x.strokeRect(40, 40, w - 80, h - 80); x.lineWidth = 2; x.strokeRect(64, 64, w - 128, h - 128); }
      x.textAlign = "center"; x.textBaseline = "middle";
      const word = "TAMIKO", size = opts.size || 250, gap = size * 0.34;
      x.font = `400 ${size}px "DM Serif Display", "Didot", Georgia, serif`;
      const widths = [...word].map((ch) => x.measureText(ch).width);
      const total = widths.reduce((a, b) => a + b, 0) + gap * (word.length - 1);
      let cx = w / 2 - total / 2;
      [...word].forEach((ch, i) => { x.fillText(ch, cx + widths[i] / 2, h / 2 + (opts.sub ? -34 : 6)); cx += widths[i] + gap; });
      if (opts.sub) { x.font = `600 46px "Figtree", Arial, sans-serif`; const s = opts.sub.split("").join(String.fromCharCode(8202)); x.fillText(s, w / 2, h / 2 + 150); }
    });
    const texLid = wordTex({ frame: true, sub: "BEAUTY  ·  TRIED  AT  HOME", size: 260 });
    const texInner = wordTex({ size: 230 });
    const texPlate = wordTex({ size: 300 });
    const shadowTex = cnv(256, 256, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(.6, "rgba(0,0,0,.18)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const sparkTex = cnv(64, 64, (x, w, h) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,236,210,1)"); g.addColorStop(.25, "rgba(255,214,180,.6)"); g.addColorStop(1, "rgba(255,200,170,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const redraw = () => [texLid, texInner, texPlate].forEach((t) => {
      const fresh = t === texLid ? wordTex({ frame: true, sub: "BEAUTY  ·  TRIED  AT  HOME", size: 260 }) : t === texInner ? wordTex({ size: 230 }) : wordTex({ size: 300 });
      t.image = fresh.image; t.needsUpdate = true;
    });
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('400 100px "DM Serif Display"'), document.fonts.load('600 40px "Figtree"')]).then(redraw).catch(() => {});

    /* materials */
    const leather = new T.MeshPhysicalMaterial({ color: 0x0A0E2A, roughness: 0.62, metalness: 0.0, clearcoat: 0.45, clearcoatRoughness: 0.4, bumpMap: grain, bumpScale: 0.01, envMapIntensity: 0.45 });
    const gold = new T.MeshPhysicalMaterial({ color: 0xD7A35C, metalness: 1, roughness: 0.24, clearcoat: 0.2, envMapIntensity: 1.25 });
    const velvet = new T.MeshStandardMaterial({ color: 0xC9758F, roughness: 1, metalness: 0, envMapIntensity: 0.25 });
    const foil = (map, color = 0xE6B26A) => new T.MeshPhysicalMaterial({ map, color, emissive: 0x8A5A2A, emissiveMap: map, emissiveIntensity: 0.55, metalness: 1, roughness: 0.22, transparent: true, alphaTest: 0.4, envMapIntensity: 1.6, depthWrite: false, side: T.DoubleSide });
    const engrave = (map) => new T.MeshStandardMaterial({ map, color: 0x1A2352, roughness: 0.5, metalness: 0.4, transparent: true, alphaTest: 0.4, depthWrite: false });

    /* rounded-rect helpers */
    const rr = (w, d, r) => { const s = new T.Shape(), x = -w / 2, y = -d / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d); s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
    const extrude = (shape, h, bevel = 0.035) => { const g = new T.ExtrudeGeometry(shape, { depth: h, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 18 }); g.rotateX(-Math.PI / 2); return g; };
    const piping = (w, d, r, y, rad = 0.028) => { const pts = rr(w, d, r).getSpacedPoints(160).map((p) => new T.Vector3(p.x, y, -p.y)); return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts, true), 240, rad, 10, true), gold); };

    const W = 4.6, D = 2.9, Hb = 1.05, Hl = 0.34, R = 0.34, t = 0.12;
    const kit = new T.Group(); scene.add(kit);

    // base shell: walls with a hole + floor
    const wall = rr(W, D, R); wall.holes.push(rr(W - 2 * t, D - 2 * t, R - t));
    kit.add(new T.Mesh(extrude(wall, Hb), leather));
    kit.add(new T.Mesh(extrude(rr(W, D, R), 0.08), leather));
    // velvet lining inside
    const lin = rr(W - 2 * t - 0.02, D - 2 * t - 0.02, R - t - 0.01); lin.holes.push(rr(W - 2 * t - 0.09, D - 2 * t - 0.09, R - t - 0.045));
    const linM = new T.Mesh(extrude(lin, Hb - 0.16, 0), velvet); linM.position.y = 0.1; kit.add(linM);
    const floorV = new T.Mesh(extrude(rr(W - 2 * t - 0.02, D - 2 * t - 0.02, R - t - 0.01), 0.04, 0), velvet); floorV.position.y = 0.09; kit.add(floorV);
    // gold details on base
    kit.add(piping(W + 0.07, D + 0.07, R + 0.035, Hb + 0.035));
    kit.add(piping(W + 0.07, D + 0.07, R + 0.035, 0.0));
    const plate = new T.Mesh(extrude(rr(1.5, 0.05, 0.02), 0.42, 0.02), gold); plate.position.set(0, Hb * 0.5 - 0.21, D / 2 + 0.06); kit.add(plate);
    const plateTxt = new T.Mesh(new T.PlaneGeometry(1.36, 0.34), engrave(texPlate)); plateTxt.position.set(0, Hb * 0.5, D / 2 + 0.115); kit.add(plateTxt);
    [-1.55, 1.55].forEach((x) => {
      const latch = new T.Mesh(extrude(rr(0.36, 0.06, 0.04), 0.26, 0.015), gold); latch.position.set(x, Hb - 0.2, D / 2 + 0.05); kit.add(latch);
    });
    const hcurve = new T.CatmullRomCurve3([new T.Vector3(-0.55, 0, 0), new T.Vector3(-0.45, 0.26, 0.12), new T.Vector3(0, 0.36, 0.18), new T.Vector3(0.45, 0.26, 0.12), new T.Vector3(0.55, 0, 0)]);
    const handle = new T.Mesh(new T.TubeGeometry(hcurve, 64, 0.06, 14), leather);
    handle.rotation.x = Math.PI / 2; handle.position.set(0, Hb - 0.02, D / 2 + 0.07); kit.add(handle);
    [-0.55, 0.55].forEach((x) => kit.add(mesh(new T.CylinderGeometry(0.07, 0.07, 0.08, 20), gold, x, Hb - 0.02, D / 2 + 0.07)));
    // four gold feet
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => kit.add(mesh(new T.CylinderGeometry(0.09, 0.11, 0.06, 24), gold, sx * (W / 2 - 0.35), -0.06, sz * (D / 2 - 0.3))));

    // lid on a hinge at the back
    const hinge = new T.Group(); hinge.position.set(0, Hb + 0.035, -D / 2); kit.add(hinge);
    const lid = new T.Group(); lid.position.set(0, 0, D / 2); hinge.add(lid);
    lid.add(new T.Mesh(extrude(rr(W, D, R), Hl), leather));
    lid.add(piping(W + 0.07, D + 0.07, R + 0.035, Hl + 0.035));
    const lidTxt = new T.Mesh(new T.PlaneGeometry(W * 0.74, W * 0.74 * 0.25), foil(texLid)); lidTxt.rotation.x = -Math.PI / 2; lidTxt.position.y = Hl + 0.04; lid.add(lidTxt);
    const lidUnder = new T.Mesh(new T.ShapeGeometry(rr(W - 2 * t, D - 2 * t, R - t), 18), new T.MeshStandardMaterial({ color: 0xC9758F, roughness: 1, side: T.DoubleSide })); lidUnder.rotation.x = Math.PI / 2; lidUnder.position.y = -0.04; lid.add(lidUnder);
    const innerTxt = new T.Mesh(new T.PlaneGeometry(W * 0.5, W * 0.5 * 0.25), foil(texInner, 0xE9B49A)); innerTxt.rotation.x = Math.PI / 2; innerTxt.material.side = T.DoubleSide; innerTxt.position.y = -0.045; lid.add(innerTxt);

    // soft contact shadow
    const shadow = new T.Mesh(new T.PlaneGeometry(W * 1.9, D * 2.3), new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.09; kit.add(shadow);

    // warm glow that rises from inside as the lid opens
    const glow = new T.PointLight(0xFFD2B0, 0, 6, 2); glow.position.set(0, 0.7, 0.2); kit.add(glow);

    // gold dust
    const N = 140, pos = new Float32Array(N * 3), seed = [];
    for (let i = 0; i < N; i++) { seed.push([Math.random() * 7 - 3.5, Math.random() * 4.2, Math.random() * 4 - 2, Math.random() * 6.28, 0.2 + Math.random() * 0.5]); }
    const dustGeo = new T.BufferGeometry(); dustGeo.setAttribute("position", new T.BufferAttribute(pos, 3));
    const dust = new T.Points(dustGeo, new T.PointsMaterial({ map: sparkTex, size: 0.09, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 }));
    kit.add(dust);

    // products: packed inside, then rise into a gentle arc
    const types = ["perfume", "serum", "lipstick", "jar", "tube", "compact", "applicators"];
    const prods = types.map((ty, i) => {
      const o = P[ty](); o.scale.setScalar(0.74); o.visible = false; kit.add(o);
      o.traverse((m) => { if (m.material) m.material.envMapIntensity = 1.2; });
      const col = i - (types.length - 1) / 2;
      return { o, from: new T.Vector3((i % 4 - 1.5) * 0.95, 0.5, i < 4 ? -0.45 : 0.5),
        to: new T.Vector3(col * 0.78, 2.25 + Math.cos(col * 0.55) * 0.35, 0.55 - Math.abs(col) * 0.16),
        delay: i * 0.04, spin: (i % 2 ? 1 : -1) * 0.22 };
    });

    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const easeOut = (x) => 1 - Math.pow(1 - x, 4);

    let Wp = 1, Hp = 1, mobile = false, mx = 0, cmx = 0, sp = 0;
    const size = () => {
      const r = canvas.getBoundingClientRect(); Wp = r.width || 1; Hp = r.height || 1; mobile = Wp < 860;
      renderer.setSize(Wp, Hp, false); cam.aspect = Wp / Hp; cam.updateProjectionMatrix();
      kit.position.set(mobile ? 0 : 3.5, mobile ? -2.0 : -1.0, 0);
      kit.scale.setScalar(mobile ? (Wp < 520 ? 0.5 : 0.6) : 0.86);
      key.target.position.copy(kit.position);
    };
    addEventListener("resize", size); size();
    section.addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; });

    const progress = () => {
      if (reduce) return 1;
      const r = section.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - innerHeight));
    };
    const frame = (tm) => {
      const s = tm / 1000;
      sp += (progress() - sp) * 0.08;            // smoothed scroll for a cinematic feel
      const p = sp;
      cmx += (mx - cmx) * 0.04;
      const dolly = ease(clamp(p / 0.6));
      cam.position.set(cmx * 1.2 + (mobile ? 0 : 1.2), 3.0 + dolly * 0.9, 13.5 - dolly * 2.2);
      cam.lookAt(mobile ? 0 : 2.1, mobile ? -0.2 : 0.55, 0);

      kit.rotation.y = T.MathUtils.lerp(-0.85, 0.08, ease(clamp(p / 0.32))) + Math.sin(s * 0.35) * 0.02;
      kit.rotation.x = 0.06;
      const open = ease(clamp((p - 0.22) / 0.28));
      hinge.rotation.x = -1.92 * open;
      glow.intensity = open * 1.6;
      dust.material.opacity = open * 0.9;

      const arr = dustGeo.attributes.position.array;
      seed.forEach(([x, y, z, ph, v], i) => {
        const yy = ((y + s * v * 0.35) % 4.2);
        arr[i * 3] = x * 0.6 + Math.sin(s * 0.4 + ph) * 0.25; arr[i * 3 + 1] = 0.4 + yy; arr[i * 3 + 2] = z * 0.5 + Math.cos(s * 0.3 + ph) * 0.2;
      });
      dustGeo.attributes.position.needsUpdate = true;

      prods.forEach((pr) => {
        const k = clamp((p - 0.46 - pr.delay) / 0.3), e = easeOut(k);
        pr.o.visible = open > 0.15;
        pr.o.position.lerpVectors(pr.from, pr.to, e);
        if (mobile) pr.o.position.x *= 0.82;
        pr.o.position.y += k >= 1 ? Math.sin(s * 0.9 + pr.delay * 50) * 0.05 : 0;
        pr.o.rotation.y = e * 0.5 + pr.spin * s * e;
        pr.o.rotation.z = (1 - e) * 0.2 * pr.spin;
      });

      const step = steps.reduce((acc, el, i) => (p >= +el.dataset.at ? i : acc), 0);
      steps.forEach((el, i) => el.classList.toggle("on", i === step));
      renderer.render(scene, cam);
    };
    frame(0);
    if (reduce) steps.forEach((el) => el.classList.add("on"));
    visibleLoop(canvas, frame);
  }

  window.TamikoFloat = floatScene;
  window.TamikoKit = kitScene;
  document.querySelectorAll("canvas[data-float]").forEach((c) => {
    const layouts = {
      home: [
        ["perfume", 0.06, 0.62, -1, 1.2, [0.92, 0.97]],
        ["lipstick", -0.97, -0.95, 1, 0.95, [-0.8, -0.9]],
        ["jar", 0.12, -0.78, 0, 1.0, null],
        ["serum", 0.94, -0.6, -2, 1.3, [0.82, -0.88]],
        ["compact", 0.98, 0.78, -3, 1.2, null],
        ["tube", -0.5, 0.86, -4, 1.0, null],
        ["pearl", 0.1, 0.1, -2, 1.3, null],
        ["pearl", -0.92, 0.22, -1, 1.0, null],
        ["pearl", 0.6, 0.93, 0, 0.8, null],
      ],
      join: [
        ["perfume", 0.9, 0.78, -2, 1.1, [0.8, 0.9]],
        ["lipstick", -0.9, -0.82, 0, 0.9, null],
        ["jar", 0.92, -0.86, -1, 1.0, [0.8, -0.92]],
        ["pearl", 0.05, 0.92, -1, 1.0, null],
        ["serum", -0.1, -0.92, -3, 1.0, null],
      ],
    };
    floatScene(c, layouts[c.dataset.float] || layouts.home);
  });
  document.querySelectorAll("[data-kit3d]").forEach(kitScene);
})();

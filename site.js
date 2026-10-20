/* Tamiko — shared behaviour */
(() => {
  /* Paste a form backend URL here (Formspree, Google Apps Script, or your own API) to collect submissions directly.
     Leave empty and forms open the visitor's email app addressed to contact@tamiko.club instead. */
  const FORM_ENDPOINT = "";
  const CONTACT = "contact@tamiko.club";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* images: show any that finished loading before this script ran */
  document.querySelectorAll(".art img").forEach((i) => { if (i.complete && i.naturalWidth) i.classList.add("ok"); });

  /* header */
  const head = document.querySelector(".site-head");
  const onScroll = () => head && head.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) menuBtn.addEventListener("click", () => {
    const open = head.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* reveal: only things below the fold start hidden */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains("rv")) {
        const sib = [...el.parentElement.children].filter((c) => c.classList.contains("rv"));
        el.style.transitionDelay = Math.min(4, Math.max(0, sib.indexOf(el))) * 80 + "ms";
        el.classList.add("go"); el.classList.remove("pre");
      }
      if (el.classList.contains("art")) el.classList.add("in");
      io.unobserve(el);
    }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".rv").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) el.classList.add("pre");
      io.observe(el);
    });
    document.querySelectorAll(".art").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".art").forEach((el) => el.classList.add("in"));
  }

  /* FAQ: smooth, one open at a time within a group */
  document.querySelectorAll(".faq details").forEach((d) => {
    const s = d.querySelector("summary"), a = d.querySelector(".ans");
    s.addEventListener("click", (e) => {
      if (reduce || !a) return;
      e.preventDefault();
      if (d.open) {
        a.animate([{ height: a.offsetHeight + "px" }, { height: "0px" }], { duration: 320, easing: "cubic-bezier(.2,.7,.1,1)" }).onfinish = () => (d.open = false);
      } else {
        d.parentElement.querySelectorAll("details[open]").forEach((o) => { if (o !== d) o.open = false; });
        d.open = true; const h = a.offsetHeight;
        a.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
      }
    });
  });

  /* copy buttons */
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const text = b.getAttribute("data-copy");
    const ok = () => { const t = b.textContent; b.textContent = "Copied"; setTimeout(() => (b.textContent = t), 1600); };
    try { navigator.clipboard.writeText(text).then(ok, () => {}); } catch (_) {}
  }));

  /* forms */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const kind = form.getAttribute("data-form");
    const msg = form.querySelector(".form-msg"), btn = form.querySelector("button[type=submit]");
    const show = (t, err) => { msg.textContent = t; msg.hidden = false; msg.classList.toggle("err", !!err); };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      for (const el of form.querySelectorAll("[required]")) {
        const v = (el.value || "").trim();
        if (!v) { show(`Please fill in ${el.dataset.label || "this field"}.`, true); el.focus(); return; }
        if (el.type === "tel" && v.replace(/\D/g, "").length < 10) { show("Please enter a 10-digit mobile number.", true); el.focus(); return; }
      }
      const em = form.querySelector("input[type=email]");
      if (em && em.value && !/^\S+@\S+\.\S+$/.test(em.value.trim())) { show("That email doesn't look right. Check it or leave it blank.", true); em.focus(); return; }
      const fd = new FormData(form), data = { form: kind, source: location.hostname || "tamiko.club", at: new Date().toISOString() };
      for (const [k, v] of fd.entries()) data[k] = data[k] ? data[k] + ", " + v : v;
      if (FORM_ENDPOINT) {
        const label = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
        try {
          const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!r.ok) throw 0;
          form.reset(); show(form.dataset.success || "Thanks. We've got your details and will be in touch soon."); btn.textContent = "Sent";
        } catch (_) { show("That didn't go through. Please try again or email " + CONTACT + ".", true); btn.disabled = false; btn.textContent = label; }
        return;
      }
      const lines = Object.entries(data).filter(([k]) => !["source", "at", "form"].includes(k)).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`);
      const subj = { waitlist: "Try Club waitlist", expert: "Expert application", brand: "Brand partnership" }[kind] || "Hello Tamiko";
      location.href = `mailto:${CONTACT}?subject=${encodeURIComponent(subj + (data.name ? ": " + data.name : ""))}&body=${encodeURIComponent(lines.join("\n"))}`;
      show(`Your email app should open with these details. Press send and you're done. If nothing opened, write to ${CONTACT}.`);
    });
  });
})();

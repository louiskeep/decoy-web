// Motion layer. Runs only when the head script added html.anim-on (reduced motion off) and GSAP
// loaded. Every start state is applied here with gsap.set, never in CSS, so a script failure
// leaves the page in its final, fully visible state.
(function () {
  const root = document.documentElement;
  if (!root.classList.contains("anim-on") || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  const mm = gsap.matchMedia();
  mm.add(
    { motionOK: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px)" },
    (ctx) => {
      const { motionOK, desktop } = ctx.conditions;
      if (!motionOK) return;

      const pinned = desktop && pinnedPipeline();
      reveal();
      hero();
      heroMaskTable();
      typedTerminal();
      countUp();
      auditChain();
      flowStrips(pinned);
    }
  );

  window.addEventListener("load", () => ScrollTrigger.refresh());

  // Fail-safes: nothing stays hidden if a trigger never fires (odd viewports, print).
  const showAll = () => {
    gsap.set("[data-reveal] > *, [data-reveal-self], .stage-cards .card, .audit-entry, .audit-verify, .t-line, .flow-step", { clearProps: "opacity,visibility,transform" });
  };
  window.addEventListener("beforeprint", showAll);
  setTimeout(() => {
    document.querySelectorAll("[data-reveal] > *, [data-reveal-self]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && getComputedStyle(el).visibility === "hidden") {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, overwrite: true });
      }
    });
  }, 5000);

  // Groups marked data-reveal stagger their children up on first entry.
  function reveal() {
    document.querySelectorAll("[data-reveal], [data-reveal-self]").forEach((group) => {
      const items = group.hasAttribute("data-reveal-self") ? [group] : Array.from(group.children);
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 24 });
      const stagger = Math.min(0.08, 1.2 / items.length); // large grids finish in about a second
      ScrollTrigger.create({
        trigger: group,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger, overwrite: true }),
      });
    });
  }

  // Headline lines rise out of a mask, then the lede, actions, and visual follow.
  function hero() {
    const copy = document.querySelector(".hero-copy");
    if (!copy) return;
    const h1 = copy.querySelector("h1[data-split]");
    const rest = copy.querySelectorAll(".lede, .hero-actions");
    const visual = document.querySelector(".hero-visual, .hero .terminal");
    gsap.set([copy.querySelector(".eyebrow"), rest], { autoAlpha: 0, y: 14 });
    if (visual) gsap.set(visual, { autoAlpha: 0, y: 24 });
    if (h1) gsap.set(h1, { autoAlpha: 0 });

    const run = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(copy.querySelector(".eyebrow"), { autoAlpha: 1, y: 0, duration: 0.5 });
      if (h1 && window.SplitText) {
        const split = SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(h1, { autoAlpha: 1 });
        tl.from(split.lines, { yPercent: 110, duration: 0.9, stagger: 0.09 }, "-=0.3");
      } else if (h1) {
        tl.to(h1, { autoAlpha: 1, duration: 0.6 }, "-=0.3");
      }
      tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.55");
      if (visual) tl.to(visual, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5");
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
  }

  // Home hero: the raw rows mask themselves one column at a time, then the run reports and loops.
  function heroMaskTable() {
    const frame = document.querySelector("[data-hero-mask]");
    if (!frame) return;
    const before = Array.from(frame.querySelectorAll("tr.mask-before"));
    const after = frame.querySelectorAll("tr.mask-after");
    const caption = frame.querySelector("[data-caption]");
    if (!before.length || !caption) return;
    gsap.set(after, { display: "none" });

    const labels = ["email → faker (deterministic)", "ssn → fpe (FF1, AES-256)", "dob → date_shift (±30 days)"];
    const columns = [1, 2, 3].map((c) =>
      before.map((row) => {
        const cell = row.children[c];
        const span = document.createElement("span");
        span.textContent = cell.textContent;
        cell.dataset.raw = cell.textContent;
        cell.textContent = "";
        cell.appendChild(span);
        return { cell, span };
      })
    );
    const idle = caption.textContent;

    const reset = () => {
      columns.forEach((cells) =>
        cells.forEach(({ cell, span }) => {
          span.textContent = cell.dataset.raw;
          cell.classList.remove("safe");
          cell.classList.add("raw");
        })
      );
      caption.textContent = idle;
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power2.inOut" } });
    tl.add(reset, 0);
    tl.add(() => { caption.textContent = "$ decoy run pipeline.yaml --mask-secret env:DECOY_MASK_SECRET"; }, 1.4);
    columns.forEach((cells, i) => {
      const spans = cells.map((c) => c.span);
      tl.to(spans, { scaleY: 0, duration: 0.16, stagger: 0.06 }, "+=0.45")
        .add(() => {
          cells.forEach(({ cell, span }) => {
            span.textContent = cell.dataset.safe;
            cell.classList.remove("raw");
            cell.classList.add("safe");
          });
          caption.textContent = labels[i];
        })
        .to(spans, { scaleY: 1, duration: 0.2, stagger: 0.06 });
    });
    tl.add(() => { caption.textContent = "customers · 3 rows masked · joins intact · exit 0"; }, "+=0.35");
    tl.to({}, { duration: 3.2 });
  }

  // CLI hero: command lines type out, output lines land after each, once, when in view.
  function typedTerminal() {
    const term = document.querySelector("[data-terminal]");
    if (!term) return;
    const lines = Array.from(term.querySelectorAll(".t-line"));
    if (!lines.length) return;
    const cmds = lines.filter((l) => l.hasAttribute("data-cmd")).map((l) => {
      const el = l.querySelector(".t-cmd");
      const text = el.textContent;
      return { line: l, el, text };
    });
    gsap.set(lines, { autoAlpha: 0 });
    cmds.forEach(({ el }) => { el.textContent = ""; });

    const tl = gsap.timeline({ paused: true });
    lines.forEach((line) => {
      const cmd = cmds.find((c) => c.line === line);
      if (cmd) {
        const state = { n: 0 };
        tl.set(line, { autoAlpha: 1 })
          .add(() => line.classList.add("is-typing"))
          .to(state, {
            n: cmd.text.length,
            duration: Math.min(1.4, 0.035 * cmd.text.length),
            ease: "none",
            onUpdate: () => { cmd.el.textContent = cmd.text.slice(0, Math.round(state.n)); },
          })
          .add(() => line.classList.remove("is-typing"), "+=0.25");
      } else {
        tl.to(line, { autoAlpha: 1, duration: 0.08 }, "+=0.12");
      }
    });
    ScrollTrigger.create({ trigger: term, start: "top 80%", once: true, onEnter: () => tl.play() });
  }

  // Platform: audit entries land one by one and the chain links draw between them.
  function auditChain() {
    const chain = document.querySelector("[data-chain]");
    if (!chain) return;
    const entries = chain.querySelectorAll(".audit-entry");
    const links = chain.querySelectorAll(".audit-link");
    const verify = chain.querySelector(".audit-verify");
    gsap.set(entries, { autoAlpha: 0, y: 12 });
    gsap.set(links, { "--draw": "0%" });
    gsap.set(verify, { autoAlpha: 0 });
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    entries.forEach((entry, i) => {
      tl.to(entry, { autoAlpha: 1, y: 0, duration: 0.4 });
      if (links[i]) tl.to(links[i], { "--draw": "100%", duration: 0.35, ease: "none" });
    });
    tl.to(verify, { autoAlpha: 1, duration: 0.4 }, "+=0.2");
    ScrollTrigger.create({ trigger: chain, start: "top 80%", once: true, onEnter: () => tl.play() });
  }

  // Stat tiles count up once when they enter the viewport.
  function countUp() {
    const format = (v, fmt) => {
      if (fmt === "m") {
        const m = v / 1e6;
        return (m >= 10 ? Math.round(m).toString() : m.toFixed(2)) + "M";
      }
      return Math.round(v).toLocaleString("en-US");
    };
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      if (!isFinite(target)) return;
      const state = { v: 0 };
      el.textContent = format(0, el.dataset.format);
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(state, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = format(state.v, el.dataset.format); } }),
      });
    });
  }

  function addPacket(flow) {
    const packet = document.createElement("div");
    packet.className = "packet";
    flow.appendChild(packet);
    gsap.set(packet, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    return packet;
  }
  function stepPoint(step) { return { x: step.offsetLeft + step.offsetWidth / 2, y: step.offsetTop }; }
  function activate(steps, i) { steps.forEach((s, k) => s.classList.toggle("is-active", k === i)); }

  // Flow strips: steps rise in, then a packet runs the pipeline, lighting each stage, and loops.
  function flowStrips(skipPinned) {
    document.querySelectorAll("[data-flow]").forEach((flow) => {
      if (skipPinned && flow.closest("[data-pipeline]")) return;
      const steps = Array.from(flow.querySelectorAll(".flow-step"));
      if (!steps.length) return;
      const packet = addPacket(flow);
      gsap.set(steps, { autoAlpha: 0, y: 16 });

      const run = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2 });
      steps.forEach((step, i) => {
        const p = stepPoint(step);
        run.to(packet, { x: p.x, y: p.y, autoAlpha: 1, duration: i === 0 ? 0.01 : 0.55, ease: "power1.inOut" })
          .add(() => activate(steps, i))
          .to({}, { duration: 0.25 });
      });
      run.to(packet, { autoAlpha: 0, duration: 0.3 }).add(() => activate(steps, -1));

      ScrollTrigger.create({
        trigger: flow,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(steps, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, onComplete: () => run.play() });
        },
      });
    });
  }

  // How it works, desktop: pin the pipeline and scrub the packet and stage cards with scroll.
  function pinnedPipeline() {
    const pipe = document.querySelector("[data-pipeline]");
    if (!pipe) return false;
    const flow = pipe.querySelector("[data-flow]");
    const steps = Array.from(flow.querySelectorAll(".flow-step"));
    const cards = Array.from(pipe.querySelectorAll(".card[data-stage]"));
    if (steps.length < 2) return false;
    pipe.classList.add("pipeline-stage--pinned");
    const grid = pipe.querySelector(".stage-cards");
    if (grid) grid.removeAttribute("data-reveal"); // the scrub owns these cards
    const packet = addPacket(flow);
    gsap.set(cards, { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pipe,
        start: "top 120px",
        end: () => "+=" + steps.length * 260,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => activate(steps, Math.min(steps.length - 1, Math.floor(self.progress * steps.length + 0.0001))),
        onLeaveBack: () => activate(steps, -1),
      },
    });
    const first = stepPoint(steps[0]);
    gsap.set(packet, { x: first.x, y: first.y, autoAlpha: 1 });
    steps.forEach((step, i) => {
      const p = stepPoint(step);
      if (i > 0) tl.to(packet, { x: p.x, y: p.y, duration: 1, ease: "none" }, i - 1);
      const card = cards.find((c) => c.dataset.stage === step.dataset.stage);
      if (card) {
        // Previous card is fully out (i - 0.95 … i - 0.75) before this one comes in (i - 0.6 … i - 0.4).
        // The first stage card is visible from the start so the pinned area never looks empty.
        if (i === 1) tl.set(card, { autoAlpha: 1, y: 0 }, 0);
        else tl.to(card, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, i - 0.6);
        if (i < steps.length - 1) tl.to(card, { autoAlpha: 0, y: -16, duration: 0.2, ease: "power2.in" }, i + 0.05);
      }
    });
    return true;
  }
})();

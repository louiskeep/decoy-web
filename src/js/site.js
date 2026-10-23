// Shared chrome behavior: theme toggle, mobile nav, copy buttons, tabs. No dependencies.
(function () {
  const root = document.documentElement;

  // Theme. The inline head script already applied the initial value before paint.
  const toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); localStorage.removeItem("mode"); } catch (e) {}
    });
  }

  // Mobile nav.
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = root.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && root.classList.contains("menu-open")) navToggle.click();
    });
  }

  // Copy buttons: <div class="code-wrap"><pre>…</pre><button class="copy-btn" data-copy>…</button></div>
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = btn.getAttribute("data-copy")
        ? document.querySelector(btn.getAttribute("data-copy"))
        : btn.parentElement.querySelector("pre, code");
      const text = (target ? target.innerText : "").replace(/^\$ /gm, "").trim();
      try {
        await navigator.clipboard.writeText(text);
        const label = btn.innerHTML;
        btn.textContent = "Copied";
        setTimeout(() => { btn.innerHTML = label; }, 1400);
      } catch (e) {}
    });
  });

  // Tabs: [role=tablist] > button[role=tab][aria-controls], panels with role=tabpanel.
  document.querySelectorAll("[role=tablist]").forEach((list) => {
    const tabs = Array.from(list.querySelectorAll("[role=tab]"));
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        select(tab, false);
        if (tab.dataset.hash) history.replaceState(null, "", "#" + tab.dataset.hash);
      });
      tab.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(tab);
        if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
    const hash = location.hash.slice(1);
    const fromHash = hash && tabs.find((t) => t.dataset.hash === hash);
    select(fromHash || tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], false);
  });
})();

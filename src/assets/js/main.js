// The brand has one dark theme. Navigation works without stored theme settings.
function initNavigation() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const backdrop = document.getElementById("mobileMenuBackground");
  if (!header || !toggle || !menu || !backdrop) return;
  const desktop = window.matchMedia("(min-width: 1024px)");
  const background = document.querySelectorAll("main, footer, .skip-link");
  function setOpen(open, restoreFocus = true) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    menu.classList.toggle("is-open", open);
    backdrop.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    background.forEach(element => { element.inert = open; });
    if (open) menu.querySelector("a")?.focus();
    else if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  backdrop.addEventListener("click", () => setOpen(false));
  desktop.addEventListener("change", event => { if (event.matches) setOpen(false, false); });
  document.addEventListener("keydown", event => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
    if (event.key === "Tab") {
      const focusable = [...header.querySelectorAll("a[href], button")].filter(element => element.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initNavigation, { once: true });
else initNavigation();

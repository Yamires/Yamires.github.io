// Keep the desktop calculator bundle off phone-sized screens.
// The portfolio adds margins around its iframe; use the outer viewport there.
const viewport = window.frameElement ? window.parent : window;
const screen = viewport.matchMedia("(min-width: 768px)");
let started = false;
function loadCalculator() {
  document.documentElement.classList.toggle(
    "calculator-supported",
    screen.matches,
  );
  if (screen.matches && !started) {
    started = true;
    import("./assets/index-5BI5Xh8Z.js");
  }
}
loadCalculator();
screen.addEventListener("change", loadCalculator);

// Info screen open/close (R17). Full screen on phone; on laptop a right-half panel over the right
// column while the character column stays visible. Whatever sits under the panel is made inert so
// keyboard and screen-reader users cannot reach it.

const layer = document.getElementById('info-layer');
const back = document.getElementById('info-back');
const scrim = document.getElementById('info-scrim');
const openButton = document.getElementById('info-btn');
const laptop = window.matchMedia('(min-width: 900px)');

// Laptop: only the right column is covered. Phone: the whole main view is.
const COVERED = { laptop: ['.top-bar', '#pill', '#day-strip'], phone: ['#main-view'] };

function setCoveredInert(on) {
  document.querySelectorAll([...COVERED.laptop, ...COVERED.phone].join(',')).forEach((el) => { el.inert = false; });
  if (!on) return;
  document.querySelectorAll(COVERED[laptop.matches ? 'laptop' : 'phone'].join(',')).forEach((el) => { el.inert = true; });
}

function open() {
  layer.hidden = false;
  setCoveredInert(true);
  back.focus();
}

function close() {
  layer.hidden = true;
  setCoveredInert(false);
  openButton.focus();
}

openButton.addEventListener('click', open);
back.addEventListener('click', close);
scrim.addEventListener('click', close); // clicking outside the panel (laptop) returns to Main

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !layer.hidden) close();
});

// Resizing across the breakpoint while open changes what the panel covers
laptop.addEventListener('change', () => {
  if (!layer.hidden) setCoveredInert(true);
});

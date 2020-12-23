const e = el => document.querySelector(el);
const es = el => Array.from(document.querySelectorAll(el));

let inClick = false;

function DOM_verseHover () {
  if (inClick) return;
  DOM_reset();
  es("verse").forEach(el => el != this && el.classList.add("dim"));
  const toHide = es("interp").filter((el, i) => !db.interpretations[i][2].includes(this.dataset.cite));
  toHide.forEach(el => el.classList.add("hide"));
  e("h2").innerHTML = `Interpretations (${db.interpretations.length - toHide.length})`;
}
function DOM_interpHover () {
  if (inClick) return;
  DOM_reset();
  es("interp").forEach(el => el != this && el.classList.add("dim"));
  es("verse").forEach((el, i) => !this.dataset.cites.includes(db.aue[i][0]) && el.classList.add("dim"));
}
function DOM_click (e) {
  if (!(inClick = !inClick))
    DOM_reset();
  else
    e.currentTarget.classList.add("underlined");
  e.stopPropagation();
}
function DOM_reset () {
  if (inClick) return;
  e("h2").innerHTML = `Interpretations (${db.interpretations.length})`;
  es("verse").concat(es("interp")).forEach(el => {
    el.classList.remove("dim", "hide", "underlined");
  });
}

function DOM_display_Aue () {
  e("aue").innerHTML = db.aue.map(
    ([cite, body]) => `<verse data-cite="${cite}"><cite>${cite}</cite> ${body}</verse>`)
    .join(" ");
  e("interps").innerHTML = db.interpretations.map(
    ([title, body, cites]) => `<interp data-cites="${cites}"><i>${title}</i>. ${body} <cite>${cites}</cite></interp>`)
    .join(" ");

  document.body.addEventListener('click', () => {
    if (window.getSelection().type == "Range")
      return;
    inClick = false;
    DOM_reset();
  });
  es("verse").forEach(l => {
    l.addEventListener('mouseover', DOM_verseHover);
    l.addEventListener('click', DOM_verseHover);
  });
  es("interp").forEach(l => {
    l.addEventListener('mouseover', DOM_interpHover);
    l.addEventListener('click', DOM_interpHover);
  });
  es("verse").concat(es("interp")).forEach(l => {
    l.addEventListener('click', DOM_click);
    l.addEventListener('mouseout', DOM_reset);
  });
  DOM_reset();
}

const frequencies = arr => {
  const totals = new Map();
  arr.forEach(x => totals.has(x) ? totals.set(x, totals.get(x) + 1) : totals.set(x, 1))
  return totals;
};

function heatmap () {
  const freqs = frequencies(db.interpretations.map(i => i[2]).join("").split(""));
  const maxN = Math.max(...freqs.values());
  es("verse").forEach(v => {
    v.style.opacity = freqs.get(v.dataset.cite) / maxN;
  })
}
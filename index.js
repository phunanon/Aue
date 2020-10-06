const e = el => document.querySelector(el);
const es = el => Array.from(document.querySelectorAll(el));
const ess = el => es(el).map(e => e.style);

let inClick = false;

function DOM_verseHover () {
  if (inClick) return;
  DOM_reset();
  const cite = db.aue[this.dataset.num][0];
  ess("verse").forEach(s => s.opacity = 0.25);
  this.style.opacity = 1;
  let numInclusions = 0;
  ess("interp").forEach((s, i) => {
    const included = db.interpretations[i][2].includes(cite);
    s.maxHeight = included ? "20rem" : 0;
    s.opacity = included ? 1 : 0;
    numInclusions += included;
  });
  e("h2").innerHTML = `Interpretations (${numInclusions})`;
}
function DOM_interpHover () {
  if (inClick) return;
  DOM_reset();
  const cites = db.interpretations[this.dataset.num][2];
  ess("interp").forEach(s => s.opacity = 0.25);
  this.style.opacity = 1;
  ess("verse").forEach((s, i) => s.opacity = cites.includes(db.aue[i][0]) ? 1 : 0.25);
}
function DOM_click (e) {
  if (!(inClick = !inClick))
    DOM_reset();
  else
    e.target.style.textDecorationColor = "#000";
  e.stopPropagation();
}
function DOM_reset () {
  if (inClick) return;
  e("h2").innerHTML = `Interpretations (${db.interpretations.length})`;
  ess("verse").concat(ess("interp")).forEach(s => {
    s.opacity = 1;
    s.textDecorationColor = "transparent"
  });
  ess("interp").forEach(s => s.opacity = 1);
  ess("interp").forEach(s => s.maxHeight = "20rem");
}

function htmlAueVerse ([cite, body], i) {
  return `<verse data-num="${i}"><sup>${cite} </sup>${body}</verse>`;
}

function htmlInterp ([title, body, cites], i) {
  return `<interp data-num="${i}"><i>${title}</i>. ${body} <sup>${cites}</sup></interp>`;
}

function DOM_display_Aue () {
  e("aue").innerHTML = db.aue.map(htmlAueVerse).join("");
  e("interps").innerHTML = db.interpretations.map(htmlInterp).join("");

  document.body.addEventListener('click', () => {inClick = false; DOM_reset()});
  es("verse").forEach(l => l.addEventListener('mouseover', DOM_verseHover));
  es("interp").forEach(l => l.addEventListener('mouseover', DOM_interpHover));
  es("verse").concat(es("interp")).forEach(l => l.addEventListener('click', DOM_click));
  es("verse").concat(es("interp")).forEach(l => l.addEventListener('mouseout', DOM_reset));
  DOM_reset();
}

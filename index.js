const e = el => document.querySelector(el);
const es = el => Array.from(document.querySelectorAll(el));

function DOM_verseHover () {
  const cite = db.aue[this.dataset.num][0];
  es("verse").forEach(e => e.style.opacity = 0.25);
  this.style.opacity = 1;
  es("interp").forEach((e, i) => {
    const included = db.interpretations[i][2].includes(cite);
    e.style.maxHeight = included ? "20rem" : 0;
    e.style.opacity = included ? 1 : 0;
  });
}
function DOM_interpHover () {
  const cites = db.interpretations[this.dataset.num][2];
  es("interp").forEach(e => e.style.opacity = 0.25);
  this.style.opacity = 1;
  es("verse").forEach((e, i) => e.style.opacity = cites.includes(db.aue[i][0]) ? 1 : 0.25);
}
function DOM_mouseLeave () {
  es("verse").forEach(e => e.style.opacity = 1);
  es("interp").forEach(e => e.style.opacity = 1);
  es("interp").forEach(e => e.style.maxHeight = "20rem");
}

function htmlAueVerse ([cite, body], i) {
  return `<verse data-num="${i}"><sup>${cite} </sup>${body}</verse>`;
}

function htmlInterp ([title, body, cites], i) {
  return `<interp data-num="${i}"><i>${title}</i>. ${body} <sup>${cites}</sup></interp>`;
}

function DOM_display_Aue () {
  const {aue, interpretations} = db;
  e("aue").innerHTML = aue.map(htmlAueVerse).join("");
  e("interps").innerHTML = interpretations.map(htmlInterp).join("");

  es("verse").forEach(l => l.addEventListener('mouseover', DOM_verseHover));
  es("interp").forEach(l => l.addEventListener('mouseover', DOM_interpHover));
  es("verse").concat(es("interp")).forEach(l => l.addEventListener('mouseout', DOM_mouseLeave));
}

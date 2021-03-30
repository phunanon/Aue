const e = el => document.querySelector(el);
const es = el => [...document.querySelectorAll(el)];
const ess = el => e(el).style;

let inClick = false;

const noInterps = () => typeof db.interpretations == "undefined";
const noDescs = () => typeof db.verseDescriptions == "undefined";
const noMaterials = () => typeof db.materials == "undefined";

function DOM_verseHover () {
  if (inClick || noInterps()) return;
  DOM_reset();
  es("verse").forEach(el => el != this && el.classList.add("dim"));
  const toDim = es("interp").filter((el, i) => !db.interpretations[i][2].includes(this.dataset.cite));
  toDim.forEach(el => el.classList.add("dim"));
  e("h2.interps").innerHTML = `Interpretations (${db.interpretations.length - toDim.length})`;
}
function DOM_interpHover () {
  if (inClick) return;
  DOM_reset();
  es("interp").forEach(el => el != this && el.classList.add("dim"));
  es("verse").forEach((el, i) => !this.dataset.cites.includes(db.aue[i][0]) && el.classList.add("dim"));
}
function DOM_click (e) {
  if (noInterps()) return;
  if (!(inClick = !inClick))
    DOM_reset();
  else {
    e.currentTarget.classList.add("underlined");
    es("verse.dim, interp.dim").forEach(el => el.classList.add("unselectable"));
  }
  e.stopPropagation();
}
function DOM_reset () {
  if (inClick) return;
  e("h2.interps").innerHTML = `Interpretations (${db.interpretations?.length ?? 0})`;
  es("verse, interp").forEach(el => {
    el.classList.remove("dim", "underlined", "unselectable");
  });
}

async function DOM_display_Aue (isFirstLoad = false) {
  const contributorSelect = e("select#contributor");
  let contributor = "Patrick Bowen";
  if (isFirstLoad) {
    db.contributors.forEach(c => contributorSelect.add(new Option(c)));
  } else {
    contributor = contributorSelect.value;
  }
  try {
    const contribution = await (await fetch(`contributions/${contributor.replaceAll(" ", "_")}.json`)).json();
    db = {...db, ...contribution};
  } catch (e) {}

  const [aueEl, interpsEl, descsEl, materialsEl] = [e("aue"), e("interps"), e("descs"), e("materials")];
  aueEl.innerHTML = db.aue.map(
    ([cite, body]) => `<verse data-cite="${cite}"><cite>${cite}</cite> ${body}</verse>`)
    .join(" ");
  if (interpsEl && !noInterps())
    interpsEl.innerHTML = db.interpretations.map(
      ([title, body, cites]) => `<interp data-cites="${cites}"><i>${title}</i>. ${body} <cite>${cites}</cite></interp>`)
      .join(" ");
  if (descsEl && !noDescs())
    descsEl.innerHTML = db.verseDescriptions.map(
      ([verse, body]) => `<description><cite>${verse}</cite> <b>${db.aue.find(([v]) => v == verse)[1]}</b>
                          <p>${body.replace("\n", "</p><p>")}</p></description>`)
      .join("");
  if (materialsEl && !noMaterials())
    materialsEl.innerHTML = db.materials.map(
      ([title, url, comment]) => `<material><a href="${url}"><i>${title}</i></a>${title.endsWith("?") ? "" : "."} ${comment}</material>`)
      .join("");
  [ess("column.interps").display, ess("column.descs").display, ess("column.materials").display] =
    [noInterps(), noDescs(), noMaterials()].map(b => b ? "none" : "inline-block");

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
  es("verse, interp").forEach(l => {
    l.addEventListener('click', DOM_click);
    l.addEventListener('mouseout', DOM_reset);
  });
  DOM_reset();
}

function heatmap () {
  const frequencies = arr => {
    const totals = new Map();
    arr.forEach(x => totals.has(x) ? totals.set(x, totals.get(x) + 1) : totals.set(x, 1))
    return totals;
  };
  const freqs = frequencies(db.interpretations.map(i => i[2]).join("").split(""));
  const maxN = Math.max(...freqs.values());
  es("verse").forEach(v => {
    v.style.opacity = freqs.get(v.dataset.cite) / maxN;
  })
}
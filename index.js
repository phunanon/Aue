const e = el => document.querySelector(el);
const es = el => [...document.querySelectorAll(el)];
const ess = el => e(el).style;

let inClick = false;

const noOpinions = () => typeof db.opinions == "undefined";
const noDescs = () => typeof db.verseDescriptions == "undefined";
const noMaterials = () => typeof db.materials == "undefined";

function DOM_verseHover() {
    if (inClick || noOpinions()) {
        return;
    }
    DOM_reset();
    es("verse").forEach(el => el != this && el.classList.add("dim"));
    const toDim = es("opinion").filter(
        (el, i) => !db.opinions[i][2].includes(this.dataset.cite),
    );
    toDim.forEach(el => el.classList.add("dim"));
    e("h2.opinions").innerHTML = `Opinions (${db.opinions.length - toDim.length})`;
}

function DOM_opinionHover() {
    if (inClick) {
        return;
    }
    DOM_reset();
    es("opinion").forEach(el => el != this && el.classList.add("dim"));
    es("verse").forEach(
        (el, i) => !this.dataset.cites.includes(i2c(i)) && el.classList.add("dim"),
    );
}

function DOM_click(e) {
    if (noOpinions()) {
        return;
    }
    if (!(inClick = !inClick)) DOM_reset();
    else {
        e.currentTarget.classList.add("underlined");
        es("verse.dim, opinion.dim").forEach(el => el.classList.add("unselectable"));
    }
    e.stopPropagation();
}

function DOM_reset() {
    if (inClick) return;
    e("h2.opinions").innerHTML = `Opinions (${db.opinions?.length ?? 0})`;
    es("verse, opinion").forEach(el => el.classList.remove("dim", "underlined", "unselectable"));
}

function materialHtml(title, urls, comment) {
    const punc = title.endsWith("?") ? "" : ".";
    const titleHtml = Array.isArray(urls)
        ? `<i>${title}</i> (${urls.map((u, i) => `<a href="${u}">${i + 1}</a>`).join(", ")})`
        : `<a href="${urls}"><i>${title}</i></a>`;
    return `<material>${titleHtml}${punc} ${comment}</material>`;
}

const i2c = i => String.fromCharCode(97 + i);
const c2i = c => c.charCodeAt(0) - 97;

async function DOM_display_Aue(isFirstLoad = false) {
    e("aue").innerHTML = db.aue
        .map((body, i) => `<verse data-cite="${i2c(i)}"><cite>${i2c(i)}</cite> ${body}</verse>`)
        .join(" ");

    const [contributorSelect, opinionsEl, descsEl, materialsEl] = [
        e("select#contributor"),
        e("opinions"),
        e("descs"),
        e("materials"),
    ];

    if (!contributorSelect || !opinionsEl || !descsEl || !materialsEl) {
        return;
    }

    let contributor = "Patrick Bowen";
    if (isFirstLoad) {
        es("verse").forEach(l => {
            l.addEventListener("mouseover", DOM_verseHover);
            l.addEventListener("click", DOM_verseHover);
            l.addEventListener("click", DOM_click);
            l.addEventListener("mouseout", DOM_reset);
        });
        db.contributors.forEach(c => contributorSelect.add(new Option(c)));
    } else {
        contributor = contributorSelect.value;
    }
    try {
        const contribution = await (
            await fetch(`contributions/${contributor.replaceAll(" ", "_")}.json`)
        ).json();
        db = { ...db, ...contribution };
    } catch (e) {}

    if (!noOpinions()) {
        opinionsEl.innerHTML = db.opinions
            .map(
                ([title, body, cites]) =>
                    `<opinion data-cites="${cites}"><i>${title}</i>. ${body} <cite>${cites}</cite></opinion>`,
            )
            .join(" ");
    }
    if (!noDescs())
        descsEl.innerHTML = db.verseDescriptions
            .map(
                ([cite, body]) =>
                    `<description><cite>${cite}</cite> <b>${db.aue[c2i(cite)]}</b><p>${body.replace(
                        "\n",
                        "</p><p>",
                    )}</p></description>`,
            )
            .join("");
    if (!noMaterials())
        materialsEl.innerHTML = db.materials
            .map(([title, url, comment]) => materialHtml(title, url, comment))
            .join("");

    const doShow = (elName, boolean) => {
        ess(elName).display = boolean ? "inline-block" : "none";
    };
    doShow("column.opinions", !noOpinions());
    doShow("column.descs", !noDescs());
    doShow("column.materials", !noMaterials());

    document.body.addEventListener("click", () => {
        if (window.getSelection().type == "Range") {
            return;
        }
        inClick = false;
        DOM_reset();
    });
    es("verse").forEach(l => {
        l.addEventListener("mouseover", DOM_verseHover);
        l.addEventListener("mouseout", DOM_reset);
        l.addEventListener("click", DOM_verseHover);
        l.addEventListener("click", DOM_click);
    });
    es("opinion").forEach(l => {
        l.addEventListener("mouseover", DOM_opinionHover);
        l.addEventListener("mouseout", DOM_reset);
        l.addEventListener("click", DOM_opinionHover);
        l.addEventListener("click", DOM_click);
    });
    DOM_reset();
}

function heatmap() {
    const frequencies = arr => {
        const totals = new Map();
        arr.forEach(x => (totals.has(x) ? totals.set(x, totals.get(x) + 1) : totals.set(x, 1)));
        return totals;
    };
    const freqs = frequencies(
        db.opinions
            .map(i => i[2])
            .join("")
            .split(""),
    );
    const maxN = Math.max(...freqs.values());
    es("verse").forEach(v => {
        v.style.opacity = freqs.get(v.dataset.cite) / maxN;
    });
}

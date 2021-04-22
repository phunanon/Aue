let inClick = false;

function setupInteractivity() {
    e("html").addEventListener("click", () => {
        if (window.getSelection()?.type == "Range") return;
        inClick = false;
        DOM_reset();
    });
    es("verse").forEach(l => {
        l.addEventListener("mouseover", DOM_verseHover);
        l.addEventListener("click", DOM_verseHover);
    });
    es("interp").forEach(l => {
        l.addEventListener("mouseover", DOM_interpHover);
        l.addEventListener("click", DOM_interpHover);
    });
    es("verse, interp").forEach(l => {
        l.addEventListener("click", DOM_click);
        l.addEventListener("mouseout", DOM_reset);
    });
    DOM_reset();
}

const e_safe = el => e(el) ?? {};
const es = (elName: string) => Array.from(document.querySelectorAll(elName));
const ess = el => e(el).style;

function DOM_verseHover(this: HTMLElement) {
    if (inClick) return;
    DOM_reset();
    es("verse").forEach(el => el != this && el.classList.add("dim"));
    const toDim = es("interp").filter(
        (el, i) => !db.interpretations?.[i][2].includes(this.dataset.cite ?? ""),
    );
    toDim.forEach(el => el.classList.add("dim"));
    e(".interps h2").innerHTML = `Interpretations ${
        db.interpretations ? `(${db.interpretations.length - toDim.length})` : ""
    }`;
}

function DOM_interpHover(this: HTMLElement) {
    if (inClick) return;
    DOM_reset();
    es("interp").forEach(el => el != this && el.classList.add("dim"));
    es("verse").forEach(
        (el, i) => !this.dataset.cites.includes(db.aue[i][0]) && el.classList.add("dim"),
    );
}

function DOM_click(e: Event) {
    if (!(inClick = !inClick)) DOM_reset();
    else {
        (e.currentTarget as HTMLElement).classList.add("underlined");
        es("verse.dim, interp.dim").forEach(el => el.classList.add("unselectable"));
    }
    e.stopPropagation();
}

function DOM_reset() {
    if (inClick) return;
    e_safe(".interps h2").innerHTML = `Interpretations (${db.interpretations?.length ?? 0})`;
    es("verse, interp").forEach(el => el.classList.remove("dim", "underlined", "unselectable"));
}

function materialHtml(title, urls, comment) {
    const punc = title.endsWith("?") ? "" : ".";
    const titleHtml = Array.isArray(urls)
        ? `<i>${title}</i> (${urls.map((u, i) => `<a href="${u}">${i + 1}</a>`).join(", ")})`
        : `<a href="${urls}"><i>${title}</i></a>`;
    return `<material>${titleHtml}${punc} ${comment}</material>`;
}

function heatmap() {
    const frequencies = arr => {
        const totals = new Map();
        arr.forEach(x => (totals.has(x) ? totals.set(x, totals.get(x) + 1) : totals.set(x, 1)));
        return totals;
    };
    const freqs = frequencies(
        db.interpretations
            .map(i => i[2])
            .join("")
            .split(""),
    );
    const maxN = Math.max(...freqs.values());
    es("verse").forEach(v => {
        v.style.opacity = freqs.get(v.dataset.cite) / maxN;
    });
}

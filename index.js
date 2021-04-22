"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let db = {
    aue: [
        ["a", "Think sensibly for Aue;"],
        ["b", "believe in it & your abilities."],
        ["c", "This is knowledge, to share, preserve, for joy."],
        ["d", "It is shared to you, rejoice!"],
        ["e", "Record, speak, listen to the joy."],
        ["f", "Nature, so body, so mind, are of now;"],
        ["g", "after death is scattering."],
        ["h", "From evolution came joy & woe in sentience."],
        ["i", "Life, evolved together, shares the universe."],
        ["j", "Time, volatile, should be precious & used well."],
        ["k", "Know of woe and seek joy happily."],
        ["l", "Be comfortable relying on nature & society."],
        ["m", "Oppose harm to it and uphold good."],
        ["n", "Have empathy and seek others' emulation."],
        ["o", "Some woe is incited, inflicted;"],
        ["p", "protect against it and reduce belligerence."],
        ["q", "Some woe is ignorantly fed, so show Aue."],
        ["r", "Keep critical faith in science & knowledge;"],
        ["s", "wielded for joy, impedes known woe, grow it."],
    ],
    contributors: ["Patrick Bowen", "Mikha Bowen"],
};
const e = (elName) => document.querySelector(elName);
function DOM_display_Aue() {
    return __awaiter(this, void 0, void 0, function* () {
        const aueEl = e("aue");
        if (aueEl) {
            mount(aueEl, aueHtml, db);
        }
        const contributionsEl = e("contributions");
        if (!contributionsEl) {
            return;
        }
        db.contributor = db.contributors[0];
        db = Object.assign(Object.assign({}, db), (yield contribution(db.contributor)));
        mount(contributionsEl, contributionsHtml, db, setupInteractivity);
    });
}
const contribution = (contributor) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield fetch(`contributions/${contributor.replaceAll(" ", "_")}.json`)).json(); });
const aueHtml = ({ aue }) => aue.map(([cite, body]) => ["verse", { "data-cite": cite }, ["cite", cite], " ", body]);
const contributionsHtml = ({ aue, contributors, contributor, interpretations, verseDescriptions, materials, }) => [
    [
        "column",
        ["h2", "Select a contributor"],
        [
            "p",
            "View contributions of Aue adherents: interpretations, verse descriptions, and materials.",
        ],
        [
            "select#contributor",
            {
                onchange: (db, { selectedOptions }) => __awaiter(void 0, void 0, void 0, function* () {
                    return (Object.assign({ contributor: selectedOptions[0].value }, contribution(selectedOptions[0].value)));
                }),
            },
            contributors.map(c => ["option", [contributor == c, { selected: "" }], c]),
        ],
        [
            "p",
            "If you would like to contribute, get in touch with Patrick Bowen using the links above.",
        ],
    ],
    [
        "column.interps",
        ["h2", "Interpretations"],
        interpretations === null || interpretations === void 0 ? void 0 : interpretations.map(([title, body, cites]) => [
            "interp",
            { "data-cites": cites },
            ["i", title],
            ". ",
            body,
            " ",
            ["cite", cites],
        ]),
    ],
    [
        "column.descs",
        ["h2", "Verse descriptions"],
        verseDescriptions === null || verseDescriptions === void 0 ? void 0 : verseDescriptions.map(([verse, body]) => {
            var _a, _b;
            return [
                "description",
                ["cite", verse],
                " ",
                ["b", (_b = (_a = aue.find(([v]) => v == verse)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ""],
                ["p", body.replace("\n", "</p><p>")],
            ];
        }),
    ],
    [
        "column.materials.thin",
        ["h2", "Materials"],
        materials === null || materials === void 0 ? void 0 : materials.map(([title, url, comment]) => [
            "material",
            ["a", { href: url }, ["i", title]],
            title.endsWith("?") ? "" : ".",
            " ",
            comment,
        ]),
    ],
];
let inClick = false;
function setupInteractivity() {
    e("html").addEventListener("click", () => {
        var _a;
        if (((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.type) == "Range")
            return;
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
const e_safe = el => { var _a; return (_a = e(el)) !== null && _a !== void 0 ? _a : {}; };
const es = (elName) => Array.from(document.querySelectorAll(elName));
const ess = el => e(el).style;
function DOM_verseHover() {
    if (inClick)
        return;
    DOM_reset();
    es("verse").forEach(el => el != this && el.classList.add("dim"));
    const toDim = es("interp").filter((el, i) => { var _a, _b; return !((_a = db.interpretations) === null || _a === void 0 ? void 0 : _a[i][2].includes((_b = this.dataset.cite) !== null && _b !== void 0 ? _b : "")); });
    toDim.forEach(el => el.classList.add("dim"));
    e(".interps h2").innerHTML = `Interpretations ${db.interpretations ? `(${db.interpretations.length - toDim.length})` : ""}`;
}
function DOM_interpHover() {
    if (inClick)
        return;
    DOM_reset();
    es("interp").forEach(el => el != this && el.classList.add("dim"));
    es("verse").forEach((el, i) => !this.dataset.cites.includes(db.aue[i][0]) && el.classList.add("dim"));
}
function DOM_click(e) {
    if (!(inClick = !inClick))
        DOM_reset();
    else {
        e.currentTarget.classList.add("underlined");
        es("verse.dim, interp.dim").forEach(el => el.classList.add("unselectable"));
    }
    e.stopPropagation();
}
function DOM_reset() {
    var _a, _b;
    if (inClick)
        return;
    e_safe(".interps h2").innerHTML = `Interpretations (${(_b = (_a = db.interpretations) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0})`;
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
    const freqs = frequencies(db.interpretations
        .map(i => i[2])
        .join("")
        .split(""));
    const maxN = Math.max(...freqs.values());
    es("verse").forEach(v => {
        v.style.opacity = freqs.get(v.dataset.cite) / maxN;
    });
}
const isArr = Array.isArray;
const isStr = (x) => typeof x == "string";
const isObj = (x) => typeof x == "object";
const isEvt = (x) => typeof x == "function";
function hash(s) {
    for (var i = 0, h = 9; i < s.length;)
        h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return h ^ (h >>> 9);
}
let _mount, _view, _state, _afterUpdate;
const _handlers = new Map();
function mount(component, view, state, afterUpdate) {
    [_mount, _view, _state, _afterUpdate] = [component, view, state, afterUpdate];
    update();
}
function update() {
    _mount.innerHTML = html(doConditionals(_view(Object.assign({}, _state))));
    _afterUpdate === null || _afterUpdate === void 0 ? void 0 : _afterUpdate();
}
function doEvent(handlerKey, that) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        _state = Object.assign(Object.assign({}, _state), (yield ((_a = _handlers.get(handlerKey)) === null || _a === void 0 ? void 0 : _a(_state, that))));
        update();
    });
}
const html = (x) => { var _a; return (isArr(x) ? arrHtml(x) : (_a = x === null || x === void 0 ? void 0 : x.toString()) !== null && _a !== void 0 ? _a : ""); };
const doConditionals = (node) => isArr(node)
    ? node[0] === true || node[0] === false
        ? node.shift()
            ? node[0]
            : ""
        : node.map(doConditionals)
    : node;
function arrHtml(node) {
    const head = node.shift();
    if (isArr(head)) {
        return arrHtml(head) + node.map(html).join("");
    }
    let elAttrs = node.length && isObj(node[0]) && !isArr(node[0]) ? attrs(node.shift()).join("") : "";
    const [tagAndId, ...classes] = head.split(".");
    const [tag, id] = tagAndId.split("#");
    return `<${tag}${id ? ` id="${id}"` : ""} ${classes.length ? `class="${classes.join(" ")}"` : ""}${elAttrs}>${node.map(html).join("")}</${tag}>`;
}
const attr = (a) => (isEvt(a) ? makeEvt(a) : a);
const attrs = (node) => Object.keys(node).map(a => ` ${a}="${attr(node[a])}"`);
function makeEvt(handler) {
    const key = hash(handler.toString());
    _handlers.set(key, handler);
    return `doEvent(${key}, this)`;
}
//# sourceMappingURL=index.js.map
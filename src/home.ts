const e = <T extends HTMLElement>(elName: string) => document.querySelector(elName) as T;

async function DOM_display_Aue() {
    const aueEl = e("aue");
    if (aueEl) {
        mount(aueEl, aueHtml, db);
    }

    const contributionsEl = e("contributions");

    if (!contributionsEl) {
        return;
    }

    db.contributor = db.contributors[0];
    db = { ...db, ...(await contribution(db.contributor)) };

    mount(contributionsEl, contributionsHtml, db, setupInteractivity);
}

const contribution = async (contributor: string) =>
    await (await fetch(`contributions/${contributor.replaceAll(" ", "_")}.json`)).json();

const aueHtml = ({ aue }: AueDb): any[] =>
    aue.map(([cite, body]) => ["verse", { "data-cite": cite }, ["cite", cite], " ", body]);

const contributionsHtml = ({
    aue,
    contributors,
    contributor,
    interpretations,
    verseDescriptions,
    materials,
}: AueDb) => [
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
                onchange: async (db: AueDb, { selectedOptions }: HTMLSelectElement) => ({
                    contributor: selectedOptions[0].value,
                    ...contribution(selectedOptions[0].value),
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
        interpretations?.map(([title, body, cites]) => [
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
        verseDescriptions?.map(([verse, body]) => [
            "description",
            ["cite", verse],
            " ",
            ["b", aue.find(([v]) => v == verse)?.[1] ?? ""],
            ["p", body.replace("\n", "</p><p>")],
        ]),
    ],
    [
        "column.materials.thin",
        ["h2", "Materials"],
        materials?.map(([title, url, comment]) => [
            "material",
            ["a", { href: url }, ["i", title]],
            title.endsWith("?") ? "" : ".",
            " ",
            comment,
        ]),
    ],
];

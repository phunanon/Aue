const e = el => document.querySelector(el);

async function DomLoad() {
    const id = window.location.href.match(/\?(.+)/)[1];
    const { author, date, title, body } = await (
        await fetch(`../contributions/articles/${id}.json`)
    ).json();
    e("h1 span").innerHTML = document.title = title;
    e("h3").innerHTML = `${author}, ${date}`;
    e("article").innerHTML = `<section>${body.join(
        "</section><section>",
    )}</section>`;
}

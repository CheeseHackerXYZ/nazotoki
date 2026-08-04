document.addEventListener("DOMContentLoaded", () => {
    const articleArea = document.getElementById("articleArea");
    const latestList = document.getElementById("latestList");
    const searchInput = document.getElementById("blogSearchInput");
    const searchStatus = document.getElementById("searchStatus");
    const publicArticles = blogArticles.filter((article) => !article.hidden);
    const deferredArticles = blogArticles.filter((article) => article.hidden);

    document.getElementById("profileText").textContent = `${blogProfile.name}（${blogProfile.reading}）\n${blogProfile.bio}`;

    publicArticles.forEach((article) => {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = article.title;
        button.addEventListener("click", () => {
            searchInput.value = "";
            renderArticles([article]);
            searchStatus.textContent = "公開記事を表示しています。";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        listItem.appendChild(button);
        latestList.appendChild(listItem);
    });

    function normalize(value) {
        return value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
    }

    function matches(article, term) {
        const haystack = [article.title, article.subtitle, ...article.tags, ...article.body].join(" ");
        return normalize(haystack).includes(term);
    }

    function renderArticles(articles) {
        articleArea.replaceChildren();
        if (!articles.length) {
            const empty = document.createElement("p");
            empty.className = "empty";
            empty.textContent = "一致する記録は見つかりませんでした。";
            articleArea.appendChild(empty);
            return;
        }

        articles.forEach((article) => {
            const articleEl = document.createElement("article");
            articleEl.className = "article";
            if (article.hidden) articleEl.classList.add("hidden-article");
            const title = document.createElement("h2");
            title.textContent = article.title;
            const subtitle = document.createElement("p");
            subtitle.className = "subtitle";
            subtitle.textContent = article.subtitle;
            const meta = document.createElement("div");
            meta.className = "meta";
            const date = document.createElement("time");
            date.textContent = article.date;
            meta.appendChild(date);
            article.tags.forEach((tag) => {
                const tagEl = document.createElement("span");
                tagEl.className = "tag";
                tagEl.textContent = tag;
                meta.appendChild(tagEl);
            });
            if (article.hidden) {
                const label = document.createElement("span");
                label.className = "record-label";
                label.textContent = "保留記録";
                meta.appendChild(label);
            }
            articleEl.append(title, subtitle, meta);
            article.body.forEach((paragraph) => {
                const body = document.createElement("p");
                body.textContent = paragraph;
                articleEl.appendChild(body);
            });
            if (article.action) {
                const action = document.createElement("a");
                action.className = "article-action";
                action.href = article.action.href;
                action.textContent = article.action.label;
                action.addEventListener("click", () => localStorage.setItem("arg8CaseStage", "archive"));
                articleEl.appendChild(action);
            }
            articleArea.appendChild(articleEl);
        });
    }

    function search() {
        const term = normalize(searchInput.value);
        if (!term) {
            renderArticles(publicArticles);
            searchStatus.textContent = "公開記事を新しい順に表示しています。";
            return;
        }
        const results = publicArticles.filter((article) => matches(article, term));
        const unlocked = deferredArticles.filter((article) => matches(article, term));
        if (unlocked.length) {
            localStorage.setItem("arg8CaseStage", "archive");
            searchStatus.textContent = "公開記事に加えて、保留記録が見つかりました。";
            articleArea.classList.add("discovery-flash");
            setTimeout(() => articleArea.classList.remove("discovery-flash"), 600);
        } else {
            searchStatus.textContent = `${results.length}件の公開記事が見つかりました。`;
        }
        renderArticles([...unlocked, ...results]);
    }

    searchInput.addEventListener("input", search);
    renderArticles(publicArticles);
    searchStatus.textContent = "公開記事を新しい順に表示しています。";
});

document.addEventListener("DOMContentLoaded", () => {
    const articleArea = document.getElementById("articleArea");
    const latestList = document.getElementById("latestList");
    const searchInput = document.getElementById("blogSearchInput");

    // URLパラメータ(?article=xxx)の取得
    const urlParams = new URLSearchParams(window.location.search);
    const currentArticleId = urlParams.get("article");

    // サイドバーの最新記事リストを生成（secret以外）
    blogArticles.filter(a => a.id !== "secret").forEach(article => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="blog.html?article=${article.id}">${escapeHTML(article.title)}</a>`;
        latestList.appendChild(li);
    });

    // 初期描画処理
    if (currentArticleId) {
        // パラメータ指定がある場合（secretも直接アクセスなら表示可能）
        const target = blogArticles.find(a => a.id === currentArticleId);
        if (target) {
            renderArticles([target]);
        } else {
            articleArea.innerHTML = `<div class="no-results">指定された記事が見つかりません。</div>`;
        }
    } else {
        // パラメータがない場合は通常記事（1〜3）を全件表示
        renderArticles(blogArticles.filter(a => a.id !== "secret"));
    }

    // 検索機能（タイトル・サブタイトルのみ対象、secretは検索対象外）
    searchInput.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase().trim();

        if (keyword === "") {
            renderArticles(blogArticles.filter(a => a.id !== "secret"));
            return;
        }

        // タイトルまたはサブタイトルにキーワードが含まれるか検索
        const filtered = blogArticles.filter(article => {
            if (article.id === "secret") return false; // 隠し記事は検索から除外
            const titleMatch = article.title.toLowerCase().includes(keyword);
            const subtitleMatch = article.subtitle.toLowerCase().includes(keyword);
            return titleMatch || subtitleMatch;
        });

        renderArticles(filtered);
    });

    // 記事のレンダリング
    function renderArticles(articles) {
        articleArea.innerHTML = "";
        if (articles.length === 0) {
            articleArea.innerHTML = `<div class="no-results">該当する記事が見つかりませんでした。</div>`;
            return;
        }

        articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "article-card";
            card.innerHTML = `
                <h2>${escapeHTML(article.title)}</h2>
                <div class="subtitle">${escapeHTML(article.subtitle)}</div>
                <div class="date">${escapeHTML(article.date)}</div>
                <div class="body">${escapeHTML(article.content)}</div>
            `;
            articleArea.appendChild(card);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }
});

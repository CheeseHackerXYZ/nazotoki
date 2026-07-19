document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const listContainer = document.getElementById("blog-list");

    if (!searchBtn || !searchInput || !listContainer) return;

    function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            if (typeof index === "function") index();
            return;
        }

        // 0.htmlも含めて全体から検索可能にする（隠し要素の発見ルートになる）
        const results = articles.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.summary.toLowerCase().includes(query) || 
            a.content.toLowerCase().includes(query)
        );

        listContainer.innerHTML = `<h3>「${searchInput.value}」の検索結果 (${results.length}件)</h3>`;

        if (results.length === 0) {
            listContainer.insertAdjacentHTML("beforeend", "<p>一致する記事が見つかりませんでした。</p>");
            return;
        }

        results.forEach(item => {
            const articleHtml = `
                <article class="post-item">
                    <div class="post-meta">${item.date}</div>
                    <h2 class="post-title"><a href="${item.id}.html">${item.title}</a></h2>
                    <div class="post-content"><p>${item.summary}</p></div>
                    <div class="post-footer"><a href="${item.id}.html" class="read-more-btn">続きを読む →</a></div>
                </article>
            `;
            listContainer.insertAdjacentHTML("beforeend", articleHtml);
        });
    }

    searchBtn.addEventListener("click", executeSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") executeSearch();
    });
});

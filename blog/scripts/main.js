const articles = [
    {
        id: 0,
        title: "最初の投稿",
        summary: "ブログ始めました。特に書くことないけど。",
        content: "<p>テスト投稿です。これから日常のことを適当に書いていきます。</p>",
        date: "2026/07/15 20:00",
        likes: 2,
        dislikes: 0,
        comments: [
            { author: "名無し", text: "初投稿おめ", date: "2026/07/15 20:30" }
        ]
    },
    {
        id: 1,
        title: "明日は文化祭！",
        summary: "かきくけこ、さしすせそ。たちつてとなにぬねの。",
        content: "<p>さしすせそ、たちつてと。なにぬねのはひふへほ、まみむめもやゆよ。らりるれろわをん。</p><p>あいうえおかきくけこ、さしすせそたちつてと。</p>",
        date: "2026/07/19 16:23",
        likes: 7,
        dislikes: 0,
        comments: [
            { author: "名無しさん", text: "なにぬねの", date: "2026/07/19 17:05" }
        ]
    }
];

function index() {
    const listContainer = document.getElementById("blog-list");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    
    // 0.htmlは隠し記事なので、インデックス1以降（通常の記事）のみトップに表示
    for (let i = 1; i < articles.length; i++) {
        const item = articles[i];
        const articleHtml = `
            <article class="post-item">
                <div class="post-meta">${item.date}</div>
                <h2 class="post-title"><a href="${item.id}.html">${item.title}</a></h2>
                <div class="post-content">
                    <p>${item.summary}</p>
                </div>
                <div class="post-footer">
                    <a href="${item.id}.html" class="read-more-btn">続きを読む →</a>
                </div>
            </article>
        `;
        listContainer.insertAdjacentHTML("beforeend", articleHtml);
    }
}

function article(id) {
    const item = articles.find(a => a.id === id);
    if (!item) return;

    document.title = `${item.title} - 中2の雑記ブログ`;
    
    const metaEl = document.getElementById("js-meta");
    const titleEl = document.getElementById("js-title");
    const bodyEl = document.getElementById("js-body");
    const likesEl = document.getElementById("js-likes");
    const dislikesEl = document.getElementById("js-dislikes");
    const navEl = document.getElementById("js-nav");
    const commentListEl = document.getElementById("js-comment-list");

    if (metaEl) metaEl.textContent = item.date;
    if (titleEl) titleEl.textContent = item.title;
    if (bodyEl) bodyEl.innerHTML = item.content;
    if (likesEl) likesEl.textContent = item.likes;
    if (dislikesEl) dislikesEl.textContent = item.dislikes;

    if (navEl) {
        // 1番目でも0.htmlへ戻れるようにする
        const prevHref = id > 0 ? `${id - 1}.html` : "#";
        const prevStyle = id === 0 ? 'style="visibility:hidden;"' : '';
        
        // 最後の記事なら次へのボタンを消す（違和感演出）
        const isLast = id === articles.length - 1;
        const nextHtml = isLast 
            ? '<div class="nav-empty"></div>' 
            : `<a href="${id + 1}.html" class="nav-link">次の記事へ →</a>`;

        navEl.innerHTML = `
            <a href="${prevHref}" class="nav-link" ${prevStyle}>← 前の記事へ</a>
            ${nextHtml}
        `;
    }

    if (commentListEl) {
        commentListEl.innerHTML = item.comments.map(c => `
            <li class="comment-item">
                <div class="comment-meta">${c.author} - ${c.date}</div>
                <div class="comment-text">${c.text}</div>
            </li>
        `).join("");
    }
}

window.onerror = (msg, src, line, col) => alert(`${msg}\n${src}:${line}:${col}`);

const articles = [
    {
        id:0
    },
    {
        id: 1,
        title: "明日は文化祭！",
        summary: "かきくけこ、さしすせそ。たちつてとなにぬねの。",
        content: "<p>さしすせそ、たちつてと。なにぬねのはひふへほ、まみむめもやゆよ。らりるれろわをん。</p><p>あいうえおかきくけこ、さしすせそたちつてと。</p>",
        date: "2026/09/17 18:23",
        likes: 7,
        dislikes: 0,
        comments: [
            { author: "あﾇゅ御さ", text: "文化祭頑張ってね", date: "2026/09/17 19:05" }
        ]
    },
    {
        id: 2,
        title: "明日から学校",
        summary: "なにぬねの、らり。るれろーはん",
        content: "<p>さしすせそ、たちつてと。なにぬねのはひふへほ、まみむめもやゆよ。らりるれろわをん。</p><p>あいうえおかきくけこ、さしすせそたちつてと。</p>",
        date: "2026/09/05 21:34",
        likes: 15,
        dislikes: 0,
        comments: [
            { author: "次きヤﾝ", text: "宿題終わらない...", date: "2026/09/05 22:56" }
        ]
    },
    {
        id: 3,
        title: "海に行ったよ",
        summary: "ばびぶべぼがぎ。ぐげごだぢ、づでど",
        content: "<p>さしすせそ、たちつてと。なにぬねのはひふへほ、まみむめもやゆよ。らりるれろわをん。</p><p>あいうえおかきくけこ、さしすせそたちつてと。</p>",
        date: "2026/08/22 16:23",
        likes: 7,
        dislikes: 0,
        comments: [
            // ノーコメントw
        ]
    }
];

function index() {
    const listContainer = document.getElementById("blog-list");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
   
    mylog(`ブログ「最初のブログ:SecretZero」の読み込みに失敗しました`);
    
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

        mylog(`ブログ「${item.title}」の読み込みに成功しました`)
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

function mylog(x){
    console.log(x);
    const p = document.createElement('p');
    p.textContent = x;
    document.getElementById('log').appendChild(p);
}

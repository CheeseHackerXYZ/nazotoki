/**
 * ブログUI制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const articleListEl = document.getElementById('article-list');
  const articleDetailEl = document.getElementById('article-detail');

  // トップページ: 記事一覧描画
  if (articleListEl) {
    const articles = BlogData.getAllArticles();
    articleListEl.innerHTML = '';

    articles.forEach(article => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-meta">${escapeHtml(article.date)}</div>
        <h2 class="blog-card-title">
          <a href="article.html?id=${article.id}">${escapeHtml(article.title)}</a>
        </h2>
        <div class="blog-card-preview">
          ${article.content}
        </div>
      `;
      articleListEl.appendChild(card);
    });
  }

  // 詳細ページ: 記事本文描画
  if (articleDetailEl) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const article = BlogData.getArticleById(id);

    if (article) {
      document.title = `${article.title} - 個人開発＆日常ブログ`;

      let imageHtml = '';
      if (article.image) {
        imageHtml = `
          <div class="article-image-container">
            <img src="${article.image}" alt="記事画像" class="article-img" onerror="this.src='img/X.png'">
          </div>
        `;
      }

      articleDetailEl.innerHTML = `
        <header class="article-header">
          <div class="article-meta">${escapeHtml(article.date)}</div>
          <h1 class="article-title">${escapeHtml(article.title)}</h1>
        </header>
        <div class="article-body">
          ${article.content}
          ${imageHtml}
        </div>
        <footer class="article-footer">
          <a href="index.html" class="btn-back">← 記事一覧に戻る</a>
        </footer>
      `;
    } else {
      articleDetailEl.innerHTML = `
        <p class="error-msg">記事が見つかりませんでした。</p>
        <a href="index.html" class="btn-back">← 記事一覧に戻る</a>
      `;
    }
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

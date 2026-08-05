/**
 * 検索バーの動的処理
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function performSearch() {
    const query = searchInput.value.trim();
    const itemList = document.getElementById('item-grid');

    // index.html （商品一覧グリッドが存在するページ）の場合
    if (itemList) {
      const results = ItemData.searchItems(query);
      if (typeof renderItemList === 'function') {
        renderItemList(results);
      }
    } else {
      // 詳細ページやユーザーページからの検索時はトップへ遷移
      window.location.href = `index.html?q=${encodeURIComponent(query)}`;
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  // URLパラメータ 'q' が存在する場合は初期検索を実行
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  if (queryParam && searchInput) {
    searchInput.value = queryParam;
    const itemList = document.getElementById('item-grid');
    if (itemList && typeof renderItemList === 'function') {
      const results = ItemData.searchItems(queryParam);
      renderItemList(results);
    }
  }
});

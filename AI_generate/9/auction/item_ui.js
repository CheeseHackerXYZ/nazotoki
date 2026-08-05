/**
 * 商品関連UI制御
 */
document.addEventListener('DOMContentLoaded', () => {
  // トップページ (index.html) の一覧描画
  const itemGrid = document.getElementById('item-grid');
  if (itemGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const items = query ? ItemData.searchItems(query) : ItemData.getAllItems();
    renderItemList(items);
  }

  // 商品詳細ページ (item.html) の描画
  const itemDetailContainer = document.getElementById('item-detail-container');
  if (itemDetailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const item = ItemData.getItemById(itemId);

    if (item) {
      document.title = `${item.title} - ヤミオク`;
      itemDetailContainer.innerHTML = `
        <div class="item-detail-layout">
          <div class="item-image-wrapper">
            <img src="${item.image}" alt="${escapeHtml(item.title)}" class="item-detail-img" onerror="this.src='img/X.png'">
          </div>
          <div class="item-info-wrapper">
            <h1 class="item-detail-title">${escapeHtml(item.title)}</h1>
            <div class="item-detail-price">現在価格: <span>${item.price}</span></div>
            <div class="item-detail-bids">入札件数: ${item.bids}件</div>
            
            <div class="seller-box">
              <span class="seller-label">出品者:</span>
              <a href="user.html?id=${encodeURIComponent(item.sellerId)}" class="seller-link">
                ${escapeHtml(item.sellerName)}
              </a>
            </div>

            <div class="item-description-box">
              <h3>商品説明</h3>
              <p>${escapeHtml(item.description)}</p>
            </div>

            <div class="action-box">
              <a href="index.html" class="btn-back">← トップページに戻る</a>
            </div>
          </div>
        </div>
      `;
    } else {
      itemDetailContainer.innerHTML = `<p class="error-msg">指定された出品商品は存在しません。</p><a href="index.html" class="btn-back">トップへ戻る</a>`;
    }
  }
});

/**
 * 商品カード一覧の描画関数
 */
function renderItemList(items) {
  const itemGrid = document.getElementById('item-grid');
  if (!itemGrid) return;

  itemGrid.innerHTML = '';

  if (items.length === 0) {
    itemGrid.innerHTML = '<p class="no-results">該当する出品商品が見つかりませんでした。</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <a href="item.html?id=${item.id}" class="card-link">
        <div class="card-image">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" onerror="this.src='img/X.png'">
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <div class="card-price">${item.price}</div>
          <div class="card-seller">出品者: ${escapeHtml(item.sellerName)}</div>
        </div>
      </a>
    `;
    itemGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

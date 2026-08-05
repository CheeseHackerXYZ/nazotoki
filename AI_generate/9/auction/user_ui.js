/**
 * ユーザー詳細・出品一覧UI制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const userProfileContainer = document.getElementById('user-profile-container');
  const userItemsGrid = document.getElementById('user-items-grid');

  if (userProfileContainer && userItemsGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
      const user = UserData.getUserById(userId);
      const userItems = ItemData.getItemsBySeller(userId);

      document.title = `${user.name} さんの情報 - ヤミオク`;

      // ユーザープロフィールおよびメッセージ欄の描画
      userProfileContainer.innerHTML = `
        <div class="user-card">
          <h2 class="user-name">${escapeHtml(user.name)}</h2>
          <div class="user-rating">評価: ${user.rating}</div>
          <div class="user-message-box">
            <h3>出品者からのメッセージ</h3>
            <div class="user-message-content">${user.message}</div>
          </div>
        </div>
      `;

      // 該当ユーザーの出品一覧描画
      userItemsGrid.innerHTML = '';
      if (userItems.length === 0) {
        userItemsGrid.innerHTML = '<p class="no-results">現在出品中の商品はありません。</p>';
      } else {
        userItems.forEach(item => {
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
              </div>
            </a>
          `;
          userItemsGrid.appendChild(card);
        });
      }
    } else {
      userProfileContainer.innerHTML = '<p class="error-msg">ユーザーが指定されていません。</p>';
    }
  }
});

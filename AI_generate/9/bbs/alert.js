/**
 * 10秒後の新規レス自動割り込み＆通知バナー制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const NEW_POST_KEY = 'arg_bbs_has_simulated_post';

  // 通知バナーの生成
  const banner = document.createElement('div');
  banner.id = 'bbs-notification-banner';
  banner.className = 'notification-banner';
  banner.innerHTML = `
    <span>新着レスが1件届いています</span>
    <button id="btn-reload-bbs">読み込む</button>
  `;
  document.body.prepend(banner);

  const reloadBtn = document.getElementById('btn-reload-bbs');

  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      banner.classList.remove('show');

      const hasSimulated = localStorage.getItem(NEW_POST_KEY);

      // まだ自動割り込みレスが追加されていない場合のみ実行
      if (!hasSimulated && typeof BbsData !== 'undefined') {
        const posts = BbsData.getPosts();
        
        // 存在する最後の投稿IDを取得（ID固定による不具合を防止）
        let lastId = 1;
        function findMaxId(list) {
          list.forEach(item => {
            if (item.id > lastId) lastId = item.id;
            if (item.replies && item.replies.length > 0) findMaxId(item.replies);
          });
        }
        findMaxId(posts);

        const newReplyContent = 'おい、ヤミオクでオークションが始まったぞ。次の被害者が出る前に食い止めないと。';

        // 最後の投稿に対して返信を追加
        BbsData.addReply(lastId, '名無しの調査員', newReplyContent);
        localStorage.setItem(NEW_POST_KEY, 'true');
      }

      // UI再描画（関数が存在することを確認して確実に呼び出す）
      if (typeof window.renderBbsUI === 'function') {
        window.renderBbsUI();
      } else {
        // 万が一関数の登録が遅れている場合はリロードで確実に適用
        window.location.reload();
      }
    });
  }

  // 10秒後に通知バナーを表示（まだ追加されていなければ）
  setTimeout(() => {
    const hasSimulated = localStorage.getItem(NEW_POST_KEY);
    if (!hasSimulated) {
      showBanner();
    }
  }, 10000);

  // 別タブでのlocalStorage同期
  window.addEventListener('storage', (e) => {
    if (typeof BbsData !== 'undefined' && e.key === BbsData.STORAGE_KEY) {
      showBanner();
    }
  });

  function showBanner() {
    banner.classList.add('show');
  }
});

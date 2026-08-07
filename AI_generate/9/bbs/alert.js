/**
 * 10秒後の新規レス自動割り込み＆通知バナー制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const NEW_POST_KEY = 'arg_bbs_has_simulated_post';
  let isPendingPost = false;

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

      // 未読み込みの新規レスがある場合、実際にデータを追加して描画更新
      if (isPendingPost && typeof BbsData !== 'undefined') {
        const targetId = 6; // 最後のレス(id: 6)への返信として追加
        const newReplyContent = 'おい保管庫の画像、さっき解析ツール通したらヤバいもん写ってたぞ…マジで確認してみろ';

        BbsData.addReply(targetId, '名無しの調査員', newReplyContent);
        localStorage.setItem(NEW_POST_KEY, 'true');
        isPendingPost = false;
      }

      // UI再描画
      if (typeof window.renderBbsUI === 'function') {
        window.renderBbsUI();
      }
    });
  }

  // 10秒後に通知バナーを表示（まだ追加されていなければ）
  setTimeout(() => {
    const hasSimulated = localStorage.getItem(NEW_POST_KEY);
    if (!hasSimulated) {
      isPendingPost = true;
      showBanner();
    }
  }, 10000);

  // 別タブや他アクセスでの変更を検知（localStorage同期）
  window.addEventListener('storage', (e) => {
    if (typeof BbsData !== 'undefined' && e.key === BbsData.STORAGE_KEY) {
      showBanner();
    }
  });

  function showBanner() {
    banner.classList.add('show');
  }
});

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
      if (typeof window.renderBbsUI === 'function') {
        window.renderBbsUI();
      }
    });
  }

  // 10秒後に新規レスを1回だけ挿入するタイマー処理
  setTimeout(() => {
    const hasSimulated = localStorage.getItem(NEW_POST_KEY);
    if (!hasSimulated) {
      // ターゲット（ID: 102）に対して新規レスを追加
      const newReplyContent = 'おい、ヤミオクで次のオークションが始まったぞ。次の被害者が出る前に解決しないと。';
      
      if (typeof BbsData !== 'undefined') {
        BbsData.addReply(102, '名無しの調査員', newReplyContent);
        localStorage.setItem(NEW_POST_KEY, 'true');
        showBanner();
      }
    }
  }, 10000);

  // 別タブや他アクセスでの変更を検知（localStorage同期）
  window.addEventListener('storage', (e) => {
    if (e.key === BbsData.STORAGE_KEY) {
      showBanner();
    }
  });

  function showBanner() {
    banner.classList.add('show');
  }
});

/**
 * 10秒後の新規レス自動割り込み＆トースト通知制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const NEW_POST_KEY = 'arg_bbs_has_simulated_post';

  // 初回表示時の重複防止のため、すでに既読・通知済みフラグがあるか確認
  // （必要に応じてフラグ名や挙動を調整してください）

  /**
   * 画面上にトースト通知（ポップアップ）を表示
   * @param {string} message 
   */
  function showBbsNotification(message) {
    // 既存の通知があれば重複しないように削除
    const existingNotice = document.getElementById('mail-notification');
    if (existingNotice) {
      existingNotice.remove();
    }

    // 通知要素の生成（メール通知と共通の構造・クラスを利用）
    const noticeEl = document.createElement('div');
    noticeEl.id = 'mail-notification';
    noticeEl.className = 'mail-notification';
    noticeEl.innerHTML = `
      <div class="mail-notice-content">
        <span class="mail-notice-icon">✉</span>
        <span class="mail-notice-text">${message}</span>
      </div>
    `;

    document.body.appendChild(noticeEl);

    // アニメーション用クラス付与
    requestAnimationFrame(() => {
      noticeEl.classList.add('show');
    });

    // 11秒後に自動消去
    setTimeout(() => {
      noticeEl.classList.remove('show');
      setTimeout(() => noticeEl.remove(), 1000);
    }, 11000);
  }

  // 10秒後に新着通知を表示（まだシミュレーションフラグが立っていなければ）
  setTimeout(() => {
    const hasSimulated = localStorage.getItem(NEW_POST_KEY);
    if (!hasSimulated) {
      // フラグを立てて2回目以降出ないようにする
      localStorage.setItem(NEW_POST_KEY, 'true');

      // トースト通知を表示
      showBbsNotification('新着メールが1件届きました');

      // 必要であればここでUIの再描画などを呼ぶ
      if (typeof window.renderBbsUI === 'function') {
        window.renderBbsUI();
      }
    }
  }, 10000);

  // 別タブでのlocalStorage同期
  window.addEventListener('storage', (e) => {
    if (typeof BbsData !== 'undefined' && e.key === BbsData.STORAGE_KEY) {
      showBbsNotification('掲示板データが更新されました');
    }
  });
});

/**
 * メール通知・状態管理モジュール (mail.js)
 */
const MailSystem = {
  // ストレージキー設定
  STORAGE_KEY: 'arg_karakuribako_content_checked',

  /**
   * 詳細データ確認時の処理
   */
  triggerContentCheck() {
    // 【追加】すでに確認済みの場合は処理を中断（連打・重複通知をガード）
    if (localStorage.getItem(this.STORAGE_KEY) === 'true') {
      return;
    }

    // ローカルストレージのフラグをtrueに更新
    localStorage.setItem(this.STORAGE_KEY, 'true');

    // メール到達の通知を表示
    this.showMailNotification('新着メールが1件届きました');
  },

  /**
   * 画面上にトースト通知（ポップアップ）を表示
   * @param {string} message 
   */
  showMailNotification(message) {
    // 既存の通知があれば重複しないように削除
    const existingNotice = document.getElementById('mail-notification');
    if (existingNotice) {
      existingNotice.remove();
    }

    // 通知要素の生成
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

    setTimeout(() => {
      noticeEl.classList.remove('show');
      setTimeout(() => noticeEl.remove(), 1000);
    }, 11000);
  }
};

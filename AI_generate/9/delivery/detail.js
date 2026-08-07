/**
 * メール通知システム
 */
const MailSystem = {
  // ストレージキー設定
  STORAGE_KEY: 'arg_karakuribako_content_checked',

  /**
   * 詳細データ確認時の処理
   */
  triggerContentCheck() {
    // すでに確認済みの場合は処理を中断（連打・重複通知をガード）
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

/**
 * 発送詳細・宛先変更制御スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
  const TARGET_ADDRESS = '中央区3-2-4危険物解除施設8階';
  const FLAG_KEY = 'arg_karakuribako_changed_addressee';
  const ADDRESS_STORAGE_KEY = 'arg_karakuribako_current_addressee';

  const inputEl = document.getElementById('addressee-input');
  const btnEl = document.getElementById('btn-update-address');
  const msgEl = document.getElementById('msg-success');

  // 保存済みの宛先があれば復元
  const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
  if (savedAddress && inputEl) {
    inputEl.value = savedAddress;
  }

  if (btnEl && inputEl) {
    btnEl.addEventListener('click', () => {
      const currentVal = inputEl.value.trim();

      // 現在の入力値を保存
      localStorage.setItem(ADDRESS_STORAGE_KEY, currentVal);

      // 指定の解呪/危険物解除施設住所と一致する場合
      if (currentVal === TARGET_ADDRESS) {
        localStorage.setItem(FLAG_KEY, 'true');

        // 正しい住所になったタイミングでメール通知をトリガー
        MailSystem.triggerContentCheck();
      }

      // 画面上の保存完了メッセージの表示
      if (msgEl) {
        msgEl.style.display = 'block';
        setTimeout(() => {
          msgEl.style.display = 'none';
        }, 3000);
      }
    });
  }
});

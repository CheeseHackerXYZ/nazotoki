/**
 * UIの更新および操作イベントの処理
 */
document.addEventListener('DOMContentLoaded', () => {
  const mailListEl = document.getElementById('mail-list');
  const detailSubjectEl = document.getElementById('detail-subject');
  const detailSenderEl = document.getElementById('detail-sender');
  const detailDateEl = document.getElementById('detail-date');
  const detailBodyEl = document.getElementById('detail-body');
  const placeholderEl = document.getElementById('detail-placeholder');
  const contentEl = document.getElementById('detail-content');

  let mails = MailData.getMails();

  /**
   * メール一覧の描画
   */
  function renderMailList() {
    mailListEl.innerHTML = '';
    mails.forEach(mail => {
      const item = document.createElement('div');
      item.className = `mail-item ${mail.isRead ? 'read' : 'unread'}`;
      item.dataset.id = mail.id;

      item.innerHTML = `
        <div class="mail-item-header">
          <span class="mail-item-sender">${escapeHtml(mail.sender)}</span>
          <span class="mail-item-date">${mail.date}</span>
        </div>
        <div class="mail-item-subject">${escapeHtml(mail.subject)}</div>
      `;

      item.addEventListener('click', () => selectMail(mail.id));
      mailListEl.appendChild(item);
    });
  }

  /**
   * メールの選択・本文表示
   */
  function selectMail(mailId) {
    const mail = mails.find(m => m.id === mailId);
    if (!mail) return;

    // 既定のプレースホルダーを隠して詳細を表示
    placeholderEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    detailSubjectEl.textContent = mail.subject;
    detailSenderEl.textContent = mail.sender;
    detailDateEl.textContent = mail.date;
    detailBodyEl.innerHTML = mail.content; // HTMLタグ（リンク）を有効化

    // アクティブクラス切り替え
    document.querySelectorAll('.mail-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === mailId);
    });

    // 既読処理
    if (!mail.isRead) {
      MailData.markAsRead(mailId);
      mail.isRead = true;
      renderMailList();
      // アクティブ状態の再適用
      const currentActive = document.querySelector(`[data-id="${mailId}"]`);
      if (currentActive) currentActive.classList.add('active');
    }
  }

  /**
   * エスケープ処理（XSS防止用）
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 初期化実行
  renderMailList();
});

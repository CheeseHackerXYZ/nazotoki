/**
 * 条件に応じた新着メールの自動受信処理
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_EMAILS = 'arg_karakuribako_mail_list';
  const STORAGE_KEY_BBS = 'arg_bbs_has_simulated_post';
  const STORAGE_KEY_DELIVERY = 'arg_karakuribako_delivery_auth';
  const STORAGE_KEY_CONTENT_CHECKED = 'arg_karakuribako_content_checked'
  // 追加する新着メールの定義
  const urgentMail = {
    id: 'mail_urgent_001',
    subject: '【緊急】発送を阻止してください',
    sender: '依頼人',
    date: null,
    content: 'ヤミオクのオークションが終了した。発送が間もなく開始されるからそれまでに回収するんだ。5分後には発送されてしまうから急いでくれ。',
    isRead: false
  };

  /**
   * 日付を YYYY/MM/DD HH:mm 形式でフォーマット
   */
  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  // 条件フラグの取得
  const isBbsPassed = localStorage.getItem(STORAGE_KEY_BBS) === 'true';
  const isDeliveryAuthed = localStorage.getItem(STORAGE_KEY_DELIVERY) === 'true';

  // 両方のフラグが true の場合のみ処理を実行
  if (isBbsPassed && isDeliveryAuthed) {
    let stored = localStorage.getItem(STORAGE_KEY_EMAILS);
    let mailList = stored ? JSON.parse(stored) : [];

    // すでにこの新着メールが存在するかチェック（初回判定）
    const hasUrgentMail = mailList.some(m => m.id === urgentMail.id);

    if (!hasUrgentMail) {
      // 日付を設定してリストの先頭（最新）に追加
      urgentMail.date = formatDate(new Date());
      mailList.unshift(urgentMail);

      // ローカルストレージを更新
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(mailList));

      // 画面（UI）を更新
      refreshUI();
    }
  }

  /**
   * UIの再描画処理
   */
  function refreshUI() {
    const mailListEl = document.getElementById('mail-list');
    if (!mailListEl) return;

    // data.js の最新情報を再取得
    const mails = MailData.getMails();
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

      // クリックイベントの再登録
      item.addEventListener('click', () => {
        // UI側の詳細表示ロジックを呼び出すため既存要素をシミュレート
        const targetMail = mails.find(m => m.id === mail.id);
        if (!targetMail) return;

        document.getElementById('detail-placeholder').classList.add('hidden');
        document.getElementById('detail-content').classList.remove('hidden');

        document.getElementById('detail-subject').textContent = targetMail.subject;
        document.getElementById('detail-sender').textContent = targetMail.sender;
        document.getElementById('detail-date').textContent = targetMail.date;
        document.getElementById('detail-body').innerHTML = targetMail.content;

        document.querySelectorAll('.mail-item').forEach(el => {
          el.classList.toggle('active', el.dataset.id === mail.id);
        });

        if (!targetMail.isRead) {
          MailData.markAsRead(mail.id);
          targetMail.isRead = true;
          refreshUI();
        }
      });

      mailListEl.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});

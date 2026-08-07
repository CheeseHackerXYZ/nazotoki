/**
 * 条件に応じた新着メールの自動受信処理
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_EMAILS = 'arg_karakuribako_mail_list';
  const STORAGE_KEY_BBS = 'arg_bbs_has_simulated_post';
  const STORAGE_KEY_DELIVERY = 'arg_karakuribako_delivery_auth';
  const STORAGE_KEY_CONTENT_CHECKED = 'arg_karakuribako_content_checked';
  const STORAGE_KEY_CHANGED_ADDRESSEE = 'arg_karakuribako_changed_addressee';
  const STORAGE_KEY_IS_CLEAR = 'arg_karakuribako_is_clear';

  // 【時系列 1】掲示板誘導メール（保管庫詳細確認時に追加）
  const bbsInfoMail = {
    id: 'mail_bbs_info_001',
    subject: '匿名掲示板に関する情報',
    sender: '情報提供者',
    date: null,
    content: '匿名掲示板のサイトを見つけた。何か情報源になるかもしれない。<br><a href="../bbs/index.html">https://URL/index.html</a>',
    isRead: false
  };

  // 【時系列 2】緊急発送阻止メール
  const urgentMail = {
    id: 'mail_urgent_001',
    subject: '【緊急】発送を阻止してください',
    sender: '依頼人',
    date: null,
    content: 'ヤミオクのオークションが終了した。発送が間もなく開始されるからそれまでに回収するんだ。急いでくれ。回収先住所は中央区3-2-4危険物解除施設8階だ。',
    isRead: false
  };

  // 【時系列 3】解錠依頼メール
  const unlockMail = {
    id: 'mail_unlock_001',
    subject: '解錠依頼',
    sender: '依頼人',
    date: null,
    content: '箱の回収は成功した。あとは解錠するだけだ。手伝ってくれ。<br><a href="../unlock/index.html">解錠する</a>',
    isRead: false
  };

  // 【時系列 1】掲示板誘導メール（保管庫詳細確認時に追加）
  const clearMail = {
    id: 'mail_clear_001',
    subject: '協力ありがとうございました',
    sender: '依頼人',
    date: null,
    content: '箱の解除に成功し、呪縛は解けたようだ。更新が止まっていたブログも更新されて、体調も回復したらしい。君のおかげだ、ありがとう。',
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

  // ローカルストレージからメールリストを取得
  let stored = localStorage.getItem(STORAGE_KEY_EMAILS);
  let mailList = stored ? JSON.parse(stored) : [];
  let isUpdated = false;

  // --- 【時系列 1】保管庫詳細画像確認済みの場合 (mail_bbs_info_001) ---
  const isContentChecked = localStorage.getItem(STORAGE_KEY_CONTENT_CHECKED) === 'true';

  if (isContentChecked) {
    const hasBbsInfoMail = mailList.some(m => m.id === bbsInfoMail.id);
    if (!hasBbsInfoMail) {
      bbsInfoMail.date = formatDate(new Date());
      mailList.unshift(bbsInfoMail);
      isUpdated = true;
    }
  }

  // --- 【時系列 2】BBS通過かつ配送認証済みの場合 (mail_urgent_001) ---
  const isBbsPassed = localStorage.getItem(STORAGE_KEY_BBS) === 'true';
  const isDeliveryAuthed = localStorage.getItem(STORAGE_KEY_DELIVERY) === 'true';

  if (isBbsPassed && isDeliveryAuthed) {
    const hasUrgentMail = mailList.some(m => m.id === urgentMail.id);
    if (!hasUrgentMail) {
      urgentMail.date = formatDate(new Date());
      mailList.unshift(urgentMail);
      isUpdated = true;
    }
  }


    // --- 【時系列 3】解錠依頼 ---
  const isChangedAddressee = localStorage.getItem(STORAGE_KEY_CHANGED_ADDRESSEE) === 'true';

  if (isChangedAddressee) {
    const hasUnlockMail = mailList.some(m => m.id === unlockMail.id);
    if (!hasUnlockMail) {
      unlockMail.date = formatDate(new Date());
      mailList.unshift(unlockMail);
      isUpdated = true;
    }
  }

  // --- 【時系列 4】ゲームクリア ---
  const isClear = localStorage.getItem(STORAGE_KEY_IS_CLEAR) === 'true';

  if (isClear) {
    const hasClearMail = mailList.some(m => m.id === clearMail.id);
    if (!hasClearMail) {
      clearMail.date = formatDate(new Date());
      mailList.unshift(clearMail);
      isUpdated = true;
    }
  }
  
  // メールが新しく追加された場合のみストレージ保存とUI更新
  if (isUpdated) {
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(mailList));
    refreshUI();
  }

  /**
   * UIの再描画処理
   */
  function refreshUI() {
    const mailListEl = document.getElementById('mail-list');
    if (!mailListEl) return;

    // MailDataがある場合は最新一覧を取得、なければローカル変数のmailListを利用
    const mails = (typeof MailData !== 'undefined' && MailData.getMails) ? MailData.getMails() : mailList;
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

      item.addEventListener('click', () => {
        const targetMail = mails.find(m => m.id === mail.id);
        if (!targetMail) return;

        const placeholder = document.getElementById('detail-placeholder');
        const content = document.getElementById('detail-content');
        if (placeholder) placeholder.classList.add('hidden');
        if (content) content.classList.remove('hidden');

        const detailSubject = document.getElementById('detail-subject');
        const detailSender = document.getElementById('detail-sender');
        const detailDate = document.getElementById('detail-date');
        const detailBody = document.getElementById('detail-body');

        if (detailSubject) detailSubject.textContent = targetMail.subject;
        if (detailSender) detailSender.textContent = targetMail.sender;
        if (detailDate) detailDate.textContent = targetMail.date;
        if (detailBody) detailBody.innerHTML = targetMail.content;

        document.querySelectorAll('.mail-item').forEach(el => {
          el.classList.toggle('active', el.dataset.id === mail.id);
        });

        if (!targetMail.isRead) {
          if (typeof MailData !== 'undefined' && MailData.markAsRead) {
            MailData.markAsRead(mail.id);
          }
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

/**
 * メールデータの管理・ローカルストレージ処理
 */
const MailData = (() => {
  const STORAGE_KEY_EMAILS = 'arg_karakuribako_mail_list';
  const STORAGE_KEY_CLEAR_FLAG = 'arg_karakuribako_cleared';

  // 初期メール定義
  const initialMails = [
    {
      id: 'mail_001',
      subject: '調査のお願い',
      sender: '依頼人',
      date: null, // 初回読み込み時に動的設定
      content: 'ヤミオクでヤバい出品がある。もうすぐオークションが終了してしまうから調べてほしい。リンクは<a href="../auction/item.html?id=2">https://URL/item.html?id=2</a>だ。',
      isRead: false
    }
  ];

  // クリア時のメール定義
  const clearMail = {
    id: 'mail_clear',
    subject: '【調査完了】ご協力ありがとうございました',
    sender: '依頼人',
    date: null,
    content: '調査お疲れ様、無事問題解決した。例のブログもまた更新を始めたようだ。君のおかげだ。本当にありがとう。',
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

  /**
   * 保存データの読み込みと更新確認
   */
  function getMails() {
    let stored = localStorage.getItem(STORAGE_KEY_EMAILS);
    let mailList = stored ? JSON.parse(stored) : [];
    const nowStr = formatDate(new Date());

    // 初回アクセス時の処理
    if (mailList.length === 0) {
      initialMails[0].date = nowStr;
      mailList.push(initialMails[0]);
    }

    // クリア判定（キー "arg_karakuribako_cleared" が "true" かどうか）
    const isCleared = localStorage.getItem(STORAGE_KEY_CLEAR_FLAG) === 'true';
    const hasClearMail = mailList.some(m => m.id === clearMail.id);

    // クリア済みかつまだクリアメールが追加されていない場合に追加
    if (isCleared && !hasClearMail) {
      const newClearMail = { ...clearMail, date: nowStr };
      mailList.unshift(newClearMail); // 既定で最新メッセージを上に
    }

    // ローカルストレージに最新状態を永続化
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(mailList));
    return mailList;
  }

  /**
   * 既読フラグの更新
   */
  function markAsRead(mailId) {
    const mailList = getMails();
    const mail = mailList.find(m => m.id === mailId);
    if (mail && !mail.isRead) {
      mail.isRead = true;
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(mailList));
    }
  }

  return {
    getMails,
    markAsRead
  };
})();

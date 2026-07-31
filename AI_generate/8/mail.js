// 今日の日付を取得 (MM/DD 形式)
function getTodayString() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    return `${month}/${date}`;
}

// メールデータ（初期データとして依頼のメールを用意）
let mailData = [
    {
        id: 1,
        sender: "Unknown",
        subject: "依頼：あるブログの調査",
        preview: "このサイトを調べてほしい。何か不穏な噂がある…",
        content: `突然の連絡失礼する。
あなたに調べてほしいブログがある。最近妙な噂が絶えないんだ。

公式ブログURL：
<a href="blog.html" target="_blank">http://本番は別ドメイン/blog</a>

軽く目を通すだけでいい。ただ、調査自体は「裏掲示板」で有志が進めているらしい。掲示板のURLも貼っておく。

裏掲示板URL：
<a href="bbs.html" target="_blank">http://本番は別ドメイン/bbs</a>

何か分かったら教えてほしい。頼んだ。`,
        date: "7/31",
        unread: true
    }
];

let mailIdCounter = 3;

// ===== メールの追加関数 =====
// 例: addMail("依頼主", "クリアおめでとう", "真相は…", "よくやってくれた。報酬を振り込んだ。");
function addMail(sender, subject, preview, content) {
    const newMail = {
        id: mailIdCounter++,
        sender: sender,
        subject: subject,
        preview: preview,
        content: content,
        date: getTodayString(), // ここで今日の日付をセット
        unread: true
    };
    
    // 配列の先頭に追加して再レンダリング
    mailData.unshift(newMail);
    
    // 詳細画面を開いていなければ一覧を更新
    if (document.getElementById("mailList").style.display !== "none") {
        renderMails(mailData);
    }
}

// ===== メールの描画処理 =====
function renderMails(mails) {
    const mailListEl = document.getElementById("mailList");
    mailListEl.innerHTML = "";
    
    if (mails.length === 0) {
        mailListEl.innerHTML = "<div style='padding: 20px; color: #666;'>メールが見つかりません。</div>";
        return;
    }

    mails.forEach(mail => {
        const mailEl = document.createElement("div");
        mailEl.className = "mail";
        if (mail.unread) mailEl.classList.add("unread");
        
        // リスト項目のHTML生成 (XSS対策で一覧のみタグを無効化)
        mailEl.innerHTML = `
            <div class="sender">${escapeHTML(mail.sender)}</div>
            <div class="subject">${escapeHTML(mail.subject)}</div>
            <div class="preview">${escapeHTML(mail.preview)}</div>
            <div class="date">${escapeHTML(mail.date)}</div>
        `;
        
        // クリックで詳細画面へ
        mailEl.addEventListener("click", () => openMail(mail));
        mailListEl.appendChild(mailEl);
    });
}

// ===== メール詳細を開く =====
function openMail(mail) {
    // 既読状態を解除
    if (mail.unread) {
        mail.unread = false;
        renderMails(mailData); // 既読の見た目を反映
    }
    
    // 詳細データをセット
    document.getElementById("detailSubject").textContent = mail.subject;
    document.getElementById("detailSender").textContent = mail.sender;
    document.getElementById("detailDate").textContent = mail.date;
    
    // 本文はHTMLタグ（リンク等）を許可するため innerHTML を使用
    // 改行コード(\n)がある場合は <br> に変換する
    document.getElementById("detailContent").innerHTML = mail.content.replace(/\n/g, '<br>');
    
    // 画面の切り替え
    document.getElementById("mailList").style.display = "none";
    document.getElementById("mailDetail").style.display = "block";
}

// ===== 一覧へ戻るボタン =====
document.getElementById("backBtn").addEventListener("click", () => {
    document.getElementById("mailDetail").style.display = "none";
    document.getElementById("mailList").style.display = "block";
});

// 簡単なエスケープ関数
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

// 読み込み時に初期描画
document.addEventListener("DOMContentLoaded", () => {
    renderMails(mailData);
});

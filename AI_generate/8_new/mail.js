const initialMailData = [
    {
        id: "briefing",
        sender: "Archive Relay",
        subject: "調査依頼: 青井葵の日誌について",
        preview: "公開記録と検証スレッドを確認してほしい。",
        date: "7/31",
        unread: true,
        body: [
            "青井葵という書き手の日誌で、公開済みの文章が保留扱いになる現象が報告されています。",
            "まずは日誌を読み、検証掲示板に残された報告と照らし合わせてください。調査に必要な手掛かりは、すべて各ページの画面内にあります。"
        ],
        actions: [
            { href: "blog.html", label: "青井葵の日誌を開く", stage: "blog" },
            { href: "bbs.html", label: "検証掲示板を開く", stage: "board" }
        ]
    }
];

const finalMail = {
    id: "resolution",
    sender: "Archive Relay",
    subject: "調査完了: 保留記録の引き継ぎを確認",
    preview: "作者認証が完了し、隔離されていた記録を回収しました。",
    date: "8/01",
    unread: true,
    body: [
        "作者認証を確認しました。保留になっていた投稿は、旧式の自動監査が誤って隔離したものです。",
        "侵入や改ざんの痕跡はなく、青井葵が残したバックアップも無事でした。掲示板の噂にある特別な操作は、どれも必要ありません。",
        "記録を読み、手掛かりを確かめ、正規の引き継ぎまで到達したことで調査は完了です。"
    ],
    actions: [
        { href: "blog.html", label: "日誌をもう一度確認する", stage: "cleared" }
    ]
};

let mailData = initialMailData.map((mail) => ({ ...mail }));

function getTodayString() {
    const date = new Date();
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function currentStage() {
    return localStorage.getItem("arg8CaseStage") || "start";
}

function stageLabel(stage) {
    return {
        start: "調査を開始",
        blog: "公開記録を確認中",
        board: "検証情報を確認中",
        archive: "保留記録を確認中",
        cleared: "調査完了"
    }[stage] || "調査を開始";
}

function updateCaseState() {
    document.getElementById("caseState").textContent = stageLabel(currentStage());
}

function ensureFinalMail() {
    if (currentStage() === "cleared" && !mailData.some((mail) => mail.id === finalMail.id)) {
        mailData = [{ ...finalMail, date: getTodayString() }, ...mailData];
    }
}

function renderMails(mails = mailData) {
    const mailList = document.getElementById("mailList");
    mailList.replaceChildren();
    if (!mails.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "一致するメールはありません。";
        mailList.appendChild(empty);
        return;
    }

    mails.forEach((mail) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = `mail${mail.unread ? " unread" : ""}`;
        const sender = document.createElement("span");
        sender.className = "sender";
        sender.textContent = mail.sender;
        const subject = document.createElement("span");
        subject.className = "subject";
        subject.textContent = mail.subject;
        const preview = document.createElement("span");
        preview.className = "preview";
        preview.textContent = mail.preview;
        const date = document.createElement("time");
        date.className = "date";
        date.textContent = mail.date;
        row.append(sender, subject, preview, date);
        row.addEventListener("click", () => openMail(mail));
        mailList.appendChild(row);
    });
}

function openMail(mail) {
    mail.unread = false;
    document.getElementById("detailSubject").textContent = mail.subject;
    document.getElementById("detailSender").textContent = mail.sender;
    document.getElementById("detailDate").textContent = mail.date;
    const content = document.getElementById("detailContent");
    content.replaceChildren();
    mail.body.forEach((paragraph) => {
        const line = document.createElement("p");
        line.textContent = paragraph;
        content.appendChild(line);
    });
    mail.actions.forEach((item) => {
        const link = document.createElement("a");
        link.className = "message-link";
        link.href = item.href;
        link.textContent = item.label;
        link.addEventListener("click", () => {
            if (item.stage) localStorage.setItem("arg8CaseStage", item.stage);
        });
        content.appendChild(link);
    });
    document.getElementById("mailList").style.display = "none";
    document.getElementById("mailDetail").style.display = "block";
}

function showList() {
    document.getElementById("mailDetail").style.display = "none";
    document.getElementById("mailList").style.display = "block";
    renderMails();
}

document.addEventListener("DOMContentLoaded", () => {
    ensureFinalMail();
    updateCaseState();
    renderMails();
    document.getElementById("backBtn").addEventListener("click", showList);
});

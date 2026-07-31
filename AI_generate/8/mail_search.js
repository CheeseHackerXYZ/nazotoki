document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    
    searchInput.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase();
        
        // 送信者、件名、プレビュー、本文 のいずれかにキーワードが含まれていれば抽出
        const filteredMails = mailData.filter(mail => {
            return mail.subject.toLowerCase().includes(keyword) ||
                   mail.sender.toLowerCase().includes(keyword) ||
                   mail.preview.toLowerCase().includes(keyword) ||
                   mail.content.toLowerCase().includes(keyword);
        });
        
        // フィルタリングした結果を描画
        renderMails(filteredMails);
        
        // 検索時は強制的に一覧画面に戻す
        document.getElementById("mailDetail").style.display = "none";
        document.getElementById("mailList").style.display = "block";
    });
});

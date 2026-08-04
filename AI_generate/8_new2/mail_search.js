document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
        const filtered = mailData.filter((mail) => {
            const source = [mail.sender, mail.subject, mail.preview, ...mail.body].join(" ");
            return source.normalize("NFKC").toLocaleLowerCase("ja-JP").includes(term);
        });
        document.getElementById("mailDetail").style.display = "none";
        document.getElementById("mailList").style.display = "block";
        renderMails(filtered);
    });
});

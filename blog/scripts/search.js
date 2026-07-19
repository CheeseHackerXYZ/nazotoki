document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (!searchBtn || !searchInput) return;

    function goToSearchPage() {
        const query = searchInput.value.trim();
        if (query) {
            // search.htmlへクエリ付きで遷移
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    searchBtn.addEventListener("click", goToSearchPage);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") goToSearchPage();
    });
});

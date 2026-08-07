// 1. オブジェクト管理（実際の埋め込みファイルパス と 表示パスのマッピング）
const routes = {
  // 形式: [実際のパス]: "表示用のURL"
  "mail/index.html": "https://mail-service.arg",
  "./dashboard.html": "https://example.com/dashboard",
  "./settings.html": "https://example.com/settings"
};

// 初期表示するページ（routesのキーから選択）
const INITIAL_REAL_PATH = "./app-page.html";

// 要素の取得
const iframe = document.getElementById('appFrame');
const reloadBtn = document.getElementById('reloadBtn');
const addressBar = document.getElementById('addressBar');

// --- 表示パス更新関数 ---
function updateAddressBar() {
  try {
    // iframe内の実際の相対パス/絶対パスを取得
    const currentPath = iframe.contentWindow.location.pathname;

    // routesマップから一致する表示パスを探索（完全一致または部分一致）
    const matchedKey = Object.keys(routes).find(key => {
      // "./app-page.html" などの相対パスをパス名と比較できるように正規化
      const cleanKey = key.replace(/^\./, ''); 
      return currentPath.endsWith(cleanKey);
    });

    if (matchedKey && routes[matchedKey]) {
      // マップに存在するならダミー表示パスをセット
      addressBar.textContent = routes[matchedKey];
    } else {
      // マップに定義されていない内部遷移の場合は、そのまま実際のパスを表示
      addressBar.textContent = currentPath;
    }
  } catch (e) {
    addressBar.textContent = routes[INITIAL_REAL_PATH] || iframe.src;
  }
}

// --- イベント設定 ---

// 初期ページロード
iframe.src = INITIAL_REAL_PATH;

// iframeロード完了時にアドレスバー表示を切り替え
iframe.addEventListener('load', updateAddressBar);

// リロード処理
reloadBtn.addEventListener('click', () => {
  try {
    iframe.contentWindow.location.reload();
  } catch (e) {
    iframe.src = iframe.src;
  }
});

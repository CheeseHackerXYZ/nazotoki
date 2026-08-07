document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_BBS_POSTS = 'arg_karakuribako_bbs_posts';

  const clearTimeEl = document.getElementById('clear-time');
  const shareXBtn = document.getElementById('share-x-btn');

  let formattedClearTime = '--分--秒';

  /**
   * クリアタイム（所要時間）の計算処理
   */
  function calculateClearTime() {
    const rawPosts = localStorage.getItem(STORAGE_KEY_BBS_POSTS);

    if (!rawPosts) {
      clearTimeEl.textContent = '記録なし';
      return;
    }

    try {
      const posts = JSON.parse(rawPosts);

      // 配列の最初の要素を取得
      if (!Array.isArray(posts) || posts.length === 0 || !posts[0].date) {
        clearTimeEl.textContent = '記録なし';
        return;
      }

      // "YYYY/MM/DD HH:mm" 形式を Date オブジェクトに変換
      const startDateStr = posts[0].date.replace(/\//g, '-');
      const startTime = new Date(startDateStr).getTime();
      const endTime = new Date().getTime();

      if (isNaN(startTime)) {
        clearTimeEl.textContent = '記録なし';
        return;
      }

      // 差分（ミリ秒）から時間・分・秒を算出
      const diffMs = Math.max(0, endTime - startTime);
      const totalSeconds = Math.floor(diffMs / 1000);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        formattedClearTime = `${hours}時間${minutes}分${seconds}秒`;
      } else {
        formattedClearTime = `${minutes}分${seconds}秒`;
      }

      clearTimeEl.textContent = formattedClearTime;
    } catch (e) {
      console.error('クリアタイムの計算エラー:', e);
      clearTimeEl.textContent = '記録なし';
    }
  }

  /**
   * X（旧Twitter）共有用のURL作成とポスト画面起動
   */
  function shareToX() {
    const currentUrl = window.location.href;
    const shareText = `【ゲームクリア】\nゲームをクリアしました！\nクリアタイム: ${formattedClearTime}\n\n#カラクリ箱`;

    const xShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;

    window.open(xShareUrl, '_blank', 'noopener,noreferrer');
  }

  // 初期化実行
  calculateClearTime();

  // イベントリスナーの追加
  if (shareXBtn) {
    shareXBtn.addEventListener('click', shareToX);
  }
});

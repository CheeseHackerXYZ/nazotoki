document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_BBS_POSTS = 'arg_karakuribako_bbs_posts';

  const clearTimeEl = document.getElementById('clear-time');
  const shareXBtn = document.getElementById('share-x-btn');

  let formattedClearTime = '--分--秒';

  /**
   * ローカル時刻として "YYYY/MM/DD HH:mm" または "YYYY-MM-DD HH:mm[:ss]" をパースして
   * 単位ミリ秒のタイムスタンプを返す（失敗したら NaN）
   */
  function parseLocalDateTime(str) {
    if (typeof str !== 'string') return NaN;

    // 年/月/日 区切りは / か - のどちらでも許容、秒は任意
    const m = str.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return NaN;

    const year = Number(m[1]);
    const month = Number(m[2]); // 1-12
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    const second = m[6] ? Number(m[6]) : 0;

    // new Date(year, monthIndex, day, hour, minute, second) はローカル時刻で作られる
    return new Date(year, month - 1, day, hour, minute, second).getTime();
  }

  /**
   * クリアタイム（所要時間）の計算処理
   * - posts の中で "最も古い" date を開始時刻として使う（配列が新しい順に入っている場合でも正しい）
   */
  function calculateClearTime() {
    const rawPosts = localStorage.getItem(STORAGE_KEY_BBS_POSTS);

    if (!rawPosts) {
      clearTimeEl.textContent = '記録なし';
      return;
    }

    try {
      const posts = JSON.parse(rawPosts);

      if (!Array.isArray(posts) || posts.length === 0) {
        clearTimeEl.textContent = '記録なし';
        return;
      }

      // posts の中で最も古い（最小の）日時を探す
      let startTime = Infinity;
      for (const p of posts) {
        if (!p || !p.date) continue;
        const parsed = parseLocalDateTime(p.date);
        const fallback = isNaN(parsed) ? new Date(p.date).getTime() : parsed;
        if (!isNaN(fallback) && fallback < startTime) {
          startTime = fallback;
        }
      }

      if (!isFinite(startTime)) {
        clearTimeEl.textContent = '記録なし';
        return;
      }

      const endTime = new Date().getTime();

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
    const shareText = `【ゲームクリア】\n「題名」をクリアしました！\nクリアタイム: ${formattedClearTime}\nhttps://URL/`;

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

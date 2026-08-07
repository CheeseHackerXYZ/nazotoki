/**
 * 荷物状態の動的切り替えスクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
  const BBS_FLAG_KEY = 'arg_bbs_has_simulated_post';
  const hasBbsSimulated = localStorage.getItem(BBS_FLAG_KEY) === 'true';

  const statusBadge = document.querySelector('.status-badge');
  const statusDetail = document.querySelector('.status-detail');

  // BBSで新規投稿が読み込まれている場合は発送手続き中に変更
  if (hasBbsSimulated && statusBadge && statusDetail) {
    statusBadge.textContent = '発送手続き中';
    statusDetail.innerHTML = '詳細：発送手続き中です。<a href="detail.html">詳細を見る</a>';
  }
});

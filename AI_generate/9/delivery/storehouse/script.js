/**
 * 保管庫管理システム 制御スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
  const cameraImg = document.getElementById('camera-img');
  const toggleBtn = document.getElementById('toggle-img-btn');
  const viewLabel = document.getElementById('view-label');

  let isShowingNow = true;

  if (toggleBtn && cameraImg) {
    toggleBtn.addEventListener('click', () => {
      isShowingNow = !isShowingNow;

      if (isShowingNow) {
        cameraImg.src = 'now.png';
        viewLabel.textContent = '現在（リアルタイム監視カメラ）';
        toggleBtn.textContent = '保管庫内部データ／詳細画像に切り替え';
      } else {
        cameraImg.src = 'content.png';
        viewLabel.textContent = '保管品内部構造／スキャンデータ';
        toggleBtn.textContent = 'リアルタイム監視カメラに切り替え';

        // 詳細画像に切り替わったタイミングで通知発行 & ストレージ更新
        if (typeof MailSystem !== 'undefined') {
          MailSystem.triggerContentCheck();
        }
      }
    });
  }
});

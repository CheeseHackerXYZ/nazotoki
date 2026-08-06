/**
 * BlackDelivery 追跡番号認証スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('tracking-form');
  const trackingInput = document.getElementById('tracking-number');
  const errorMsg = document.getElementById('error-message');

  const VALID_TRACKING_NUMBER = '530492974863';
  const AUTH_KEY = 'arg_karakuribako_delivery_auth';

  // ログイン画面の処理
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputVal = trackingInput.value.trim();

      if (inputVal === VALID_TRACKING_NUMBER) {
        // 認証成功時、ローカルストレージに保持してダッシュボードへ
        localStorage.setItem(AUTH_KEY, 'true');
        window.location.href = 'dashboard.html';
      } else {
        errorMsg.textContent = 'その番号は存在しません';
        errorMsg.style.display = 'block';
      }
    });
  }

  // ダッシュボードでの認証チェック
  if (window.location.pathname.includes('dashboard.html')) {
    const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
    if (!isAuth) {
      window.location.href = 'login.html';
    }
  }
});

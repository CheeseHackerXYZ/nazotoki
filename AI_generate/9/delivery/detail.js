/**
 * 発送詳細・宛先変更制御スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
  const TARGET_ADDRESS = '中央区3-2-4危険物解除施設8階';
  const FLAG_KEY = 'arg_karakuribako_changed_addressee';
  const ADDRESS_STORAGE_KEY = 'arg_karakuribako_current_addressee';

  const inputEl = document.getElementById('addressee-input');
  const btnEl = document.getElementById('btn-update-address');
  const msgEl = document.getElementById('msg-success');

  // 保存済みの宛先があれば復元
  const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
  if (savedAddress && inputEl) {
    inputEl.value = savedAddress;
  }

  if (btnEl && inputEl) {
    btnEl.addEventListener('click', () => {
      const currentVal = inputEl.value.trim();

      // 現在の入力値を保存
      localStorage.setItem(ADDRESS_STORAGE_KEY, currentVal);

      // 指定の解除施設住所と一致する場合のみフラグをtrueにする
      if (currentVal === TARGET_ADDRESS) {
        localStorage.setItem(FLAG_KEY, 'true');
      }

      // 完了メッセージの表示
      if (msgEl) {
        msgEl.style.display = 'block';
        setTimeout(() => {
          msgEl.style.display = 'none';
        }, 3000);
      }
    });
  }
});

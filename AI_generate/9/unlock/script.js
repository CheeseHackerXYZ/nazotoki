const STORAGE_KEY = 'arg_karakuribako_is_clear';

// 正解のインデックスの組み合わせ（最後が真ん中の 4 ）
const CORRECT_SEQUENCE = [0, 2, 6, 4];

const CENTER_INDEX = 4;

let userInput = [];

const buttons = document.querySelectorAll('.btn');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

// ボタンクリック時の処理
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // data-index を数値（number）として取得
    const index = parseInt(button.getAttribute('data-index'), 10);
    userInput.push(index);

    // 真ん中のボタン（インデックス 4）が押されたら判定
    if (index === CENTER_INDEX) {
      checkSequence();
    } else {
      messageEl.textContent = `入力中: ${userInput.join(' -> ')}`;
      messageEl.className = 'message';
    }
  });
});

// 正誤判定処理
function checkSequence() {
  // 配列長と要素の一致を確認
  const isCorrect = userInput.length === CORRECT_SEQUENCE.length &&
    userInput.every((val, idx) => val === CORRECT_SEQUENCE[idx]);

  if (isCorrect) {
    messageEl.textContent ='成功';
    messageEl.className = 'message success';
    localStorage.setItem('STORAGE_KEY', 'true');
    setTimeout(function() { window.location.href = '../mail/index.html'; }, 1000);
  } else {
    messageEl.textContent = '失敗';
    messageEl.className = 'message error';
    userInput = []; // 失敗時は入力履歴をリセット
    setTimeout(function() { window.location.href = 'failure.html'; }, 1000);
  }
}

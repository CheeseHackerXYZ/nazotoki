/**
 * ARG (Alternate Reality Game) Disclaimer Banner
 * 他のDOMやCSSに一切影響を与えず、画面最下部に固定表示する自己完結型スクリプト
 */
(function() {
  'use strict';

  // 二重読み込み防止
  if (window.__ARG_DISCLAIMER_LOADED__) return;
  window.__ARG_DISCLAIMER_LOADED__ = true;

  const createDisclaimer = () => {
    // 1. 隔離用のホスト要素を作成
    const host = document.createElement('div');
    host.id = 'arg-disclaimer-root';
    
    // 他の要素の z-index や配置に影響されないように最前面へ設定
    host.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647;';

    // 2. Shadow DOM を作成してスタイルを完全に隔離（周りのCSSを一切受け付けない・干渉しない）
    const shadow = host.attachShadow({ mode: 'closed' });

    // 3. バナーの HTML 構造 & 専用CSS
    shadow.innerHTML = `
      <style>
        .disclaimer-banner {
          position: fixed;
          bottom: 12px;
          right: 12px;
          max-width: 360px;
          width: calc(100vw - 24px);
          background: rgba(18, 18, 20, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #e2e8f0;
          padding: 12px 14px;
          border-radius: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .disclaimer-banner.show {
          opacity: 1;
          transform: translateY(0);
        }

        .icon {
          font-size: 16px;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .content {
          flex: 1;
        }

        .title {
          font-weight: 700;
          color: #38bdf8;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
          font-size: 11px;
          text-transform: uppercase;
        }

        .text {
          color: #cbd5e1;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          padding: 0 2px;
          margin-left: 4px;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #ffffff;
        }
      </style>

      <div class="disclaimer-banner" id="banner" role="alert">
        <div class="icon">🎮</div>
        <div class="content">
          <div class="title">FICTION NOTICE / ARG</div>
          <p class="text">
            本作品はARG（代替現実ゲーム）でありフィクションです。実在の人物、団体、法律、事件、地名、ウェブサイトなどとは一切関係ありません。現実の出来事として取り扱わないようご注意ください。
          </p>
        </div>
        <button class="close-btn" id="close-btn" aria-label="閉じる">×</button>
      </div>
    `;

    // 4. bodyの最最後に安全に追加
    document.body.appendChild(host);

    // 5. アニメーション表示 & 閉じるボタンのアクション
    const banner = shadow.getElementById('banner');
    const closeBtn = shadow.getElementById('close-btn');

    // ちょっとだけ遅れてふわっと表示
    requestAnimationFrame(() => {
      setTimeout(() => {
        banner.classList.add('show');
      }, 300);
    });

    closeBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      setTimeout(() => {
        host.remove();
      }, 300);
    });
  };

  // DOMの読み込み完了タイミングに合わせて実行（bodyの最後に追加）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDisclaimer);
  } else {
    createDisclaimer();
  }
})();

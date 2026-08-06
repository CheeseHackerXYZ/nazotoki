/**
 * 掲示板UI描画・返信制御
 */
document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts-container');
  let activeReplyForm = null;

  function render() {
    const posts = BbsData.getPosts();
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
      postsContainer.appendChild(createPostNode(post));
    });
  }

  function createPostNode(post) {
    const wrapper = document.createElement('div');
    wrapper.className = 'post-wrapper';

    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    postCard.innerHTML = `
      <div class="post-header">
        <span class="post-name">${escapeHtml(post.name)}</span>
        <span class="post-date">${post.date}</span>
      </div>
      <div class="post-content">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
      <div class="post-actions">
        <button class="btn-reply" data-id="${post.id}">返信する</button>
      </div>
      <div class="reply-form-container" id="form-container-${post.id}"></div>
    `;

    const replyBtn = postCard.querySelector('.btn-reply');
    replyBtn.addEventListener('click', () => {
      toggleReplyForm(post.id);
    });

    wrapper.appendChild(postCard);

    if (post.replies && post.replies.length > 0) {
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'replies-container';
      post.replies.forEach(reply => {
        repliesContainer.appendChild(createPostNode(reply));
      });
      wrapper.appendChild(repliesContainer);
    }

    return wrapper;
  }

  function toggleReplyForm(targetId) {
    const targetContainer = document.getElementById(`form-container-${targetId}`);
    
    if (activeReplyForm) {
      activeReplyForm.remove();
      if (activeReplyForm.dataset.targetId === String(targetId)) {
        activeReplyForm = null;
        return;
      }
    }

    const form = document.createElement('form');
    form.className = 'inline-reply-form';
    form.dataset.targetId = targetId;

    form.innerHTML = `
      <div class="form-group">
        <input type="text" class="input-name" placeholder="名前 (省略可)">
      </div>
      <div class="form-group">
        <textarea class="input-content" rows="3" placeholder="返信コメントを入力..." required></textarea>
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn-submit">送信</button>
        <button type="button" class="btn-cancel">キャンセル</button>
      </div>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('.input-name').value;
      const content = form.querySelector('.input-content').value;
      
      if (content.trim()) {
        BbsData.addReply(targetId, name, content);
        render();
      }
    });

    form.querySelector('.btn-cancel').addEventListener('click', () => {
      form.remove();
      activeReplyForm = null;
    });

    targetContainer.appendChild(form);
    activeReplyForm = form;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  render();
});

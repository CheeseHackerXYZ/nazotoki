/**
 * 掲示板データ管理・ローカルストレージ処理
 */
const BbsData = (() => {
  const STORAGE_KEY_POSTS = 'arg_karakuribako_bbs_posts';

  // 初期スレッドデータ
  const initialPosts = [
    {
      id: 1,
      number: 1,
      name: '名無しの調査員',
      date: '2026/08/01 23:14',
      content: '【オークションの木箱】について語るスレ\nヤミオクに出てたあの変な木箱、落札した奴受け取り拒否したらしいぞ。\nBlackDeliveryの配送トラッキングで受取拒否になってて草',
      replies: [
        {
          id: 101,
          number: 2,
          name: '名無しの調査員',
          date: '2026/08/01 23:20',
          content: 'マジかよ。出品者のブログもピタッと止まってるし不気味すぎるだろ。',
          replies: [
            {
              id: 201,
              number: 4,
              name: '名無しの調査員',
              date: '2026/08/01 23:45',
              content: 'ブログに書いてあった自作の画像解析ツールでBlackDeliveryの画像見たやついる？',
              replies: []
            }
          ]
        },
        {
          id: 102,
          number: 3,
          name: '名無しの調査員',
          date: '2026/08/01 23:32',
          content: '保管庫のカメラ画像、なんか暗すぎて何も見えん。解析ツール通したら何かわかるんかな？',
          replies: []
        }
      ]
    }
  ];

  /**
   * 投稿リストの取得（保存がなければ初期データを設定）
   */
  function getPosts() {
    const stored = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(initialPosts));
      return initialPosts;
    }
    return JSON.parse(stored);
  }

  /**
   * 次の番号とIDを取得
   */
  function getNextNumbers(posts) {
    let maxNum = 0;
    let maxId = 0;

    function traverse(list) {
      list.forEach(item => {
        if (item.number > maxNum) maxNum = item.number;
        if (item.id > maxId) maxId = item.id;
        if (item.replies && item.replies.length > 0) {
          traverse(item.replies);
        }
      });
    }

    traverse(posts);
    return { nextNum: maxNum + 1, nextId: maxId + 1 };
  }

  /**
   * 日時フォーマット
   */
  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  /**
   * 親レスまたは返信コメントにレスを追加
   */
  function addReply(targetId, name, content) {
    const posts = getPosts();
    const { nextNum, nextId } = getNextNumbers(posts);

    const newComment = {
      id: nextId,
      number: nextNum,
      name: name.trim() || '名無しの調査員',
      date: formatDate(new Date()),
      content: content.trim(),
      replies: []
    };

    if (targetId === null) {
      // トップレベルの投稿を追加
      posts.push(newComment);
    } else {
      // 再帰的に対象のレスを探索して追加
      function insertRecursively(list) {
        for (let item of list) {
          if (item.id === targetId) {
            item.replies.push(newComment);
            return true;
          }
          if (item.replies && item.replies.length > 0) {
            if (insertRecursively(item.replies)) return true;
          }
        }
        return false;
      }
      insertRecursively(posts);
    }

    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    return posts;
  }

  return {
    getPosts,
    addReply
  };
})();

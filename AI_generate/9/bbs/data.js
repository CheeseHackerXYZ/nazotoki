/**
 * 掲示板データ管理・ローカルストレージ処理
 */
const BbsData = (() => {
  const STORAGE_KEY_POSTS = 'arg_karakuribako_bbs_posts';

  /**
   * 現在時刻から指定分だけ遡った日時文字列（YYYY/MM/DD HH:mm）を取得
   */
  function getPastDateString(minutesAgo) {
    const d = new Date(Date.now() - minutesAgo * 60 * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  // 初期スレッドデータ（半日前から順に投稿された設定）
  const initialPosts = [
    {
      id: 1,
      number: 1,
      name: '名無しの調査員',
      date: getPastDateString(720), // 12時間前（半日前）
      content: 'あの不思議な模様がある木箱、またヤミオクに出品されてたな。\n外見はただの木箱だが、正しい順序で処理しないと怪異が拡散するらしい。\n正確な模様と解除方法を知ってる奴いないか？',
      replies: [
        {
          id: 2,
          number: 2,
          name: '名無しの調査員',
          date: getPastDateString(600), // 10時間前
          content: 'ああ、「中央にスカルがあって、その周りに星が4つあるやつ」だろ？\nあれは四隅の星を水で濡らしてから、中央のドクロを強く押し込むのが正解。',
          replies: [
            {
              id: 3,
              number: 3,
              name: '名無しの調査員',
              date: getPastDateString(510), // 8.5時間前
              content: 'ドクロなんてついてないだろ。\n「四角い枠の中に星が4つ並んでるやつ」だよ。\n枠の角を順番に叩いてから、箱をひっくり返す（上下逆にする）と解除される。',
              replies: [
                {
                  id: 4,
                  number: 4,
                  name: '名無しの調査員',
                  date: getPastDateString(420), // 7時間前
                  content: 'お前らが見たのは偽物か別の箱だな。\n本物は「迷路みたいな渦巻き模様の中に、星が浮いてるやつ」だ。\n日光に5分当ててから箱を3回振るのが正解。',
                  replies: [
                    {
                      id: 5,
                      number: 5,
                      name: '名無しの調査員',
                      date: getPastDateString(240), // 4時間前
                      content: '昔の文献を調べたが、本物は「大きな円の内側に、星が4つ配置されている模様」だ。\n他の柄は後代の模倣品か別の呪物。\n\n円と四星の箱の正しい無力化手順は以下の通り。\n「まず上面の4つの星を順番に押し、次に箱をひっくり返して、最後に日に当てる。」\nこの手順を間違えると封印が破れて怪異が拡散するから注意しろ。',
                      replies: [
                        {
                          id: 6,
                          number: 6,
                          name: '名無しの調査員',
                          date: getPastDateString(60), // 1時間前
                          content: 'マジか、円の中に星4つのやつが本物なのか。\n前にどこかで「水に濡らす」って見た気がしたけど、あれはドクロ版の手順と混ざってたんだな。助かったわ。',
                          replies: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
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
      name: '名無しの調査員',
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
    STORAGE_KEY: STORAGE_KEY_POSTS,
    getPosts,
    addReply
  };
})();

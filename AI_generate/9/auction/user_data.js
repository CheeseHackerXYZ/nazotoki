/**
 * ユーザーデータ管理
 */
const UserData = (() => {
  const users = {
    'seller123': {
      id: 'seller123',
      name: 'seller123',
      rating: '★★☆☆☆ (2.1)',
      message: 'ブログのURL載せておきます。<br><a href="../blog/index.html">https://URL/index.html</a>'
    },
    'user_tcg_master': {
      id: 'user_tcg_master',
      name: 'カードコレクターA',
      rating: '★★★★★ (4.9)',
      message: 'スムーズで丁寧な取引を心がけております。トレカ中心に出品しています。よろしくお願いいたします！'
    },
    'user_fashion_lover': {
      id: 'user_fashion_lover',
      name: 'オシャレ好き',
      rating: '★★★★☆ (4.5)',
      message: 'クローゼット整理中につき、着なくなったブランド服を多数出品予定です。'
    },
    'user_train_fan': {
      id: 'user_train_fan',
      name: 'トレインマニア',
      rating: '★★★★★ (5.0)',
      message: '鉄道模型や関連グッズを主に取り扱っています。梱包は丁寧に行います。'
    },
    'user_gamer99': {
      id: 'user_gamer99',
      name: 'ゲーマー99',
      rating: '★★★★☆ (4.2)',
      message: '遊ばなくなったゲーム機器やソフトを出品しています。動作確認はしっかり行っております。'
    },
    'user_photo_mania': {
      id: 'user_photo_mania',
      name: 'レンズ沼太郎',
      rating: '★★★★★ (4.8)',
      message: 'カメラ機材の入れ替えのため出品します。防湿庫保管品です。'
    }
  };

  function getUserById(id) {
    return users[id] || {
      id: id,
      name: '匿名ユーザー',
      rating: '★★★☆☆ (3.0)',
      message: 'よろしくお願いいたします。'
    };
  }

  return {
    getUserById
  };
})();

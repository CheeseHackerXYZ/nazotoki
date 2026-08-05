/**
 * オークション商品データ管理
 */
const ItemData = (() => {
  const items = [
    {
      id: '0',
      title: 'レアゲームカード',
      sellerId: 'user_tcg_master',
      sellerName: 'カードコレクターA',
      price: '150,000円',
      bids: 14,
      image: 'img/0.png',
      description: '【美品】限定100枚の超レアカードです。スリーブに入れて暗所にて保管しておりました。コレクション整理のため出品します。'
    },
    {
      id: '1',
      title: 'ブランド服',
      sellerId: 'user_fashion_lover',
      sellerName: 'オシャレ好き',
      price: '45,000円',
      bids: 5,
      image: 'img/1.png',
      description: '昨シーズン購入したハイブランドのジャケットです。数回使用したのみで状態は良好です。サイズ：M'
    },
    {
      id: '2',
      title: '[訳あり]不気味な木箱',
      sellerId: 'seller123',
      sellerName: 'seller123',
      price: '1,000円',
      bids: 2,
      image: 'img/2.png',
      description: '誰か引き取って'
    },
    {
      id: '3',
      title: '鉄道模型',
      sellerId: 'user_train_fan',
      sellerName: 'トレインマニア',
      price: '12,800円',
      bids: 8,
      image: 'img/3.png',
      description: 'Nゲージの車両セットです。動作確認済み。ライトも点灯します。箱には少し擦れ傷があります。'
    },
    {
      id: '4',
      title: 'ゲーム機',
      sellerId: 'user_gamer99',
      sellerName: 'ゲーマー99',
      price: '28,000円',
      bids: 22,
      image: 'img/4.png',
      description: '最新世代の家庭用ゲーム機本体です。付属品はすべて揃っています。初期化済み。'
    },
    {
      id: '5',
      title: 'カメラ',
      sellerId: 'user_photo_mania',
      sellerName: 'レンズ沼太郎',
      price: '68,000円',
      bids: 19,
      image: 'img/5.png',
      description: '一眼レフカメラ本体と標準ズームレンズのセットです。届いてすぐに撮影を始められます。'
    }
  ];

  function getAllItems() {
    return items;
  }

  function getItemById(id) {
    return items.find(item => item.id === String(id));
  }

  function getItemsBySeller(sellerId) {
    return items.filter(item => item.sellerId === sellerId);
  }

  function searchItems(keyword) {
    if (!keyword.trim()) return items;
    const lower = keyword.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lower) || 
      item.description.toLowerCase().includes(lower)
    );
  }

  return {
    getAllItems,
    getItemById,
    getItemsBySeller,
    searchItems
  };
})();

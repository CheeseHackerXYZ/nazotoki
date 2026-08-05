/**
 * ブログ記事データ管理
 */
const BlogData = (() => {
  const articles = [
    {
      id: '1',
      title: '【WebAPI】ブラウザで動く画像解析・明暗補正ツールを作ってみた',
      date: '数ヶ月前の投稿',
      content: `
        <p>ポートフォリオ用に、HTML5 Canvasを使って画像の明度・コントラスト・赤外線っぽい強調処理ができる簡易レタッチツールを作りました。</p>
        <p>潰れた暗い写真でも、コントラストを極限まで上げれば隠れたディテールが浮き彫りになります。</p>
        <div class="blog-link-box">
          <a href="../img_editor/index.html" class="blog-tool-link">［自作ツールを試す（/img_editor/index.html）］</a>
        </div>
      `,
      image: null
    },
    {
      id: '2',
      title: '骨董市でヘンテコな木箱を買った',
      date: '1ヶ月前の投稿',
      content: `
        <p>祖父の遺品整理の帰りに寄った骨董市で、古い「からくり箱」を購入。</p>
        <p>表面に何か模様が彫ってあるっぽいけど、真っ黒くずんでてよく分からない。</p>
      `,
      image: null
    },
    {
      id: '3',
      title: '体調が悪い／耳鳴りが止まらない',
      date: '1週間前の投稿',
      content: `
        <p>箱を買ってから部屋で変な音がする。開けようとすると頭痛がひどい。</p>
        <p>夢の中に変な数字や図形が出てくる。もう手元に置きたくない。</p>
        <p>明日、ヤミオクに出品して手放すことにする。</p>
      `,
      image: 'img/3.png'
    },
    {
      id: '4',
      title: '本日発送完了。これで解放される',
      date: '最後の投稿',
      content: `
        <p>最初の落札者に発送した。これで終わりだ。</p>
        <p>伝票の控えをデスクに置いた。もう二度とあの箱を見たくない。</p>
      `,
      image: 'img/4.png'
    }
  ];

  function getAllArticles() {
    // 最新記事が上にくるように降順取得
    return [...articles].reverse();
  }

  function getArticleById(id) {
    return articles.find(article => article.id === String(id));
  }

  return {
    getAllArticles,
    getArticleById
  };
})();

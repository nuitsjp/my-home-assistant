# My Home Assistant

[English](README.md) · **日本語**

Home Assistantの設定、機器連携、運用のナレッジをまとめるリポジトリーです。

[公開サイト](https://nuitsjp.github.io/my-home-assistant/)

- [XiaomiのBluetooth温湿度計をBTHome化する](docs/guides/mjwsd06mmc-bthome/index.md)
- [XiaomiのBluetooth温湿度計をBTHome化する英語版概要](docs/guides/mjwsd06mmc-bthome/overview.en.md)

## サイトを編集する

Node.js 22以降で依存関係をインストールし、開発サーバーを起動します。

```sh
npm ci
npm run docs:dev
```

新しい記事のMarkdownと画像を `docs/guides/` の下に置き、`docs/index.md` からリンクします。`npm run docs:build` で `dist/` に静的ファイルを生成し、`npm run docs:preview` で生成結果を確認できます。`main` の変更はGitHub ActionsでGitHub Pagesに公開されます。

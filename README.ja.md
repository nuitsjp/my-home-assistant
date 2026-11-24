# My Home Assistant

[English](README.md) · **日本語**

Home Assistantの設定や機器連携、運用の手順をまとめたリポジトリーです。

[公開サイト](https://nuitsjp.github.io/my-home-assistant/)

- [XiaomiのBluetooth温湿度計をBTHome化する](docs/guides/mjwsd06mmc-bthome/index.md)
- [XiaomiのBluetooth温湿度計をBTHome化する（英語版概要）](docs/guides/mjwsd06mmc-bthome/overview.en.md)

## サイトを編集する

Node.js 22以降を使い、依存パッケージをインストールして開発サーバーを起動します。

```sh
npm ci
npm run docs:dev
```

新しい記事と画像は `docs/guides/` 配下に置き、`docs/index.md` からリンクを追加します。`npm run docs:build` で `dist/` に静的ファイルを出力し、`npm run docs:preview` で表示を確認できます。`main` ブランチへの変更は、GitHub ActionsでGitHub Pagesに自動公開されます。

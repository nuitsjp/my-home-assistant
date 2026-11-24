# My Home Assistant

**English** · [日本語](README.ja.md)

A knowledge base for configuring, integrating, and operating Home Assistant.

[Published site](https://nuitsjp.github.io/my-home-assistant/)

- [Xiaomi MJWSD06MMC BTHome conversion guide](docs/guides/mjwsd06mmc-bthome/index.md) (Japanese)
- [Xiaomi MJWSD06MMC quick guide](docs/guides/mjwsd06mmc-bthome/overview.en.md) (English)

## Work on the site

With Node.js 22 or later, install the locked dependencies and start the development server.

```sh
npm ci
npm run docs:dev
```

Add new Markdown guides and their images under `docs/guides/`, then link to them from `docs/index.md`. Run `npm run docs:build` to generate the static site in `dist/` and `npm run docs:preview` to preview that build. GitHub Actions publishes changes to `main` to GitHub Pages.

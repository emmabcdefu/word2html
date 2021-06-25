# word2html

This is an app to transform word document to HTML initialy developed for ENTSOG.
This app has been build with Electron using Typescript with the framework React with some material-ui component.

## Instalation

First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/Tuddual/word2html your-project-name
cd your-project-name
yarn
```

## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package the app for windows:

```bash
electron-packager appdirectory appName --platform=win32 --arch=x64
```


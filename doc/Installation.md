# Installation and packaging

## Instalation for usage only

If you want to use this application without coding anything, you can download it on the [release page](https://github.com/Tuddual/word2html/releases) and extract files from the ZIP file to use it.

If you have any problem with the instalation, need a specific version or need the application for another os, please [create an issue](https://github.com/Tuddual/word2html/issues/new).

## Instalation for Development

### Windows

* This app is built with Node, so you'll need Node.js 14.0.0 (or newer) installed. Go to the [Node.js website](https://nodejs.org/) , download the latest version, open up the downloaded file, and follow the steps from the installer.

* Download the code with [git](https://git-scm.com/download/win) `git clone https://github.com/Tuddual/word2html` or download the lastest [ZIP file](https://github.com/Tuddual/word2html/archive/main.zip) or a [release version](https://github.com/Tuddual/word2html/releases) and extract all folders and files from the ZIP file.

* In main folder (`cd word2html`) install the dependencies with `yarn` (if yarn isn't installed, install it with `npm install -g yarn`)

If you have any problem with the instalation, please [create an issue](https://github.com/Tuddual/word2html/issues/new).

## Starting Development

Once all the installation is done, launch the project with `yarn start`.

## Packaging for Production

To package the app for windows:

* In main folder build the app with `yarn build`

* And then package the application with `electron-packager ./ appName --platform=win32 --arch=x64`
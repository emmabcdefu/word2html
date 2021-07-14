# word2html

![Code size](https://img.shields.io/github/languages/code-size/Tuddual/word2html)
![Downloads](https://img.shields.io/github/downloads/Tuddual/word2html/total)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Tuddual/word2html/CodeQL/main?label=CodeQL)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Tuddual/word2html/Test/main?label=Test)

## Description

This is an app to transform word document to HTML initialy developed for ENTSOG.
This app has been build with Electron using Typescript with the framework React with some material-ui component.

----

## Installation

### Installation for usage only

If you want to use this application without coding anything, you can download a version in assets on the [release page](https://github.com/Tuddual/word2html/releases) and extract files from the ZIP file to use it.

If you have any problem with the installation, need a specific version or need the application for another os, please [create an issue](https://github.com/Tuddual/word2html/issues/new).

### Installation for Development

#### Windows

* This app is built with Node, so you'll need Node.js 12.0.0 (or newer) installed. Go to the [Node.js website](https://nodejs.org/), download the latest version, open up the downloaded file, and follow the steps from the installer.
* Download the code with [git](https://git-scm.com/download/win) using the command `git clone https://github.com/Tuddual/word2html` or download the latest [ZIP file](https://github.com/Tuddual/word2html/archive/main.zip) or a [release version](https://github.com/Tuddual/word2html/releases) and extract all folders and files from the ZIP file.
* In the main folder (`cd word2html`) install the dependencies with `yarn`.

If you have any problem with the installation, please [create an issue](https://github.com/Tuddual/word2html/issues/new).

### Starting Development

Once all the installation is done, launch the project with  `yarn start`.

## Packaging

To package the app for windows:
* Before packaging the app I recommand to clean the `node_module` folder with [ModClean](https://github.com/ModClean/modclean) and/or [node-prune](https://github.com/tj/node-prune).
* In the main folder build the app with `yarn build`
* And then package the application with `electron-packager ./ appName --platform=win32 --arch=x64`

----

## Usage

[A wiki](https://github.com/Tuddual/word2html/wiki) has been created, that explain how to use the application, you should look at it !

## Credit 

All credit goes to [@tuddual](https://github.com/Tuddual).

## License

Tuddual/word2html is [MIT licensed](./LICENSE).

The Tuddual/word2html documentation (in the [wiki](https://github.com/Tuddual/word2html/wiki)) is [Creative Commons licensed](./LICENSE-docs).

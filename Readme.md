# HeroSpin mobile app

A hybrid mobile app developed with following features.

  - The app selects a super hero for you and suggests movies on the super hero. 
  - View details of the movie. 
  - Select your own favourite super hero.
 
### Version
1.0.0

### Tech

The following projects have been used in the development of this mobile app. 

* [Ionic] - Known as 'bootstrap' for hybrid mobile apps. Built on top of cordova.
* [AngularJS] - HTML enhanced for web apps! 
* [Gulp] - the streaming build system

### Installation

You will need Nodejs and NPM installed on the system. Head over to https://nodejs.org/ to install if you do not have it. 


Install ionic and cordova. 

```sh
$ npm install -g cordova ionic
```

Then you will need Gulp installed globally:

```sh
$ npm install -g gulp
```

```sh
$ ionic state reset
$ npm install
$ ionic build ios
$ ionic emulate ios
```
### Run in ios
Once the app is successfully build using `ionic build ios`. Open the project in xcode. And run it on your device. 

### Development

Want to contribute? Great!

Open your favorite Terminal and run these commands.

First Tab: This will watch all your JS files (see the task names watchjs in gulpfile.js) and build them.
```sh
$ gulp watchjs
```

Second Tab: This will serve a local copy for quick web development. 
```sh
$ ionic serve
```

(optional) Third: This will open the ios emulator to test it on device emulator. 
```sh
$ ionic emulate ios
```

### Todos

 - Write Tests


# Exemple d'application (Apache Cordova/jQuery Mobile)

## Sommaire

   * [Installation Apache Cordova](#installation-cordova)
   * [Application de démonstration](#application-gfiches)
  	 * [Démarrage](#demarrage)
	 * [Tests](#tests)

<a name="installation-cordova"/>

## Installation Apache Cordova

Lire le tutoriel : [installation-cordova.adoc](https://github.com/tvaira/cordova-jquery-mobile/raw/main/installation-cordova/installation-cordova.adoc) [[HTML](https://github.com/tvaira/cordova-jquery-mobile/raw/main/installation-cordova/build/installation-cordova.html) | [PDF](https://github.com/tvaira/cordova-jquery-mobile/raw/main/installation-cordova/build/installation-cordova.pdf)]

<a name="application-gfiches"/>

## Application gfiches

Ceci est juste une application de démonstration de mise en oeuvre de **[Apache Cordova](https://cordova.apache.org/)** et **[jQuery Mobile](https://jquerymobile.com/)** sous **Android/iOS**.

<a name="demarrage"/>

### Démarrage

```sh
$ git clone https://github.com/tvaira/cordova-jquery-mobile.git
$ cd cordova-jquery-mobile/gfiches
```

Installer les _plugins_ :

```sh
$ cordova plugin add cordova-sqlite-storage
$ cordova plugin add cordova-pdf-generator
$ cordova plugin add cordova-plugin-file
```

Liens vers les _plugins_ :

* [SQLite](https://github.com/storesafe/cordova-sqlite-storage)
* [pdf-generator](https://github.com/cesarvr/pdf-generator)
* [File](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)

<a name="tests"/>

### Tests

Pour Android :

```sh
$ cordova platform add android
$ cordova prepare

$ cordova build android --debug
$ cordova run android --device
```

![Android](https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-android.gif)

<img src="https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-android.gif" alt="Android" width="100" height="100">

Pour iOS :

```sh
$ cordova platform add ios
$ cordova prepare

$ cordova run ios --device
```

![iOS](https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-ios.gif)

<img src="https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-ios.gif" alt="iOS" width="90" height="90">

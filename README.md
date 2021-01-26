# Exemple d'application (Apache Cordova/jQuery Mobile)

## Sommaire

   * [Installation Apache Cordova](#installation-cordova)
   * [Application de démonstration](#application-gfiches)
  	 * [Démarrage](#demarrage)
	 * [Tests](#tests)
     * [Icônes de l'application](#icons)

<a name="installation-cordova"/>

## Installation Apache Cordova

Lire le tutoriel : [installation-cordova.adoc](https://github.com/tvaira/cordova-jquery-mobile/blob/main/installation-cordova/installation-cordova.adoc) [[HTML](./installation-cordova/build/installation-cordova.html) | [PDF](https://github.com/tvaira/cordova-jquery-mobile/raw/main/installation-cordova/build/installation-cordova.pdf)]

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

<img src="https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-android.gif" alt="Android" width="50%" height="50%">

Pour iOS :

```sh
$ cordova platform add ios
$ cordova prepare

$ cordova run ios --device
```

<img src="https://github.com/tvaira/cordova-jquery-mobile/raw/main/gfiches/screenshots/screenshot-ios.gif" alt="iOS" width="50%" height="50%">

<a name="icons"/>

### Icônes de l'application

Il existe un utilisaire qui assure le redimensionnement automatique des icônes pour Cordova : [cordova-icon](https://github.com/AlexDisler/cordova-icon)

Il faut créer une icône dans le dossier pour les ressources (par exemple `res/icons`) à la racine du projet Cordova. L'utilitaire la redimensionne et la copie automatiquement pour toutes les plates-formes prises en charge par le projet (cela fonctionne notamment pour Android et iOS).

Pour Android (sous Ubuntu) :

```sh
$ cd cordova-jquery-mobile/gfiches

$ sudo apt-get install imagemagick
$ npm install cordova-icon -g

$ cordova-icon --config=config.xml --icon=./res/icons/icon-android.png
```

_Remarque :_ les icônes de l'application Android seront copiés automatiquement dans `cordova-jquery-mobile/gfiches/platforms/android/app/src/main/res`

Pour iOS (sous Mac OS) :

```sh
$ cd cordova-jquery-mobile/gfiches

$ brew install imagemagick
$ npm install cordova-icon -g

$ cordova-icon --config=config.xml --icon=./res/icons/icon-ios.png
```

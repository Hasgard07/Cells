# Cells APP

> A starting point to work with the Cells App.

## Requirements

* [Git](https://git-scm.com/downloads) if you are going to clone the repository instead of download it.
* Install [NodeJS](https://nodejs.org/en/).
* Install [Bower](http://bower.io/).
* Install [sass gem](http://sass-lang.com/install).


## Getting started

To start working in the GloMob project, you need to follow these steps:

1. Create a project directory and move inside of it.
2. Clone or download the project into the directory created before.
3. Run `npm install`
4. Run `bower install`


### Usage

Once the project has been cloned or downloaded you can run in several ways.

#### Development mode (with mocks)

`gulp serve --config dev --mocks`


#### Production mode

`gulp serve` o `gulp serve --config pro`


#### Development workflow to deploy apps into Cordova Project

### Config project paths 

Open cordovaScripts.js in tasks folder and set the path where the Cordova project is located:

```sh
var CONTAINER_PATH = '/path/to/cordova/project/';
```

#### Deploy 

```sh
gulp deploy:cordova --config [prod/prod-mix/dev/qa]
```

This task build and copy all files from web app to www folder in Cordova Project.



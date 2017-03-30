[![Build Status](https://travis-ci.org/CDSappBuilders/The-Cordovizer.svg?branch=master)](https://travis-ci.org/CDSappBuilders/The-Cordovizer)

# The Cordovizer 

Please meet the Cordovizer, the first GUI tool exclusively dedicated to Cordova projects:
- Create and manage Cordova projects locally.
- Add/Remove core plugins online and offline.
- Install third-party plugins and reuse them online and offline.
- Edit config.xml file.
- Run, build and debug locally (you won't depend on any big firm server which Terms Of Use says: "Working on our server you give us all rights for all uses of your entire work...").
- Create keystores (Android build).
- Build signed apk for Play-Store distribution.
- Launch your favorite editor over your project.

## Warning
This is beta version (v0.1.0). So, you'll find bugs, little platform support and some other issues. Please, help us moving forward report any problem you'll find and feature requests in issues.

If you want to help more, see [contribute.md](./contribute.md).

## Getting started

### Use directly
Get the ZIP on our [website](http://www.cordovizer.cdswebbuilder.eu).

Unzip it and execute The-Cordovizer-beta-v0.1.0-yourPlatform.exe

```
Windows users: unzip at the root of your computer to avoid 'Run as admin' issue.
```


### Build it (NW.js for now)
Clone this repo run it with NW.js according to their [documentation](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/#write-nwjs-app): see step 3 "run your app".

Be sure to build with the SDK flavor, you won't have Devtools otherwise.

### Workflow
Suggested workflow:
- Create a new Cordova project:
    - Drag a folder containing your code, it must be at list one .html file inside.
    - or Click "Create blank project" which will create the basic "hellocordova" app.
- Add plugins you need, after reading their documentation (which is plugin repo README.md).
- Add platforms you want to build for, and their docs are avaible too, but some are not working for the moment so you will have to check [Cordova documentation](http://cordova.apache.org/docs/en/latest/) for requirements and quirks on each platform.
- Connect your favorite "testing" device or be sure you have got all emulators for the platform(s) you want to build for.
- Click "Run", You'll be able to run for platforms you installed.
- When it's running, click "Edit" that will launch your editor on current Cordova project.
- Click "Toggle to little remote window" which is little and stays on top of your editor window so you can re-run your project when editing.
- Click "Debug", also in little remote window, this will open "devices window" from devtools. There you'll be able to find your device or emulator. Just click on "inspect" under the one your working on.
- Click "build", you'll find build options for all platforms installed in your project. *Special treatment for Android, because for now we develloped around it. But don't be shy! You can help with knowledge or hard code*.
- Enjoy, and if you don't, please let us know.



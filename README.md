# angular-walkme

> An AngularJS module for interfacing with the WalkMe snippet API


## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Background

## Install

```
npm install @buildium/angular-walkme --save
```

## Usage

```javascript
angular.module('MyApp', ['buildium.angular-walkme'])

.config(function(AngularWalkMeProvider) {
    AngularWalkMeProvider.setEditorSnippetUrl('https://snippet/url')
})

.run(function(AngularWalkMe) {
    AngularWalkMe.addVariables(walkMeVariables);
    AngularWalkMe.runSnippet();
    AngularWalkMe.onWalkthroughCompleted(onWalkthroughCompleted);
})
```

## License

MIT © Buildium

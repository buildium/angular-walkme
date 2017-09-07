#!/usr/bin/env node

var path = require('path');
var buildiumAngularDocs = require('@buildium/angular-docs');
var ghPages = process.argv.indexOf('--gh-pages') !== -1;

buildiumAngularDocs({
    scripts: [
        '//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js'
    ],
    title: 'Buildium : Angular-WalkMes',
    sourceFiles: [
        path.join(__dirname, '../src/**/*.js')
    ],
    destination: path.join(__dirname, '../docs'),
    ghPages: ghPages
});
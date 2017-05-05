/* global angular */
'use strict';

const cloneDeep = require('lodash/cloneDeep');
const WalkMeWrapper = require('./wrapper');
const moduleName = 'buildium.angular-walkme';

/**
 * @ngdoc module
 * @name buildium.angular-walkme
 * @module buildium.angular-walkme
 */
angular.module(moduleName, [])

/**
 * @ngdoc provider
 * @name AngularWalkMeProvider
 */
.provider('AngularWalkMe', function AngularWalkMeProvider () {
  const provider = this;
  let editorSnippetUrl;

    /**
     * @ngdoc method
     * @name AngularWalkMeProvider#setEditorSnippetUrl
     * @param {String} url - the snippet url from the WalkMe editor
     */
  provider.setEditorSnippetUrl = function setEditorSnippetUrl (url) {
    editorSnippetUrl = url;
  };

    /**
     * @ngdoc service
     * @name AngularWalkMe
     */
  provider.$get = function AngularWalkMeFactory () {
    const factory = cloneDeep(WalkMeWrapper);

        /**
         * @ngdoc method
         * @name AngularWalkMe#runSnippet
         * @description
         * Runs a piece of javascript code that allows WalkMe to run in the application
         */
    factory.runSnippet = function runSnippet () {
      WalkMeWrapper.runSnippet(editorSnippetUrl);
    };

    return factory;
  };
});

module.exports = moduleName;

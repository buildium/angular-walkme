const expect = require('chai').expect;
const angular = require('angular');
require('angular-mocks');
const moduleName = require('../src/module');

describe('AngularWalkMe', () => {
  beforeEach(angular.mock.module(moduleName));

  describe('AngularWalkMeProvider', () => {
    let AngularWalkMeProvider;

    beforeEach(angular.mock.module((_AngularWalkMeProvider_) => {
      AngularWalkMeProvider = _AngularWalkMeProvider_;
    }));

    describe('setEditorSnippetUrl', () => {
      it('should exist', () => {
        console.warn(AngularWalkMeProvider);
        expect(AngularWalkMeProvider).to.respondTo('setEditorSnippetUrl');
      });
    });
  });
});

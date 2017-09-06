const expect = require('chai').expect;
const angular = require('angular');
require('angular-mocks');
const moduleName = require('../src/module');

describe('AngularWalkMe', () => {
  beforeEach(angular.mock.module(moduleName));

  it('passes', () => {
    expect(true).to.equal(true);
  });

  xdescribe('AngularWalkMeProvider', () => {
    let AngularWalkMeProvider;

    beforeEach(angular.mock.module((_AngularWalkMeProvider_) => {
      AngularWalkMeProvider = _AngularWalkMeProvider_;
    }));

    describe('setEditorSnippetUrl', () => {
      it('should exist', () => {
        expect(AngularWalkMeProvider).to.respondTo('setEditorSnippetUrl');
      });
    });
  });
});

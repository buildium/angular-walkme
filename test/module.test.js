const chai = require('chai');
const angular = require('angular');
require('angular-mocks');
const moduleName = require('../src/module');
chai.use(require('dirty-chai'));

const expect = chai.expect;

describe('AngularWalkMe', () => {
  beforeEach(angular.mock.module(moduleName));

  describe('AngularWalkMeProvider', () => {
    let AngularWalkMeProvider;

    beforeEach(() => {
      angular.mock.module(_AngularWalkMeProvider_ => {
        AngularWalkMeProvider = _AngularWalkMeProvider_;
      });

      angular.mock.inject(AngularWalkMe => {});
    });

    describe('setEditorSnippetUrl', () => {
      it('should exist', () => {
        expect(AngularWalkMeProvider).to.respondTo('setEditorSnippetUrl');
      });
    });
  });

  describe('AngularWalkMe', () => {
    let AngularWalkMe;

    beforeEach(angular.mock.inject((_AngularWalkMe_) => {
      AngularWalkMe = _AngularWalkMe_;
    }));

    it('should exist', () => {
      expect(AngularWalkMe).to.exist();
    });
  });
});

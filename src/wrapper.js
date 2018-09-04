/* globals WalkMeAPI, _walkMe */
'use strict';

const Promise = require('es6-promise').Promise;
const assign = require('lodash/assign');
const find = require('lodash/find');
const findLast = require('lodash/findLast');
const sortBy = require('lodash/sortBy');

const wrapper = {};
const API_LOAD_INTERVAL = 500;
const API_LOAD_ATTEMPTS = 120;
let isLoadedPromise;

const StepType = {
  Step: 0,
  PopupStep: 1,
  SuperStep: 2
};

wrapper.Event = {
  AfterMenuClose: 'AfterMenuClose',
  AfterMenuOpen: 'AfterMenuOpen',
  BBCodeLinkClicked: 'BBCodeLinkClicked',
  BackButtonClicked: 'BackButtonClicked',
  BalloonCreated: 'BalloonCreated',
  BeforeMenuClose: 'BeforeMenuClose',
  BeforeMenuOpen: 'BeforeMenuOpen',
  DoneButtonClicked: 'DoneButtonClicked',
  LauncherClicked: 'LauncherClicked',
  LauncherIsShown: 'LauncherIsShown',
  NextButtonClicked: 'NextButtonClicked',
  NextStepShown: 'NextStepShown',
  PlayerInitComplete: 'PlayerInitComplete',
  SurveyPlayed: 'SurveyPlayed',
  SurveyCompleted: 'SurveyCompleted',
  TaskCompleted: 'TaskCompleted',
  TasksLoaded: 'TasksLoaded',
  UserStoppedWalkthru: 'UserStoppedWalkthru',
  UserStoppedWalkthruAfterStop: 'UserStoppedWalkthruAfterStop',
  WalkthruAborted: 'WalkthruAborted',
  WalkthruFailedToStart: 'WalkthruFailedToStart',
  WalkthruSelected: 'WalkthruSelected'
};

let afterApiLoad = function afterApiLoad (fn) {
  if (!isLoadedPromise) {
    isLoadedPromise = new Promise(function isLoaded (resolve, reject) {
      let count = 1;
      let interval = setInterval(() => {
        if (typeof WalkMeAPI !== 'undefined') {
          resolve(true);
          clearInterval(interval);
        } else if (count === API_LOAD_ATTEMPTS) {
          reject(new Error(false));
          clearInterval(interval);
        }
        count++;
      }, API_LOAD_INTERVAL);
    });
  }

  return function isLoaded () {
    let args = arguments;
    return isLoadedPromise.then(() => fn.apply(null, args)).catch(() => false);
  };
};

wrapper.runSnippet = function runSnippet (walkmeSnippetUrl) {
  let walkme = document.createElement('script');
  let script;
  walkme.type = 'text/javascript';
  walkme.async = true;
  walkme.src = walkmeSnippetUrl;
  script = document.getElementsByTagName('script')[0];
  script.parentNode.insertBefore(walkme, script);
  window._walkmeConfig = { smartLoad: true };
};

wrapper.startWalkthrough = afterApiLoad(function (id) {
  WalkMeAPI.startWalkthruById(id);
});

wrapper.isLoaded = afterApiLoad(() => true);

wrapper.startVisionsRecording = function startVisionsRecording() {
  if(WalkMeInsightsAPI) {
    WalkMeInsightsAPI.startPlaybackRecording()
  } else {
    throw "Visions API not loaded.";
  }
};

let eventSubscribers = Object.keys(wrapper.Event).reduce((subscribers, event) => {
  subscribers[event] = [];
  return subscribers;
}, {});

/**
 * Listen to a WalkMe event
 *
 * @param  {String} eventName - the WalkMe event
 * @param  {Function} handler - the method to execute when this event is received
 */
wrapper.on = afterApiLoad(function (eventName, handler) {
  window.menu_event = window.menu_event || function onMenuEvent (eventData) {
    eventSubscribers[eventData.Type].forEach(subscriber => {
      subscriber(eventData);
    });
  };

  window.walkme_event = window.walkme_event || function onWalkMeEvent (eventData) {
    eventSubscribers[eventData.Type].forEach(subscriber => {
      subscriber(eventData);
    });
  };

  eventSubscribers[eventName].push(handler);
});

const lastStepMemo = {};
function isLastStep (walkthruId, stepIndex) {
  if (walkthruId in lastStepMemo) {
    return lastStepMemo[walkthruId] === stepIndex;
  }

  let isUndocumentedApiAvailable = _walkMe && typeof _walkMe.getTutorials === 'function';

  if (isUndocumentedApiAvailable) {
    let tutorial = find(_walkMe.getTutorials(), {Id: walkthruId});
    let sortedSteps = sortBy(tutorial.Steps, 'StepIndex');
    let lastStep = tutorial && findLast(sortedSteps, step => {
      return !step.IsSkippable && step.Status === 1 && step.Type !== StepType.SuperStep;
    });

    if (typeof lastStep !== 'undefined') {
      lastStepMemo[walkthruId] = lastStep.StepIndex;
      return lastStep.StepIndex === stepIndex;
    }
  }

  return false;
}

wrapper.onWalkthroughCompleted = function onWalkthroughCompleted (handler) {
  function onAllStepsFinished (eventData) {
    if (isLastStep(eventData.WalkthruId, eventData.StepIndex)) {
      handler(eventData);
    }
  }

  wrapper.on(wrapper.Event.TaskCompleted, handler);
  wrapper.on(wrapper.Event.NextButtonClicked, onAllStepsFinished);
  wrapper.on(wrapper.Event.DoneButtonClicked, onAllStepsFinished);
};

/**
 * addVariables attaches a "CustomWalkMeCompanyVariables" object
 * to window with the given values.
 *
 * This method can be called multiple times and the new variables
 * will be merged with the existing variables
 *
 * @param {Object} variables - a map of variable name to value
 */
wrapper.addVariables = function addVariables (variables) {
  window.CustomWalkMeCompanyVariables = assign(window.CustomWalkMeCompanyVariables, variables);
};

module.exports = wrapper;

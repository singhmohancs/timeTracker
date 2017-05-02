/**
 * @ngdoc module
 * @name TrackerApp
 *
 * @module app
 *
 * @description
 * An application to track work
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('TrackerApp', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'LocalStorageModule'
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          template: '<time-tracker></time-tracker>'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
})();

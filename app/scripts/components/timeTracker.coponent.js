/**
 * @ngdoc Component
 * @name TrackerApp.component.timeTracker
 *
 * @module TrackerApp
 *
 * @description
 * A reusable component to track working hours
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('TrackerApp')
    .component('timeTracker', {
      template: `<div class="wrapper"> 
          <div class="panel panel-default text-center timer-container">
            <div class="panel-body">
              <div class="timer-content">
                <h3><span>{{$ctrl.timer.hours}}</span> : <span>{{$ctrl.timer.minutes}}</span> : <span>{{$ctrl.timer.seconds}}</span> : <span>{{$ctrl.timer.milliseconds}}</span> </h3>
              </div>
            </div>
            <div class="panel-footer text-muted">
            <div class="btn-group btn-group-justified" role="group">
              <div class="btn-group btn-group-lg" role="group">
                <button type="button" class="btn btn-default" ng-click="$ctrl.start()" data-ng-show="!$ctrl.isRunning"><span class="glyphicon glyphicon-play"  aria-hidden="true"></span> Play</button>
                  <button type="button" class="btn btn-default" ng-click="$ctrl.stop()" data-ng-show="$ctrl.isRunning"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span> Pasue</button>
              </div>
              <div class="btn-group btn-group-lg" role="group">
                <button class="btn btn-default" type="button" ng-click="$ctrl.saveWorklog()"><span class="glyphicon glyphicon-time" aria-hidden="true"></span></button>
              </div>
              <div class="btn-group btn-group-lg" role="group">
                <button type="button" class="btn btn-default" ng-click="$ctrl.reset()"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
              </div>
            </div>
            </div>
        </div>
        <div class="panel panel-default worklog-container" data-ng-if="$ctrl.worklogs.length">
          <div class="panel-body">
            <ul class="list-group">
              <li class="list-group-item" data-ng-repeat="worklog in $ctrl.worklogs track by $index"><span>{{worklog.hours}}</span> : <span>{{worklog.minutes}}</span> : <span>{{worklog.seconds}}</span> : <span>{{worklog.milliseconds}}</span> <button class="btn btn-xs btn-danger btn-remove pull-right" data-ng-click="$ctrl.deleteWorklog($index)">Remove</button></li>
            </ul>
          </div>
        </div>
      </div>`,
      bindings: {},
      require: {},
      controller: [
        '$log',
        'localStorageService',
        '$interval',
        '$scope',
        function ($log, localStorageService, $interval,$scope) {
          var $ctrl = this,
            timer_segments = {
              hours: 0,
              minutes: 0,
              seconds: 0,
              milliseconds: 0
            },
            timerInstance;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;
          $ctrl.$onDestroy = onDestroy;
          $ctrl.$onChanges = onChanges;

          /**
           * public methods
           */
          $ctrl.start = start;
          $ctrl.stop = stop;
          $ctrl.reset = reset;
          $ctrl.saveWorklog = saveWorklog;
          $ctrl.deleteWorklog = deleteWorklog;
          /**
           * public properties
           */
          /**
           * @function
           * @name initialization
           * @description
           * A component's lifeCycle hook which is called after all the controllers on an element have
           * been constructed and had their bindings initialized
           */
          function initialization() {
            if (!localStorageService.get('timerObj')) {
              localStorageService.set('timerObj', timer_segments)
            }
            $ctrl.timer = localStorageService.get('timerObj');
            $ctrl.isRunning = localStorageService.get('isRunning') || false;
            $ctrl.worklogs = localStorageService.get('worklogs') || [];
            if ($ctrl.isRunning) {
              start();
            }
          }

          /**
           * @function
           * @name onChanges
           * @description
           * A component's lifeCycle hook which is called when bindings are updated.
           */
          function onChanges(bindings) { }
          /**
           * @function
           * @name onDestroy
           * @description
           * A component's lifeCycle hook which is called when is called on a controller when its containing scope is destroyed.
           * Usefull to release external resources, watches and event handlers.
           */
          function onDestroy() { }


          function start() {
            setTimerState(true);
            timerInstance = $interval(function () {
              $ctrl.timer.milliseconds = $ctrl.timer.milliseconds + 1;
              if ($ctrl.timer.milliseconds === 100) {
                $ctrl.timer.seconds = $ctrl.timer.seconds + 1;
                $ctrl.timer.milliseconds = 0;
                if ($ctrl.timer.seconds === 60) {
                  $ctrl.timer.minutes = $ctrl.timer.minutes + 1;
                  $ctrl.timer.seconds = 0;
                  if ($ctrl.timer.minutes === 60) {
                    $ctrl.timer.hours = $ctrl.timer.hours + 1;
                    $ctrl.timer.minutes = 0;
                  }
                }
              }
              localStorageService.set('timerObj', angular.copy($ctrl.timer));
            }, 10);
          }

          function setTimerState(flag) {
            $ctrl.isRunning = flag;
            localStorageService.set('isRunning', flag);
          }
          function stop() {
            if (angular.isDefined(timerInstance)) {
              $interval.cancel(timerInstance);
              setTimerState(false)
            }
          }

          function reset() {
            $ctrl.timer = angular.copy(timer_segments);
            localStorageService.set('timerObj', $ctrl.timer);
          }

          function saveWorklog() {
            $ctrl.worklogs.push(angular.copy($ctrl.timer));
            localStorageService.set('worklogs', $ctrl.worklogs);
          }

          function deleteWorklog(index) {
            $ctrl.worklogs.splice(index, 1);
            localStorageService.set('worklogs', $ctrl.worklogs);
          }

          $scope.$watch(function(){
            return localStorageService.get('isRunning');
          }, function(newValue, oldValue){
            if(newValue === oldValue){
              return;
            }
            console.log(newValue);
            if(newValue){
              start();
            }else{
              stop();
            }
          });


        }
      ]
    });

})();
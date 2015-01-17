'use strict';


angular.module('ActivityLogger')
    .controller('ActivityCtrl',
        function($scope, $state, $stateParams, $ionicPopup, DataService, Activity) {
            // init values
            $scope.timerHours = 0;
            $scope.timerMinutes = 0;
            $scope.timerSeconds = 0;

            $scope.timerIsOn = false;

            // starts (or resumes) timer
            $scope.startTimer = function() {
                $scope.startStamp = new Date().getTime();

                if ($scope.timerIsOn !== true) {
                    $scope.timerIsOn = true;

                    $scope.timer = setInterval(function() {
                        if ($scope.timerSeconds === 59) {
                            if ($scope.timerMinutes === 59) {
                                /* increment hour */
                                $scope.timerHours++;
                                $scope.timerMinutes = 0;
                                $scope.timerSeconds = 0;

                            } else {
                                /* just one minute more */
                                $scope.timerMinutes++;
                                $scope.timerSeconds = 0;
                            }
                        } else {
                            $scope.timerSeconds++;
                        }
                        $scope.$digest();
                    }, 1000);
                }
            };

            // pauses the timer
            $scope.stopTimer = function() {
                if ($scope.timerIsOn === true) {
                    $scope.endStamp = new Date().getTime();
                    $scope.timerIsOn = false;

                    clearInterval($scope.timer);
                }
            };

            // resets all timer vars
            $scope.resetTimer = function() {
                if ($scope.timerIsOn === true) {
                    $scope.timerIsOn = false;

                    clearInterval($scope.timer);
                }

                $scope.startStamp = 0;
                $scope.endStamp = 0;
                $scope.timerHours = 0;
                $scope.timerMinutes = 0;
                $scope.timerSeconds = 0;
            };

            // shows popup and aborts if affirmative
            $scope.abortActivity = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Abort Activity',
                    template: 'Are you sure you want to abort your activity?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.resetTimer();
                        $state.go('tab.main');
                    }
                });
            };

            $scope.finishAcitivity = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Finish Activity',
                    template: 'Are you sure you want to finish your activity?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.stopTimer();
                        // TODO: save
                        var activity = new Activity(1, $stateParams.type, 4, 8, 'trackdaten', $stateParams.comment);
                        DataService.addActivity(activity);

                    }
                });
            };

            // start the timer on initialization
            $scope.startTimer();
        });
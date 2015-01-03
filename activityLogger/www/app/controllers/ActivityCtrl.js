'use strict';


angular.module('ActivityLogger')
    .controller('ActivityCtrl', ['$scope',
        function($scope) {
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
            }

            // pauses the timer
            $scope.stopTimer = function() {
                if ($scope.timerIsOn === true) {
                    $scope.endStamp = new Date().getTime();
                    $scope.timerIsOn = false;

                    clearInterval($scope.timer);
                }
            }

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
            }

            // shows popup and aborts if affirmative
            $scope.abortActivity = function() {
                // TODO: maybe show popup?
                $scope.resetTimer();

            }

            $scope.finishAcitivity = function() {
                $scope.stopTimer();
                // TODO: "really finish off" popup
            }

            // start the timer on initialization
            $scope.startTimer();
        }
    ]);
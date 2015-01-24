'use strict';


angular.module('ActivityLogger')
    .controller('ActivityCtrl',
        function($scope, $state, $stateParams, $ionicPopup, DataService,
            GeoLocationService, Activity) {
            var thisCtrl = this;

            var data = [];
            var path = []; // for google map

            // timer setup
            // init values
            $scope.timerHours = 0;
            $scope.timerMinutes = 0;
            $scope.timerSeconds = 0;

            $scope.timerIsOn = false;

            // location values
            $scope.totalDistance = 0;

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

                thisCtrl.setupGeolocationWatcher();
            };

            /**
             * @description Stop the timer interval and geolocation watcher.
             */
            $scope.stopTimer = function() {
                if ($scope.timerIsOn === true) {
                    $scope.endStamp = new Date().getTime();
                    $scope.timerIsOn = false;

                    clearInterval($scope.timer);
                    GeoLocationService.stop();
                }
            };

            /**
             * @description Reset all timer vars to zero and clear the
             * timer interval.
             */
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

            /**
             * @description Show popup to confirm the cancelation of the
             * activity. If confirmed all data gets deleted and the
             * app will return to the main view.
             */
            $scope.abortActivity = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Abort Activity',
                    template: 'Are you sure you want to abort your activity?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.resetTimer();
                        GeoLocationService.stop();

                        $state.go('tab.main');
                    }
                });
            };

            /**
             * @description Show popup to confirm the finishing of the activity.
             * If confirmed, all timers and watchers are
             * halted and cleaned and the activity will be saved. Otherwise
             * everything will continue as if nothing happened. The app
             * then will go to the workout list to show the newly created workout.
             */
            $scope.finishAcitivity = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Finish Activity',
                    template: 'Are you sure you want to finish your activity?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.stopTimer();
                        GeoLocationService.stop();

                        var activity = new Activity(1, $stateParams.type,
                            4, 8, data, $stateParams.comment);
                        DataService.addActivity(activity);
                        $state.go('tab.workoutlist');
                    }
                });
            };

            /**
             * @description Set up the map and draw the new data as path
             * 
             * @param  {Array} data as returned by GeoLocationService
             */
            this.refreshMap = function(data) {
                var options = {
                    zoom: 14,
                    center: path[path.length - 1],
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById("map-canvas"),
                    options);

                var polyline = new google.maps.Polyline({
                    map: map,
                    path: path,
                    strokeColor: '#3876E1',
                    strokeOpacity: 0.9,
                    strokeWeight: 10
                });
            }

            /**
             * @description Set up the geo location watcher
             */
            this.setupGeolocationWatcher = function() {
                GeoLocationService.start(function(position) {
                    var coords = position.coords;

                    path.push(new google.maps.LatLng(
                        coords.latitude,
                        coords.longitude));

                    data.push(position);

                    if (data.length > 1) {
                        $scope.totalDistance = google.maps.geometry.spherical.computeLength(path);
                        thisCtrl.refreshMap(data);
                    }
                }, function(err) {
                    alert(err);
                });
            }

            this.setupGeolocationWatcher();

            // start the timer on initialization
            $scope.startTimer();
        });
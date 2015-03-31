/**
 * @author Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .controller('ActivityCtrl',
            function($scope, $state, $stateParams, $ionicPopup, MockDataService,
                GeoLocationService, Activity) {
                // for referencing this later in anonymous functions
                var thisCtrl = this;

                this.competitionMode = $stateParams.competitionID ? true : false;
                this.competitionID = $stateParams.competitionID;
                this.competition = MockDataService.getCompetitionById(this.competitionID);

                if (this.competitionMode) {
                    var opponentActivityID = this.competition.activity_id1 || this.competition.activity_id2;

                    // both activity ids are null if the competition was newly created
                    if (opponentActivityID !== null) {
                        var opponentActivity = MockDataService.getActivityByID(opponentActivityID);

                        this.opponentPath = [];

                        for (var i = 0; i < opponentActivity.track_data.length; i++) {
                            var coords = opponentActivity.track_data[i].coords;

                            this.opponentPath.push(new google.maps.LatLng(
                                coords.latitude,
                                coords.longitude));
                        }
                    }
                }

                // for saving the activity.
                // not to confuse with `startStamp` which is only internally used
                var startedTimeStamp = new Date().getTime();

                // array of raw position data as returned by geo location watcher
                var data = [];

                // for google map
                var path = [];

                // timer setup
                // init values
                $scope.timerHours = 0;
                $scope.timerMinutes = 0;
                $scope.timerSeconds = 0;

                $scope.timerIsOn = false;

                // location values
                $scope.totalDistance = 0;

                $scope.speed = 0;

                /**
                 * @description Setup timer to display the elapsed time.
                 * Also the geo location watcher gets set up.
                 */
                $scope.startTimer = function() {
                    $scope.startStamp = new Date().getTime();

                    if ($scope.timerIsOn !== true) {
                        $scope.timerIsOn = true;

                        $scope.timer = setInterval(function() {
                            // if in competition mode: stop 
                            if (this.competitionMode) {
                                var now = new Date.getTime();

                                if ((now - this.startedTimeStamp) >= this.competition.duration) {
                                    $scope.finishAcitivity();
                                }
                            }

                            if ($scope.timerSeconds === 59) {
                                if ($scope.timerMinutes === 59) {
                                    // increment hour
                                    $scope.timerHours++;
                                    $scope.timerMinutes = 0;
                                    $scope.timerSeconds = 0;

                                } else {
                                    // just one minute more
                                    $scope.timerMinutes++;
                                    $scope.timerSeconds = 0;
                                }
                            } else {
                                $scope.timerSeconds++;
                            }
                            // force time redraw
                            $scope.$digest();
                        }, 1000);
                    }

                    thisCtrl.setupGeolocationWatcher();
                };

                /**
                 * @description Stop the timer interval and geo location watcher.
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
                $scope.finishActivity = function() {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Finish Activity',
                        template: 'Are you sure you want to finish your activity?'
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            $scope.stopTimer();
                            GeoLocationService.stop();

                            var activity = new Activity(1, $stateParams.type,
                                startedTimeStamp, new Date().getTime(), data,
                                $stateParams.comment, $scope.totalDistance, MockDataService.getCurrentUserId());
                            var activityID = MockDataService.addActivity(activity);

                            if (thisCtrl.competitionMode) {
                                var comp = MockDataService.getCompetitionById(thisCtrl.competitionID);
                                
                                if (comp.activity_id1 == null)
                                    comp.activity_id1 = activityID;
                                else
                                    comp.activity_id2 = activityID;

                                MockDataService.updateCompetition(thisCtrl.competitionID, comp);
                            }
                            
                            $state.go('tab.workoutlist');
                        }
                    });
                };

                /**
                 * @description Set up the map and draw the new position data as path
                 */
                this.refreshMap = function() {
                    // set up options of the map provided by google
                    var options = {
                        zoom: 14,
                        // center map at current location
                        center: path[path.length - 1],
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    // get handle of `map-canvas`
                    var map = new google.maps.Map(document.getElementById("map-canvas"),
                        options);

                    if (this.competitionMode) {
                        var opponentPolyline = new google.maps.Polyline({
                            map: map,
                            path: this.opponentPath,
                            strokeColor: '#F51C2C',
                            stroleOpacity: 0.5,
                            strokeWeight: 6
                        });
                    }

                    // draw location path to map
                    var polyline = new google.maps.Polyline({
                        map: map,
                        path: path,
                        strokeColor: '#3876E1',
                        strokeOpacity: 0.9,
                        strokeWeight: 10
                    });
                }

                /**
                 * @description Set up the geo location watcher that subscribes to
                 * changes to the users geo location
                 */
                this.setupGeolocationWatcher = function() {
                    GeoLocationService.start(function(position) {
                        var coords = position.coords;

                        // add location to path for displaying it on the map
                        path.push(new google.maps.LatLng(
                            coords.latitude,
                            coords.longitude));

                        data.push(position);

                        // the map should only be touched if there are at
                        // least two data points so that a path can be drawn
                        if (data.length > 1) {
                            $scope.totalDistance = google.maps
                                .geometry.spherical.computeLength(path);

                                // save speed as km/m (is km/s)
                                var speed = Number($scope.totalDistance) /
                                ((data[data.length - 1].timestamp - data[0].timestamp) / 60);
                                $scope.speed = speed;
                        }

                        // draw the map
                        thisCtrl.refreshMap();
                    }, function(err) {
                        // do nothing for now
                    });
                }

                // start the timer on initialization
                $scope.startTimer();
            });
})();
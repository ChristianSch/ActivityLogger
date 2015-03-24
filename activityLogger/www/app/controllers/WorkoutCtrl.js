/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular.module('ActivityLogger')
        .controller('WorkoutCtrl',
        function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup, $window, MockDataService, Activity) {
            var wCtrl = this;
            var elevationSamples = 250;
            var elevationData = [];
            var elevator;
            var map;
            var polyline;
            var thisActivity;

            this.activityTypes = [{
                id: 1,
                label: 'Run'
            }, {
                id: 2,
                label: 'Bike'
            }];
            this.isEditMode = false;
            if ($stateParams.id == 'new') {
                $ionicNavBarDelegate.setTitle('New Activity');
                this.activity = new Activity(0, this.activityTypes[0], 0, 0, [], "", 0, 0);
                this.activity.userId = MockDataService.getCurrentUserId();

            } else {
                this.isEditMode = true;
                $ionicNavBarDelegate.setTitle('Activity ' + $stateParams.id);
                this.activity = MockDataService.getActivityByID($stateParams.id);
                console.log(this.activity);
            }
            thisActivity = this.activity;
            /**
             * @description Saves the currently edited Activity.
             */
            this.save = function() {
                this.activity.type = this.activity.type.label;
                MockDataService.addActivity(this.activity);
                $ionicNavBarDelegate.back();
            };

            /**
             * @description Deletes the currently edited Activity.
             */
            this.remove = function() {
                var confirmPopup = $ionicPopup.confirm({
                    template: 'Do you really want to delete this Activity?',
                    cancelText: 'Cancel',
                    okText: 'Delete'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        MockDataService.removeActivity(thisActivity.id);
                        $ionicNavBarDelegate.back();
                    }
                });
            };
            /**
             * @description Shows the Elevation for the currently shown Activity.
             */
            this.showElevation = function() {
                var elevationChart;
                var chartOptions;
                var ctx;
                var scala = [];

                for(var i = 0; i < elevationSamples; i++) {
                    scala.push("");
                }
                chartOptions = {
                    scaleLineWidth: 2,
                    scaleShowVerticalLines: false,
                    showTooltips: false,
                    dataSetStroke: false,
                    pointDot: false,
                    responsive: true
                };

                elevationChart = {
                    labels : scala,
                    datasets : [ {
                        label : "Elevation",
                        fillColor : "rgba(220,220,220,0.2)",
                        strokeColor : "rgba(220,220,220,1)",
                        pointColor : "rgba(220,220,220,1)",
                        pointStrokeColor : "#fff",
                        pointHighlightFill : "#fff",
                        pointHighlightStroke : "rgba(220,220,220,1)",
                        data : elevationData
                    } ]
                };

                ctx = document.getElementById("elevation_profile").getContext("2d");
                $window.myLine = new Chart(ctx).Line(elevationChart, chartOptions);
            };

            /**
             * @description Initiates the map on the first TrackRecord or a default Centre.
             */
            function init() {
                var initial_Position;
                var mapOptions;

                if(thisActivity.track_data.length > 0) {
                    initial_Position = thisActivity.track_data[0];
                    mapOptions = {
                        center: new google.maps.LatLng(initial_Position.coords.latitude, initial_Position.coords.longitude),
                        zoom: 10,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                } else {
                    // Default initial Position
                    mapOptions = {
                        center: new google.maps.LatLng(50.5851, 8.6841),
                        zoom: 10,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                }


                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

                if(thisActivity.track_data.length > 0) {
                    elevator = new google.maps.ElevationService();
                    drawPath();
                }
            }

            /**
             * @description Draws the currently shown Activity to GoogleMaps.
             */
            function drawPath() {
                var position;
                var path = [];

                for(var i = 0; i < thisActivity.track_data.length; i++) {
                    position = thisActivity.track_data[i];
                    path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                }

                // Create a PathElevationRequest object using this array.
                var pathRequest = {
                    'path': path,
                    'samples': elevationSamples
                };

                // Initiate the path request.
                elevator.getElevationAlongPath(pathRequest, computeElevation);
            }

            /**
             * @description Callback Method to compute the Elevation for the currently shown Activity.
             * @param results {Array} Array with the results of the elevation
             * @param status {status} Returned Status from GoogleMapsAPI. OK if everything went fine.
             */
            function computeElevation(results, status) {
                if (status != google.maps.ElevationStatus.OK) {
                    return;
                }
                var elevations = results;

                // Extract the elevation samples from the returned results
                // and store them in an array of LatLngs.
                var elevationPath = [];
                for (var i = 0; i < results.length; i++) {
                    elevationPath.push(elevations[i].location);
                    elevationData.push(elevations[i].elevation);
                }

                // Display a polyline of the elevation path.
                var pathOptions = {
                    path: elevationPath,
                    strokeColor: '#0000CC',
                    opacity: 0.4,
                    map: map
                };
                polyline = new google.maps.Polyline(pathOptions);
                wCtrl.showElevation();
            }

            //Show GooogleMaps only if it's a persisted Activity
            if(this.isEditMode) {
                google.maps.event.addDomListener(window, 'load', init());
            }
        });
})();
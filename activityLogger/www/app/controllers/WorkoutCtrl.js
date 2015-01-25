/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular.module('ActivityLogger')
        .controller('WorkoutCtrl',
        function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup, $window, DataService, Activity) {
            var wCtrl = this;
            var elevationSamples = 200;
            var elevationData = [];
            var elevator;
            var map;
            var polyline;

            this.isEditMode = false;
            if ($stateParams.id == 'new') {
                $ionicNavBarDelegate.setTitle('Neue Activity');
                this.activity = {};
                this.activity.user_id = DataService.getCurrentUserId();
            } else {
                this.isEditMode = true;
                $ionicNavBarDelegate.setTitle('Activity ' + $stateParams.id);
                this.activity = DataService.getActivityByID($stateParams.id);
            }
            /**
             * @description Saves the currently edited Activity.
             */
            this.save = function() {
                DataService.addActivity(activity);
                $ionicNavBarDelegate.back();
            };

            var thisActivity = this.activity;

            /**
             * @description Deletes the currently edited Activity.
             */
            this.remove = function() {
                var confirmPopup = $ionicPopup.confirm({
                    template: 'Wollen Sie die Aktivität wirklich löschen?',
                    cancelText: 'Abbrechen',
                    okText: 'Löschen'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        console.log("Delete");
                        DataService.removeActivity(thisActivity.id);
                        $ionicNavBarDelegate.back();
                    } else {
                        console.log("Do not delete");
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
                if(thisActivity.track_data.track_records.length > 0) {
                    initial_Position = thisActivity.track_data.track_records[0];
                } else {
                    // Default initial Position
                    initial_Position = new TrackRecord(50.5851, 8.6841, 0, 0);
                }
                var mapOptions = {
                    center: new google.maps.LatLng(initial_Position.latitude, initial_Position.logitude),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

                if(thisActivity.track_data.track_records.length > 0) {
                    elevator = new google.maps.ElevationService();

                    // google.maps.event.addListener(map, 'click', getElevation);

                    drawPath();
                }
            }

            /**
             * @description Draws the currently shown Activity to GoogleMaps.
             */
            function drawPath() {
                var path = [];

                for(var i = 0; i < thisActivity.track_data.track_records.length; i++) {
                    path.push(new google.maps.LatLng(thisActivity.track_data.track_records[i].latitude, thisActivity.track_data.track_records[i].logitude));
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
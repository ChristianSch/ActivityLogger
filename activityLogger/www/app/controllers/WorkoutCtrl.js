/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular.module('ActivityLogger')
        .controller('WorkoutCtrl',
        function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup, $window, Track, TrackRecord, Activity) {
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
                //this.activity.id = localStorage.getItem('nextActivityId');
                //this.activity.user_id = DataService.getUserProfil();
            } else {
                this.isEditMode = true;
                $ionicNavBarDelegate.setTitle('Activity ' + $stateParams.id);
                //this.activity = DataService.getActivityById($stateParams.id);

                if($stateParams.id == 1) {
                    var track1 = new Track();
                    track1.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));
                    track1.addTrackRecord(new TrackRecord(50.5866, 8.6815, 0, 0));
                    track1.addTrackRecord(new TrackRecord(50.5874, 8.6840, 0, 0));
                    track1.addTrackRecord(new TrackRecord(50.5860, 8.6861, 0, 0));

                    this.activity = new Activity(1, 'Laufen', 13, 14, track1, 'Erster Dummy');
                } else if($stateParams.id == 2) {
                    var track2 = new Track();
                    /*track2.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));
                     track2.addTrackRecord(new TrackRecord(50.5837, 8.6847, 0, 0));
                     track2.addTrackRecord(new TrackRecord(50.5828, 8.6802, 0, 0));
                     track2.addTrackRecord(new TrackRecord(50.5839, 8.6783, 0, 0));
                     */
                    this.activity = new Activity(2, 'Laufen', 15, 16, track2, 'Zweiter Dummy');
                } else if($stateParams.id == 3){
                    var track3 = new Track();
                    track3.addTrackRecord(new TrackRecord(50.7967, 8.7688, 0, 0));
                    track3.addTrackRecord(new TrackRecord(50.7950, 8.7689, 0, 0));
                    track3.addTrackRecord(new TrackRecord(50.7943, 8.7625, 0, 0));
                    track3.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));

                    this.activity = new Activity(3, 'Radfahren', 17, 18, track3, 'Dritter Dummy');
                } else {
                    var track4 = new Track();
                    track4.addTrackRecord(new TrackRecord(36.578581, -118.291994, 0, 0));
                    track4.addTrackRecord(new TrackRecord(36.606111, -118.062778, 0, 0));
                    track4.addTrackRecord(new TrackRecord(36.433269, -117.950916, 0, 0));
                    track4.addTrackRecord(new TrackRecord(36.588056, -116.943056, 0, 0));
                    track4.addTrackRecord(new TrackRecord(36.339722, -117.467778, 0, 0));
                    track4.addTrackRecord(new TrackRecord(36.23998, -116.83171, 0, 0));
                    this.activity = new Activity(4, 'Radfahren', 123824193, 183924123, track4, 'Standard Elevation of the Gooogle-API')
                }
            }
            /**
             * @description Saves the currently edited Activity.
             */
            this.save = function() {
                //DataService.addActivity(activity);
                $ionicNavBarDelegate.back();
            };

            var thisActivity = this.activity;

            /**
             * @description Deletes the currently edited Activity.
             */
            this.delete = function() {
                var confirmPopup = $ionicPopup.confirm({
                    template: 'Wollen Sie die Aktivität wirklich löschen?',
                    cancelText: 'Abbrechen',
                    okText: 'Löschen'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        console.log("Delete");
                        //DataService.removeActivity(thisActivity.id);
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
                if(thisActivity.track_data.track_records.length > 0) {
                    var initial_Position = thisActivity.track_data.track_records[0];
                } else {
                    // Default initial Position
                    var initial_Position = new TrackRecord(50.5851, 8.6841, 0, 0);
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
                }

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
                }
                polyline = new google.maps.Polyline(pathOptions);
                wCtrl.showElevation();
            }

            //Show GooogleMaps only if it's a persisted Activity
            if(this.isEditMode) {
                google.maps.event.addDomListener(window, 'load', init());
            }
        });
})();
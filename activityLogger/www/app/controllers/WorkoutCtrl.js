'use strict';


angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
    function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup, $window) {
        var wCtrl = this;
        var infowindow = new google.maps.InfoWindow();
        var elevationSamples = 200;
        var elevationData = [];
        var elevator;
        var map;
        var polyline;

        var whitney = new google.maps.LatLng(36.578581, -118.291994);
        var lonepine = new google.maps.LatLng(36.606111, -118.062778);
        var owenslake = new google.maps.LatLng(36.433269, -117.950916);
        var beattyjunction = new google.maps.LatLng(36.588056, -116.943056);
        var panamintsprings = new google.maps.LatLng(36.339722, -117.467778);
        var badwater = new google.maps.LatLng(36.23998, -116.83171);

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
        }

        this.save = function() {
            //DataService.addActivity(activity);
            $ionicNavBarDelegate.back();
        };

        var thisActivity = this.activity;
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

        this.showElevation = function() {
            var elevationChart;
            var chartOptions;
            var ctx;
            var scala = [];

            for(var i = 1; i <= elevationSamples; i++) {
                scala.push("");
            }
            chartOptions = {
                //showScale: false, //TODO: Mit oder ohne SKALA?
                //scaleShowLabels: false,
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

        function init() {
            var mapOptions = {
                center: new google.maps.LatLng(50.587, 8.669),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            elevator = new google.maps.ElevationService();

            google.maps.event.addListener(map, 'click', getElevation);

            drawPath();
        }

        function drawPath() {

            var path = [ whitney, lonepine, owenslake, panamintsprings, beattyjunction, badwater];

            // Create a PathElevationRequest object using this array.
            var pathRequest = {
                'path': path,
                'samples': elevationSamples
            }

            // Initiate the path request.
            elevator.getElevationAlongPath(pathRequest, plotElevation);
        }

        // Takes an array of ElevationResult objects, draws the path on the map
        // and plots the elevation profile on a Chartjs Line.
        function plotElevation(results, status) {
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

        function getElevation(event) {
            var locations = [];

            // Retrieve the clicked location and push it on the array
            var clickedLocation = event.latLng;
            locations.push(clickedLocation);

            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            }

            // Initiate the location request
            elevator.getElevationForLocations(positionalRequest, function(results, status) {
                if (status == google.maps.ElevationStatus.OK) {

                    // Retrieve the first result
                    if (results[0]) {

                        // Open an info window indicating the elevation at the clicked position
                        infowindow.setContent('The elevation at this point <br>is ' + results[0].elevation + ' meters.');
                        infowindow.setPosition(clickedLocation);
                        infowindow.open(map);
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Elevation service failed due to: ' + status);
                }
            });
        }
        if(this.isEditMode) {
            google.maps.event.addDomListener(window, 'load', init());
        }
    });
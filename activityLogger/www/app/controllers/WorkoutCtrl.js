'use strict'


angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
    function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup, $window) {
        var elevator;
        var map;
        var infowindow = new google.maps.InfoWindow();
        var chart;
        var polyline;

        var scala = [];
        for(var i = 1; i <= 50; i++) {
            scala.push(i + "");
        }
        this.elevationChart = {
            labels : scala,
            datasets : [ {
                label : "Elevation",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : [ 200, 450, 30, 60, 600, 300, 100 ]
            } ]
        };

        this.isEditMode = false;

        if ($stateParams.id == 'new') {
            $ionicNavBarDelegate.setTitle('Neue Activity');
            this.activity = {};
            //this.activity.id = localStorage.getItem('nextActivityId');
            //this.activity.user_id = DataService.getUserProfil();
        } else {
            //edit
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

        this.plotElevation = function() {

            var ctx = document.getElementById("elevation_profile").getContext("2d");
            $window.myLine = new Chart(ctx).Line(this.elevationChart, {
                scaleShowVerticalLines: false,
                pointDot: false,
                responsive : true
            });
        };

        var whitney = new google.maps.LatLng(36.578581, -118.291994);
        var lonepine = new google.maps.LatLng(36.606111, -118.062778);
        var owenslake = new google.maps.LatLng(36.433269, -117.950916);
        var beattyjunction = new google.maps.LatLng(36.588056, -116.943056);
        var panamintsprings = new google.maps.LatLng(36.339722, -117.467778);
        var badwater = new google.maps.LatLng(36.23998, -116.83171);

        function init() {
            var mapOptions = {
                center: new google.maps.LatLng(50.587, 8.669),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            elevator = new google.maps.ElevationService();

            //google.maps.event.addListener(map, 'click', getElevation);

           // drawPath();
        }

         function drawPath() {

            // Create a new chart in the elevation_chart DIV.
            chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

            var path = [ whitney, lonepine, owenslake, panamintsprings, beattyjunction, badwater];

            // Create a PathElevationRequest object using this array.
            // Ask for 256 samples along that path.
            var pathRequest = {
                'path': path,
                'samples': 256
            }

            // Initiate the path request.
            elevator.getElevationAlongPath(pathRequest, plotElevation);
        }

        // Takes an array of ElevationResult objects, draws the path on the map
        // and plots the elevation profile on a Visualization API ColumnChart.
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
            }

            // Display a polyline of the elevation path.
            var pathOptions = {
                path: elevationPath,
                strokeColor: '#0000CC',
                opacity: 0.4,
                map: map
            }
            polyline = new google.maps.Polyline(pathOptions);

            // Extract the data from which to populate the chart.
            // Because the samples are equidistant, the 'Sample'
            // column here does double duty as distance along the
            // X axis.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Sample');
            data.addColumn('number', 'Elevation');
            for (var i = 0; i < results.length; i++) {
                data.addRow(['', elevations[i].elevation]);
            }

            // Draw the chart using the data within its DIV.
            document.getElementById('elevation_chart').style.display = 'block';
            chart.draw(data, {
                height: 150,
                legend: 'none',
                titleY: 'Elevation (m)'
            });
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
        google.maps.event.addDomListener(window, 'load', init());
    });
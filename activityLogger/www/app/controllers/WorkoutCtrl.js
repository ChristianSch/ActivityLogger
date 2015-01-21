'use strict'


angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
    function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup) {
        var elevator;
        var map;
        var infowindow = new google.maps.InfoWindow();

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

        function init() {
            var mapOptions = {
                center: new google.maps.LatLng(50.587, 8.669),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            elevator = new google.maps.ElevationService();
            google.maps.event.addListener(map, 'click', getElevation);
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
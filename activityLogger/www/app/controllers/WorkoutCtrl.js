'use strict'


angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
        function($stateParams, $scope, $ionicNavBarDelegate) {
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

            this.init = function() {
                var mapOptions = {
                    center: new google.maps.LatLng(50.587, 8.669),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById("map_canvas"),
                    mapOptions);
            };
        });
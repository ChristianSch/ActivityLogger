'use strict'


angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
    function($stateParams, $scope, $ionicNavBarDelegate, $ionicPopup) {
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
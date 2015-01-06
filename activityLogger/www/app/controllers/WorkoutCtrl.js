'use-strict'
angular.module('ActivityLogger')
    .controller('WorkoutCtrl',
    function ($scope, $ionicNavBarDelegate, DataService) {

        this.isEditMode = false;
        if($stateParams.id == 'new') {
            $ionicNavBarDelegate.setTitle('Neue Activity');
            this.activity = {};
            //this.activity.id = localStorage.getItem('nextActivityId');
        } else {
            //edit
            this.isEditMode = true;
            $ionicNavBarDelegate.setTitle('Activity ' + $stateParams.id);
            //this.activity = DataService.getActivityById($stateParams.id);
        }
        this.save = function() {
            $ionicNavBarDelegate.back();
        };
    })
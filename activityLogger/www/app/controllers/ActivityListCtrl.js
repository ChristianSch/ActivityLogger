'use strict';


angular.module('ActivityLogger').controller('ActivityListCtrl',
    function($state, $ionicPopup, $scope, Activity, DataService) {

        this.activities = [];
        this.activities.push(new Activity(1, 'Laufen 100m', 13, 14, [], 'Erster Dummy'));
        this.activities.push(new Activity(2, 'Laufen 200m', 15, 16, [], 'Zweiter Dummy'));
        this.activities.push(new Activity(3, 'Laufen 400m', 17, 18, [], 'Dritter Dummy'));

        //Todo: Users hinzufügen, wie finde ich aktuellen user?
        //var userId = DataService.getStatus('userId'); // current userId saved on firebase

        //this.activities = DataService.getAllActivitiesByUserID(userId);

        this.addActivity = function() {
            console.log('addActivity()');
            $state.go('tab.workout', {
                id: 'new'
            });
        };

        //Todo: Should it really be possible to delete Activities?!
        this.delete = function(id) {
            //Todo: implement

        };

        this.searchQuery = localStorage.getItem('lastSearchQuery');

        if (this.searchQuery) {
            this.searchActive = true;
        } else {
            this.searchActive = false;
        }

        this.toggleSearch = function() {
            console.log('toggleSearch()');
            if (this.searchActive) {
                this.searchQuery = '';
                localStorage.setItem('lastSearchQuery', '');
            }
            this.searchActive = !this.searchActive;
        };
    });
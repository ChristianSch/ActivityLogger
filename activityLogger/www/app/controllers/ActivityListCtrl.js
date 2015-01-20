'use strict';


angular.module('ActivityLogger').controller('ActivityListCtrl',
    function($state, $ionicPopup, $scope, $ionicPopover, Activity, DataService) {

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

        //TODO: Don't forget to remove. Only for testing!
        var thisActivities = this.activities;
        $scope.getActivityByID = function(id) {
            for(var i = 0; i < thisActivities.length; i++) {
                if(thisActivities[i].id == id) {
                    return thisActivities[i];
                }
            }
            return null;
        }

        this.delete = function(id) {
            var confirmPopup = $ionicPopup.confirm({
                template: 'Wollen Sie die Aktivität wirklich löschen?',
                cancelText: 'Abbrechen',
                okText: 'Löschen'
            });
            confirmPopup.then(function(res) {
                console.log("Delete");
                thisActivities.splice(thisActivities.indexOf($scope.getActivityByID(id)), 1);
                //thisActivities.splice(thisActivities.indexOf(DataService.getActivityByID(id)), 1);
                //DataService.removeActivity(id);
            });
        };

        this.searchQuery = localStorage.getItem('lastSearchQuery');

        if (this.searchQuery) {
            this.searchActive = true;
        } else {
            this.searchActive = false;
        }

        this.toggleSearch = function() {
            if (this.searchActive) {
                this.searchQuery = '';
                localStorage.setItem('lastSearchQuery', '');
            }
            this.searchActive = !this.searchActive;
        };

        $scope.$on('$stateChangeStart',
            function(event) {
                if(event.currentScope.alCtrl.searchQuery || (event.currentScope.alCtrl.searchQuery == '')) {
                    localStorage.setItem('lastSearchQuery', event.currentScope.alCtrl.searchQuery);
                }
            });

    });
'use strict';


angular.module('ActivityLogger').controller('ActivityListCtrl',
    function($state, $ionicPopup, $scope, $ionicPopover, Activity, Track, TrackRecord, DataService) {

        var track1 = new Track();
        track1.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));
        track1.addTrackRecord(new TrackRecord(50.5866, 8.6815, 0, 0));
        track1.addTrackRecord(new TrackRecord(50.5874, 8.6840, 0, 0));
        track1.addTrackRecord(new TrackRecord(50.5860, 8.6861, 0, 0));

        var track2 = new Track();
        track2.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));
        track2.addTrackRecord(new TrackRecord(50.5837, 8.6847, 0, 0));
        track2.addTrackRecord(new TrackRecord(50.5828, 8.6802, 0, 0));
        track2.addTrackRecord(new TrackRecord(50.5839, 8.6783, 0, 0));

        var track3 = new Track();
        track3.addTrackRecord(new TrackRecord(50.7967, 8.7688, 0, 0));
        track3.addTrackRecord(new TrackRecord(50.7950, 8.7689, 0, 0));
        track3.addTrackRecord(new TrackRecord(50.7943, 8.7625, 0, 0));
        track3.addTrackRecord(new TrackRecord(50.5851, 8.6841, 0, 0));

        this.activities = [];
        this.activities.push(new Activity(1, 'Laufen 100m', 13, 14, track1, 'Erster Dummy'));
        this.activities.push(new Activity(2, 'Laufen 200m', 15, 16, track2, 'Zweiter Dummy'));
        this.activities.push(new Activity(3, 'Laufen 400m', 17, 18, track3, 'Dritter Dummy'));

        //Todo: Users hinzufügen, wie finde ich aktuellen user?
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
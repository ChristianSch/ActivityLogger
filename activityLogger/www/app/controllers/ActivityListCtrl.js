/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular.module('ActivityLogger').controller('ActivityListCtrl',
        function($state, $ionicPopup, $scope, $ionicPopover, Activity, DataService) {

            var userId = DataService.getCurrentUserId();

            this.activities = DataService.getAllActivities(userId);

            /**
             * @description Switches to detailed activity-view for a new activity
             */
            this.addActivity = function() {
                $state.go('tab.workout', {
                    id: 'new'
                });
            };

            var thisActivities = this.activities;

            /**
             * @description Deletes an activity from the Activitiy List
             *
             * @param id of the Activity that should be deleted
             */
            this.remove = function(id) {
                var confirmPopup = $ionicPopup.confirm({
                    template: 'Wollen Sie die Aktivität wirklich löschen?',
                    cancelText: 'Abbrechen',
                    okText: 'Löschen'
                });
                confirmPopup.then(function(res) {
                    thisActivities.splice(thisActivities.indexOf(DataService.getActivityByID(id)), 1);
                    DataService.removeActivity(id);
                });
            };

            this.searchQuery = localStorage.getItem('lastSearchQuery');

            if (this.searchQuery) {
                this.searchActive = true;
            } else {
                this.searchActive = false;
            }
            /**
             * @description Toggles the Searchbar if the button is pressed
             */
            this.toggleSearch = function() {
                if (this.searchActive) {
                    this.searchQuery = '';
                    localStorage.setItem('lastSearchQuery', '');
                }
                this.searchActive = !this.searchActive;
            };
            /**
             * @description Saves the last Searchquery if the state is changed
             */
            $scope.$on('$stateChangeStart',
                function(event) {
                    if(event.currentScope.alCtrl.searchQuery || (event.currentScope.alCtrl.searchQuery == '')) {
                        localStorage.setItem('lastSearchQuery', event.currentScope.alCtrl.searchQuery);
                    }
                });

        });
})();
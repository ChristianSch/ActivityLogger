/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular.module('ActivityLogger').controller('ActivityListCtrl',
        function($state, $ionicPopup, $scope, $ionicPopover, Activity, MockDataService) {

            var userId = MockDataService.getCurrentUserId();

            this.activities = MockDataService.getAllActivities(userId);

            /**
             * @description Switches to detailed activity-view for a new activity
             */
            this.addActivity = function() {
                $state.go('tab.main', {
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
                    template: 'Do you really want to delete this Activity?',
                    cancelText: 'Cancel',
                    okText: 'Delete'
                });
                confirmPopup.then(function(res) {
                    thisActivities.splice(thisActivities.indexOf(MockDataService.getActivityByID(id)), 1);
                    MockDataService.removeActivity(id);
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
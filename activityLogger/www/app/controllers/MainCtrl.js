/**
 * @author Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .controller('MainCtrl',
            function($scope, $state, DataService) {
                // for referencing this later in anonymous functions
                var thisCtrl = this;

                // set up the selectable options
                this.possibleActivityTypes = [{
                    id: 1,
                    label: 'Run'
                }, {
                    id: 2,
                    label: 'Bike'
                }];

                console.log(DataService.getAllActivities());

                this.selectedActivityType = this.possibleActivityTypes[0];
                this.comment = '';

                /**
                 * @description Start the activity by changing the view to
                 * the `activity` tab
                 */
                this.startActivity = function() {
                    // we could validate something here
                    // but we don't have anything to validate at the moment
                    if (thisCtrl.selectedActivityType !== undefined) {
                        $state.go('tab.activity', {
                            'type': thisCtrl.selectedActivityType.label,
                            'comment': thisCtrl.comment
                        });
                    }
                };
            });
})();
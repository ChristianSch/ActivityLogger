'use strict';


angular.module('ActivityLogger').controller('MainCtrl',
    function($scope, $state) {
    	// set up the selectable options
        $scope.possibleActivityTypes = [{
            id: 1,
            label: 'Laufen'
        }, {
            id: 2,
            label: 'Radfahren'
        }];

        $scope.selectedActivityType = $scope.possibleActivityTypes[0];
        $scope.comment = '';

        $scope.startActivity = function() {
        	// we could validate something here
        	// but we don't have anything to validate at the moment
        	if ($scope.selectedActivityType !== undefined) {
        		$state.go('tab.activity');
        	}
        }
    });
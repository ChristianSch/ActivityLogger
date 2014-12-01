'use strict';
angular.module('ActivityLogger').controller('WorkoutListCtrl',
		function($scope) {
			$scope.workouts = [ {
				name : "Workout A"
			}, {
				name : "Workout B"
			}, {
				name : "Workout C"
			} ];
		})
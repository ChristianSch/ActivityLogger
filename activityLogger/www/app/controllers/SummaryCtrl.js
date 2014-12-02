'use strict';
angular.module('ActivityLogger').controller('SummaryCtrl', function($scope) {
	$scope.stats = [ {
		name : "Kilometer gesamt"
	}, {
		name : "Zeit gesamt"
	}, {
		name : "Kalorienverbrauch gesamt"
	}, {
		name : "Durchschnittlicher Kalorienverbrauch"
	} ];
})
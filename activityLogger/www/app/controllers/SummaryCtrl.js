'use strict';
angular.module('ActivityLogger').controller('SummaryCtrl', function($scope, Activity) {
	//Example data
	this.activities = [];
    this.activities.push(new Activity(1, 'Laufen 100m', 1420744000, 1420744957, [], 'Erster Dummy'));
    this.activities.push(new Activity(2, 'Laufen 200m', 1420743200, 1420744957, [], 'Zweiter Dummy'));
    this.activities.push(new Activity(3, 'Laufen 400m', 1420742000, 1420744957, [], 'Dritter Dummy'));
	
    this.getTotalTime = function(){
		var time = 0;
		for (var i = 0; i < this.activities.length; i++) {
		    time += this.activities[i].duration;
		}
		return time;
	};
    
	$scope.stats = [ {
		name : "Kilometer gesamt",
		value: 0
	}, {
		name : "Zeit gesamt",
		value: this.getTotalTime() + " Sekunden"
	}, {
		name : "Aktivitäten gesamt",
		value: this.activities.length
	}, ];
	
	
})
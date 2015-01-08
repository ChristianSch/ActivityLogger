'use strict';
angular.module('ActivityLogger').controller(
		'SummaryCtrl',
		function($scope, Activity) {
			// Example data
			this.activities = [];
			this.activities.push(new Activity(1, 'Laufen 100m', 1420744000,
					1420744957, [], 'Erster Dummy'));
			this.activities.push(new Activity(2, 'Laufen 200m', 1420743200,
					1420744957, [], 'Zweiter Dummy'));
			this.activities.push(new Activity(3, 'Laufen 400m', 1420742000,
					1420744957, [], 'Dritter Dummy'));

			this.getTotalTime = function() {
				var time = 0;
				for (var i = 0; i < this.activities.length; i++) {
					time += this.activities[i].duration;
				}
				return time;
			};

			$scope.stats = [ {
				name : "Kilometer gesamt",
				value : 0
			}, {
				name : "Zeit gesamt",
				value : this.getTotalTime() + " Sekunden"
			}, {
				name : "Aktivitäten gesamt",
				value : this.activities.length
			}, ];

			this.lineChartData = {
				labels : [ "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So" ],
				datasets : [ {
					label : "My First dataset",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : [ 200, 450, 30, 60, 600, 300, 100 ]
				} ]
			}

			this.showChart = function() {
				console.log(this.lineChartData);
				var ctx = document.getElementById("chart_times").getContext(
						"2d");
				window.myLine = new Chart(ctx).Line(this.lineChartData, {
					responsive : true
				});
			}
		})
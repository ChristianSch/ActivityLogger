'use strict';

angular.module('ActivityLogger').controller(
		'SummaryCtrl',
		function($scope, $compile, $window, Activity, SummaryService) {

			$scope.overallRecords = SummaryService.getOverallRecords();
			
			$scope.disciplineRecords = SummaryService.getAllDisciplineRecords();
			
			$scope.overallPerformances = SummaryService.getOverallPerformances();
			
			//TEST

			this.timesWeekChart = {
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
			};

			this.timesMonthChart = {
				labels : [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "18", "19",
						"20", "21", "22", "23", "24", "25", "26", "27", "28",
						"29", "30" ],
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
			};

			this.timesYearChart = {
				labels : [ "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul",
						"Aug", "Sep", "Okt", "Nov", "Dez" ],
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
			};

			this.showTimesWeekChart = function() {
				var ctx = document.getElementById("chart_times_week")
						.getContext("2d");
				$window.myLine = new Chart(ctx).Line(this.timesWeekChart, {
					responsive : true
				});
			};

			this.showTimesMonthChart = function() {

				var ctx = document.getElementById("chart_times_month")
						.getContext("2d");
				$window.myLine = new Chart(ctx).Line(this.timesMonthChart, {
					responsive : true
				});
			};

			this.showTimesYearChart = function() {

				var ctx = document.getElementById("chart_times_year")
						.getContext("2d");
				$window.myLine = new Chart(ctx).Line(this.timesYearChart, {
					responsive : true
				});
			};
		});

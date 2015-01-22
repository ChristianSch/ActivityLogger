'use strict';

angular.module('ActivityLogger')
		.controller(
				'SummaryCtrl',
				function($scope, $window, Activity, SummaryService) {

					$scope.overallRecords = SummaryService.getOverallRecords();

					$scope.disciplineRecords = SummaryService
							.getAllDisciplineRecords();

					$scope.overallPerformances = SummaryService
							.getOverallPerformances();

					/**
					 * 
					 */
					$scope.showTimesWeekChart = function() {
						var weekdays = [ "MO", "DI", "MI", "DO", "FR", "SA",
								"SO" ];
						// rotate weekdays
						var day = new Date().getDay();
						weekdays = weekdays.slice(day).concat(
								weekdays.slice(0, day))

						var data = SummaryService.getDurations(7);
						drawChart(weekdays, data, "chart_times_week");
					};

					/**
					 * 
					 */
					$scope.showTimesMonthChart = function() {
						var days = [ "1", "2", "3", "4", "5", "6", "7", "8",
								"9", "10", "11", "12", "13", "14", "15", "16",
								"17", "18", "19", "20", "21", "22", "23", "24",
								"25", "26", "27", "28", "29", "30" ];

						var data = SummaryService.getDurations(30);

						drawChart(days, data, "chart_times_month");
					};

					/**
					 * 
					 */
					$scope.showTimesYearChart = function() {
						var days = [ "", "", "", "", "", "", "", "", "", "10",
								"", "", "", "", "", "", "", "", "", "20", "",
								"", "", "", "", "", "", "", "", "30", "", "",
								"", "", "", "", "", "", "", "40", "", "", "",
								"", "", "", "", "", "", "50", "", "" ];
						var durations = SummaryService.getDurations(364);
						var data = [];
						var i;
						
						for (i = 0; i < 364; i+=7) {
							data.push(durations[i] + durations[i + 1]
									+ durations[i + 2] + durations[i + 3]
									+ durations[i + 4] + durations[i + 5]
									+ durations[i + 6]);
						}
						
						drawChart(days, data, "chart_times_year");
					};

					/**
					 * 
					 */
					var drawChart = function(labels, data, canvas_id) {
						var chart = {
							labels : labels,
							datasets : [ {
								label : "",
								fillColor : "rgba(220,220,220,0.2)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(220,220,220,1)",
								data : data
							} ]
						};
						var ctx = document.getElementById(canvas_id)
								.getContext("2d");
						$window.chart = new Chart(ctx).Line(chart, {
							showTooltips : false,
							dataSetStroke : false,
							pointDot : false,
							responsive : true
						});
					};

				});

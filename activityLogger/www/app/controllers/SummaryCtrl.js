/**
 * @author Daniel Nassauer
 */
(function() {
	'use strict';

	angular
			.module('ActivityLogger')
			.controller(
					'SummaryCtrl',
					function($scope, $window, $ionicPopup, Activity,
							SummaryService) {						

						$scope.period_slider = 42;
						this.period_slider = 42;						

						/**
						 * Updates all statistics depending on the period.
						 */
						$scope.update = function() {	
							var p = getPeriod(this.period_slider);
							SummaryService.update();
							$scope.bestPerfs = SummaryService
									.getBestPerformances(p);
							$scope.overallPerfs = SummaryService
									.getOverallPerformances(p);
							$scope.avgPerfs = SummaryService
									.getAveragePerformances(p);
							$scope.disciplineDistributionLegend = $scope
									.showDisciplineDistributionChart(p);
						}
						/**
						 * Shows all week charts.
						 */
						$scope.showWeekCharts = function() {
							var weekdays = [ "MON", "TUE", "WED", "THU", "FRI",
									"SAT", "SUN" ];
							// rotate weekdays
							var day = new Date().getDay();
							weekdays = weekdays.slice(day).concat(
									weekdays.slice(0, day))

							// draw times chart
							var data_time = SummaryService.getDurations(7);
							drawLineChart(weekdays, data_time,
									"chart_times_week");

							// draw distance chart
							var data_dist = SummaryService.getDistances(7);
							drawLineChart(weekdays, data_dist,
									"chart_dist_week");

							// draw calories chart
							var data_kcal = SummaryService.getCalories(7);
							drawLineChart(weekdays, data_kcal,
									"chart_kcal_week");
						};

						/**
						 * Shows all month charts.
						 */
						$scope.showMonthCharts = function() {
							var days = [ "1", "2", "3", "4", "5", "6", "7",
									"8", "9", "10", "11", "12", "13", "14",
									"15", "16", "17", "18", "19", "20", "21",
									"22", "23", "24", "25", "26", "27", "28",
									"29", "30" ];

							// draw times chart
							var data_time = SummaryService.getDurations(30);
							drawLineChart(days, data_time, "chart_times_month");

							// draw distance chart
							var data_dist = SummaryService.getDistances(30);
							drawLineChart(days, data_dist, "chart_dist_month");

							// draw calories chart
							var data_kcal = SummaryService.getCalories(30);
							drawLineChart(days, data_kcal, "chart_kcal_month");

						};

						/**
						 * Shows all year charts.
						 */
						$scope.showYearCharts = function() {
							var days = [ "", "", "", "", "", "", "", "", "",
									"10", "", "", "", "", "", "", "", "", "",
									"20", "", "", "", "", "", "", "", "", "",
									"30", "", "", "", "", "", "", "", "", "",
									"40", "", "", "", "", "", "", "", "", "",
									"50", "", "" ];

							// draw times chart
							var data_time = SummaryService.getDurations(364);
							drawLineChart(days, summarize(data_time, 7),
									"chart_times_year");

							// draw distance chart
							var data_dist = SummaryService.getDistances(364);
							drawLineChart(days, summarize(data_dist, 7),
									"chart_dist_year");

							// draw calories chart
							var data_kcal = SummaryService.getCalories(364);
							drawLineChart(days, summarize(data_kcal, 7),
									"chart_kcal_year");
						};

						/**
						 * Shows the discipline distribution chart.
						 */
						$scope.showDisciplineDistributionChart = function(
								period) {
							var durations = SummaryService
									.getDurationOfAllDisciplines(period);
							var labels = [];
							var values = [];

							var i;
							for (i in durations) {
								labels.push(durations[i].discipline);
								values
										.push(Math
												.floor(durations[i].duration / 60));
							}
							return drawPieChart(labels, values,
									"chart_discipline_distribution");
						}

						/**
						 * Calculates a period for a specified period slider
						 * value.
						 * 
						 * @return {number} period in seconds.
						 */
						var getPeriod = function(slider_value) {
							if (slider_value < 30) {
								return slider_value * 60 * 60 * 24 * 1000;
							}
							if (slider_value < 42) {
								return (slider_value - 29) * 60 * 60 * 24 * 30
										* 1000;
							}
							return -1;
						}

						/**
						 * Creates a text for the specified period slider value.
						 * 
						 * @return {string} text.
						 */
						$scope.getPeriodText = function(slider_value) {
							var period = getPeriod(slider_value) / 1000;
							if (period == -1 / 1000) {
								return "Since the beginning";
							}
							if (period % (60 * 60 * 24 * 30) == 0) {
								return "Last " + period
										/ (60 * 60 * 24 * 30) + " months";
							}
							if (period % (60 * 60 * 24 * 7) == 0) {
								return "Last " + period / (60 * 60 * 24 * 7)
										+ " weeks";
							}
							if (period % (60 * 60 * 24) == 0) {
								return "Last " + period / (60 * 60 * 24)
										+ " days";
							}
						}

						/**
						 * 
						 */
						$scope.showInfo = function(title) {
							var text;

							if (title == "Best Performances") {
								text = "Here you can see your best performances in the chosen period.";
							} else if (title == "Average Performances") {
								text = "Here you can see your average performances in the chosen period.";
							} else if (title == "Overall Performances") {
								text = "Here you can see your summarized performances over the whole period you have chosen.";
							} else if (title == "Trends") {
								text = "Here you can see your trends for duration, distance and calorie consumption over the last week, month or year.";
							} else if (title == "Activity Distribution") {
								text = "Here you can see how much time you have spent on the single activities in the chosen period.";
							}

							var alertPopup = $ionicPopup.alert({
								title : title,
								template : text
							});
						};

						/**
						 * Draws a line chart.
						 * 
						 * @param label
						 *            {string[]} array of labels for each value.
						 * @param data
						 *            {number[]} array of values.
						 * @param canvas_id
						 *            {string} ID of the canvas to draw on.
						 */
						var drawLineChart = function(labels, data, canvas_id) {
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

						/**
						 * Draws a pie chart.
						 * 
						 * @param label
						 *            {string[]} array of labels for each value.
						 * @param data
						 *            {number[]} array of values.
						 * @param canvas_id
						 *            {string} ID of the canvas to draw on.
						 * @return {{value: number, color: string, label:
						 *         string}[]} Array containing value, color and
						 *         label for each dataset (used to write a
						 *         legend).
						 */
						var drawPieChart = function(labels, data, canvas_id) {
							var colors = [ "#F44336", "#2196F3", "#FFEB3B",
									"#795548", "#009688", "#9C27B0", "#4CAF50" ];
							var chart = [];
							var i;
							for (i = 0; i < data.length; i++) {
								chart.push({
									value : data[i],
									color : colors[i],
									highlight : colors[i],
									label : labels[i]
								});
							}

							var ctx = document.getElementById(canvas_id)
									.getContext("2d");
							$window.chart = new Chart(ctx).Doughnut(chart, {
								responsive : true,
								showTooltips : false
							});
							return chart;
						};

						/**
						 * Summarizes an array of numbers.
						 * 
						 * @param data
						 *            {number[]} array of numbers.
						 * @param step
						 *            {number} summarize step values
						 * @return {number} new summarized array of numbers.
						 */
						var summarize = function(data, step) {
							var summarized_data = [];
							var i;
							var j;
							for (i = 0; i < data.length; i += step) {
								var val = 0;
								for (j = 0; j < step; j++) {
									val += data[i + j];
								}
								summarized_data.push(val);
							}
							return summarized_data;
						};

						$scope.update();

					});
})();

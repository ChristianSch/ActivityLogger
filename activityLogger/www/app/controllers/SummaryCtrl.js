'use strict';

angular.module('ActivityLogger').controller(
		'SummaryCtrl',
		function($scope, $window, Activity, SummaryService) {

			$scope.period_slider = 42;
			this.period_slider = 42;

			$scope.bestPerfs = SummaryService.getBestPerformances(-1);

			$scope.overallPerfs = SummaryService.getOverallPerformances(-1);

			$scope.avgPerfs = SummaryService.getAveragePerformances(-1);

			/**
			 * 
			 */
			$scope.update = function() {
				var p = getPeriod(this.period_slider);
				$scope.bestPerfs = SummaryService.getBestPerformances(p);
				$scope.overallPerfs = SummaryService.getOverallPerformances(p);
				$scope.avgPerfs = SummaryService.getAveragePerformances(p);
			}
			/**
			 * 
			 */
			$scope.showWeekCharts = function() {
				var weekdays = [ "MO", "DI", "MI", "DO", "FR", "SA", "SO" ];
				// rotate weekdays
				var day = new Date().getDay();
				weekdays = weekdays.slice(day).concat(weekdays.slice(0, day))

				// draw times chart
				var data_time = SummaryService.getDurations(7);
				drawChart(weekdays, data_time, "chart_times_week");

				// draw distance chart
				var data_dist = SummaryService.getDistances(7);
				drawChart(weekdays, data_dist, "chart_dist_week");
				
				// draw calories chart
				var data_kcal = SummaryService.getCalories(7);
				drawChart(weekdays, data_kcal, "chart_kcal_week");
			};

			/**
			 * 
			 */
			$scope.showMonthCharts = function() {
				var days = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "18", "19",
						"20", "21", "22", "23", "24", "25", "26", "27", "28",
						"29", "30" ];

				// draw times chart
				var data_time = SummaryService.getDurations(30);
				drawChart(days, data_time, "chart_times_month");

				// draw distance chart
				var data_dist = SummaryService.getDistances(30);
				drawChart(days, data_dist, "chart_dist_month");
				
				// draw calories chart
				var data_kcal = SummaryService.getCalories(30);
				drawChart(days, data_kcal, "chart_kcal_month");

			};

			/**
			 * 
			 */
			$scope.showYearCharts = function() {
				var days = [ "", "", "", "", "", "", "", "", "", "10", "", "",
						"", "", "", "", "", "", "", "20", "", "", "", "", "",
						"", "", "", "", "30", "", "", "", "", "", "", "", "",
						"", "40", "", "", "", "", "", "", "", "", "", "50", "",
						"" ];

				// draw times chart
				var data_time = SummaryService.getDurations(364);
				drawChart(days, summarize(data_time, 7), "chart_times_year");

				// draw distance chart
				var data_dist = SummaryService.getDistances(364);
				drawChart(days, summarize(data_dist, 7), "chart_dist_year");
				
				// draw calories chart
				var data_kcal = SummaryService.getCalories(364);
				drawChart(days, summarize(data_kcal, 7), "chart_kcal_year");
			};

			/**
			 * 
			 */
			var getPeriod = function(slider_value) {
				if (slider_value < 30) {
					return slider_value * 60 * 60 * 24;
				}
				if (slider_value < 42) {
					return (slider_value - 29) * 60 * 60 * 24 * 7 * 30;
				}
				return -1;
			}

			$scope.getPeriodText = function(slider_value) {
				var period = getPeriod(slider_value);
				if (period == -1) {
					return "Gesamter Zeitraum";
				}
				if (period % (60 * 60 * 24 * 7 * 30) == 0) {
					return "letzte " + period / (60 * 60 * 24 * 7 * 30)
							+ " Monate";
				}
				if (period % (60 * 60 * 24 * 7) == 0) {
					return "letzte " + period / (60 * 60 * 24 * 7) + " Wochen";
				}
				if (period % (60 * 60 * 24) == 0) {
					return "letzte " + period / (60 * 60 * 24) + " Tage";
				}
			}

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
				var ctx = document.getElementById(canvas_id).getContext("2d");
				$window.chart = new Chart(ctx).Line(chart, {
					showTooltips : false,
					dataSetStroke : false,
					pointDot : false,
					responsive : true
				});
			};

			/**
			 * 
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
			}

		});

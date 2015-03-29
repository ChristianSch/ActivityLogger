/**
 * @author Daniel Nassauer
 */
(function() {
	'use strict';

	angular
			.module('ActivityLogger')
			.factory(
					'SummaryService',
					function(Activity, User, MockDataService) {

						// TEST DATA
						// var user = new User(42, "a", "b", "male", null, 80,
						// 180);
						// if (activities === undefined) {
						// var activities = getRandomActivities();
						// }

						var userID = MockDataService.getCurrentUserId();
						var activities = MockDataService
								.getAllActivities(userID);
						var user = MockDataService.getUserByID(userID);
						console.log(userID);
						console.log(activities);
						console.log(user);

						// PUBLIC FUNCTIONS

						/**
						 * Collects the best performances for each activity type
						 * in a specified period.
						 * 
						 * @param period
						 *            {number} period in seconds.
						 * @return {{discipline : string, records:
						 *         {name:string,value:number,unit:string}[]}[]}
						 *         best performances for all disciplines.
						 */
						function getBestPerformances(period) {
							var performances = [];
							var disciplines = getAllActivityTypes();
							var i;

							for (i in disciplines) {
								performances.push({
									discipline : disciplines[i],
									records : getBestPerformancesOfDiscipline(
											disciplines[i], period)
								})
							}
							return performances;
						}

						/**
						 * Collects the average performances for each activity
						 * type in a specified period.
						 * 
						 * @param period
						 *            {number} period in seconds.
						 * @return {{discipline : string, data:
						 *         {name:string,value:number,unit:string}[]}[]}
						 *         average performances for all disciplines.
						 */
						function getAveragePerformances(period) {
							var performances = [];
							var disciplines = getAllActivityTypes();
							var i;
							for (i in disciplines) {
								performances.push({
									discipline : disciplines[i],
									data : getAvgPerformancesOfDiscipline(
											disciplines[i], period)
								})
							}
							return performances;
						}

						/**
						 * Calculates overall performances for the specified
						 * period.
						 * 
						 * @param period
						 *            {number} period in seconds.
						 * @return {{name:string, value:number, unit:string}[]}
						 *         overall performances.
						 */
						function getOverallPerformances(period) {
							var distance = 0;
							var calories = 0;
							var duration = 0;
							var time = new Date().getTime() - period;
							var i;
							for (i in activities) {
								if (activities[i].start_time < time
										&& period != -1) {
									continue;
								}
								distance += activities[i].distance;
								calories += calcCalories(activities[i]);
								duration += activities[i].duration / 1000;
							}

							var performances = [ {
								name : "Distance",
								value : Math.round(distance / 100) / 10,
								unit : "km"
							}, {
								name : "Total Time",
								value : Math.round(duration / 60),
								unit : "min"
							}, {
								name : "Calorie Consumption",
								value : Math.round(calories),
								unit : "kcal"
							} ];
							return performances;
						}

						/**
						 * Determines the best performances for the specified
						 * activity type in a period.
						 * 
						 * @param activity_type
						 *            {string} activity type.
						 * @param period
						 *            {number} period in seconds.
						 * @return {{name:string, value:number, unit:string}[]}
						 *         Best performances of discipline.
						 */
						function getBestPerformancesOfDiscipline(activity_type,
								period) {
							var longest_track = 0;
							var highest_avg_speed = 0;
							var highest_speed = 0;
							var most_kcal = 0;
							var time = new Date().getTime() - period;

							var i;
							for (i in activities) {
								if (activities[i].start_time < time
										&& period != -1) {
									continue;
								}

								if (activities[i].type == activity_type) {
									var dist = activities[i].distance;
									var avg_speed = dist
											/ (activities[i].duration / 1000);
									var max_speed = getMaxSpeed(activities[i]);
									var kcal = calcCalories(activities[i]);

									if (dist > longest_track) {
										longest_track = dist;
									}
									if (avg_speed > highest_avg_speed) {
										highest_avg_speed = avg_speed;
									}
									if (max_speed > highest_speed) {
										highest_speed = max_speed;
									}
									if (kcal > most_kcal) {
										most_kcal = kcal;
									}
								}
							}

							return [
									{
										name : "Distance",
										value : Math.round(longest_track / 100) / 10,
										unit : "km"
									},
									{
										name : "Ø Speed",
										value : Math
												.round(highest_avg_speed * 36) / 10,
										unit : "km/h"
									}, {
										name : "Max. Speed",
										value : Math.round(highest_speed),
										unit : "km/h"
									}, {
										name : "Calorie Consumption",
										value : Math.round(most_kcal),
										unit : "kcal"
									} ];

						}

						/**
						 * Determines the average performances for the specified
						 * activity type in a period.
						 * 
						 * @param activity_type
						 *            {string} activity type.
						 * @param period
						 *            {number} period in seconds.
						 * @return {{name:string, value:number, unit:string}[]}
						 *         Average performances of discipline.
						 */
						function getAvgPerformancesOfDiscipline(activity_type,
								period) {
							var count = 0;
							var first_activity_time = 0;
							var total_duration = 0;
							var total_distance = 0;
							var total_calories = 0;
							var time = new Date().getTime() - period;

							var i;
							for (i in activities) {
								if (activities[i].start_time < time
										&& period != -1) {
									continue;
								}
								if (activities[i].type == activity_type) {
									count++;
									total_duration += activities[i].duration / 1000;
									total_distance += activities[i].distance;
									total_calories += calcCalories(activities[i]);
									if (activities[i].start_time < first_activity_time
											|| first_activity_time == 0) {
										first_activity_time = activities[i].start_time;
									}
								}
							}

							if (period == -1) {
								period = new Date().getTime()
										- first_activity_time;
							}
							var days = period / 60 / 60 / 24;
							var avg_speed = total_distance / total_duration;
							var dist_per_day = total_distance / days;
							var time_per_day = total_duration / days;
							var cal_per_day = total_calories / days;

							return [ {
								name : "Speed",
								value : Math.round(avg_speed * 36) / 10,
								unit : "km/h"
							}, {
								name : "Distance",
								value : Math.round(dist_per_day / 100) / 10,
								unit : "km/day"
							}, {
								name : "Duration",
								value : Math.round(time_per_day / 60),
								unit : "minutes/day"
							}, {
								name : "Calorie Consumption",
								value : Math.round(cal_per_day),
								unit : "kcal/day"
							} ];

						}

						/**
						 * Determines the duration of all activities for each
						 * day.
						 * 
						 * @param {number}
						 *            days Number of days.
						 * @return {number[]} Array that contains all durations
						 *         for each day in minutes.
						 */
						function getDurations(days) {
							var today = new Date().getTime();
							var durations = [];
							for (var i = days - 1; i >= 0; i--) {
								durations.push(getDurationPerDay(today - 86400000
										* i) / 60);
							}
							return durations;
						}

						/**
						 * Determines the distance of all activities for each
						 * day.
						 * 
						 * @param {number}
						 *            days Number of days.
						 * @return {number[]} Array that contains all distances
						 *         for each day in km.
						 */
						function getDistances(days) {
							var today = new Date().getTime();
							var distances = [];
							for (var i = days - 1; i >= 0; i--) {
								distances.push(getDistancePerDay(today - 86400000
										* i) / 1000);
							}
							return distances;
						}

						/**
						 * Determines the burned calories of all activities for
						 * each day.
						 * 
						 * @param {number}
						 *            days Number of days.
						 * @return {number[]} Array that contains all calories
						 *         for each day in kcal.
						 */
						function getCalories(days) {
							var today = new Date().getTime();
							var calories = [];
							for (var i = days - 1; i >= 0; i--) {
								calories.push(getCaloriesPerDay(today - 86400000
										* i));
							}
							return calories;
						}

						/**
						 * Determines the time spent on an discipline in a
						 * specified period.
						 * 
						 * @param discipline
						 *            {string} activity type.
						 * @param period
						 *            {number} period in seconds.
						 * @return {number} duration
						 */
						function getDurationOfDiscipline(discipline, period) {
							var time = new Date().getTime() - period;
							var duration = 0;

							var i;
							for (i in activities) {
								if (activities[i].start_time < time
										&& period != -1) {
									continue;
								}
								if (activities[i].type == discipline) {
									duration += activities[i].duration / 1000;
								}
							}
							return duration;
						}

						/**
						 * Determines the time spent on each discipline in a
						 * specified period.
						 * 
						 * @param period
						 *            {number} period in seconds.
						 * @return {{discipline:string, duration:number}[]}
						 *         durations
						 */
						function getDurationOfAllDisciplines(period) {
							var durations = [];
							var disciplines = getAllActivityTypes();

							var i;
							for (i in disciplines) {
								durations.push({
									discipline : disciplines[i],
									duration : getDurationOfDiscipline(
											disciplines[i], period)
								});
							}

							return durations;
						}

						// PRIVATE FUNCTIONS

						/**
						 * Only for testing!
						 */
						function getRandomActivities() {
							var activities = [];
							var id = 1000;
							var date = new Date().getTime() - 60 * 60 * 10000;
							var x;

							for (var i = 0; i < 1053; i++) {
								var track = [ {
									speed : (Math.random() + 0.1) * 30
								} ];
								var rand = Math.random() + 0.1;
								var start = Math.floor(date - Math.random()
										* 60 * 60 * 10);
								var end = Math
										.floor(start + rand * 60 * 60 * 2);
								date = start - 14400;

								if (rand < 0.5) {
									activities.push(new Activity(id--,
											'Running', start, end, track, '',
											(Math.random() + 0.1) * 12000,
											user.userId));
								} else {
									activities.push(new Activity(id--,
											'Biking', start, end, track, '',
											(Math.random() + 0.1) * 12000,
											user.userId));
								}
							}
							return activities;
						}

						/**
						 * Determines the maximum speed of an activity.
						 * 
						 * @param activity
						 *            {Activity} activity.
						 * @return {number} maximum speed.
						 */
						function getMaxSpeed(activity) {
							var max_speed = 0;
							var i;
							for (i in activity.track_data) {
								if (activity.track_data[i].coords.speed > max_speed) {
									max_speed = activity.track_data[i].coords.speed;
								}
							}
							return max_speed;
						}

						/**
						 * Determines the duration of all activities of the
						 * specified day.
						 * 
						 * @param day
						 *            {number} Unix-Timestamp of an arbitrary
						 *            time of a day.
						 * @return {number} duration in seconds.
						 */
						function getDurationPerDay(day) {
							var duration = 0;
							var i;
							for (i in activities) {
								if (isSameDay(activities[i].start_time, day)) {
									duration += activities[i].duration / 1000;
								}
							}
							return duration;
						}

						/**
						 * Determines the distance of all activities of the
						 * specified day.
						 * 
						 * @param day
						 *            {number} Unix-Timestamp of an arbitrary
						 *            time of a day.
						 * @return {number} distance in meters.
						 */
						function getDistancePerDay(day) {
							var dist = 0;
							var i;
							for (i in activities) {
								if (isSameDay(activities[i].start_time, day)) {
									dist += activities[i].distance;
								}
							}
							return dist;
						}

						/**
						 * Determines the burned calories of all activities of
						 * the specified day.
						 * 
						 * @param day
						 *            {number} Unix-Timestamp of an arbitrary
						 *            time of a day.
						 * @return {number} calories in kcal.
						 */
						function getCaloriesPerDay(day) {
							var kcal = 0;
							var i;
							for (i in activities) {
								if (isSameDay(activities[i].start_time, day)) {
									kcal += calcCalories(activities[i]);
								}
							}
							return kcal;
						}

						/**
						 * Calculates the burned calories for an activity.
						 * 
						 * @param activity
						 *            {Activity} activity.
						 * @return {number} burned calories in kcal.
						 */
						function calcCalories(activity) {
							var met;
							// determine MET
							if (activity.type == "Bike") {
								met = 8;
							} else if (activity.type == "Run") {
								met = 11;
							}
							// consider gender
							if (user.gender == "Female") {
								met *= 0.9;
							}
							// calculate kcal
							// MET * kg * hours
							var hours = activity.duration / 1000 / 60 / 60;
							var kcal = met * user.weight * hours;
							return kcal;
						}

						/**
						 * Checks if two unix-timestamps are at the same day.
						 * 
						 * @param timestamp_a
						 *            {number} First timestamp.
						 * @param timestamp_b
						 *            {number} Second timestamp.
						 */
						function isSameDay(timestamp_a, timestamp_b) {
							var date_a = new Date(timestamp_a).setHours(0, 0,
									0, 0);
							var date_b = new Date(timestamp_b).setHours(0, 0,
									0, 0);
							if (date_a === date_b) {
								return true;
							}
							return false;
						}

						/**
						 * Determines all existing activity types.
						 * 
						 * @return {string[]} Array of all activity types.
						 */
						function getAllActivityTypes() {
							var types = [];
							var i;
							for (i in activities) {
								if (types.indexOf(activities[i].type) == -1) {
									types.push(activities[i].type);
								}
							}
							return types.sort();
						}

						var service = {
							getBestPerformances : getBestPerformances,
							getOverallPerformances : getOverallPerformances,
							getDurations : getDurations,
							getDistances : getDistances,
							getCalories : getCalories,
							getAveragePerformances : getAveragePerformances,
							getDurationOfDiscipline : getDurationOfDiscipline,
							getDurationOfAllDisciplines : getDurationOfAllDisciplines
						};

						return service;

					});
})();
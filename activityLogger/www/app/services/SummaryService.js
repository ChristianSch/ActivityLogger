'use-strict';
angular
		.module('ActivityLogger')
		.factory(
				'SummaryService',
				function(Activity, User, DataService) {

					// TEST DATA
					// var activities = getRandomActivities();
					// var user = new User(42, "a", "b", "male", null, 80, 180);
					var activities = DataService.getAllActivities(DataService
							.getCurrentUserId());
					var user = DataService.getUserByID(DataService
							.getCurrentUserId());
					console.log(user);

					// PUBLIC FUNCTIONS

					/**
					 * Collects the best performances for each activity type.
					 * 
					 * @return
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
					 * Collects the average performances for each activity type.
					 * 
					 * @return
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
					 * 
					 */
					function getOverallPerformances(period) {
						var distance = 0;
						var calories = 0;
						var time = new Date().getTime() / 1000 - period;
						var i;
						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							distance += activities[i].distance;
							calories += calcCalories(activities[i]);
						}

						performances = [ {
							name : "Zurückgelegte Strecke",
							value : Math.round(distance / 100) / 10,
							unit : "km"
						}, {
							name : "Zeit insgesamt",
							value : Math.round(getOverallTime() / 60),
							unit : "min"
						}, {
							name : "Verbrannte Kalorien",
							value : Math.round(calories),
							unit : "kcal"
						} ];
						return performances;
					}

					/**
					 * Determines longest track an highest average speed for the
					 * specified activity type.
					 * 
					 * @param activity_type
					 *            activity type.
					 * @return
					 */
					function getBestPerformancesOfDiscipline(activity_type,
							period) {
						var longest_track = 0;
						var highest_avg_speed = 0;
						var highest_speed = 0;
						var most_kcal = 0;
						var time = new Date().getTime() / 1000 - period;

						var i;
						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							if (activities[i].type == activity_type) {
								var dist = activities[i].distance;
								var avg_speed = dist / activities[i].duration;
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

						return [ {
							name : "Strecke",
							value : Math.round(longest_track / 100) / 10,
							unit : "km"
						}, {
							name : "Ø Geschwindigkeit",
							value : Math.round(highest_avg_speed * 36) / 10,
							unit : "km/h"
						}, {
							name : "Max. Geschwindigkeit",
							value : Math.round(highest_speed * 36) / 10,
							unit : "km/h"
						}, {
							name : "Kalorienverbrauch",
							value : Math.round(most_kcal),
							unit : "kcal"
						} ];

					}

					/**
					 * 
					 */
					function getAvgPerformancesOfDiscipline(activity_type,
							period) {
						var count = 0;
						var first_activity_time = 0;
						var total_duration = 0;
						var total_distance = 0;
						var total_calories = 0;
						var time = new Date().getTime() / 1000 - period;

						var i;
						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							if (activities[i].type == activity_type) {
								count++;
								total_duration += activities[i].duration;
								total_distance += activities[i].distance;
								total_calories += calcCalories(activities[i]);
								if (activities[i].start_time < first_activity_time
										|| first_activity_time == 0) {
									first_activity_time = activities[i].start_time;
								}
							}
						}

						if (period == -1) {
							period = new Date().getTime() / 1000
									- first_activity_time;
						}
						var days = period / 60 / 60 / 24;
						var avg_speed = total_distance / total_duration;
						var dist_per_day = total_distance / days;
						var time_per_day = total_duration / days;
						var cal_per_day = total_calories / days;

						return [ {
							name : "Ø Geschwindigkeit",
							value : Math.round(avg_speed * 36) / 10,
							unit : "km/h"
						}, {
							name : "Strecke",
							value : Math.round(dist_per_day / 100) / 10,
							unit : "km/Tag"
						}, {
							name : "Zeit",
							value : Math.round(time_per_day / 60),
							unit : "Min/Tag"
						}, {
							name : "Kalorienverbrauch",
							value : Math.round(cal_per_day),
							unit : "kcal/Tag"
						} ];

					}

					/**
					 * Determines the duration of all activities for each day.
					 * 
					 * @param {Number}
					 *            days Number of days.
					 * @return {Array} Array that contains all durations for
					 *         each day in minutes.
					 */
					function getDurations(days) {
						var today = new Date().getTime() / 1000;
						var durations = [];
						for (var i = days - 1; i >= 0; i--) {
							durations
									.push(getDurationPerDay(today - 86400 * i) / 60);
						}
						return durations;
					}

					/**
					 * Determines the distance of all activities for each day.
					 * 
					 * @param {Number}
					 *            days Number of days.
					 * @return {Array} Array that contains all distances for
					 *         each day in km.
					 */
					function getDistances(days) {
						var today = new Date().getTime() / 1000;
						var distances = [];
						for (var i = days - 1; i >= 0; i--) {
							distances
									.push(getDistancePerDay(today - 86400 * i) / 1000);
						}
						return distances;
					}

					/**
					 * Determines the burned calories of all activities for each
					 * day.
					 * 
					 * @param {Number}
					 *            days Number of days.
					 * @return {Array} Array that contains all calories for each
					 *         day in kcal.
					 */
					function getCalories(days) {
						var today = new Date().getTime() / 1000;
						var calories = [];
						for (var i = days - 1; i >= 0; i--) {
							calories.push(getCaloriesPerDay(today - 86400 * i));
						}
						return calories;
					}

					/**
					 * 
					 */
					function getDurationOfDiscipline(discipline, period) {
						var time = new Date().getTime() / 1000 - period;
						var duration = 0;

						var i;
						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							if (activities[i].type == discipline) {
								duration += activities[i].duration;
							}
						}

						return duration;
					}

					/**
					 * 
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
						var date = new Date().getTime() / 1000 - 60 * 60 * 10;
						var track = [];
						var x;

						for (var i = 0; i < 1053; i++) {
							start = Math.floor(date - Math.random() * 60 * 60
									* 10);
							end = Math.floor(start + Math.random() * 60 * 60
									* 2);
							date = start;

							if (Math.random() < 0.5) {
								activities.push(new Activity(id--, 'Laufen',
										start, end, track, '',
										Math.random() * 12000));
							} else {
								activities.push(new Activity(id--, 'Radfahren',
										start, end, track, '',
										Math.random() * 12000));
							}
						}
						return activities;
					}

					/**
					 * Determines the maximum speed of an activity.
					 * 
					 * @param activity
					 *            {Activity} activity.
					 * @return {Number} maximum speed.
					 */
					function getMaxSpeed(activity) {
						var track_records = activity.track_data.track_records;
						var max_speed = 0;
						var i;
						for (i in track_records) {
							if (track_records[i].speed > max_speed) {
								max_speed = track_records[i].speed;
							}
						}
						return max_speed;
					}

					/**
					 * Determines the duration of all activities of the
					 * specified day.
					 * 
					 * @param day
					 *            {Number} Unix-Timestamp of an arbitrary time
					 *            of a day.
					 * @return {Number} duration in seconds.
					 */
					function getDurationPerDay(day) {
						var duration = 0;
						var i;
						for (i in activities) {
							if (isSameDay(activities[i].start_time, day)) {
								duration += activities[i].duration;
							}
						}
						return duration;
					}

					/**
					 * Determines the distance of all activities of the
					 * specified day.
					 * 
					 * @param day
					 *            {Number} Unix-Timestamp of an arbitrary time
					 *            of a day.
					 * @return {Number} distance in meters.
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
					 * Determines the burned calories of all activities of the
					 * specified day.
					 * 
					 * @param day
					 *            {Number} Unix-Timestamp of an arbitrary time
					 *            of a day.
					 * @return {Number} calories in kcal.
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
					 * @return burned calories in kcal.
					 */
					function calcCalories(activity) {
						var met;
						// determine MET
						if (activity.type == "Radfahren") {
							met = 8;
						} else if (activity.type == "Laufen") {
							met = 11;
						}
						// consider gender
						if (user.gender == "Weiblich") {
							met *= 0.9;
						}
						// calculate kcal
						// MET * kg * hours
						var hours = activity.duration / 60 / 60;
						var kcal = met * user.weight * hours;
						return kcal;
					}

					function isSameDay(timestamp_a, timestamp_b) {
						date_a = new Date(timestamp_a * 1000).setHours(0, 0, 0,
								0);
						date_b = new Date(timestamp_b * 1000).setHours(0, 0, 0,
								0);
						if (date_a === date_b) {
							return true;
						}
						return false;
					}

					function getGreatestSpeed() {
						return 42;
					}

					function getGreatestHeightDiff() {
						return 42;
					}

					function getLongestTrack() {
						return 42;
					}

					function getOverallTime() {
						var duration = 0;
						var i;
						for (i in activities) {
							duration += activities[i].duration;
						}
						return duration;
					}

					function getAllActivityTypes() {
						var types = [];
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
'use-strict';
angular
		.module('ActivityLogger')
		.factory(
				'SummaryService',
				function(Activity, Track, TrackRecord) {

					var activities = getRandomActivities();

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
						performances = [ {
							name : "Zurückgelegte Strecke",
							value : 42
						}, {
							name : "Zeit insgesamt",
							value : getOverallTime()
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
						var time = new Date().getTime() / 1000 - period;

						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							if (activities[i].type == activity_type) {
								var dist = activities[i].track_data
										.getDistance();
								var avg_speed = dist / activities[i].duration;

								if (dist > longest_track) {
									longest_track = dist;
								}
								if (avg_speed > highest_avg_speed) {
									highest_avg_speed = avg_speed;
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
						} ];

					}

					/**
					 * 
					 */
					function getAvgPerformancesOfDiscipline(activity_type,
							period) {
						var count = 0;
						var total_duration = 0;
						var total_distance = 0;
						var time = new Date().getTime() / 1000 - period;

						for (i in activities) {
							if (activities[i].start_time < time && period != -1) {
								continue;
							}
							if (activities[i].type == activity_type) {
								count++;
								total_duration += activities[i].duration;
								total_distance += activities[i].track_data
										.getDistance();
							}
						}

						var avg_speed = total_distance / total_duration;

						return [ {
							name : "Ø Geschwindigkeit",
							value : Math.round(avg_speed * 36) / 10,
							unit : "km/h"
						} ];

					}

					function getActivityDurationPerDay(day) {
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
					 * Determines the duration of all activities for each day.
					 * 
					 * @param {Number}
					 *            days Number of days.
					 * @return {Array} Array that contains all durations for
					 *         each day.
					 */
					var getDurations = function(days) {
						var today = new Date().getTime() / 1000;
						var durations = [];
						for (var i = days - 1; i >= 0; i--) {
							durations.push(getActivityDurationPerDay(today
									- 86400 * i));
						}
						return durations;
					}

					// PRIVATE FUNCTIONS

					function getRandomActivities() {
						var activities = [];
						var id = 1000;
						var date = new Date().getTime() / 1000 - 60 * 60 * 10;
						var track = new Track();
						var x;
						for (x = 0; x < 100; x++) {
							track.addTrackRecord(new TrackRecord(0, 0, 0, 42));
						}
						for (var i = 0; i < 1000; i++) {
							start = Math.floor(date - Math.random() * 60 * 60
									* 10);
							end = Math.floor(start + Math.random() * 60 * 60
									* 2);
							date = start;

							if (Math.random() < 0.5) {
								activities.push(new Activity(id--, 'Laufen',
										start, end, track, ''));
							} else {
								activities.push(new Activity(id--, 'Radfahren',
										start, end, track, ''));
							}
						}
						return activities;
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
						activities = getRandomActivities();
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
						getActivityDurationPerDay : getActivityDurationPerDay,
						getDurations : getDurations,
						getAveragePerformances : getAveragePerformances
					};

					return service;

				});
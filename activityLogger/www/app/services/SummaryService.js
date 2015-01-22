'use-strict';
angular
		.module('ActivityLogger')
		.factory(
				'SummaryService',
				function(Activity) {

					// PUBLIC FUNCTIONS

					function getOverallRecords() {
						return [ {
							name : "Längste Strecke",
							value : getLongestTrack()
						}, {
							name : "Höchste Geschwindigkeit",
							value : getGreatestSpeed()
						}, {
							name : "Größter Höhenunterschied",
							value : getGreatestHeightDiff()
						} ];
					}

					function getAllDisciplineRecords() {
						var all_records = [];
						var disciplines = getAllActivityTypes();
						var i;
						for (i in disciplines) {
							all_records
									.push({
										discipline : disciplines[i],
										records : getRecordsOfDiscipline(disciplines[i])
									})
						}
						return all_records;
					}

					function getRecordsOfDiscipline(activity_type) {
						return [ {
							name : "Beste Zeit",
							value : 42
						}, {
							name : "Höchste Geschwindigkeit",
							value : 42
						}, {
							name : "Größter Höhenunterschied",
							value : 42
						} ];

					}

					function getOverallPerformances() {
						performances = [ {
							name : "Zurückgelegte Strecke",
							value : 42
						}, {
							name : "Zeit insgesamt",
							value : getOverallTime()
						} ];
						return performances;
					}

					function getActivityDurationPerDay(day) {
						activities = getRandomActivities();
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
						for (var i = 0; i < 1000; i++) {
							start = Math.floor(date - Math.random() * 60 * 60
									* 10);
							end = Math.floor(start + Math.random() * 60 * 60
									* 2);
							date = start;
							activities.push(new Activity(id--, 'Laufen 100m',
									start, end, [], ''));
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
						return [ "Laufen 100m", "Laufen 2KM", "Radfahren 50KM" ];
					}

					var service = {
						getOverallRecords : getOverallRecords,
						getRecordsOfDiscipline : getRecordsOfDiscipline,
						getAllDisciplineRecords : getAllDisciplineRecords,
						getOverallPerformances : getOverallPerformances,
						getActivityDurationPerDay : getActivityDurationPerDay,
						getDurations : getDurations
					};

					return service;

				});
'use-strict';
angular.module('ActivityLogger').factory('SummaryService', function() {

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
			all_records.push({
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
			value : 42
		} ];
		return performances;
	}

	// PRIVATE FUNCTIONS

	function getGreatestSpeed() {
		return 42;
	}

	function getGreatestHeightDiff() {
		return 42;
	}

	function getLongestTrack() {
		return 42;
	}

	function getAllActivityTypes() {
		return [ "Laufen 100m", "Laufen 2KM", "Radfahren 50KM" ];
	}

	var service = {
		getOverallRecords : getOverallRecords,
		getRecordsOfDiscipline : getRecordsOfDiscipline,
		getAllDisciplineRecords : getAllDisciplineRecords,
		getOverallPerformances : getOverallPerformances
	};

	return service;

});
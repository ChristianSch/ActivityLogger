'use strict';
angular.module('ActivityLogger').factory('Track', function() {

	var Track = function() {
		this.track_records = [];

		this.addTrackRecord = function(record) {
			this.track_records.push(record);
		}
		
		/**
		 * Calculates the distance of the track.
		 * @return distance
		 */
		this.getDistance(){
			//TODO
			return 42;
		}

	};
	return Track;

});

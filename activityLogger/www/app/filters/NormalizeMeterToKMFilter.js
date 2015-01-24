'use-strict';


angular.module('ActivityLogger')
	/**
	 * Normalize meters to kilometers
	 * 
	 * @param  {Number} to normalize
	 * @return {String}   normalized distance as String
	 */
    .filter('normalizeMeterToKMFilter', function() {
        return function(meter) {
            return meter / 1000;
        };
    });
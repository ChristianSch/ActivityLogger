'use-strict';


angular.module('ActivityLogger')
	/**
	 * Normalize time (in minutes, hours, seconds)
	 * 
	 * @param  {Number} to normalize
	 * @return {String}   normalized number as String
	 */
    .filter('normalizeTimeFilter', function() {
        return function(input) {
            if (input < 10) {
            	return '0' + input;
            }

            return input;
        };
    });
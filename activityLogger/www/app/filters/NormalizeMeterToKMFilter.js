'use-strict';


angular.module('ActivityLogger')
	/**
	 * Normalize meters to kilometers
	 * 
	 * @param  {Number} to normalize
	 * @return {String}   normalized distance as String
	 */
    .filter('normalizeMeterToKMFilter', function($filter) {
        return function(meter) {
            return $filter('number')(meter / 1000, 2);
        };
    });
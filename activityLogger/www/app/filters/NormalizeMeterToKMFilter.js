/**
 * @author Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .filter('normalizeMeterToKMFilter',
            function($filter) {
                /**
                 * Normalize meters to kilometers
                 *
                 * @param  {Number} to normalize
                 * @return {String}   normalized distance as String
                 */
                return function(meter) {
                    // note that the `number` filter gets utilised to 
                    // format the figure to 2 decimal places
                    return $filter('number')(meter / 1000, 2);
                };
            });
})();
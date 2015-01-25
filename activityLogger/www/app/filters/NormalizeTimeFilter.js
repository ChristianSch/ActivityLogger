/**
 * @author Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .filter('normalizeTimeFilter',
            function() {
                /**
                 * Normalize time (in minutes, hours, seconds)
                 *
                 * @param  {Number} to normalize
                 * @return {String}   normalized number as String
                 */
                return function(input) {
                    if (input < 10) {
                        return '0' + input;
                    }

                    return input;
                };
            });
})();
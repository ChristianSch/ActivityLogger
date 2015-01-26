/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .filter('convertMillisecondsToMinutesFilter',
        function($filter) {
            /**
             * Converts seconds in minutes
             *
             * @param  {Number}   seconds to convert
             * @return {String}   converted number as String
             */
            return function(milliseconds) {
                var minutes = (milliseconds / (1000 * 60));
                var seconds = (milliseconds / 1000) % 60;
                return $filter('number')(minutes , 0) + ":" + $filter('number')(seconds, 2);

            };
        });
})();
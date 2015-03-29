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

                var minuteString = $filter('number')(minutes, 0);
                var secondString = $filter('number')(seconds, 2);
                if(minutes < 10) {
                    minuteString = "0" + minuteString;
                }
                if(seconds < 10) {
                    secondString = "0" + secondString;
                }

                return minuteString + ":" + secondString;

            };
        });
})();
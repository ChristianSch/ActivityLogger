/**
 * @author Rene Lutz
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .filter('normalizeDateFilter',
        function() {
            /**
             * Normalizes a timestamp in a Date (hh:mm:ss dd.mm.yyyy)
             *
             * @param  {timestamp} to normalize
             * @return {String}   normalized timestamp as String
             */
            return function(timestamp) {
                var dateString;
                var date = new Date(timestamp);
                var hourString = date.getHours();
                var minuteString = date.getMinutes();
                var secondString = date.getSeconds();

                if(date.getHours()< 10) {
                    hourString = "0" + hourString;
                }
                if(date.getMinutes() < 10) {
                    minuteString = "0" + minuteString;
                }
                if(date.getSeconds() < 10) {
                    secondString = "0" + secondString;
                }
                dateString = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " +
                             hourString + ":" + minuteString + ":" + secondString;

                return dateString;
            };
        });
})();
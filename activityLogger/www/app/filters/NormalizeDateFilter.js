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

                dateString = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " +
                             date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

                return dateString;
            };
        });
})();
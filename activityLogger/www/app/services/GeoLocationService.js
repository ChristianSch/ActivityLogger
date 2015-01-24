'use strict';


/**
 * @description This service provides an abstraction to the
 * cordova geolocation plugin.
 */
angular.module('ActivityLogger').service('GeoLocationService',
    function() {
        var watchID;

        /**
         * @description Registering location watcher
         *
         * @param  {function} success called on success
         * @param  {function} error   called on error
         *
         * @see stop
         */
        function start(success, error) {
            watchID = navigator.geolocation.watchPosition(success, error, {
                timeout: 30000,
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        }

        /**
         * @description Remove registered location watcher
         *
         * @see start
         */
        function stop() {
            if (watchID)
                navigator.geolocation.clearWatch(watchID);
        }

        return {
            start: start,
            stop: stop
        };
    });
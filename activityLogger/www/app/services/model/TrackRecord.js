'use strict';


angular.module('ActivityLogger').factory('TrackRecord',
    function() {
        var TrackRecord = function(latitude, longitude, altitude, speed) {
            this.latitude = latitude;
            this.logitude = longitude;
            this.altitude = altitude;
            this.speed = speed;

            /**
             * Calculates the distance between this and the specified TrackRecord.
             * @param track_record TrackRecord
             * @return distance
             */
            this.getDistance = function(track_record) {
                // TODO
                return 1
            };
        };

        return TrackRecord;
    });
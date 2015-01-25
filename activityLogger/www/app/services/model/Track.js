'use strict';


angular.module('ActivityLogger').factory('Track',
    function() {
        var Track = function() {
            this.track_records = [];

            this.addTrackRecord = function(record) {
                this.track_records.push(record);
            }

            /**
             * Calculates the distance of the track.
             *
             * @return distance
             */
            this.getDistance = function() {
                var dist = 0;

                for (var i in this.track_records) {
                    dist += this.track_records[i].getDistance();
                }

                return dist;
            }
        };

        return Track;
    });
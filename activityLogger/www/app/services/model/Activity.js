'use strict';


angular.module('ActivityLogger').factory('Activity',
    function() {
        var Activity = function(id, type, start_time, end_time, track_data,
            comment, distance, userId) {
            this.id = id;
            this.userId = userId;
            this.type = type;
            this.start_time = start_time;
            this.end_time = end_time;
            this.track_data = track_data;
            this.comment = comment;
            this.distance = distance;
            this.duration = this.end_time - this.start_time;
        };

        return Activity;
    });
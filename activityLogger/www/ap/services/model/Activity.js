/**
 * Created by Fosso on 30.11.2014.
 */
'use strict';
angular.module('ActivityLogger').factory('Activity',
    function () {

        var Activity = function (id,sport,distance,duration,altitude,track_data,video,comment) {
            this.id = id;
            this.sport =sport;
            this.distance =distance;
            this.duration = duration;
            this.altitude= altitude;
            this.track_data = track_data;
            this.datum=new Date();
            this.video = video;
            this.comment=comment;

        };
        return Activity;

    });

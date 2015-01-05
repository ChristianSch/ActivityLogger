'use strict';
angular.module('ActivityLogger').factory('Competition',
    function () {

        var Competition = function (id, user_id1, user_id2, activity_id1, activity_id2, distance) {
            this.id = id;
            this.user_id1 = user_id1;
            this.user_id2 = user_id2;
            this.activity_id1 = activity_id1;
            this.activity_id2 = activity_id2;
            this.distance = distance;
        };
        return Competition;

    });


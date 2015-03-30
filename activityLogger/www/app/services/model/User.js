'use strict';


angular.module('ActivityLogger').factory('User',
    function() {
        var User = function(id, firstname, surname, gender, cloud,
            weight, size) {
            this.id = id;
            this.firstname = firstname;
            this.surname = surname;
            this.gender = gender;
            this.cloud = cloud;
            this.weight = weight;
            this.size = size;
        };

        return User;
    });
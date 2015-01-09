'use-strict';
angular.module('ActivityLogger').factory('DataService',
    function () {
        var service = {
            addUser: function (user) {
                 if(user.add_onfirebase){
                     //TO DO :persit on firebase
                     alert(" persit on firebase ...");
                     localStorage.setItem('infirebaseSaved','true');
                 }else{
                     localStorage.setItem('infirebaseSaved','false');
                     localStorage.setItem('Userprofil', JSON.stringify(user));
                 }
            },
            getUserProfil:function(){
                return  JSON.parse(localStorage.getItem('Userprofil'));
            },
            addActivity: function (activity) {

            }
            ,

            addCompetition: function (competition) {

            }
            ,

            removeUser: function (id) {

            }
            ,

            removeActivity: function (id) {

            }
            ,

            removeCompetition: function (id) {

            }
            ,

            updateUser: function (user) {

            }
            ,

            updateActivity: function (activity) {

            }
            ,

            getAllUsers: function () {

            }
            ,

            getAllActivities: function (user_id) {

            }
            ,

            getAllCompetitions: function (user_id) {

            },

            getUserByID: function (id) {

            },

            getActivityByID: function (id) {

            },

            getCompetitionByID: function (id) {

            }
        };

        return service;

    })
;
/**
 * Created by Fosso on 30.11.2014.
 */
'use strict';
angular.module('ActivityLogger').factory('Profil',
    function () {

        var Profil = function (name, vorname, username, alt, gewicht, grosse, isMann, nationality) {
            //this.id = id;
            this.name = name;
            this.vorname = vorname;
            this.username = username;
            this.alt = alt;
            this.gewicht = gewicht;
            this.grosse = grosse;
            this.isMann = isMann;
            this.nationality = nationality;
        };
        return Profil;

    });


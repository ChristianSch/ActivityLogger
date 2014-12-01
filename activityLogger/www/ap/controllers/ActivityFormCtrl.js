/**
 * Created by Fosso on 29.11.2014.
 */
angular.module('ActivityLogger').controller('ActivityFormCtrl',
    function ($scope) {

        this.activity={};
        this.sports=["Schwimmen","Rennen","Fahrt "];
        this.distances=["0","100 m","200 m","1000 m"];
        this.altitudes=["0m aufwährt","1m  aufwährt","2m  aufwährt","3m  aufwährt","0m abwährt","1m  abwährt","2m  abwährt","3m  abwährt"];
    });
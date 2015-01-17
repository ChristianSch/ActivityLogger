'use strict';


angular.module('ActivityLogger')
    .controller('TabCtrl',
        function($scope, DataService) {
            this.hasUser = DataService.getStatus('user') ? true : false;
        });
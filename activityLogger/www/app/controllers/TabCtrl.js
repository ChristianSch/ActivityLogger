'use strict';


angular.module('ActivityLogger')
    .controller('TabCtrl',
        function($scope, DataService) {
            $scope.hasUser = DataService.getStatus('user') ? true : false;
        });
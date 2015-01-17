'use strict';


angular.module('ActivityLogger')
    .controller('TabCtrl',
        function($scope, $ionicPopover, DataService) {
            this.show_hide = function() {
                if (DataService.getStatus('user')) {
                    return "ng-show";
                } else {
                    return "ng-hide";
                }
            };
        });
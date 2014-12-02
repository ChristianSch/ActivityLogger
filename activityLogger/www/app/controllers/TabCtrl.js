'use strict';
angular.module('ActivityLogger').controller('TabCtrl',
    function ($scope, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('popover.html', {

            scope: $scope

        }).then(function (popover) {
            $scope.popover = popover;

        });
        this.Showsummary = function () {
            alert(" gO TO Stat !!");
        }
    })

/**
 * Created by Fosso on 30.11.2014.
 */
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

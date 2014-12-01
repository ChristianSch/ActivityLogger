angular.module('ActivityLogger').controller('MainCtrl',
function ($scope, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('popover.html', {

        scope: $scope

    }).then(function (popover) {
        $scope.popover = popover;

    });
})
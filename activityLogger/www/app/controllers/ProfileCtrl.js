/**
 * @author Rene Lutz
 */
(function() {
    'use strict';
    angular.module('ActivityLogger')
        .controller('ProfileCtrl',
        function ($scope, $ionicPopup, MockDataService, User) {
            this.cloud = false;
            this.genders = ["male", "female"];
            this.user = new User("", "", "", "", "", "", "");
            this.user.gender = this.genders[0];

            function checkSize(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }
            function checkWeight(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            this.save = function () {
                //Check if Accountname is available
                console.log("Test123");
                MockDataService.addUser(this.user);
            };
        });
})();

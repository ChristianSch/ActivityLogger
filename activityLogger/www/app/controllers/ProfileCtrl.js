'use strict';
angular.module('ActivityLogger')
    .controller('ProfileCtrl',
    function ($scope, $ionicPopup, DataService, $timeout, $state) {
        var thisCtrl = this;
        var userId = DataService.getCurrentUserId();
        var user = DataService.getUserByID(userId);

        this.user = {};
        this.user_id = ""; //users secret
        this.loginOption = false;
        this.RegisterOption = false;

        this.logoutOption = userId ? true : false;

        $scope.showloginOption = function () {
            thisCtrl.loginOption = true;
            thisCtrl.RegisterOption = false;
            thisCtrl.login_out = "Logout";
            localStorage.removeItem("user");
        };
        $scope.showRegisterOption = function () {
            thisCtrl.RegisterOption = true
            thisCtrl.loginOption = false;
            $scope.logout();
            localStorage.removeItem("user");
            localStorage.removeItem('activities_CurrUser');
        };

        $scope.login = function () {
            localStorage.removeItem('activities_CurrUser');
            thisCtrl.user_id=thisCtrl.user_id.toLowerCase();

            console.log("low case log");
            console.log(thisCtrl.user_id);
            DataService.setCurrentUserId(thisCtrl.user_id).then(function (curUserId) {
                thisCtrl.user = DataService.getUserByID(curUserId);
                thisCtrl.login_Ok = true;
            }, function (error) {
                showErrorMess(error);
                thisCtrl.login_Ok = false;
            });
        };

        $scope.logout = function () {
            localStorage.removeItem("userId");
            thisCtrl.user = {};
            thisCtrl.logoutOption = false;
            localStorage.removeItem('activities_CurrUser');
        };

        $scope.showInfo = function (title, mess) {
            $ionicPopup.alert({
                title: title,
                template: mess,
                buttons: [{
                    text: 'Ok',
                    type: 'button-positive'
                }]
            });
        };
        this.genders = ["masculine ", "feminine"];
        function valide(user) {
            var error = "";
            var leer = "   darf nicht leer sein <br>";
            var positif = "  muss  > 0 sein <br>";


            if (!user.surname || user.surname.length == 0) {
                error += "Surname" + leer;
            }
            if (!user.firstname || user.firstname.length == 0) {
                error += "Firstname" + leer;

            }
            if (!user.weight || user.weight.length == 0) {
                error += "Weight" + leer;

            }
            if (!user.size || user.size.length == 0) {
                error += "Size " + leer;
            }
            if (!user.gender || user.gender.length == 0) {
                error += "Gender " + leer;
            }
            if (!user.id || user.id.length == 0) {
                error += "Usersname " + leer;
            }
            if (checkSize(user.size)) {
                if (((parseInt(user.size) || parseFloat(user.size)) <= 0)) {
                    error += "Size" + positif;
                }
            } else {
                error += "Size" + positif;
            }
            if (checkWeight(user.weight)) {
                if (((parseInt(user.weight) || parseFloat(user.weight)) <= 0)) {
                    error += "Weight" + positif;
                }

            } else {
                error += "Weight" + positif;
            }
            function checkSize(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }
            function checkWeight(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            return error;
        };

        function showErrorMess(mess) {
            $ionicPopup.alert({
                title: 'Error',
                template: mess,
                buttons: [{
                    text: 'Close',
                    type: 'button-positive'
                }]
            });
        };

        var isSave = false;


        $scope.save = function () {
            var error = valide(thisCtrl.user);
            if (error == ""){
                thisCtrl.user.id=thisCtrl.user.id.toLowerCase();
                DataService.addUser(thisCtrl.user).
                    then(function (currUsrId) {
                        $state.go('tab.main');
                    }, function (error) {
                        showErrorMess(error);
                    }
                );

            } else {
                $ionicPopup.alert({
                    title: 'Input error',
                    template: error
                });
            }
        };
        $scope.update = function () {
            var error = valide(thisCtrl.user);
            if (error == "") {
                DataService.updateUser(thisCtrl.user);
            } else {
                $ionicPopup.alert({
                    title: 'Input error',
                    template: error
                });
            }
        };

    });

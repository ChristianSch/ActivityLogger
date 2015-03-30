/**
 * @author Rene Lutz
 */
(function() {
    'use strict';
    angular.module('ActivityLogger')
        .controller('ProfileCtrl',
        function ($scope, $ionicPopup, MockDataService, User) {
            this.cloud = false;
            this.knownUser = JSON.parse(localStorage.getItem("knownUser")) || [];
            this.genders = ["male", "female"];
            this.user = new User("", "", "", "", "", "", "");
            this.user.gender = this.genders[0];

            function checkName(name) {
                return /[a-zA-Z]+$/.test(name);
            }
            function checkNumber(str) {
                return /^[+|-]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            this.changeUser = function (id) {
                console.log("switching to user: " + id);
                MockDataService.setCurrentUserId(id);
            }

            this.save = function () {
                this.knownUser = JSON.parse(localStorage.getItem("knownUser")) || [];
                var users = MockDataService.getAllUsers();
                var user;
                var alertPopup;
                //Check if Accountname is available
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id == this.user.id) {
                        alertPopup = $ionicPopup.alert({
                            title: 'Eingabefehler',
                            template: 'Accountname is already in use'
                        });
                        alertPopup.then(function (res) {
                            console.log("Accountname popup");
                        });
                        return null;
                    }
                }
                //Accountname
                if(this.user.id == "") {
                    alertPopup = $ionicPopup.alert({
                        title: 'Eingabefehler',
                        template: 'Accountname must contain at least 1 Character [a-zA-Z0-9]!'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //First name
                if(checkName(this.user.firstname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Eingabefehler',
                        template: 'Invalid Characters in First name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //Last name
                if(checkName(this.user.surname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Eingabefehler',
                        template: 'Invalid Characters in Last name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("Last name popup");
                    });
                    return null;
                }
                //Weight
                if(checkNumber(this.user.weight)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Eingabefehler',
                        template: 'Invalid Characters in Weight! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }
                //Size
                if(checkNumber(this.user.size)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Eingabefehler',
                        template: 'Invalid Characters in Weight! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }
                //if(abort) break;
                user = new User(this.user.id, this.user.firstname, this.user.surname, this.user.gender, this.user.birthday, this.user.weight, this.user.size);
                MockDataService.addUser(user);
                this.knownUser.push(user);
                localStorage.setItem("knownUser", JSON.stringify(this.knownUser));
                console.log(this.knownUser);
            }
        });
})();

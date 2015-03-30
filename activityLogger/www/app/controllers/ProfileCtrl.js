/**
 * @author Rene Lutz
 */
(function() {
    'use strict';
    angular.module('ActivityLogger')
        .controller('ProfileCtrl',
        function ($scope, $ionicPopup, MockDataService, User) {
            this.loginID = "";
            this.loginFlag = localStorage.getItem("loginFlag") || false;
            this.userCache = JSON.parse(localStorage.getItem("userCache")) || [];
            this.user = new User("", "", "", "", false, "", "");
            this.genders = ["male", "female"];
            this.user.gender = this.genders[0];

            /**
             * Checks if the given String is a valid Namestring for
             * @param name
             * @returns {boolean}
             */
            function checkName(name) {
                return /[a-zA-Z]+$/.test(name);
            }
            function checkNumber(str) {
                return /^[+|-]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            this.clearUserCache = function() {
                this.userCache = [];
                localStorage.setItem("userCache", null);
            }

            this.rememberUser = function(id) {
                console.log("Remember user " + id);
                var insert = true;
                var alertPopup;
                var user;
                this.userCache = JSON.parse(localStorage.getItem("userCache")) || [];
                for(var i = 0; i < this.userCache.length; i++) {
                    if(this.userCache[i].id == id) {
                        insert = false;
                        break;
                    }
                }
                if(insert) {
                    user = MockDataService.getUserByID(id);
                    if(user === null){
                        alertPopup = $ionicPopup.alert({
                            title: 'Insert error',
                            template: 'User is not registered in the preferred storage!'
                        });
                        alertPopup.then(function (res) {
                            console.log("rememberUserError");
                        });
                    } else {
                        this.userCache.push(user);
                        localStorage.setItem("userCache", JSON.stringify(this.userCache));
                    }
                }
            }

            this.logout = function() {
                this.loginFlag = false;
                localStorage.setItem("loginFlag", false);
                this.user = new User("", "", "", "", false, "", "");
                MockDataService.setCloudConnection(false);
                MockDataService.setCurrentUserId("ÄÖÜ");
            }

            this.loginUser = function(){
                var available = false;
                var users = MockDataService.getAllUsers();
                var alertPopup;

                for(var i = 0; i < users.length; i++) {
                    if(users[i].id == this.loginID) {
                        available = true;
                    }
                }
                if(available) {
                    this.rememberUser(this.loginID);
                    this.changeUser(this.loginID);
                } else {
                    alertPopup = $ionicPopup.alert({
                        title: 'Login error',
                        template: 'Accountname is wrong'
                    });
                    alertPopup.then(function (res) {
                        console.log("Accountname popup");
                    });
                }
            }

            this.changeUser = function (id) {
                this.user = MockDataService.getUserByID(id);
                MockDataService.setCurrentUserId(id);
                MockDataService.setCloudConnection(this.user.cloud);

                this.loginFlag = true;
                localStorage.setItem("loginFlag", true);
                var alertPopup = $ionicPopup.alert({
                    title: 'Login successful',
                    template: 'You are now logged in as ' + id
                });
                alertPopup.then(function (res) {
                    console.log("First name popup");
                });
            }

            this.register = function() {
                var users = MockDataService.getAllUsers();
                var user;
                var alertPopup;
                //Check if Accountname is available
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id == this.user.id) {
                        alertPopup = $ionicPopup.alert({
                            title: 'Input error',
                            template: 'Accountname is already in use'
                        });
                        alertPopup.then(function (res) {
                            console.log("Accountname popup");
                        });
                        return null;
                    }
                }
                //Accountname
                if (this.user.id == "") {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Accountname must contain at least 1 Character [a-zA-Z0-9]!'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //First name
                if (!checkName(this.user.firstname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in First name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //Last name
                if (!checkName(this.user.surname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Last name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("Last name popup");
                    });
                    return null;
                }
                //Weight
                if (!checkNumber(this.user.weight)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Weight! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }
                //Size
                if (!checkNumber(this.user.size)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Size! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }

                this.loginFlag = true;
                user = new User(this.user.id, this.user.firstname, this.user.surname, this.user.gender, this.user.cloud, this.user.weight, this.user.size);
                MockDataService.setCloudConnection(user.cloud);
                MockDataService.addUser(user);
                this.rememberUser(user.id);
            }

            this.save = function () {
                var user;
                var alertPopup;
                var oldCloudSetup;
                //Accountname
                if(this.user.id == "") {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Accountname must contain at least 1 Character [a-zA-Z0-9]!'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //First name
                if(!checkName(this.user.firstname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in First name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("First name popup");
                    });
                    return null;
                }
                //Last name
                if(!checkName(this.user.surname)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Last name! Only A-Z and a-z is allowed.'
                    });
                    alertPopup.then(function (res) {
                        console.log("Last name popup");
                    });
                    return null;
                }
                //Weight
                if(!checkNumber(this.user.weight)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Weight! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }
                //Size
                if(!checkNumber(this.user.size)) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Input error',
                        template: 'Invalid Characters in Size! Numbers must be like xx or xx,x .'
                    });
                    alertPopup.then(function (res) {
                        console.log("Weight popup");
                    });
                    return null;
                }

                oldCloudSetup = MockDataService.getUserByID(this.userId)
                user = new User(this.user.id, this.user.firstname, this.user.surname, this.user.gender, this.user.cloud, this.user.weight, this.user.size);
                if(oldCloudSetup == null) {
                    MockDataService.setCloudConnection(this.user.cloud);
                    MockDataService.addUser(user);
                } else {
                    MockDataService.updateUser(user.id, user);
                }
            }
        });
})();

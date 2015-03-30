/**
 * @author Rene Lutz
 */
(function() {
    'use strict';
    angular.module('ActivityLogger')
        .controller('ProfileCtrl',
        function ($scope, $ionicPopup, MockDataService, User) {
            var emptyUser = new User("", "", "", "", false, "", "");
            this.loginID = "";
            this.loggedIn = localStorage.getItem("loggedIn") || false;
            this.knownUser = JSON.parse(localStorage.getItem("knownUser")) || [];
            this.genders = ["male", "female"];
            this.user = emptyUser;
            this.user.gender = this.genders[0];

            function checkName(name) {
                return /[a-zA-Z]+$/.test(name);
            }
            function checkNumber(str) {
                return /^[+|-]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            this.rememberUser = function(id) {
                this.knownUser = JSON.parse(localStorage.getItem("knownUser")) || [];
                console.log("Remember " + id);
                for(var i = 0; i < this.knownUser.length; i++) {
                    if(this.knownUser[i].id == id) {
                        console.log("knownUserAbort");
                        return null;
                    }
                }
                this.knownUser.push(MockDataService.getUserByID(id));
                localStorage.setItem("knownUser", JSON.stringify(this.knownUser));
            }

            this.logout = function() {
                this.loggedIn = localStorage.setItem("loggedIn", false);
                MockDataService.setCurrentUserId("Debug");
                this.user = emptyUser;
            }

            this.loginUser = function(){
                var alertPopup;
                var users = MockDataService.getAllUsers();
                //Check if Accountname is available
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id == this.loginID) {
                        this.rememberUser(this.loginID);
                        this.changeUser(this.loginID);
                        MockDataService.setCloudConnection(MockDataService.getUserByID(this.loginID))
                        localStorage.setItem("loggedIn", true);
                        return null;
                    }
                }
                alertPopup = $ionicPopup.alert({
                    title: 'Login error',
                    template: 'Accountname is wrong'
                });
                alertPopup.then(function (res) {
                    console.log("Accountname popup");
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
                //if(abort) break;
                this.loggedIn = true;
                MockDataService.setCloudConnection(this.user.cloud);
                user = new User(this.user.id, this.user.firstname, this.user.surname, this.user.gender, this.user.cloud, this.user.weight, this.user.size);
                MockDataService.addUser(user);
                this.rememberUser(user.id);
            }

            this.clearUserCache = function() {
                this.knownUser = [];
                localStorage.setItem("knownUser", JSON.stringify(this.knownUser));
            }

            this.changeUser = function (id) {
                this.loggedIn = true;
                this.user = MockDataService.getUserByID(id);
                MockDataService.setCurrentUserId(id);
                console.log(this.user);
                MockDataService.setCloudConnection(this.user.cloud);

                var alertPopup = $ionicPopup.alert({
                    title: 'Login successful',
                    template: 'You are now logged in as ' + id
                });
                alertPopup.then(function (res) {
                    console.log("First name popup");
                });
                return null;
            }

            this.save = function () {
                var user;
                var alertPopup;
                //Check if Accountname is available
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

                MockDataService.setCloudConnection(this.user.cloud);
                user = new User(MockDataService.getCurrentUserId(), this.user.firstname, this.user.surname, this.user.gender, this.user.cloud, this.user.weight, this.user.size);
                MockDataService.updateUser(MockDataService.getCurrentUserId(), user);
            }
        });
})();

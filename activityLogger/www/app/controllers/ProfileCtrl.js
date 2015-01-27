'use strict';
angular.module('ActivityLogger')
    .controller('ProfileCtrl',
    function ($scope, $ionicPopup, DataService, $timeout) {
        var thisCtl = this;
        var userId =localStorage.getItem('userId');
        var user=DataService.getUserByID(userId);
        if (user) {
            this.user=user;
        } else {
            this.user = {};
            this.user.id="";
        }

        this.genders = ["Männlich", "Weiblich"];
        function valide(user) {
            var error = "";
            var leer = "   darf nicht leer sein <br>";
            var positif = "muss  > 0 sein <br>";
            var isvalide = true;

            if (!user.surname || user.surname.length == 0) {
                error += "name" + leer;
                isvalide = false;
            }
            if (!user.firstname || user.firstname.length == 0) {
                error += "Vorname" + leer;
                isvalide = false;
            }
            if (!user.weight || user.weight.length == 0) {
                error += "Gewicht" + leer;
                isvalide = false;
            }
            if (!user.size || user.size.length == 0) {
                error += "Gewicht" + leer;
                isvalide = false;
            }

            if (checkSize(user.size)) {
                if (((parseInt(user.size) || parseFloat(user.size)) <= 0)) {
                    error += "Größe " + positif;
                    isvalide = false;
                }

            } else {
                error += "Größe " + positif;
                isvalide = false;
            }
            if (checkWeight(user.weight)) {
                if (((parseInt(user.weight) || parseFloat(user.weight)) <= 0)) {
                    error += " Gewicht" + positif;
                    isvalide = false;
                }

            } else {
                error += "Gewicht " + positif;
                isvalide = false;
            }
            function checkSize(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            function checkWeight(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            return error;
        };

        function equal(user1, user2) {
            return user1.usersName == user2.usersName;
        }
        function showErrorMess(mess) {
            $ionicPopup.alert({
                title: 'Fehler',
                template: mess,
                buttons: [{
                    text: 'Schließen',
                    type: 'button-positive'
                }]
            });
        }

        var isSave = false;

        this.hasUserId=function(){
            return localStorage.getItem('userId')?true:false;
        }
        this.save = function () {
            var error = valide(thisCtrl.user);
            if (error == "") {
                if (!localStorage.getItem('user')) {
                        DataService.addUser(thisCtl.user);
                } else {

                    DataService.updateUser(thisCtl.user);
                }
                isSave = true;
            } else {
                $ionicPopup.alert({
                    title: ' Eingabefehler ',
                    template: error
                });
            }


        };

        var thisCtrl = this;
        $scope.$on('$stateChangeStart',
            function (event) {
                //TODO
            }
        );
    });

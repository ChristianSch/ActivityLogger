'use strict';
angular.module('ActivityLogger').controller('ProfileCtrl',
    function ($scope, $ionicPopup,DataService, $timeout) {

        var user = DataService.getUserProfil();

        if (user) {
            this.user = user;

        } else {
            this.user = {};
        }


        this.genders = ["Männlich", "Weibliche"];

        function valide(user) {
            var error = "";
            var leer = "   darf nicht leer sein <br>";
            var positif = "muss  > 0 sein <br>";
            var isvalide = true;

            if (!user.surname|| user.surname.length == 0) {
                error += "name" + leer;
                isvalide = false;
            }
            if (!user.firstname || user.firstname.length == 0) {
                error += "Vorname" + leer;
                isvalide = false;
            }
            if (!user.birthday || user.birthday.length == 0) {
                error += "Alt" + leer;
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
            if (checkOld(user.birthday)) {
                if ((parseInt(user.birthday)) <= 0) {
                    error += " Alt " + positif;
                    isvalide = false;
                }

            } else {
                error += " ALt " + positif;
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
            function checkOld(str) {
                return /^ *[0-9]+ *$/.test(str);
            }

            function checkSize(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            function checkWeight(str) {
                return /^[+]?[0-9]+(\.[0-9]+)?$/.test(str);
            }

            return error;
        }


        var thisCtl = this;
        var isSave = false;

        this.save = function () {
            var error = valide(this.user);
            if (error == "") {
                var confirmPopup = $ionicPopup.confirm({
                    title: " Daten Speicherung ",
                    template: 'Ihre Daten wurden erfolgreich local gespeichert  <br>Sollen diese auch aus Wettkampft Gründ in einer externen Datenbank gespeichert werden ? '

                });
                confirmPopup.then(function (res) {
                    if (res) {
                        thisCtl.user.add_onfirebase=true;
                      //TO DO: persit and bind usersdata to a backend(for example firebase)
                    }
                    DataService.addUser(thisCtl.user);

                });
                isSave = true;
            } else {
                if (error != "") {
                    $ionicPopup.alert({
                        title: ' Eingabefehler ',
                        template: error
                    });
                }
            }
        }
        var thisCtrl = this;
        $scope.$on('$stateChangeStart',
            function (event) {
                if (!isSave) {
                    thisCtrl.save();
                }
            }
        );
    }
)
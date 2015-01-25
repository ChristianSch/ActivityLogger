'use strict';
angular.module('ActivityLogger')
    .controller('SettingsCtrl',
        function($scope, DataService,$window, $ionicPopup) {
            var thisCtrl = this;
            var firebaseConection = localStorage.getItem('firebaseConection');
            var autoStop =localStorage.getItem('autoStop');

            if (firebaseConection) {
                if ((firebaseConection) == 'true') {
                    this.firebaseConection = true;
                } else {
                    this.firebaseConection = false;
                }
            } else {
                this.firebaseConection = false;
            }
            if (autoStop) {
                if ((autoStop) == 'true') {
                    this.autoStop = true;
                } else {
                    this.autoStop = false;
                }
            } else {
                this.autoStop = false;
            }


            this.save = function() {
                //TODO: save all Settings in Localstorage
                localStorage.setItem('firebaseConection', this.firebaseConection);
                localStorage.setItem('autoStop', thisCtrl.autoStop);
            }

            var thisCtrl = this;
            var connectedRef;
            this.connectWithFirebase = function() {
                if (!thisCtrl.firebaseConection) { // Confirm connection only if not connected
                    var confirmPopup = $ionicPopup.confirm({
                        title: " Firebase Verbindung",
                        cancelText: 'Abbrechen',
                        template: 'Wenn Sie die Verbindung mit der externe Datenbank Firebase zulassen werden ' +
                            'Ihre  Profil und Aktivitätsdaten in dieser gespeichert, synchronisiert  und mit Daten anderer User vergleichen<br>' +
                            'Diese Option ist für den Wettkampftsmodus erforderlich<br>' +
                            'Wollen Sie es wirklich zulassen ? '
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                             //1.check Internet connection
                             connectedRef = new Firebase("https://activtitylogger.firebaseio.com/.info/connected");
                             connectedRef.on("value", function(snap) {
                                if (snap.val() === true) {

                                    localStorage.setItem('internetConnection','true');
                                    thisCtrl.firebaseConection = true;
                                    localStorage.setItem('firebaseConection', thisCtrl.firebaseConection);

                                    var userId=DataService.getCurrentUserId();
                                    var user = DataService.getUserByID(userId); //Ad user to firebase if not have been
                                    DataService.addUser(user);
                                } else {
                                    showErrorMess(" Keine Internet Verbindung !");
                                    localStorage.setItem('internetConnection','false');
                                    thisCtrl.firebaseConection = false;
                                    localStorage.setItem('firebaseConection',thisCtrl.firebaseConection);

                                }
                            });

                        } else {
                            thisCtrl.firebaseConection = false;
                            localStorage.setItem('firebaseConection', thisCtrl.firebaseConection);
                        }
                    });
                } else {
                    localStorage.setItem('firebaseConection', false);
                }

            }
            function showErrorMess(mess) {
                $ionicPopup.alert({
                    title: 'Info',
                    template: mess,
                    buttons: [{
                        text: 'Schließen',
                        type: 'button-positive'
                    }]
                });
            }
            $scope.$on('$stateChangeStart()', function() {
                // TODO something before change state
            });
        });


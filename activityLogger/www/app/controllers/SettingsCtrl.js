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
                        title: " Firebase connection",
                        template: 'Your data will be stored in the database Firebase when you accepted the connection. This option is required if you want to work online or create a competition. Otherwise, your data will be stored only local.<br>'+'Do you accept the Firebase connection?'
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
                                    var user = localStorage.getItem('user'); //Ad user to firebase if not have been
                                    if(user){
                                        user=JSON.parse(user);
                                        DataService.addUser(user);
                                    }else{
                                        showMess("Important","You must create a profile or login to start and  save an activity in Firebase. If this is not the case, See Profile")
                                    }
                                }else {
                                    showMess("Error"," No Internet connection !");
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
            function showMess(title,mess) {
                $ionicPopup.alert({
                    title: title,
                    template: mess,
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });
            }
        });


'use strict';
angular.module('ActivityLogger').controller('SettingsCtrl',
function ($scope,DataService,$ionicPopup) {
    var thisCtrl=this;
    var firebaseConection=DataService.getStatus('firebaseConection');
    var autoStop=DataService.getStatus('autoStop');
    if(firebaseConection){
        if((firebaseConection)=='true'){
            this.firebaseConection=true;
        }else{
            this.firebaseConection=false;
        }
    }else{
        this.firebaseConection=false;
    }
    if(autoStop){
        if((autoStop)=='true'){
            this.autoStop=true;
        }else{
            this.autoStop=false;
        }
    }else{
        this.autoStop=false;
    }


    this.save=function(){
        //TODO: save all Settings in Localstorage
        DataService.setStatus('firebaseConection',this.firebaseConection);
        DataService.setStatus('autoStop',thisCtrl.autoStop);
    }
    var thisCtrl=this;
    this.connectWithFirebase=function(){
       if(!thisCtrl.firebaseConection){ // Confirm connection only if not connected
           var confirmPopup = $ionicPopup.confirm({
               title: " Firebase Verbindung",
               template: 'Wenn Sie die Verbindung mit der externe Datenbank Firebase zulassen werden ' +
               'Ihre  Profil und Aktivitätsdaten in dieser gespeichert,synchronisiert  und mit Daten anderer User vergleichen<br>' +
               'Diese Option ist für den Wettkampftsmodus erforderlich<br>'+
               'Wollen Sie es wirklich zulassen ? '

           });
           confirmPopup.then(function (res) {
               if (res) {
                   thisCtrl.firebaseConection = true;
                   DataService.setStatus('firebaseConection',thisCtrl.firebaseConection);
                   //Add Local Data to firebase
                   DataService.addDataToFirebase();
               }else{
                   thisCtrl.firebaseConection=false;
                   DataService.setStatus('firebaseConection',thisCtrl.firebaseConection);
               }
           })
       }else{ //
           DataService.setStatus('firebaseConection',false);
       }

    }
    $scope.$on('$stateChangeStart()',function(){
        // Do something before change state
    })
})
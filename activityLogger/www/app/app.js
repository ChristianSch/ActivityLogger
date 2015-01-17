'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.ap
// 'starter.controllers' is found in controllers.ap
angular.module('ActivityLogger', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $stateProvider

    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl as tCtrl'
    })

    .state('tab.profile', {
        url: '/profile',
        views: {
            'tab-profile': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl as pCtrl'
            }
        }
    })

    .state('tab.main', {
        url: '/main',
        views: {
            'tab-main': {
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl as mCtrl'
            }
        }
    })

    .state('tab.activity', {
        url: '/activity/:type/:comment',
        views: {
            'tab-main': {
                templateUrl: 'templates/activity.html'
            }
        }
    })

    .state('tab.workoutlist', {
        url: '/workoutlist',
        views: {
            'tab-workoutlist': {
                templateUrl: 'templates/workoutlist.html',
                controller: 'ActivityListCtrl as alCtrl'
            }
        }
    })

    .state('tab.workout', {
        url: '/workout/:id',
        views: {
            'tab-workoutlist': {
                templateUrl: 'templates/workout.html',
                controller: 'WorkoutCtrl as wCtrl'
            }
        }
    })

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl as setCtrl'
            }
        }
    })

    .state('tab.summary', {
        url: '/summary',
        views: {
            'tab-summary': {
                templateUrl: 'templates/summary.html',
                controller: 'SummaryCtrl as sumCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/tab/main');
    // TODO! temporary:
    $urlRouterProvider.otherwise('/tab/profile');
});
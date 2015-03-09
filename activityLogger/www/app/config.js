/**
 * @author Fosso
 * @creationDate 08.12.2014.
 * @edited 2015-01-25 by Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .constant('FIREBASE_URL', 'https://activtitylogger.firebaseio.com')
        .constant('FIREBASE_URL_MOCK', 'https://de-gi-thm-activitylogger.firebaseio.com/')
        .constant('MODULE_UPDATE_INTERVALL', 86400000); // 24h in millis
})();
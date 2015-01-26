/**
 * @author Christian Schulze, Rene Lutz
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .factory('MockDataService',
            function(Activity, Competition, User) {
                var users = [];
                var competitions = [];
                var activities = [];

                var nextCompetitionID = 0;
                var nextActivityID = 0;

                var currentUserID = null;

                function getAllUsers() {
                    return users;
                }

                function addUser(user) {
                    users.push(user);

                    return user.id;
                }

                function getUserByID(id) {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].id == id) {
                            return users[i];
                        }
                    }

                    return null;
                }

                function setCurrentUserId(id) {
                    currentUserID = id;
                }

                function getCurrentUserId() {
                    return currentUserID;
                }

                function addActivity(activity) {
                    activity.id = nextActivityID;
                    nextActivityID += 1;
                    activities.push(activity);

                    return activity.id;
                }

                function getAllActivities(user_id) {
                    return activities.filter(function(el, i) {
                        return el.userId == user_id;
                    });
                }

                function getActivityByID(id) {
                    for (var i = 0; i < activities.length; i++) {
                        if (activities[i].id == id) {
                            return activities[i];
                        }
                    }

                    return null;
                }

                function removeActivity(id) {
                    for (var i = 0; i < activities.length; i++) {
                        if (activities[i].id == id) {
                            activities.splice(activities[i], 1);
                        }
                    }
                }

                function addCompetition(competition) {
                    competition.id = nextCompetitionID;
                    nextCompetitionID += 1;
                    competitions.push(competition);

                    return competition.id;
                }

                function getCompetitionByID(id) {
                    for (var i = 0; i < competitions.length; i++) {
                        if (competitions[i].id == id) {
                            return competitions[i];
                        }
                    }

                    return null;
                }

                function getAllCompetitions() {
                    return competitions;
                }

                // mock some data
                addUser(new User('Foobar', 'Foo', 'Bar', 'Male', '34.3.4192', 118, 167));
                addUser(new User('Foobaz', 'Baz', 'Foo', 'Female', '13.3.1992', 64, 165));

                currentUserID = users[0].id;

                var track1 = [{
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.578581,
                        longitude: -118.291994,
                        speed: 0
                    },
                    timestamp: 1422290032000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.606111,
                        longitude: -118.062778,
                        speed: 0
                    },
                    timestamp: 1422290052000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.433269,
                        longitude: -117.950916,
                        speed: 0
                    },
                    timestamp: 1422290070000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.588056,
                        longitude: -116.943056,
                        speed: 0
                    },
                    timestamp: 1422290100000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.339722,
                        longitude: -117.467778,
                        speed: 0
                    },
                    timestamp: 1422290120000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 36.23998,
                        longitude: -116.83171,
                        speed: 0
                    },
                    timestamp: 1422290100000
                }];
                var track2 = [{
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.5851,
                        longitude: 8.6841,
                        speed: 0
                    },
                    timestamp: 1422290032000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.5866,
                        longitude: 8.6815,
                        speed: 0
                    },
                    timestamp: 1422290042000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.5874,
                        longitude: 8.6840,
                        speed: 0
                    },
                    timestamp: 1422290052000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.5860,
                        longitude: 8.6861,
                        speed: 0
                    },
                    timestamp: 1422290100000
                }];
                var track3 = [{
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.7967,
                        longitude: 8.7688,
                        speed: 0
                    },
                    timestamp: 1422290032000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.7950,
                        longitude: 8.7689,
                        speed: 0
                    },
                    timestamp: 1422290052000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.7943,
                        longitude: 8.7625,
                        speed: 0
                    },
                    timestamp: 1422290070000
                }, {
                    coords: {
                        accuracy: 1,
                        altitude: -0.134625,
                        altitudeAccuracy: null,
                        heading: 0,
                        latitude: 50.5851,
                        longitude: 8.6841,
                        speed: 0
                    },
                    timestamp: 1422290100000
                }];

                addActivity(new Activity(0,
                    "Run",
                    1422290032000,
                    1422290100000, track1, "", 1589.34, users[0].id));

                console.log(activities[activities.length - 1]);
                addActivity(new Activity(0,
                    "Bike",
                    1422290031199,
                    1422290076071,
                    track2, "", 1589.4696498299068, users[0].id));

                console.log(activities[activities.length - 1]);
                var anActivity = addActivity(new Activity(0,
                    "Run",
                    1422290076071,
                    1422290031199, track3, "", 1589.4696498299068, users[1].id));

                addCompetition(new Competition(0, users[1].id, users[0].id, anActivity, null, 1000));

                // api
                return {
                    getAllUsers: getAllUsers,
                    addUser: addUser,
                    getUserByID: getUserByID,
                    getCurrentUserId: getCurrentUserId,
                    setCurrentUserId: setCurrentUserId,
                    addActivity: addActivity,
                    getAllActivities: getAllActivities,
                    getActivityByID: getActivityByID,
                    removeActivity: removeActivity,
                    addCompetition: addCompetition,
                    getCompetitionByID: getCompetitionByID,
                    getAllCompetitions: getAllCompetitions
                };
            });
})();
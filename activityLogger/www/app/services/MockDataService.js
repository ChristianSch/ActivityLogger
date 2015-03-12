/**
 * @author Christian Schulze, Rene Lutz
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .factory('MockDataService',
            function($firebase, Activity, Competition, User, FIREBASE_URL_MOCK) {

                var root = new Firebase(FIREBASE_URL_MOCK);
                var fireUsers = root.child('users');
                var fireCompetitions = root.child('competitions');
                var fireActivities = root.child('activities');

                // AngularFire Wrapper
                var fireUsersAngular = $firebase(fireUsers);
                var fireCompetitionsAngular = $firebase(fireCompetitions);
                var fireActivitiesAngular = $firebase(fireActivities);

                // Only for tests
                var cloud = true;

                var users = [];
                var competitions = [];
                var activities = [];

                var nextCompetitionID = 0;
                var nextActivityID = 0;

                var currentUserID = null;

                function getAllUsers() {
                    if (cloud) {
                        return fireUsersAngular.$asArray();
                    } else {
                        return users;
                    }
                }

                function addUser(user) {
                    if (cloud) {
                        getAllUsers().$add(user);
                    } else {
                        users.push(user);
                    }

                    return user.id;
                }

                function getUserByID(id) {
                    var userDummy = getAllUsers();

                    for (var i = 0; i < userDummy.length; i++) {
                        if (usersDummy[i].id === id) {
                            return userDummy[i];
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

                    if (cloud) {
                        fireActivitiesAngular.$asArray().$add(activity);
                    } else {
                        activities.push(activity);
                    }

                    return activity.id;
                }

                function getAllActivities(user_id) {
                    var activitiesDummy;

                    if (cloud) {
                        activitiesDummy = fireActivitiesAngular.$asArray();
                    } else {
                        activitiesDummy = activities;
                    }

                    return activitiesDummy.filter(function(el, i) {
                        return el.userId === user_id;
                    });
                }

                function getActivityByID(id) {
                    var activitiesDummy = getAllActivities();

                    for (var i = 0; i < activitiesDummy.length; i++) {
                        if (activitiesDummy[i].id === id) return elt;
                    }

                    return null;
                }

                function removeActivity(id) {
                    var activitiesDummy = null;

                    if (cloud) {
                        activitiesDummy = fireActivitiesAngular.$asArray();
                    } else {
                        activitiesDummy = getAllActivities();
                    }

                    for (var i = 0; i < activitiesDummy.length; i++) {
                        if (activitiesDummy[i].id === id) {
                            if (cloud) {
                                activitiesDummy.$remove(activiesDummy[i]);
                            } else {
                                activitiesDummy.splice(activitiesDummy[i], 1);
                            }
                        }
                    }
                }

                function addCompetition(competition) {
                    competition.id = nextCompetitionID;
                    nextCompetitionID += 1;

                    if (cloud) {
                        getAllCompetitions().$add(competition);
                    } else {
                        competitions.push(competition);
                    }

                    return competition.id;
                }

                function getCompetitionById(id) {
                    var competitionsDummy = getAllCompetitions();

                    for (var i = 0; i < competitionsDummy.length; i++) {
                        if (competitionsDummy[i].id === id) {
                            return competitionsDummy[i];
                        }
                    }

                    return null;
                }

                function getAllCompetitions() {
                    if (cloud) {
                        return fireCompetitionsAngular.$asArray();
                    } else {
                        return competitions;
                    }
                }

                function updateCompetition(id, competition) {
                    var competitionsDummy = getAllCompetitions();

                    for (var i = 0; i < competitionsDummy.length; i++) {
                        if (competitionsDummy[i].id === id) {
                            competitionsDummy[i] = competition;
                        }
                    }
                }

                // mock some data
                currentUserID = addUser(new User('Foobar', 'Foo', 'Bar', 'Male', '34.3.4192', 118, 167));
                var secondTestUser = addUser(new User('Foobaz', 'Baz', 'Foo', 'Female', '13.3.1992', 64, 165));

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
                    1422290100000, track1, "", 1589.34, currentUserID));

                addActivity(new Activity(0,
                    "Bike",
                    1422290031199,
                    1422290076071,
                    track2, "", 1589.4696498299068, currentUserID));

                var anActivity = addActivity(new Activity(0,
                    "Run",
                    1422290076071,
                    1422290031199, track3, "", 1589.4696498299068, secondTestUser));

                addCompetition(new Competition(0, secondTestUser, currentUserID, anActivity, null, 1000));

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
                    getCompetitionById: getCompetitionById,
                    getAllCompetitions: getAllCompetitions,
                    updateCompetition: updateCompetition
                };
            });
})();
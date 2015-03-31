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

            var cloud = false;

            var users = [];
            var competitions = [];
            var activities = [];

            var nextCompetitionID;
            var nextActivityID;

            var currentUserID = 'ÄÖÜ';

            /**
             * Gets all users that are currently registrated
             *
             * @return {Array}   Array of user models
             */
            function getAllUsers() {
                if (cloud) {
                    return fireUsersAngular.$asArray();
                } else {
                    users = JSON.parse(localStorage.getItem("users")) || [];
                    return users;
                }
            }

            /**
             * Adds a user to the registrated users list
             *
             * @param  {User} to add
             * @return {String}   id of the added user
             */
            function addUser(user) {
                if (cloud) {
                    getAllUsers().$add(user);
                } else {
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));
                }

                return user.id;
            }

            /**
             * Updates a given user
             * @param {String} ID of the user that should be updatet
             * @param {User] Record of the user with the new values
             */
            function updateUser(id, user) {
                var dummyUser = getAllUsers();

                if(cloud) {
                    fireUsersAngular.$asArray().$save(user);
                } else {
                    for(var i = 0; i < dummyUser.length; i++) {
                        if(dummyUser[i].id == id) {
                            dummyUser[i] = user;
                        }
                    }
                    localStorage.setItem("users", JSON.stringify(dummyUser));
                }
            }
            /**
             * Get a user by his given id
             *
             * @param  {String} id of the user
             * @return {User}   with the given id, NULL if not available
             */
            function getUserByID(id) {
                var userDummy = getAllUsers();

                for (var i = 0; i < userDummy.length; i++) {
                    if (userDummy[i].id == id) {
                        return userDummy[i];
                    }
                }
                return null;
            }

            /**
             * Sets the current user id
             *
             * @param  {String} ID of the current user
             */
            function setCurrentUserId(id) {
                currentUserID = id;
            }

            /**
             * Returns the ID of the current user
             * @returns {String} ID of the current user
             */
            function getCurrentUserId() {
                return currentUserID;
            }

            /**
             * Sets the kind of persistance
             *
             * @param  {Boolean} True for cloud persistance, false otherwise
             */
            function setCloudConnection(bool) {
                cloud = bool;
            }
            /**
             * Adds an activity to the activity list
             *
             * @param  {Activity} to add
             * @return {number}   ID of the added activity
             */
            function addActivity(activity) {
                nextActivityID = parseInt(localStorage.getItem("nextActivityID") || 0);
                activity.id = nextActivityID;

                if (cloud) {
                    if(activity.track_data.length == 0) activity.track_data = 42;
                    fireActivitiesAngular.$asArray().$add(activity);
                    nextActivityID =  nextActivityID + 1;
                } else {
                    activities.push(activity);
                    localStorage.setItem("activities", JSON.stringify(activities));
                    nextActivityID = nextActivityID + 1;
                }

                localStorage.setItem("nextActivityID", nextActivityID);
                return activity.id;
            }

            /**
             * Returns all activities of a user
             *
             * @param  {String} user ID to get activities from
             * @return {Array}  of activites
             */
            function getAllActivities(user_id) {
                var activitiesDummy;

                if (cloud) {
                    activitiesDummy = fireActivitiesAngular.$asArray();
                } else {
                    activitiesDummy = JSON.parse(localStorage.getItem("activities")) || [];
                }

                return activitiesDummy.filter(function (el, i) {
                    return el.userId == user_id;
                });
            }

            /**
             * Returns an activity with given id of the current user
             *
             * @param  {number} of the activity
             * @return {Activity}   Activity with the given id, NULL if not available
             */
            function getActivityByID(id) {
                var activitiesDummy = getAllActivities(currentUserID);

                for(var i = 0; i < activitiesDummy.length; i++) {
                    if(activitiesDummy[i].id == id) {
                        //Firebase has problems with empty Arrays, so there must be used dummy data
                        if(activitiesDummy[i].track_data == 42) activitiesDummy[i].track_data = [];
                        return activitiesDummy[i];
                    }
                }
                return null;
            }

            /**
             * removes an Activity with the given id from the list
             *
             * @param  {number} id of the activity that should be removed
             */
            function removeActivity(id) {
                var activitiesDummy = getAllActivities(currentUserID);

                for (var i = 0; i < activitiesDummy.length; i++) {
                    if (activitiesDummy[i].id == id) {
                        if (cloud) {
                            fireActivitiesAngular.$asArray().$remove(activitiesDummy[i]);
                        } else {
                            activities.splice(activitiesDummy[i], 1);
                            localStorage.setItem("activities", JSON.stringify(activities));
                        }
                    }
                }
            }

            /**
             * Adds a competition to the competition list
             *
             * @param  {Competition} to add
             * @return {Number}  ID of the added competition
             */
            function addCompetition(competition) {
                nextCompetitionID = parseInt(localStorage.getItem("nextCompetitionID") || 1);
                competition.id = nextCompetitionID;

                if (cloud) {
                    fireCompetitionsAngular.$asArray().$add(competition);
                } else {
                    competitions.push(competition);
                    localStorage.setItem("competitions", JSON.stringify(competitions));
                }
                nextCompetitionID = nextCompetitionID + 1;
                localStorage.setItem("nextCompetitionID", nextCompetitionID);
                return competition.id;
            }

            /**
             * Returns a competition with the given ID
             *
             * @param  {Number} of the competition that should be returned
             * @return {Competition}   with the given ID, NULL if not available
             */
            function getCompetitionById(id) {
                var competitionsDummy = getAllCompetitions();

                for (var i = 0; i < competitionsDummy.length; i++) {
                    if (competitionsDummy[i].id == id) {
                        return competitionsDummy[i];
                    }
                }
                return null;
            }

            /**
             * returns the competition list
             *
             * @return {Array}   List of competitions
             */
            function getAllCompetitions() {
                if (cloud) {
                    return fireCompetitionsAngular.$asArray();
                } else {
                    competitions = JSON.parse(localStorage.getItem("competitions")) || [];
                    return competitions;
                }
            }

            /**
             * Updates a existing competition
             *
             * @param  {Number} ID of the competition to update
             * @param  {Competition} Updated competition for entry ID
             */
            function updateCompetition(id, competition) {
                var competitionsDummy = getAllCompetitions();

                for (var i = 0; i < competitionsDummy.length; i++) {
                    if (competitionsDummy[i].id == id) {
                        competitionsDummy[i] = competition;
                    }
                }
            }

            // mock some data
            if(!cloud) {
                addUser(new User('ÄÖÜ', 'Test', 'Test', 'Male', false, 42, 42));
                addUser(new User('Foobar', 'Foo', 'Bar', 'Male', true, 118, 167));
                var secondTestUser = addUser(new User('Foobaz', 'Baz', 'Foo', 'Female', false, 64, 165));

                var track1 = [
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    }
                ];
                var track2 = [
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    }
                ];
                var track3 = [
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    }
                ];

                var anActivity = addActivity(new Activity(0,
                    "Run",
                    1422290076071,
                    1422290031199, track3, "", 1589.4696498299068, secondTestUser));
                addActivity(new Activity(0,
                    "Run",
                    1422290032000,
                    1422290100000, track1, "", 1589.34, currentUserID));

                addActivity(new Activity(0,
                    "Bike",
                    1422290031199,
                    1422290076071,
                    track2, "", 1589.4696498299068, currentUserID));
                addActivity(new Activity(0,
                    "Run",
                    1427634000000,
                    1427634600000, track1, "", 1589.34, currentUserID));

                addActivity(new Activity(0,
                    "Bike",
                    1427634000000,
                    1427634600000,
                    track2, "", 1589.4696498299068, currentUserID));

                addCompetition(new Competition(0, secondTestUser, currentUserID, anActivity, null, 1000));

            } else {
                activities = getAllActivities(currentUserID);
                competitions = getAllCompetitions();
                users = getAllUsers();
            }
            // api
            return {
                getAllUsers: getAllUsers,
                addUser: addUser,
                getUserByID: getUserByID,
                updateUser: updateUser,
                getCurrentUserId: getCurrentUserId,
                setCurrentUserId: setCurrentUserId,
                setCloudConnection: setCloudConnection,
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
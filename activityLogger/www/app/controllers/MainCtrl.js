/**
 * @author Christian Schulze
 */

(function() {
    'use strict';

    angular
        .module('ActivityLogger')
        .controller('MainCtrl',
            function($scope, $state, $filter, $ionicModal, MockDataService, Competition, Activity, User) {
                // for referencing this later in anonymous functions
                var thisCtrl = this;

                // this is going to be our user
                var currentUserID = MockDataService.getCurrentUserId();

                // set up the selectable options
                this.possibleActivityTypes = [{
                    id: 1,
                    label: 'Run'
                }, {
                    id: 2,
                    label: 'Bike'
                }];

                this.selectedActivityType = this.possibleActivityTypes[0];
                this.comment = '';

                // set up data for competitions
                var competitions = MockDataService.getAllCompetitions();

                // filter the competitions by selecting the ones that have at least one 
                // activity that has not been absolved yet (and therefore is null)
                var openCompetitions = competitions.filter(function(el) {
                    return el.activity_id1 === null || el.activity_id2 === null;
                });

                this.hasOpenCompetitions = openCompetitions.length > 0 ? true : false;
                this.openCompetitionCount = openCompetitions.length;

                // set up competition types (open or new)
                var defaultCompetitionTypes = [{
                    id: 1,
                    label: 'New Competition'
                }];

                // if another user started a competition against the current user
                // this very option is added as a possible competition type
                if (this.hasOpenCompetitions) {
                    defaultCompetitionTypes.push({
                        id: 2,
                        label: 'Open competitions'
                    });
                }

                // set defaults
                this.possibleCompetitionTypes = defaultCompetitionTypes;

                // set up possible opponents
                var allPossibleOpponents = MockDataService.getAllUsers();

                // set defaults
                this.possibleOpponents = allPossibleOpponents;

                // set up default activity types against other users
                // if the competition will be newly created
                var defaultCompetitionActivities = [{
                    id: 1,
                    label: '1KM',
                    meters: 1000
                }, {
                    id: 2,
                    label: '2KM',
                    meters: 2000
                }, {
                    id: 3,
                    label: '3KM',
                    meters: 3000
                }, {
                    id: 3,
                    label: '4KM',
                    meters: 4000
                }];

                // set defaults
                this.possibleCompetitionDisciplins = defaultCompetitionActivities;

                // set up possbile competitions against other users
                var allPossibleOpenCompetitions = openCompetitions.map(function(el, i) {
                    var labelStr;

                    if (el.activity_id1 === null && el.activity_id2 === null) {
                        // none of the activites have been completed yet
                        labelStr = 'Empty Competition';
                    } else {
                        // choose the completed activity and take it as reference
                        var actID = (el.activity_id1 !== null) ? el.activity_id1 : el.activity_id2;
                        var act = MockDataService.getActivityByID(actID);
                        labelStr = $filter('normalizeMeterToKMFilter')(act.distance) + 'km (' + (act.duration / 60) + ')';
                    }

                    return {
                        id: i,
                        label: labelStr
                    };
                });

                // set defaults
                this.possibleCompetitions = allPossibleOpenCompetitions;

                // at start there are not enough options that allow the user
                // to start the activity
                this.competitionCanBeStarted = false;

                var allActivities = MockDataService.getAllActivities(currentUserID) || [];
                console.log(allActivities);

                var possbibleCompetitionActivities = allActivities.map(function(el, i) {
                    var labelStr = $filter('normalizeMeterToKMFilter')(el.distance) + 'km (' + (el.duration / 60) + ')';

                    return {
                        id: i,
                        label: labelStr
                    };
                });

                console.log(possbibleCompetitionActivities);

                // regenerate options shown in the popup if an input was changed
                this.refreshCompetitionPopup = function() {
                    // reset to default
                    this.competitionCanBeStarted = false;

                    // if this option is not set, there ain't no adaptions to
                    // be made
                    if (this.selectedCompetitionType === undefined) {
                        return;
                    }

                    if (this.selectedCompetitionType.id == 1) {
                        // new competition
                        if (this.selectedOpponent !== undefined) {
                            if (this.selectedOpponent.id == currentUserID) {
                                console.log('against their self');
                                // user wants to compete theirself, therefore
                                // show past activities as activites
                                this.possibleActivities = possbibleCompetitionActivities;
                            } else {
                                // set available competition lengths back to default
                                this.possibleActivities = defaultCompetitionActivities;
                            }
                        }

                    } else if (this.selectedCompetitionType.id == 2) {
                        // open competition
                        // find all opponents of open competitions
                        this.possibleOpponents = openCompetitions.map(function(el, index) {
                            var userID = el.user_id1 || el.user_id2;
                            return MockDataService.getUserByID(userID);
                        });
                    }

                    if (this.selectedCompetitionType !== undefined &&
                        this.selectedOpponent !== undefined &&
                        this.selectedCompetitionDisciplin !== undefined) {
                        this.competitionCanBeStarted = true;
                    }

                    // DEBUG
                    // console.log(this.selectedCompetitionType);
                    // console.log(this.selectedOpponent);
                    // console.log(this.selectedCompetitionDisciplin);
                };

                this.startCompetitionActivity = function() {
                    if (!this.competitionID) {
                        var dist;

                        if (this.selectedOpponent.id == currentUserID) {
                            dist = this.selectedCompetitionType.meters;
                        } else {
                            dist = 0; // TODO
                        }

                        var competition = new Competition(1, currentUserID, this.selectedOpponent.id, null, null, dist);
                        this.competitionID = competition.id;
                    }

                    this.startActivity();
                };

                /**
                 * @description Start the activity by changing the view to
                 * the `activity` tab
                 */
                this.startActivity = function() {
                    if (thisCtrl.selectedActivityType !== undefined) {
                        $state.go('tab.activity', {
                            'type': thisCtrl.selectedActivityType.label,
                            'comment': thisCtrl.comment,
                            'competitionID': thisCtrl.competitionID
                        });
                    }
                };

                // competition type popup setup
                $ionicModal.fromTemplateUrl('templates/newCompetitionActivityPopup.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                });

                $scope.openModal = function() {
                    $scope.modal.show();
                };

                // clean up modal after closing it
                $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                });
            });
})();
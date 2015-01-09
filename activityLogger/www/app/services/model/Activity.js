'use strict';
angular.module('ActivityLogger').factory(
		'Activity',
		function() {

			var Activity = function(id, type, start_time, end_time, track_data,
					comment, user_id) {
				this.id = id;
				this.type = type;
				this.start_time = start_time;
				this.end_time = end_time;
				this.track_data = track_data;
				this.comment = comment;
				this.duration = this.end_time - this.start_time
			    this.user_id = user_id;
            };
			return Activity;

		});

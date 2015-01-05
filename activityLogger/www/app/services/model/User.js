'use strict';
angular.module('ActivityLogger').factory(
		'User',
		function() {

			var User = function(id, firstname, surname, gender, birthday,
					weight, size) {
				this.id = id;
				this.firstname = firstname;
				this.surname = surname;
				this.gender = gender;
				this.birthday = birthday;
				this.weight = weight;
				this.size = size;
			};
			return User;

		});

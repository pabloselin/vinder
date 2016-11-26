angular.
	module('vinderApp').
	component('person',  {
		templateUrl: 'app/person/person.template.html',
		controller: function welcomeUserController($http) {
			var self = this;
			
			$http.get(vinderPersonUrl).then(function(response) {
				self.data = response.data;
				self.persons = self.data.persons;
				console.log(self.data.persons[0]);
			});

		}
	});
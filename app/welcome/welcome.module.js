angular.
	module('vinderApp').
	component('welcomeUser',  {
		templateUrl: 'app/welcome/welcome.template.html',
		controller: function welcomeUserController($http) {
			var self = this;
			self.user = 'service';

			$http.get(vinderDataUrl).then(function(response) {
				self.data = response.data;
				self.anger = response.data.impressions[0].average_emotion.anger;
				self.disgust = response.data.impressions[0].average_emotion.disgust;
				self.fear = response.data.impressions[0].average_emotion.fear;
				self.joy = response.data.impressions[0].average_emotion.joy;
				self.sadness = response.data.impressions[0].average_emotion.sadness;
				self.surprise = response.data.impressions[0].average_emotion.surprise;
				console.log(self.anger);
			});

		}
	});
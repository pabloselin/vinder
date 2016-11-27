var vinderApp = angular.
					module('vinderApp', [
						'ngRoute',
						'personDetail'
						]).
					config(['$locationProvider', '$routeProvider', 
						function config($locationProvider, $routeProvider) {

							$locationProvider.hashPrefix('!');

							$routeProvider.
							
							when('/welcome', {
								templateUrl: 'app/welcome/welcome.template.html',
								controller: function welcomeController($http) {
			
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
											
										});

								}
							}).

							when('/person', {
								//templateUrl: 'app/person/person.template.html',
								template: 'person'
								
							}).

							when('/persons/:personId', {
								//template: 'personsId'
								templateUrl: 'app/person-detail/person-detail.template.html',
								controller: function( $scope, $routeParams){
									$scope.personId = $routeParams.personId;
									
								}
							}).
							
							otherwise({redirectTo: '/welcome'});
						}
						]);


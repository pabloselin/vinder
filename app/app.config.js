var vinderApp = angular.
					module('vinderApp', [
						'ngRoute',
						'personDetail'
						]).
					config(['$locationProvider', '$routeProvider', 
						function config($locationProvider, $routeProvider, $http) {

							$locationProvider.hashPrefix('!');

							$routeProvider.
							
							when('/welcome', {
								templateUrl: 'app/welcome/welcome.template.html',
								controller: [ '$http', '$scope', function welcomeController($http, $scope) {
			
										
										$scope.user = 'service';

										$http.get(vinderDataUrl).then(function(response) {

											console.log(response.data.impressions[0].average_emotion.anger);
											
											$scope.data = response.data;
											$scope.anger = response.data.impressions[0].average_emotion.anger;
											$scope.disgust = response.data.impressions[0].average_emotion.disgust;
											$scope.fear = response.data.impressions[0].average_emotion.fear;
											$scope.joy = response.data.impressions[0].average_emotion.joy;
											$scope.sadness = response.data.impressions[0].average_emotion.sadness;
											$scope.surprise = response.data.impressions[0].average_emotion.surprise;

											console.log($scope.anger);
											
										});

									}]
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


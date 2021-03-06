var vinderApp = angular.
					module('vinderApp', [
						'ngRoute',
						'personDetail'
						]).
					factory('User', function() {
						return{ name: {} };
					}).
					config(['$locationProvider', '$routeProvider', 
						function config($locationProvider, $routeProvider, $http, User) {

							$locationProvider.hashPrefix('!');

							$routeProvider.
							
							when('/welcome', {
								templateUrl: 'app/welcome/welcome.template.html',
								controller: [ '$http', '$scope', '$location', function welcomeController($http, $scope, $location, User) {
										
										$scope.user = {};

										$scope.user.name = User;
										
										$scope.createUser = function (user) {
											
											console.log(user.name);

											$scope.user.name = user.name;

 											$location.path('/video');

										}
										
										

									}]
							}).

							when('/video', {
								templateUrl: 'app/video/video.template.html',
								controller: [ '$http', '$scope', function videoController($http, $scope, User) {
									
									$scope.createUser = function (user) {
											
											console.log(user.name);

											$scope.user.name = user.name;

										}



								}]
							}).

							when('/persons/:personId', {
								//template: 'personsId'
								templateUrl: 'app/person-detail/person-detail.template.html',
								controller: function( $scope, $routeParams){
									$scope.personId = $routeParams.personId;
									console.log($scope.user);
									
								}
							}).
							
							otherwise({redirectTo: '/video'});
						}
						]);

vinderApp.factory('dataService', function() {
	
	var userData = {};

	function set(data) {
		userData = data;
	}

	function get() {
		return userData;
	}

	return {
		set: set,
		get: get
	}
});


angular.
	module('personDetail').
	component('personDetail', {
		templateUrl: 'app/person/person-detail.template.html',
		controller: ['$routeParams',
			function personDetailController( $routeParams ) {
				this.personId = $routeParams.personId;
			}
		]
		});
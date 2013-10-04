'use strict';

angular.module('campaignApp')
		.controller('AdminCtrl', function ($scope, $location, angularFire) {
			var ref = new Firebase('https://campaign.firebaseio.com/');

			angularFire(ref, $scope, 'items');

			$scope.test = function () {
				console.log('yey');
			};
		});
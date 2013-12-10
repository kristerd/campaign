'use strict';

angular.module('campaignApp')
		.controller('AdminCtrl', function ($scope, $routeParams, $location, Campaign, angularFire) {
			var campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns'),
				auth;

			auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
				if (user) {
					angularFire(campaignRef, $scope, 'campaigns');
				} else {
					//console.log("Not Logged In");
				}
			});

			angularFire(campaignRef, $scope, 'campaigns');

			$scope.newCampaign = function () {
				var campaign = Campaign.createNewCampaign($scope.campaign.name, $scope.campaign.goal, $scope.campaign.validFrom, $scope.campaign.validTo);
				campaign.save();
				$scope.campaign = null;
			};
		});
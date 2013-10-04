'use strict';

angular.module('campaignApp')
		.controller('AdminCtrl', function ($scope, $routeParams, $location, Campaign, angularFire) {
			var campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns');

			angularFire(campaignRef, $scope, 'campaigns');

			$scope.newCampaign = function () {
				var campaign = Campaign.createNewCampaign($scope.campaign.name, $scope.campaign.validFrom, $scope.campaign.validTo);
				campaign.save();
				$scope.campaign = null;
			};
		});
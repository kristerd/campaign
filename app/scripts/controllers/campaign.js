'use strict';

angular.module('campaignApp')
		.controller('CampaignCtrl', function ($scope, $routeParams, $location, Campaign, angularFire) {
			var campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns/' + $routeParams.campaignId),
				usersRef = new Firebase('https://campaign.firebaseio.com/users'),
				auth;

			auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
				if (user) {
					angularFire(campaignRef, $scope, 'campaigns');
				} else {
					console.log("Not Logged In");
				}
			});

			angularFire(campaignRef, $scope, 'campaign');
			angularFire(usersRef, $scope, 'users');
		});
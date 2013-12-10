'use strict';

angular.module('campaignApp')
  .controller('CampaignviewCtrl', function ($scope, $routeParams, $location, Campaign, angularFire, CampaignService, UserService) {

    var mainRef = new Firebase('https://campaign.firebaseio.com/'),
    	campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns/' + $routeParams.campaignId),
		usersRef = new Firebase('https://campaign.firebaseio.com/users'),
		auth;

		auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
			if (user) {
				//angularFire(campaignRef, $scope, 'campaign');

				//angularFire(usersRef, $scope, 'users');


						/*$scope.$apply(function() {
							$scope.daysWithLeaders = days;
						});
						
						
						if (days) {
							$.each(days, function( index, value ) {
								
								var day = value.date,
									today = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");

								if (moment(day).isSame(today) && value.winner) {
									alert(value.winner.name);
								}
							});
						}*/

					usersRef.on("value", function(snapshot) {
						//console.log(snapshot.val());
						
						CampaignService.getDaysWithSales($routeParams.campaignId, function(days) {
							
							CampaignService.getCampaign($routeParams.campaignId, function(campaign) {
								//console.log("GETTING THE Campaign")
								//console.log(campaign.days);
								$scope.$apply(function() {
									$scope.daysWithLeaders = campaign.days;
								});

								if (campaign.days) {
									$.each(campaign.days, function( index, value ) {
										
										var day = value.date,
											today = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");

										if (moment(day).isSame(today) && value.winner) {
											//alert(value.winner.name);
										}
								});
						}
							});
						});
					});

				

			} else {
				//console.log("Not Logged In");
			}
		});
  });

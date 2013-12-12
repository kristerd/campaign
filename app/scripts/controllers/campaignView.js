'use strict';

angular.module('campaignApp')
  .controller('CampaignviewCtrl', function ($scope, $routeParams, $location, Campaign, angularFire, CampaignService, UserService) {

  	var firebaseURL = "https://campaign-dev.firebaseio.com";

    var mainRef = new Firebase(firebaseURL),
    	campaignRef = new Firebase(firebaseURL+'/campaigns/' + $routeParams.campaignId),
		usersRef = new Firebase(firebaseURL+'/users'),
		auth;

		auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
			if (user) {

				usersRef.on("value", function(snapshot) {

					CampaignService.getTopUsersByDay(null, function(data) {

						campaignRef.child("dates").child("2013-12-11").child("leaders").set(angular.copy(data), function() {
							campaignRef.child("dates").on("value", function(dates) {
								console.log(dates.val());
								$scope.dates = dates.val();
								$scope.$apply();
							});
						});
					});
				});

			} else {
				//console.log("Not Logged In");
			}
		});
  });

						/*CampaignService.getDaysWithSales($routeParams.campaignId, function(days) {
							
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
											alert(value.winner.name);
										}
								});
						}
							});
						});*/
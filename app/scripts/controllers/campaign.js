'use strict';

angular.module('campaignApp')
		.controller('CampaignCtrl', function ($scope, $routeParams, $location, Campaign, angularFire, CampaignService) {
			
			var firebaseURL = "https://campaign-dev.firebaseio.com";

			var campaignRef = new Firebase(firebaseURL+'/campaigns/' + $routeParams.campaignId),
				usersRef = new Firebase(firebaseURL+'/users'),
				auth;

			$scope.teams = new Array();

			auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
				if (user) {
					angularFire(campaignRef, $scope, 'campaign');
				} else {
					//console.log("Not Logged In");
				}
			});

			//angularFire(campaignRef, $scope, 'campaign');
			angularFire(usersRef, $scope, 'users');

			CampaignService.getDaysWithSales($routeParams.campaignId, function(days) {
				$scope.daysWithLeaders = days;
				if (days) {
					$.each(days, function( index, value ) {
						
						var day = value.date,
							today = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");

						if (moment(day).isSame(today) && value.winner) {
							alert(value.winner.name);
						}
					});
				}

			});

			function compareDates(date1, date2) {
		        //call setHours to take the time out of the comparison

		        if(date1.setHours(0,0,0,0) === date2.setHours(0,0,0,0))
		        {
		        	//console.log(" ->  " + date1, date2);
		            return true;
		        }
		        return false;
		    }

			$scope.save = function() {

				$scope.days = [];

				var days = new Array();

				var campaign = $scope.campaign,
					from = moment(campaign.validFrom, "YYYY-MM-DD"),
					to = moment(campaign.validTo, "YYYY-MM-DD"),
					currentDate = from,
					i,
					noOfDays = to.diff(from, "days");

					//console.log(noOfDays);

				for (i = 0; i <= noOfDays; i++) {

					var day = {};
					
					$scope.days[i] = {};

					if(currentDate.day() == 6 || currentDate.day() == 0) {
						// Do not include weekends
						day.day = currentDate.date();
						day.date = currentDate.format("YYYY-MM-DD");
						
						day.weekend = true;	
					}
					else {
						day.day = currentDate.date();
						day.date = currentDate.format("YYYY-MM-DD");
						
						day.weekend = false;	
					}

					days[day.date] = day;

					//console.log(currentDate.format("YYYY-MM-DD"));
					currentDate = currentDate.add('days', 1);
				} 
				campaignRef.child("dates").set(days);
			}

			function daydiff(first, second) {
			    return (second-first)/(1000*60*60*24)
			}

			$scope.addTeam = function() {
				$scope.teams.push($scope.campaignId);
				$scope.campaign.teams = $scope.teams;
			}
		});
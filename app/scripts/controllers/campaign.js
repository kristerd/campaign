'use strict';

angular.module('campaignApp')
		.controller('CampaignCtrl', function ($scope, $routeParams, $location, Campaign, angularFire, CampaignService) {
			var campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns/' + $routeParams.campaignId),
				usersRef = new Firebase('https://campaign.firebaseio.com/users'),
				auth;

			$scope.teams = new Array();

			$scope.items = [
			 { id: 0, name: 'Velg kampanjetype'},
		     { id: 1, name: 'foo' },
		     { id: 2, name: 'bar' },
		     { id: 3, name: 'blah' }
		   ];

		   $scope.selectables = [ 
		   		{label:"One", value:1, anotherValue:'Moo'}, 
		   		{label:"Two", value:2, anotherValue:'Cow'}
		   ];

			auth = new FirebaseSimpleLogin(campaignRef, function (error, user) {
				if (user) {
					angularFire(campaignRef, $scope, 'campaign');
				} else {
					console.log("Not Logged In");
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
		        	console.log(" ->  " + date1, date2);
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

					console.log(noOfDays);

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

					days.push(day);

					console.log(currentDate.format("YYYY-MM-DD"));
					currentDate = currentDate.add('days', 1);
				} 

				$scope.campaign.days = days;
			}

			function daydiff(first, second) {
			    return (second-first)/(1000*60*60*24)
			}

			$scope.addTeam = function() {
				$scope.teams.push($scope.campaignId);
				$scope.campaign.teams = $scope.teams;
			}
		});
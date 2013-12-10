'use strict';

angular.module('campaignApp')
  .controller('RegisterCtrl', function ($scope, $location, angularFire, TeamService, UserService) {

	var mainRef = new Firebase('https://campaign.firebaseio.com'),
		userRef,
		userId;

	$scope.salesAmount;
	$scope.campaignId;
	$scope.loggedIn = false;	

	$scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

	var auth = new FirebaseSimpleLogin(mainRef, function(error, user) {
		var i;

		if(user) {
			$scope.loggedIn = true; 

			userRef = new Firebase('https://campaign.firebaseio.com/users/user_'+user.id);
			userRef.on("value",function(snapshot) {
				//console.log("her");
				test(snapshot.val(), function() {
					//console.log(snapshot.val());
					UserService.getTodaysSalesSumForUser("user_"+snapshot.val().user_id, function(data) {
						var userProgress;
						$scope.salesSum = data;

						userProgress = $scope.salesSum/$scope.user.goalDay;

						$scope.userProgress = {
							width: ($scope.salesSum/$scope.user.goalDay)*100+"%"
						}

						$scope.userProgressOverGoal = {
							width: (($scope.salesSum/$scope.user.goalDay)-1)*100+"%"
						}

						//console.log("test ", snapshot.val());
						TeamService.getTeamSalesSum(snapshot.val().team.id, function(teamSummary) {
							$scope.safeApply(function() {
								$scope.teamSum = teamSummary.teamSalesSum;
								$scope.teamGoal = teamSummary.teamSalesGoal;
								$scope.teamProgress = {
									width: ($scope.teamSum/$scope.teamGoal)*100+"%"
								}

								$scope.teamProgressOverGoal = {
									width: (($scope.teamSum/$scope.teamGoal)-1)*100+"%"
								}
							});
						});
					});
				});
			});
		}
		else {
			$scope.loggedIn = false; 
		}
	});

	function test(userTemp, callback) {
		var i,
			campaigns;

		mainRef.child("campaigns").on('value', function(snapshot) {
			//$scope.campaigns = snapshot.val();
			campaigns = snapshot.val();
			//console.log("userTemp", userTemp, userTemp.sales);
			if (userTemp.sales) {
				jQuery.each(userTemp.sales, function(i, val) {
					userTemp.sales[i].campaignName = campaigns[val.campaign].name;
					userTemp.sales[i].id = i;
				});
			}

			$scope.safeApply(function() {
				$scope.user = userTemp;
				$scope.campaigns = campaigns;
			});

			if (callback) {
				callback.apply([]);
			}
			
		});
	};

	$scope.addTeam = function() {
		TeamService.addTeam("New team", function(error) {
			if (!error) { // OK
				//console.log("New team added");
			}
			else { // Error
				//console.log("Error when adding team");
			}
		});
	};

	$scope.addUserToTeam = function() {
		TeamService.addUserToTeam("-J8rbH1pdqf8Zwc8Iu4N", "user_5", function(error) {
			if (!error) { // OK
				//console.log("User added");
			}
			else { // Error
				//console.log("Error when adding user");
			}
		});
	};

	$scope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};

	$scope.deleteSale = function(sale) {
		userRef.child("sales").child(sale).remove();
	}

	$scope.logOut = function() {
		auth.logout();
	}

	$scope.saveGoal = function() {
		userRef.child("goalDay").set($scope.user.goalDay);
	};
 
	$scope.addSale = function(newSale) {

		var sale = {},
			salesRef,
			feedback = {};

			//console.log(newSale);

		if(newSale.$valid) {


			sale.amount = $scope.salesAmount;
			sale.campaign = "-J52nGIk0-XiZmGePAxX";
			//$scope.campaignId;
			sale.date = moment().format("YYYY-MM-DD");

			//console.log(sale);

			salesRef = userRef.child("sales").push(sale);

			feedback.message = "Nytt salg lagt inn";
			feedback.status = "success";
			$scope.feedback = feedback;
		}
		else {
			feedback.message = "Det skjedde en feil. Se at alle feltene er fylt ut, og at de er på riktig format.";
			feedback.status = "danger";
			$scope.feedback = feedback;
		}
	}

});

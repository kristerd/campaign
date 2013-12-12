'use strict';

angular.module('campaignApp')
  .controller('RegisterCtrl', function ($scope, $location, angularFire, TeamService, UserService) {

  	var firebaseURL = "https://campaign-dev.firebaseio.com";

	var mainRef = new Firebase(firebaseURL),
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

			userRef = new Firebase(firebaseURL+'/users/user_'+user.id);

			userRef.on("value",function(snapshot) {

				$scope.user = snapshot.val();

				var salesSum,
					progress,
					teamSum,
					user = snapshot.val();

				UserService.getSalesSumByDate("user_"+snapshot.val().user_id, null, function(sum) {
					
					salesSum = sum;

					UserService.getProgressByDate("user_"+snapshot.val().user_id, null, function(progress) {
						progress = progress;

						$scope.userProgress = {
							width: (progress.underGoal)*100+"%"
						}

						$scope.userProgressOverGoal = {
							width: (progress.overGoal)*100+"%"
						}

						$scope.salesSum = salesSum;
						$scope.goalDay = user.goalDay;

						$scope.safeApply();
					});
				});
			});
		}
		else {
			$scope.loggedIn = false; 
		}
	});

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
			salesRef2,
			feedback = {};

			//console.log(newSale);

		if(newSale.$valid) {


			sale.amount = $scope.salesAmount;
			sale.campaign = "-J52nGIk0-XiZmGePAxX";
			//$scope.campaignId;
			sale.date = moment().format("YYYY-MM-DD");

			//console.log(sale);

			salesRef = userRef.child("sales").push(sale);
			salesRef2 = userRef.child("sales2").child("dates").child("2013-12-10").push(sale, function(error) {
				
			});

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

'use strict';

angular.module('campaignApp')
  .controller('RegisterCtrl', function ($scope, $location, angularFire) {

	var mainRef = new Firebase('https://campaign.firebaseio.com'),
		userRef;

	$scope.salesAmount;
	$scope.campaignId;
	$scope.loggedIn = false;	

	var auth = new FirebaseSimpleLogin(mainRef, function(error, user) {
		if(user) {
			userRef = new Firebase('https://campaign.firebaseio.com/users/user_'+user.id);
			angularFire(userRef, $scope, 'user');
			$scope.loggedIn = true; 
		}
		else {
			console.log("Not Logged In");
			$scope.loggedIn = false; 
		}
	});

	mainRef.child("campaigns").on('value', function(snapshot) {
		$scope.campaigns = snapshot.val();
	}); 

	$scope.logOut = function() {
		auth.logout();
	}

	$scope.addSale = function(newSale) {

		var sale = {},
			salesRef,
			feedback = {};

		if(newSale.$valid) {

			sale.amount = $scope.salesAmount;
			sale.campaign = $scope.campaignId;

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

'use strict';

angular.module('campaignApp')
  .controller('MainCtrl', function ($scope) {

  	$scope.user;
   
  	var chatRef = new Firebase('https://campaign.firebaseio.com');

	var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
		if(user) {
			console.log(user);
			console.log("Logged In");
		}
		else {
			console.log("Not Logged In");
		}
	});

	$scope.logIn = function() {
		auth.login('password', {
		  email: $scope.user.email,
		  password: $scope.user.password
		});
	}

	$scope.logOut = function() {
		auth.logout();
	}
  });

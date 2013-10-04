'use strict';

angular.module('campaignApp')
  .controller('MainCtrl', function ($scope, $location, User) {

  	$scope.user,
  	$scope.newUser;
   
  	var chatRef = new Firebase('https://campaign.firebaseio.com');

	var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
		if(user) {
			console.log(user);
			console.log("Logged In");
			
			chatRef.child("users").child("user_"+user.id).on('value', function(snapshot) {
  				console.log('fred’s1 first name is ', snapshot.val());
			}); 
			$scope.$apply(function() { 
				$location.path("/register"); 
			});
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

	$scope.addUser = function() {

		var email = $scope.newUser.email,
			password = $scope.newUser.password,
			name = $scope.newUser.name;

		auth.createUser(email, password, function(error, user) {
		  if (!error) {
		    console.log('User Id: ' + user.id + ', Email: ' + user.email);
		    var newUser = User.createNewUser(name, email);
			newUser.save(user.id);
		  }
		  else {
		  	console.log(error);
		  }
		});
	}
  });

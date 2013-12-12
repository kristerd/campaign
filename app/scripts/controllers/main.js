'use strict';

angular.module('campaignApp')
  .controller('MainCtrl', function ($scope, $location, User, TeamService) {

  	$scope.user,
  	$scope.newUser = {};
  	$scope.success = false;

  	var firebaseURL = "https://campaign-dev.firebaseio.com";
   
  	var chatRef = new Firebase(firebaseURL);

	var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
		if(user) {
			//console.log(user);
			//console.log("Logged In");
			
			chatRef.child("users").child("user_"+user.id).on('value', function(snapshot) {
  				//console.log('fred’s1 first name is ', snapshot.val());
			}); 
			$scope.safeApply(function() { 
				$location.path("/register"); 
			});
		}
		else {
			//console.log("Not Logged In", error);
		}
	});

	TeamService.getTeams(function(data) {
		if($scope.safeApply) {
			$scope.safeApply(function() {
				$scope.teams = data;
			});
		} else {
			$scope.teams = data;
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
			name = $scope.newUser.name,
			team = $scope.teamId;

		if (email && password && name && team) {
			auth.createUser(email, password, function(error, user) {
			  if (!error) {

			  	$scope.error = "";

			    //console.log('User Id: ' + user.id + ', Email: ' + user.email);
			    var newUser = User.createNewUser(name, email);

		    	newUser.team = {
		    		id: $scope.teamId
		    	};

			    newUser.goalDay = 0;
			    newUser.user_id = user.id;
				newUser.save(user.id, function() {
					//console.log("opprettet");
					$scope.safeApply(function() {
						$scope.success = true;
						$scope.message = "Ny bruker opprettet, du kan nå logge inn."
					});
					
				});

			  }
			  else {
			  	//console.log(error);
			  	$scope.error = "Oppretting av bruker feilet. " + error;
			  }
			});
		}
		else {
			$scope.error = "Du må velge fylle inn alle feltene for å registrere deg";
		}
		
	}
  });

'use strict';

angular.module('campaignApp')
  .controller('UserCtrl', function ($scope, UserService, TeamService) {
    
  	var firebaseURL = "https://campaign-dev.firebaseio.com";
    
  	var mainRef = new Firebase(firebaseURL);

    var auth = new FirebaseSimpleLogin(mainRef, function(error, user) {

    	//console.log(error, user);

   	});

   	UserService.getUsers(function(users) {

    	$scope.users = {};

    	TeamService.getTeams(function(teams) {
	    	$scope.safeApply(function() {
	    		$scope.users = users;
	    		$scope.teams = teams;
	    	});
	  	});
  	});

  	$scope.setGoal = function() {
  		//console.log(this.user);
  		UserService.updateUser("user_"+this.user.user_id, angular.copy(this.user));
  	}

  	$scope.setTeam = function(id) {
  		//console.log("test ", this.user, id);
  		UserService.updateUser(id, angular.copy(this.user));	
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

  });

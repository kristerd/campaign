'use strict';

angular.module('campaignApp')
  .controller('TeamsCtrl', function ($scope, TeamService) {
    
	var mainRef = new Firebase('https://campaign.firebaseio.com');

    var auth = new FirebaseSimpleLogin(mainRef, function(error, user) {

    	//console.log(error, user);

   	});

    TeamService.getTeams(function(teams) {
    	//console.log(teams);
    	$scope.safeApply(function() {
    		$scope.teams = teams;
    	});
  	});

  	$scope.addTeam = function(newTeam) {
		TeamService.addTeam(newTeam, function(error) {
			if (!error) { // OK
				//console.log("New team "+ newTeam +" added");
			}
			else { // Error
				//console.log("Error when adding team: " + newTeam);
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

  });

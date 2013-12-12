'use strict';

angular.module('campaignApp')
  .service('TeamService', function TeamService() {

    var firebaseURL = "https://campaign-dev.firebaseio.com";

  	var teamRef = new Firebase(firebaseURL+'/teams'),
  		userRef = new Firebase(firebaseURL+'/users'),
    	service = {};

  	service.getTeams = function(callback) {

  		var teams = {};

  		teamRef.on("value",function(snapshot) {
			if (callback) {
    			callback.apply(this, [snapshot.val()]);
    		}
		});
    };

    service.addUserToTeam = function(teamID, userID, callback) {

    	teamRef.child(teamID + "/users").push(userID, function(status) {

    		if (callback) {
    			callback.apply(this, [status]);
    		}
    	});

    };

    service.getTeamWithUsers = function(teamID, callback) {
    	
    	var teamWithUsers = {},
    		teams,
    		users;

    	teamRef.child(teamID).on("value",function(snapshot) {
			
    		var teamUsers = snapshot.val().users;

    		teamWithUsers.team = snapshot.val();
    		teamWithUsers.users = new Array();

    		$.each(teamUsers, function( index, value ) {
  				
  				var user = value;

  				userRef.child(user).once("value", function(snapshot) {
  					teamWithUsers.users.push(snapshot.val());
  				});

			});

			if (callback) {
    			callback.apply(this, [teamWithUsers]);
    		}
		});
    };

    service.getTeamSalesSum = function(teamId, callback) {

    	var teamUsers = new Array(),
    		salesSummary = {
    			teamSalesSum : 0,
    			teamSalesGoal : 0
    		};

    var date = moment(date).format("YYYY-MM-DD");

		userRef.once("value", function(snapshot) {
			var users = snapshot.val();

			$.each(users, function( index, value ) {
				if (value.team.id === teamId) {
					var sales = value.sales;

					salesSummary.teamSalesGoal += value.goalDay;
					if (sales) {
						$.each(sales, function( index, value ) {
              if(moment(date).isSame(value.date)) {
							   salesSummary.teamSalesSum += value.amount;
              }
						});
					}
				}
			});
			if (callback) {
				callback.apply(this, [salesSummary]);
			}
		});    	
    }

    service.addTeam = function(name, callback) {

    	var newTeam = {};

    	newTeam.name = name;

    	teamRef.push(newTeam, function(status) {
    		if (callback) {
    			callback.apply(this, [status]);
    		}
    	});
    }

    return service;

  });

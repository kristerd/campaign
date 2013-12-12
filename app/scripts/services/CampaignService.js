'use strict';

angular.module('campaignApp')
  .service('CampaignService', function CampaignService(UserService) {

  		var firebaseURL = "https://campaign-dev.firebaseio.com";

  		var teamRef = new Firebase(firebaseURL+'/teams'),
	  		userRef = new Firebase(firebaseURL+'/users'),
	  		campaignRef = new Firebase(firebaseURL+'/campaigns'),
	    	service = {};


	service.getCampaign = function(campaignId, callback) {

		//console.log("CampaignService.getCampaign() called");
		
		campaignRef.child(campaignId).once("value",function(snapshot) {
            if (callback) {
                callback.apply(this, [snapshot.val()]);
            }
        });
	};

	service.getDaysWithSales = function(campaignId, callback) {

		//console.log("CampaignService.getDaysWithSales() called");

		var days,
			users,
			leader,
			daysWithLeaders = new Array(),
			day,
			dayIndex;

    	campaignRef.child(campaignId).child("days").once("value", function(snapshot) {

    		days = snapshot.val();

    		userRef.once("value", function(snapshot) {
    			
    			users = snapshot.val();

    			var users = $.map(users, function(value, index) {
				    return [value];
				});


    			(function(){
				   	
				   	var i = 0,
				   		j = 0;

				  function loopDays() {

					  	if (i < days.length) {
					      j = 0;
					      loopUsers();
					    } else {
					      //console.log("all done");
					    }
				  }

				  function loopUsers() {
				    if(j < users.length){

				    	UserService.getDateSalesSumForUser("user_"+users[j].user_id, days[i].date, function(data) {
				    		//console.log(data);

				    		var progress = data/users[j].goalDay;

				    		if (days[i].winner && days[i].winner.user_id === users[j].user_id && days[i].winner.progress > progress) {
								if (true) {
									days[i].winner = null;
								}
							}

							if (!days[i].leader || 
				    				days[i].leader.progress < progress || 
				    					days[i].leader.user.user_id === users[j].user_id) {

				    			if (!days[i].winner) {
									
									leader = {
										user: users[j],
										progress: progress
									}

									days[i].leader = leader;
									
									if (leader.progress >= 1) {
										users[j].progress = progress;
										days[i].winner = users[j];
									}

								}
				    		}

				    		campaignRef.child(campaignId).child("days").child(i).update(angular.copy(days[i]));

				    		//console.log(i, j, progress);
					      	
					      	j++;
					      	loopUsers()
				    	});
					      
				    } else {
				      i++;
				      loopDays();
				    }
				  }

				  loopDays();

				})(users, days, campaignId);

          		if (callback) {
      				//console.log("CALLBACK: CampaignService.getDaysWithSales()", daysWithLeaders);
    				callback.apply(this);
	    		}
          	});
    	});
    };

    service.getTopUsersByDay = function(date, callback) {

    	var users,
    		usersByProgress = new Array();

    	UserService.getUsers(function(users) {

    		users = users;

    		$.each(users, function(index, value) {
    			UserService.getProgressByDate(index, "2013-12-11", function(data) {
    				usersByProgress.push(data);
    			});
    		});

    		usersByProgress.sort(compare);

    		if (callback) {
    			callback.apply(this, [usersByProgress.slice(0,3)]);
    		};
    	});

    	function compare(a,b) {
		  if (a.underGoal < b.underGoal)
		     return 1;
		  if (a.underGoal > b.underGoal)
		    return -1;
		  return 0;
		};
    };

  	function getUserSalesSumByDate(userIndex, user, dayIndex, day, campaignId) {

  		var leader = {};

  		UserService.getDateSalesSumForUser(userIndex, day.date, function(data) {
			if (data !== 0) {

				var progress = data/user.goalDay;

				if (!day.leader || day.leader.progress < progress) {

					if (!day.winner) {
						leader = {
							user: user,
							progress: progress
						}

						day.leader = leader;
						
						if (leader.progress >= 1) {
							day.winner = user;
						}
					}
					campaignRef.child(campaignId).child("days").child(dayIndex).update(angular.copy(day));
				}
			}
			else {
				//console.log(data);
			}
		});
    };


	    return service;
  });

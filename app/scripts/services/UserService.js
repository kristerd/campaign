'use strict';

angular.module('campaignApp')
  .service('UserService', function UserService() {

  	var teamRef = new Firebase('https://campaign.firebaseio.com/teams'),
  		userRef = new Firebase('https://campaign.firebaseio.com/users'),
    	service = {};

    service.updateUser = function(id, user, callback) {

        userRef.child(id).update(user);
    };

    service.getUsers = function(callback) {
        userRef.once("value",function(snapshot) {
            if (callback) {
                callback.apply(this, [snapshot.val()]);
            }
        });
    };

    service.getDateSalesForUser = function(userId, date, callback) {
        
        var date = moment(date).format("YYYY-MM-DD");

        userRef.child(userId+"/sales").once("value", function(snapshot) {

            var sales = snapshot.val(),
                todaysSales = new Array();

            if (sales && sales !== null) {
              //console.log("1", sales);


              $.each(sales, function( index, value ) {
                  if(moment(date).isSame(value.date)) {
                    
                    todaysSales.push(value);
                  }
              });
            }
            
            if (callback) {
                callback.apply(this, [todaysSales]);
            }
            
        });
    };

    service.getTodaysSalesForUser = function(userId, callback) {
        userRef.child(userId+"/sales").once("value", function(snapshot) {
            var sales = snapshot.val(),
                todaysSales = new Array(),
                today = moment(new Date()),
                date;
            
            if (sales && sales !== null) {
              $.each(sales, function( index, value ) {

                  date = moment(value.date, "YYYY-MM-DD");
                  var today = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");

                  if(moment(value.date).isSame(today, "day")) {
                    todaysSales.push(value);
                  }
              });
            }

            if (callback) {
                callback.apply(this, [todaysSales]);
            }
            
        });
    };

    service.getTodaysSalesSumForUser = function(userId, callback) {

        console.log("UserService.getTodaysSalesSumForUser("+userId+") called");
        
        var sales,
            sum = 0;

      service.getTodaysSalesForUser(userId, function(data) {
          sales = data;

         
         if (sales && sales !== null) {
            $.each(sales, function( index, value ) {
                sum += value.amount;
            });
          }
          
          if (callback) {
              console.log("CALLBACK: UserService.getTodaysSalesSumForUser("+userId+") ", sum);
              callback.apply(this, [sum]);
          }
      });
    };

    service.getDateSalesSumForUser = function (userId, date, callback) {

        console.log("UserService.getDateSalesSumForUser("+userId+","+date+") called");

        var sales,
              sum = 0;

        service.getDateSalesForUser(userId, date, function(sales) {

            sales = sales;
            
            if (sales && sales !== null) {
              $.each(sales, function( index, value ) {
                  sum += value.amount;
              });
            }

            if (callback) {
                console.log("CALLBACK: UserService.getDateSalesSumForUser("+userId+") ", sum);
                callback.apply(this, [sum]);
            }
        });
    } 

    function compareDates(date1, date2) {
        //call setHours to take the time out of the comparison
        if(date1.setHours(0,0,0,0) === date2.setHours(0,0,0,0))
        {
            return true;
        }
        return false;
    }
  

  	/*service.getUserss = function(callback) {

  		var teams = {},
          users = {},
          usersWithTeam = {};

          usersWithTeam = new Array();

  		userRef.once("value",function(snapshot) {

          users = snapshot.val();
          
          teamRef.once("value", function(snapshot) {
              teams = snapshot.val();

              $.each(users, function( index, value ) {
                  var userId = index,
                      currentUser = value;
                  $.each(teams, function( index, value ) {
                    var teamId = index,
                        currentTeam = {
                          id: index,
                          teamDetails: value 
                        };
                    if (value.users) {
                        $.each(value.users, function( index, value ) {
                          if (userId === value) {
                              currentUser.team = currentTeam.id;
                              currentUser.teamDetails = currentTeam;
                          }
                        });
                    }
                  });
                  usersWithTeam.push(currentUser);
              });
              if (callback) {
                callback.apply(this, [usersWithTeam]);
              }
          });  			
		  });
    };*/

    return service;

  });

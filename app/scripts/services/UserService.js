'use strict';

angular.module('campaignApp')
  .service('UserService', function UserService() {

    var firebaseURL = "https://campaign-dev.firebaseio.com";

  	var teamRef = new Firebase(firebaseURL+'/teams'),
  		userRef = new Firebase(firebaseURL+'/users'),
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

    service.getSalesByDate = function(userId, date, callback) {

        if (date===null || !angular.isDefined(date)) {
            date = moment().format("YYYY-MM-DD");
        };

        userRef.child(userId).child("sales2").child("dates").child(date).once("value", function(snapshot) {
            if (callback) {
                callback.apply(this, [snapshot.val()]);
            }
        });
    };

    service.getSalesSumByDate = function(userId, date, callback) {
        
        var sum = 0;

        service.getSalesByDate(userId, date, function(sales) {

            if (sales && sales !== null) {
              $.each(sales, function( index, value ) {
                  sum += value.amount;
              });
            }
            
            if (callback) {
                callback.apply(this, [sum]);
            }
        });
    };

    service.getProgressByDate = function(userId, date, callback) {

        var goal = 0,
            sum = 0,
            progressObject = 0;

        userRef.child(userId).child("goalDay").once("value", function(goal) {
            goal = goal.val();

            service.getSalesSumByDate(userId, date, function(sum) {
                progressObject = {
                    userId: userId,
                    sum: sum,
                    underGoal: (sum / goal),
                    overGoal: (sum / goal)-1
                };

                console.log(sum, goal);

                if (callback) {
                    callback.apply(this, [progressObject]);
                }
            });
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

        //console.log("UserService.getTodaysSalesSumForUser("+userId+") called");
        
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
              //console.log("CALLBACK: UserService.getTodaysSalesSumForUser("+userId+") ", sum);
              callback.apply(this, [sum]);
          }
      });
    };

    service.getDateSalesSumForUser = function (userId, date, callback) {

       // console.log("UserService.getDateSalesSumForUser("+userId+","+date+") called");

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
               // console.log("CALLBACK: UserService.getDateSalesSumForUser("+userId+") ", sum);
                callback.apply(this, [sum]);
            }
        });
    } 

    return service;

  });

'use strict';

angular.module('campaignApp')
  .controller('MainCtrl', function ($scope) {
   
  	var chatRef = new Firebase('https://campaign.firebaseio.com/');
	var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
		console.log(error);
		console.log(user);
	});

  });

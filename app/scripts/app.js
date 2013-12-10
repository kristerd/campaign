'use strict';

angular.module('campaignApp', ['firebase', 'ui.date'])
	.config(function ($routeProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/admin', {
				templateUrl: 'views/admin.html',
				controller: 'AdminCtrl'
			})
			.when('/campaign/:campaignId', {
				templateUrl: 'views/campaign.html',
				controller: 'CampaignCtrl'
			})
			.when('/register', {
				templateUrl: 'views/register.html',
				controller: 'RegisterCtrl'
			})
			.when('/teams', {
			  templateUrl: 'views/teams.html',
			  controller: 'TeamsCtrl'
			})
			.when('/user', {
			  templateUrl: 'views/user.html',
			  controller: 'UserCtrl'
			})
			.when('/campaignView/:campaignId', {
			  templateUrl: 'views/campaignView.html',
			  controller: 'CampaignviewCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		}).config(function($httpProvider) {
    		$httpProvider.defaults.useXDomain = true;
      		delete $httpProvider.defaults.headers.common['X-Requested-With'];
  		});;
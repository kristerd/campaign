'use strict';

angular.module('campaignApp', ['firebase'])
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
			.otherwise({
				redirectTo: '/'
			});
		});
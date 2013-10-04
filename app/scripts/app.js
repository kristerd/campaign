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
			.when('/results', {
				templateUrl: 'views/results.html'
			})
			.when('/register', {
				templateUrl: 'views/register.html',
				controller: 'RegisterCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		});
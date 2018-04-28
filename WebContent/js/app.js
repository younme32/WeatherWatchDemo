//define the 'app' module
var app = angular.module('WeatherWatch', [ 'ngRoute' ]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(false).hashPrefix('');
	$routeProvider.when("/", {
		templateUrl : "pages/WeatherPage.html",
		controller : "weatherController"
	})
})
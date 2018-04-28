app.controller("weatherController", function($rootScope, $scope, $location, $http){
	// An element with ng-click='test()' will activate this function
	// 0: Chicago, 1: Dallas, 2: Milwaukee, 3: Minneapolis
	$scope.cityId = [4887398, 4684888, 5263045, 5037649]
	$scope.cityImg = ["images/chi-bg.jpg", "images/dal-bg.jpg", "images/mil-bg.jpg", "images/min-bg.jpg"]
	
	$scope.appid = "70c038ea6f76202967b842cdbe61ea0b"; // If this were not a
														// free API key then
														// this wouldn't be here
	$scope.weatherKey = "weather";
	$scope.forecastKey = "forecast";
	$scope.unit = "imperial";
	$scope.apiCall = "http://api.openweathermap.org/data/2.5/";
	$scope.Math = window.Math;
	$scope.dow = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
	
	$scope.currWeather = [];
	$scope.forecast = [];
	
	$scope.tab = function(a){
		// Make header the new active one
		jQuery(".weather-tab-header.slds-is-active").removeClass("slds-is-active");
		jQuery("#tab-head-" + a).addClass("slds-is-active");
		
		
		// change content to new tab
		jQuery(".weather-tab-content.slds-show").removeClass("slds-show").addClass("slds-hide");
		jQuery("#tab-content-" + a).removeClass("slds-hide").addClass("slds-show");
		
		// change background
		jQuery("body").css("background", "url(" + $scope.cityImg[a] + ") no-repeat");
		jQuery("body").css("background-size", "cover");
	}
	
	$scope.setSymbols = function(CID){
		// Find the appropriate temperature symbol
		var tmp = $scope.currWeather[CID].main.temp
		var classname = "";
		if(tmp < 32){
			classname = ".cold";
		}else if(tmp > 80)
		{
			classname = ".hot";
		}else{
			classname = ".med";
		}
		jQuery("#tab-content-" + CID + " " + classname).removeClass("slds-hide");
		jQuery("#tab-head-" + CID + " " + classname).removeClass("slds-hide");
		
		// Find the appropriate sunny -> cloudy symbol
		var tmp = $scope.currWeather[CID].clouds.all;
		if(tmp < 25)
		{
			classname = ".clear";
		}else if(tmp>70)
		{
			classname = ".cloudy";
		}else{
			classname = ".partly";
		}		
		jQuery("#tab-content-" + CID + " " + classname).removeClass("slds-hide");
		jQuery("#tab-head-" + CID + " " + classname).removeClass("slds-hide");
		// Check to see if it is windy
		var tmp = $scope.currWeather[CID].wind.speed;
		if(tmp > 25)
		{
			jQuery("#tab-content-" + CID + " .windy").removeClass("slds-hide");
			jQuery("#tab-head-" + CID + " " + classname).removeClass("slds-hide");
		}
		
	}
	$scope.getWeatherData = function(CID, current){
		var key;
		if(current){
			key = $scope.weatherKey;
		}else{
			key = $scope.forecastKey;
		}
		var uri = $scope.apiCall + key + "?id=" +$scope.cityId[CID] + "&units=" +$scope.unit + "&APPID=" + $scope.appid;
		jQuery.ajax({
			url:uri,
			type:"GET",
			dataType: "text"
		}).done(function(data){
			// Fix response from API starting variable with a number
			data = data.replace("3h", "h3");
			var classname;
			var set;
			if(current){
				$scope.currWeather[CID] = JSON.parse(data);
				for(let i = 0; i < $scope.currWeather[CID].weather.length; i++)
				{
					if(i == 0)
					{
						$scope.currWeather[CID].weatherDesc = $scope.currWeather[CID].weather[i].description;
					}else{
						$scope.currWeather[CID].weatherDesc += $scope.currWeather[CID].weather[i].description;
					}
				}
				for(let a of $scope.currWeather[CID].weather)
				{
					$scope.currWeather[CID].weatherDesc += ", " + a.description;
				}
				set = $scope.currWeather[CID];
				classname = ".current-weather";
			}else{
				$scope.forecast[CID] = JSON.parse(data);
				
				for(let listitem of $scope.forecast[CID].list)
				{
					var date = new Date(listitem.dt_txt);
					listitem.daytime = $scope.dow[date.getDay()] + " " + toClockTime(date.getHours());
					for(let i = 0; i < listitem.weather.length; i++ )
					{
						if(i == 0)
						{
							listitem.weatherDesc = listitem.weather[i].description;
						}else{
							listitem.weatherDesc += listitem.weather[i].description;
						}
						
					}
					
					
				}
				set = $scope.forecast[CID];
				classname = ".forecast-weather";
			}
			
			// removing rain and snow if there isn't any
			if(typeof set.rain !== "object"){
				jQuery("#tab-content-" + CID + " " + classname + " .rain").hide();
			}
			if(typeof set.snow !== "object"){
				jQuery("#tab-content-" + CID + " " + classname + " .snow").hide();
			}
			$scope.$apply();
			// Set Weather Symbols
			$scope.setSymbols(CID);
		}).fail(function(){
			console.log("something went wrong");
		}).always(function(){
			console.log("ajax executed");
		});
	}
	
	jQuery(document).ready(function(){
		// Get Current Weather Data
		$scope.getWeatherData(0,true);
		$scope.getWeatherData(1,true);
		$scope.getWeatherData(2,true);
		$scope.getWeatherData(3,true);
		
		// get Forecast Weather Data
		$scope.getWeatherData(0,false);
		$scope.getWeatherData(1,false);
		$scope.getWeatherData(2,false);
		$scope.getWeatherData(3,false);
		
		// set default bg img
		jQuery("body").css("background", "url(" + $scope.cityImg[0] + ") no-repeat");
		jQuery("body").css("background-size", "cover");
		
	});	
		
});


/*
 * http://api.openweathermap.org/data/2.5/weather?id=5263045&units=imperial&APPID=70c038ea6f76202967b842cdbe61ea0b
 * API Call to get current weather in Milwaukee (id determines the city) units
 * determines which measurement system is used (imperial) APPID refers to the
 * API key
 * 
 * http://api.openweathermap.org/data/2.5/forecast?id=5263045&APPID=70c038ea6f76202967b842cdbe61ea0b
 * API Call to get 5 day/3 hour forecast
 */
'use strict';

//Data module
var dataModule = angular.module('dataModule', ['UIModule','ngStorage']);

//Users Service
dataModule.service('userService', ['$localStorage', function($localStorage){

	var UsersDB = $localStorage.$default({blockUsers: []});

	this.block = function(blockUserName){  
    	UsersDB.blockUsers.push(blockUserName);
  	}

  	this.unblock= function(blockUserName){
    	for(var i = UsersDB.blockUsers.length-1; i>=0;i--){
      		if (UsersDB.blockUsers[i] === blockUserName) UsersDB.blockUsers.splice(i, 1);
    	}
  	}

  	this.getAll = function(){
	    return UsersDB.blockUsers;
	}

}]);

//Tweet Service
dataModule.service('tweetService', ['UIService', 'userService', '$http', '$q',function(UIService,userService,$http,$q){

	this.getAll = function(){
		var deferred = $q.defer();
		$http.get('http://localhost:3000/timeline?count=100').then(function(result){
			var tweets = result.data;
			angular.forEach(tweets,function(tweet){
				if(tweet.retweeted_status){
					tweet = UIService.textParser(tweet.retweeted_status);	
				}else{
					tweet = UIService.textParser(tweet);	
				};
				// console.log(tweet);
			});
			deferred.resolve(tweets);
			//return tweets;
		},function(error){
			deferred.reject("Unable to get tweets from timeline");
		});
		return deferred.promise;
	};

	this.getById = function(id){
		var deferred = $q.defer();
		$http.get('http://localhost:3000/statuses/show?id='+id).then(function(tweet){
			if(tweet){
				if(tweet.retweeted_status){
					tweet = UIService.textParser(tweet.retweeted_status);	
				}else{
					tweet = UIService.textParser(tweet);	
				};
			}
			//return tweet;
			deferred.resolve(tweet);
		},function(error){
			deferred.reject("Unable to get tweet by id");
		});
		return deferred.promise;
	};

	this.getByText = function(search){		
		var deferred = $q.defer();
		$http.get('http://localhost:3000/search?q=%23'+search).then(function(result){
			var tweets = result.data.statuses;								
			angular.forEach(tweets,function(tweet){
				if(tweet.retweeted_status){
					tweet = UIService.textParser(tweet.retweeted_status);	
				}else{
					tweet = UIService.textParser(tweet);	
				};
			});			
			console.log(tweets);
			deferred.resolve(tweets);
		},function(error){
			deferred.reject("Unable to get tweets by text")	
		});
		return deferred.promise;
	};

}]);

//Trends Service
dataModule.service('trendsService', ['$http','geoLocationService', '$q', function($http,geoLocationService,$q){

	this.getAll = function(){
		var deferred = $q.defer();
		geoLocationService.getLocation().then(function(coords){
			$http.get('http://localhost:3000/myplace?lat='+coords.latitude+'&long='+coords.longitude).then(function(data){
				var myplace = data.data[0];
				getByCountryId(myplace.parentid).then(function(trends){
					deferred.resolve(trends);
				});
			});
		});
		return deferred.promise;		
	};	

	var getByCountryId = function(countryId){
		var deferred = $q.defer();
        $http.get('http://localhost:3000/trends?id='+countryId).then(function(trends){
        	//console.log(trends);
        	return deferred.resolve(trends.data[0].trends);
        }, function(error){
        	return deferred.reject("Unable to get trends by country");
        });
        return deferred.promise;
	};

}]);

//Geo Location Service
dataModule.service('geoLocationService', function($q){

	this.getLocation = function(){
		var deferred = $q.defer();
		//Geo Location
	   	if (navigator.geolocation) {
	    	navigator.geolocation.getCurrentPosition(function(position){	      		
	        	return deferred.resolve(position.coords);
	      	}, function(error){
	      		return deferred.reject("Unable to get your location");
	      	});
	    } else {
          deferred.reject("Your browser cannot access to your position");
        };
        return deferred.promise;
  	};

});




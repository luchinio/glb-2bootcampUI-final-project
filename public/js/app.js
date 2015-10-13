'use strict';

var tweetApp = angular.module('tweetApp', ['UIModule', 'dataModule', 'ngRoute']);

//Route Configuration
tweetApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/timeline', { templateUrl: 'Views/timeline.html', controller: 'timelineController'}). 
      when('/timeline/:search', { templateUrl: 'Views/timeline.html', controller: 'timelineController'}). 
      when('/trends', { templateUrl: 'Views/trends.html', controller: 'trendsController'}).       
      when('/tweet/:id', { templateUrl: 'Views/tweet.html', controller: 'timelineController'}).        
      when('/blockUsers', { templateUrl: 'Views/blockUsers.html', controller: 'blockUsersController'}). 
      otherwise({ redirectTo: '/timeline' });   
}]);

//Temaplte Cache
tweetApp.run(['$templateCache', '$http', function ($templateCache, $http){
  $http.get('Views/tweet.html', {cache: $templateCache});
  $http.get('Views/timeline.html', {cache: $templateCache});
  $http.get('Views/trends.html', {cache: $templateCache});
  $http.get('Views/blockUsers.html', {cache: $templateCache});
}]);

//Header Active tab 
tweetApp.controller('HeaderController', ['$scope', '$location', function($scope,$location){
    $scope.isActive = function (viewLocation) {
      if($location.path().toString().indexOf('tweet') != -1){
        return viewLocation == '/timeline';
      }
      return $location.path().toString().indexOf(viewLocation) != -1;
    };
}]);

//Timeline Controller
tweetApp.controller('timelineController', ['$scope','tweetService','$routeParams', 'userService', '$location', function($scope, tweetService, $routeParams,userService,$location){

  $scope.blockUsers = userService.getAll();

  if($routeParams.search){
    $scope.search = $routeParams.search;
    tweetService.getByText(encodeURIComponent($routeParams.search)).then(function(tweets){            
      $scope.tweets = tweets;
    });  
  }else{
    tweetService.getAll().then(function(tweets){
      $scope.tweets = tweets;
    });
  }

  if($routeParams.id){
    tweetService.getById($routeParams.id).then(function(tweet){
      $scope.tweet = tweet;  
    });
  }

  $scope.searchData = function(input){
    tweetService.getByText(input).then(function(tweets){            
      $scope.tweets = tweets;  
    });  
  };

  $scope.blockUser = function(blockUserName){
    alert('User @' + blockUserName + ' is blocked !');
    userService.block(blockUserName);
  };

  $scope.isBlock = function(tweet){
    return $scope.blockUsers.indexOf(tweet.user.screen_name) == -1;
  };

  $scope.details = function(id){
    $location.path('tweet/'+id);
  };

}]);

//BlockUsers Controller
tweetApp.controller('blockUsersController', ['$scope', 'userService', function($scope,userService){

  $scope.blockUsers = userService.getAll();

  $scope.unblock = function(blockUserName){ 
      alert('User @' + blockUserName + ' is unblocked !');  
      userService.unblock(blockUserName);
  };

  $scope.block = function(newBlockUser){
    if (newBlockUser){
      if(newBlockUser.toString().length > 0){
        var name = newBlockUser.replace('@','');
        userService.block(name);
      }
    }
  }

}]);

//Trends Controller
tweetApp.controller('trendsController', ['$scope', 'trendsService', function($scope,trendsService){

  $scope.trends = trendsService.getAll().then(function(trends){
    $scope.trends = trends;
  });

}]);






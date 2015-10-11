'use strict';

//UI Module
var UIModule = angular.module('UIModule', ['dataModule']);

//Reverse blockUsers string
UIModule.filter('reverse', function() {
  return function(tweets) {
    return tweets.slice().reverse();
  };
});

//Time in Tweet details
UIModule.filter('detailTime',function(){
	return function(twitterTime){
		var dateTime = new Date(twitterTime);
		var hours = dateTime.getHours();
		  var minutes = dateTime.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12;
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct','Nov', 'Dec'];
		return dateTime.getDate() + ' ' + monthNames[dateTime.getMonth()] + ' ' + dateTime.getFullYear().toString().replace('20','') + ' - ' +  strTime;
	};
});

//Filter for time in tweet list
UIModule.filter('converTime', function(){
	return function(datetime){
		var tTime = new Date(datetime);
	    var cTime = new Date();
	    var sinceMin = Math.round((cTime-tTime)/60000);
	    var since;
	    if(sinceMin == 0)
	    {
	        var sinceSec = Math.round((cTime-tTime)/1000);
	        since = sinceSec + 's';
	    } else if(sinceMin <60){
	    	since = sinceMin + 'm';
	    } else if(sinceMin <1440){
	    	var sinceHr = Math.round(sinceMin/60);
	    	since = sinceHr + 'h';
	    } else {
	    	var sinceDay = Math.round(sinceMin/1440);
	    	since = sinceDay + 'd';
	    };	     
	    return since;
	};
});

//Filter for links urls in tweet text
UIModule.filter('convertUrl', ['$sce', function($sce){
    return function(text) {
   		return $sce.trustAsHtml(text);
  	};
}]);

//Service to change default text for text with links
UIModule.service('UIService', function(){

	this.textParser = function(tweet){	   	
	    if(tweet.entities.urls){
	      if(tweet.entities.urls.length > 0){
	        angular.forEach(tweet.entities.urls,function(url){
	          tweet.text = tweet.text.replace(url.url,'<a target="_blank" href="'+url.expanded_url+'">'+url.display_url+'</a>');          
	        });    
	      } 
	    };
	    if(tweet.entities.media){
	      if(tweet.entities.media.length > 0){
	        angular.forEach(tweet.entities.media,function(media){
	          tweet.text = tweet.text.replace(media.url,'<a target="_blank" href="'+media.media_url+'">'+media.display_url+'</a>');
	        });
	      } 
	    };
	    if(tweet.entities.hashtags){
	      if(tweet.entities.hashtags.length > 0){
	        angular.forEach(tweet.entities.hashtags,function(hashtag){
	          tweet.text = tweet.text.replace('#'+hashtag.text,'<a href="#timeline/'+hashtag.text+'">'+'#'+hashtag.text+'</a>');          	          
	        });    
	      }
	    };
	    if(tweet.entities.user_mentions){
	      if(tweet.entities.user_mentions.length > 0){
	        angular.forEach(tweet.entities.user_mentions,function(user_mentions){
	          tweet.text = tweet.text.replace('@'+user_mentions.screen_name,'<a href="#timeline/'+user_mentions.screen_name+'">'+'@'+user_mentions.screen_name+'</a>');
	        });
	      } 
	    };
	    return tweet;
  	};  	
});
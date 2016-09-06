angular.module('SubNavCtrl', []).controller('SubNavController', function($scope, EnvService, AppService,$q,$http,$location) { 
	$scope.isDemo = false;
	$scope.loc = $location.path();
    $scope.nav = languageData.nav;    
    $scope.isChangingProxy = false;
    $scope.customerInfo = "";
    
    $scope.editProxyCustomer = function(){
    	setTimeout(function(){
    		$("#proxyTagsInput .input")[0].focus();
    	}, 50);    	
    	$scope.isChangingProxy = true;    	
    };
    
    $scope.cancelEdit = function(){
    	$scope.isChangingProxy = false;
    	$scope.tags = [];
    };
    
    $scope.changeProxyCustomer = function(){    	
    	var tag = $scope.tags[0];
    	var request = {};
    	request.stp = tag.rdesc;
    	request.customerID = tag.ldesc;
    	request.customerName = tag.text;
    	$http.post('secure/setCustomerInfo',request).success(function(data) {   		 	
   		 	window.location.reload();
    	});
    };
    
    $scope.tags = [];
	
    $scope.onTagAdded = function($tag){    	
    	$scope.search = $tag.text;    	
    	$scope.filterTable();    	
    };
    
    $scope.onTagRemoved = function($tag){
    	$scope.search = "";

    	    	
    	$scope.filterTable();
    };
    
	$scope.loadTags = function(query) {	
		var deferred = $q.defer();
		$http.get("secure/search",{params: {searchText: query, queryName: "type_ahead_customers", stp: ""}}).success(function(data){
			var results = angular.fromJson(data.results);
			var tagsResults = [];
			var index = -1;
			var tmp;
			for(var i = 0; i < results.length; i++){
				tmp = results[i];
				index = tagsResults.indexOf(_.findWhere(tagsResults, {text:tmp[1]}));
				if(index < 0){
					tagsResults.push({text : tmp[2],ldesc:tmp[1],rdesc: tmp[0],getChildColor:{"background-color":"#74ACBD"}});
				}	
				if(tagsResults.length === 10){
					i = results.length + 1;
				}
			}			
			deferred.resolve(tagsResults);						
		});
		return deferred.promise;
	};
	
	$scope.filterTable = function(){
							
	};
	
    
    $scope.getTimeInfo = function(){	   
 	   var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 	   var dateFormat = "MMMM Do YYYY";
 	   var hourFormat = "h:mm A";	   
 	   $scope.clockHours = moment().format(hourFormat);
 	   if($location.$$path === "/dashboard" || $location.$$path === "/reachutilratiochart/details" || $location.$$path === "/reachutilratiochart/activity"){
 		   var m = moment().subtract(1,'days');
 		   $scope.clockDate = days[m.day()] + ", " + m.format(dateFormat);
 		   $scope.initialClockDate = days[moment().startOf('year').day()] + ", " + moment().startOf('year').format(dateFormat);
 	   }else{
 		   $scope.clockDate = days[moment().day()] + ", " + moment().format(dateFormat);
 	   }
 	   
    }; 
    
     $scope.init = function(){    	 
    	 $http.get('secure/getAppInfo').success(function(data) {
    		 $scope.customerInfo = data.customerName + ", " + data.stp;
    	 });
    	 
    	 $scope.getTimeInfo();
    	 setInterval($scope.getTimeInfo, 30000);
    	 EnvService.getIsDemo(function(isDemo){
    		 $scope.isDemo = isDemo;
    	 });
     };
     $scope.hasDashPermissions = function(){
    	 return AppService.hasDashboardPermissions() || $scope.isDemo;
     };
     
     $scope.hasLiveStatsPermissions = function(){
    	 return AppService.hasLiveStatsPermissions() || $scope.isDemo;
     };
     
     $scope.hasReportsPermissions = function(){
    	 return AppService.hasReportsPermissions() || $scope.isDemo;
     };
     
     $scope.hasProxyClientPermissions = function(){
    	 return AppService.hasProxyClientPermissions() || $scope.isDemo;
     };
     
     $scope.showTime = function(){
    	 if($location.$$path === "/dashboard" || $location.$$path === "/reachutilratiochart/details" || $location.$$path === "/reachutilratiochart/activity"){
    		 return false;
    	 }else{
    		 return true;
    	 }
     };
     
     
     $scope.init();
});
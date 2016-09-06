angular.module('LoginCtrl', []).controller('LoginController', function($scope, $http, $location,Auth,LoginService,RedirectService) {
    $scope.user = {};
    $scope.user.username = "";
    $scope.user.password = "";
    $scope.url = "/loginservice/login";
    $scope.badLogin = false;

    $scope.login = function(){
    	
    	$http.post($scope.url,$scope.user).success(function(data) { 
    		console.log("data",data)
    		if(data.statusCode === 200){
    			LoginService.setCurrentUser($scope.user);
    			$location.path(RedirectService.getUserRedirectUrl($scope.user));
    		}else{
    			$scope.badLogin = true;
    		}
    	});
    	
    };

});
angular.module('DashboardReportsCtrl', []).controller('DashboardReportsController', function($scope, $http,InitialSiteService) {
	
	InitialSiteService.hideInitialLoader();
	
    $http.get('resources/data/reportTable.json').success(function(data) {
        $scope.reportTable = data;
    });
});
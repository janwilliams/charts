angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider,$httpProvider) {
    var access = routingConfig.accessLevels;
    
    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {
            if(response.status === 401) {
                window.location.href = "https://www.appreciatehub.com/"
                return $q.reject(response);
            }
            else if(response.status === 500){
            	$location.path('/ep');
            	return $q.reject(response);
            }else{
            	return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);
    
    $routeProvider

		// home page
		.when('/dashboard', {
			templateUrl: 'resources/partials/dashboardCharts.html',
			controller: '',
            access:         access.admin,
            resolve: {
            	userPermissions: function(AppService){
            		return AppService.setCustomerPermissions(true,SAC.VIEW_PERMISSIONS.VIEW_DASHBOARD);
            	},            	
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
		})
		
		.when('/reachutilratiochart/:stack', {
            templateUrl: 'resources/partials/reachutilratiochart.html',
            controller: '',
            access:         access.admin,
            resolve: {
            	userPermissions: function(AppService){
            		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_DASHBOARD);
            	},            	
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
        })
		
		.when('/livestats', {
            templateUrl: 'resources/partials/livestats.html',
            controller: '',
            access:         access.admin,
            resolve: {
            	userPermissions: function(AppService){
            		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_LIVE_STATS);
            	},            	
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
        })
        
//        .when('/reports', {
//            templateUrl: 'resources/partials/reports.html',
//            controller: 'ReportsController',
//            access:         access.admin,
//            resolve: {
//            	userPermissions: function(AppService){
//            		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_REPORTS_2_0);
//            	},
//            	appInfo: function(AppService){
//            		return AppService.loadAndSaveAppInfo();
//            	}
//            }
//        })
        
        .when('/reports', {
        	templateUrl: 'resources/partials/reports.html',
            controller: 'ReportsController',
            access:         access.admin,
            resolve: {
           	 userPermissions: function(AppService){
            		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_REPORTS_2_0);
            	},
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
       })
        
        .when('/datamashup', {
            templateUrl: 'resources/partials/mashup.html',
            controller: 'MashupController',
            access:         access.admin,
            resolve: {
            	userPermissions: function(AppService){
            		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_REPORTS_2_0);
            	},
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
        })
        
        .when('/executivesummaryreport', {
        	 templateUrl: 'resources/partials/executivesummary.html',
             controller: 'ExecutiveSummaryController',
             access:         access.admin,
             resolve: {
            	 userPermissions: function(AppService){
             		return AppService.setCustomerPermissions(false,SAC.VIEW_PERMISSIONS.VIEW_REPORTS_2_0);
             	},
             	appInfo: function(AppService){
             		return AppService.loadAndSaveAppInfo();
             	}
             }
        })
        
        .when('/ep', {
            templateUrl: 'resources/partials/error/error.html',
            controller: '',
            access:         access.admin,
        })
        
        .otherwise({redirectTo : "/dashboard"});

	$locationProvider.html5Mode(true);

}]);

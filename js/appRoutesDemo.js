angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider,$httpProvider) {
    var access = routingConfig.accessLevels;
    
    var interceptor = ['$location','$injector', '$q', function($location,$injector,$q) {
        function success(response) {
            return response;
        }

        function error(response) {
            if(response.status === 401) {
            	
            	var LoginService = $injector.get('LoginService');
            	if($location.$$url !== "/login" && LoginService.getCurrentUser()){
            		
                	var RedirectService = $injector.get('RedirectService');
                	var redirectObj = {username:LoginService.getCurrentUser(),path:$location.$$url};
                	if(redirectObj.username ){
                		RedirectService.setUserRedirectUrl(redirectObj);
                	}
                	
            	}
            	
            	$location.path('/login');
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

	    .when('/login', {
			templateUrl: 'resources/partials/login.html',
			controller: 'LoginController',
	        access:         access.admin
		})
		
		.when('/dashboard', {
			templateUrl: 'resources/partials/dashboardCharts.html',
			controller: '',
            access:         access.admin,
            resolve: {
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
		})

		.when('/drillin', {
			templateUrl: 'resources/partials/stak.html',
            access:         access.admin

		})        
        
        .when('/reports', {
            templateUrl: 'resources/partials/reports.html',
            controller: 'ReportsController',
            access:         access.admin
        })
        
        .when('/budgetreport', {
        	 templateUrl: 'resources/partials/budgetReport.html',
             controller: 'BudgetReportController',
             access:         access.admin,
             resolve: {
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
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
        })
        
        .when('/activitycharts', {
            templateUrl: 'resources/partials/activitychart.html',
            controller: 'ZoomActivityChartsController',
            access:         access.admin
        })

        .when('/reachutilratiochart/:stack', {
            templateUrl: 'resources/partials/reachutilratiochart.html',
            controller: '',
            access:         access.admin,
            resolve: {
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
            	appInfo: function(AppService){
            		return AppService.loadAndSaveAppInfo();
            	}
            }
        })

        .when('/filters', {
            templateUrl: 'resources/partials/filters.html',
            controller: 'FiltersController',
            access:         access.admin
        })
        
        .when('/dependantFilters', {
            templateUrl: 'resources/partials/dependantfilters.html',
            controller: 'DependantFiltersController',
            access:         access.admin
        })
        
        .when('/ep', {
            templateUrl: 'resources/partials/error/error.html',
            controller: '',
            access:         access.admin,
        })                
        
        .otherwise({redirectTo:"/dashboard"});

	$locationProvider.html5Mode(true);

}]);

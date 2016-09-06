angular.module('DashboardChartsCtrl', []).controller('DashboardChartsController', function($scope, $http,InitialSiteService, ZoomHorizontal, AppService,EnvService,$location) {
	
	InitialSiteService.hideInitialLoader();
	$scope.pageLangs = languageData.pages.home;
	$scope.nav = languageData.nav;
	$scope.header = languageData.header;
	$scope.footer = languageData.footer;
	$scope.dictionary = languageData.dictionary;
	
	$scope.stp = AppService.getAppInfo().stp;
	
    $scope.comma = d3.format(',');
    $scope.prct = d3.format('%');
    $scope.timeparse = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
    $scope.dollar= d3.format('$,');    
    $scope.isDemo = false;
    
    $scope.init = function(){
    	EnvService.getIsDemo(function(isDemo){    	
    		$scope.isDemo =  isDemo;    		
	   	 });	
	   	 ga('send', 'pageview', '/dashboard');
    };
    
    $scope.init();
    
    $scope.redirectTo = function(path){
		$location.path(path);
	};
	
    $scope.dashboardData = {            
            "adoption":{
                "total": 71576,
                "current":50103
            },

            "redemption":{
            	"total": 71576,
                "current":48904
            },

            "activity":[
                {"name": "Given", "amount": 724691},
                {"name": "Received", "amount": 724691}

            ],


            "budget" :{
                "total": 2287925,
                "current": 682873
            },

            "yearData" :[
                {"year": "2012", "budget": 3155640},
                {"year": "2013", "budget":2193920},
                {"year": "2014", "budget": 2287925},
                {"year": "total", "budget": 2287925}
            ],



            "teamData" :[
                {"team": "Team1", "budget": 10000},
                {"team": "Team2", "budget": 25000},
                {"team": "Team3", "budget": 19000},
                {"team": "US", "budget": 30000}
            ]


        };
    
    $scope.globalSettings = {
    		util: {
    			clientId : $scope.stp,
    			wsUrl : "secure/getDashboardDonutData",
    			queryName : "dashboard_donut_util",
    			title:$scope.dictionary.utilization,
    			color1:"rgba(52,138,211,1)",
    			color2:"rgba(52,138,211,0.3)" 
    		},
    		reach : {
    			clientId : $scope.stp,
    			wsUrl : "secure/getDashboardDonutData",
    			queryName : "dashboard_donut_reach",
    			title:$scope.dictionary.reach,
    			color1:"rgba(228,72,76,1)",
    			color2:"rgba(228,72,76,0.3)" 
    		},
    		adoption : {
    			clientId : $scope.stp,
    			wsUrl : "secure/getDashboardDonutData",
    			queryName : "dashboard_donut_new_visits",
    			title:$scope.dictionary.reach,
    			color1:"rgba(250,165,81,1)",
    			color2:"rgba(250,165,81,0.6)", 
    			color3:"rgba(250,165,127,1)" 
    		},
    		redemption : {
    			clientId : $scope.stp,
    			wsUrl : "secure/getDashboardDonutData",
    			queryName : "dashboard_donut_reach",
    			title:$scope.dictionary.reach,
    			color1:"rgba(188,46,90,1)",
    			color2:"rgba(188,46,90,0.3)" 
    		}
    };
    
    $scope.activitBarSettings = {
    		stp: $scope.stp,
    		queryName : "dashboard_activity_resultset",
    		wsUrl : "secure/getDashboardActivityData",
    		container:  null,    		
            chartTypes: {
                columns: {style: {minHeight: 0}}
            },            
            currentTime: {enabled: false},
            toolbars: {
                "default" : "toolbarBare",
                displayUnit : false,
                "export" : false,
                logScale : false,
                periodButtons : false,
                periodSelection : false,
                zoomOutButton : false,
                backButton: false
            },
            timeAxis: {
                enabled: false
            },            
            info: {
                enabled: false,
                advanced: {
                    scope: "stack",
                    showOnlyHoveredSeries: true
                }
            }            
         
        
    };       
    
    ZoomHorizontal.mergeWithBaseSettings($scope.activitBarSettings);    
    
    $http.get('resources/data/budget.json').success(function(data) {
		$scope.budgetData = data;
	});

    window.onresize = function() {
    	$scope.$apply();
    };
    
});
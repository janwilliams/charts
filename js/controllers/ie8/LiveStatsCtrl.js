angular.module('LiveStatsCtrl', []).controller('LiveStatsController', function(
		$scope, $http, $location, $interval, $filter, $timeout, ngTableParams, $rootScope,$modal,
		TimeStackChartService,LiveStatsPieChartService,HighChartsService,AppService,InitialSiteService) {
	
	$scope.onlyie = IEUTILS.isIE;
	InitialSiteService.hideInitialLoader();
	$scope.clientId = AppService.getAppInfo().customerID;
	
	$scope.dataSources = {};
	$scope.totalDataSources={};
	$scope.storedData = {};
	
	$scope.socket = null;
	$scope.stompClient = null;
	
	$scope.showClock = true;
	$scope.clockHours = "";
	$scope.clockDate = "";    
	    
	//dates
	$scope.midnight = moment().startOf('day');	
	$scope.endDateIE;
	
	//langs
	$scope.pageLangs = languageData.pages.livestat;
	$scope.nav = languageData.nav;
	$scope.header = languageData.header;
	$scope.footer = languageData.footer;
	$scope.dictionary = languageData.dictionary;
	
	$scope.getLiveStatsTimeInfo = function(){	   
	   var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	   var dateFormat = "MMMM Do YYYY";
	   var hourFormat = "h:mm A";	   
	   $scope.clockHours = moment().format(hourFormat);
	   $scope.clockDate = days[moment().day()] + ", " + moment().format(dateFormat);
    };  
	    
	$scope.init = function(){	
		
		$http.get("secure/getRefreshInterval").success(function(interval){
			//setInterval($scope.refreshAll, interval);
		});		
		setInterval($scope.getLiveStatsTimeInfo, 30000);
		$scope.getInitialLiveValues();
	};

	$scope.getLiveStatsTimeInfo();
	
	$scope.liveUrl = "secure/getLiveStatsTimeDataHighCharts";
	$scope.liveDonutUrl = "secure/getLiveStatsDonutData";
	$scope.liveNames = [{name:"approvedHighchart",url:$scope.liveUrl},{name:"nominationHighchart",url:$scope.liveUrl},{name:"ordersHighchart",url:$scope.liveUrl},
	                    {name:"reward_codesHighchart",url:$scope.liveUrl},{name:"eCardHighchart",url:$scope.liveUrl},{name:"eButtonHighchart",url:$scope.liveUrl},
	                    {name:"uniqueVisitsHighchart",url:$scope.liveUrl},{name:"newAccountsHighchart",url:$scope.liveUrl},{name:"donut_chart",url:$scope.liveDonutUrl}];
	
	$scope.liveNamesLoaded = [];
	$scope.getInitialLiveValues = function(){
		for(var i=0;i<$scope.liveNames.length;i++){
			$scope.loadDataLiveStats($scope.liveNames[i].url,$scope.liveNames[i].name);
		}
	};
	
	$scope.checkLiveDataLoadedRenderChart = function(){
		if($scope.liveNamesLoaded.length === $scope.liveNames.length){
			$scope.createAndRenderChart();
		}
	};

	$scope.loadDataLiveStats = function(url,queryName){    	
		$scope.endDateIE = moment().minutes(59).seconds(59)
		if($scope.dataSources[queryName] === undefined){
	        $http.post(url,{clientId : $scope.clientId, unit: "s", queryName : queryName , beginDate : $scope.midnight, endDate : $scope.endDateIE }).success(function(data) {	        	
	        	$scope.dataSources[queryName] = data;
	        	
	        	if($scope.storedData[queryName] !== undefined){
	        		$scope.loadStoredData(queryName);
	        	}
	        	
	        	$scope.liveNamesLoaded.push({name:queryName,loaded:true});
	        	$scope.checkLiveDataLoadedRenderChart();
	        });
    	}
    };
    
    $scope.loadStoredData = function(viewId){
    	var storedData = $scope.storedData[viewId];
    	for(var i = 0; i < storedData.length; i++){
    		$scope.dataSources[viewId].values.push(storedData[i]);
    		TimeStackChartService.addData(viewId,storedData[i]);
    	}
    	$scope.storedData[viewId] = [];
    };    
	
	$scope.refreshAll = function(){
		$scope.dataSources = {};
		$scope.totalDataSources={};
    };
    
    $scope.getActivityTotal = function(rootName){
    	
    	if($scope.totalDataSources[rootName]){
    		
    		var total=0;
        	for(var obj in $scope.totalDataSources[rootName] ){
    			total += $scope.totalDataSources[rootName][obj];
    		}
        	return total;
    	}
    	
	};

	$scope.getAllActivityTotal = function(values,objectName,rootName){
		
		var total=0;
		
		if(values !== undefined && values !== null){
			
			if(values.length > 0){
				
				for(var i=0;i<values.length;i++){
					total += values[i].y;
				}
				
				if($scope.totalDataSources[rootName] === undefined){
					$scope.totalDataSources[rootName] = {}
				}
				
				$scope.totalDataSources[rootName][objectName] = total;
			}
			
		}
		
		
		return total;
	}
	
	$scope.createAndRenderChart = function(){
		
		Highcharts.setOptions({
			global:{
				useUTC:false
			},
			colors:["#8c5499","#fba752","#e3484c","#358ad4","#abd5bf","#bb2e5a","#8aa15f","#6a5fbb","#60bedd","#995f25","#9a2528","#1d5a8f","#589977","#741533","#2c5b32","#483e94","#1f7693"]
		});
		
		$scope.awardSettings={
				series: [
	             	{
	             		type:'area',
	             		name: "Submitting",
	             		data: $scope.getDataSourceValuesByName("nominationHighchart"),
	             		stack: 0,
	             		pointInterval:  3600 * 1000,
	             		color:'#9F61AA'
	             	},
	             	{
	             		type:'area',
	             		name: "Approving",
	             		data: $scope.getDataSourceValuesByName("approvedHighchart"),
	             		stack: 0,
	             		pointInterval:  3600 * 1000,
	             		color: '#DE5258'
	             	},
	             	{
	             		type:'area',
	             		name: "Ordering",
	             		data: $scope.getDataSourceValuesByName("ordersHighchart"),
	             		stack: 0,
	             		pointInterval:  3600 * 1000,
	             		color:'#F7A75F'
	             	},
	             	{
	             		type:'area',
	             		name: "Claiming",
	             		data: $scope.getDataSourceValuesByName("reward_codesHighchart"),
	             		stack: 0,
	             		pointInterval:  3600 * 1000,
	             		color:'#ADD6C0'
	             	}
	            ]	
		}
		
		$scope.eThanksSettings={
				series: [
	             	{
	             		type:'area',
	             		name: "eCards",
	             		data: $scope.getDataSourceValuesByName("eCardHighchart"),
	             		stack: 0,
	             		pointInterval:  3600 * 1000,
	             		color:'#9F61AA '
	             	},
	             	{
	             		type:'area',
	             		name: "eButtons",
	             		data: $scope.getDataSourceValuesByName("eButtonHighchart"),
	             		stack: 0,
	             		pointInterval: 3600 * 1000,
	             		color: '#ADD6C0'
	             	}	             	
	            ]	
		}
		
		$scope.accountsSettings={
				series: [
					{
						type:'area',
						name: "New visits",
						data: $scope.getDataSourceValuesByName("newAccountsHighchart"),
						stack: 0,
						pointInterval:  3600 * 1000,
						color:'#F9A858'
					},
					{
						type:'area',
						name: "Return visits",
						data: $scope.getDataSourceValuesByName("uniqueVisitsHighchart"),
						stack: 0,
						pointInterval:  3600 * 1000,
						color: '#BF474C'
					}
	            ]	
		};
		
		$scope.pieData =  HighChartsService.createLevels($scope.getDataSourceValuesByName("donut_chart"));
		$scope.pillNames = [];
		$scope.currentLevel = 0;
		$scope.programCorporateSettings={
				series: [{
                    name: 'Programs',
                    colorByPoint: true,
                    data: HighChartsService.getLevel($scope.pillNames,$scope.currentLevel,$scope.pieData),
                    point:{
                    	events:{
                    		click:function(e){
                    			var validStatePillNames = angular.copy($scope.pillNames);
                    			var validCurrentLevel = angular.copy($scope.currentLevel);
                    			
                    			$scope.pillNames[e.point.level] = e.point.name;
                    			$scope.currentLevel = e.point.level + 1;
                    			
                    			if( HighChartsService.getLevel($scope.pillNames,$scope.currentLevel,$scope.pieData).length > 0){
                    				
                    				$scope.pillNames[e.point.level] = e.point.name;
                        			$scope.currentLevel = e.point.level + 1;
                        		    
                        			$scope.$apply();
                        			
                        			$scope.programCorporateChart.series[0].setData( HighChartsService.getLevel($scope.pillNames,$scope.currentLevel,$scope.pieData) );
                        			
                    			}else{
                    				$scope.pillNames = validStatePillNames;
                    				$scope.currentLevel = validCurrentLevel;
                    			}
                    			return false;
                    			$scope.$apply();
                    		}
                    	}
                    }
                }]
		};
				
		angular.extend($scope.awardSettings,HighChartsService.getBaseLineSettings('awardsContainer'));
		$scope.awardsChart = new Highcharts.Chart ($scope.awardSettings,function(chart){$scope.awardsChart = chart;});
		
		angular.extend($scope.eThanksSettings,HighChartsService.getBaseLineSettings('eThanksContainer'));
		$scope.eThanksChart = new Highcharts.Chart ($scope.eThanksSettings,function(chart){$scope.eThanksChart = chart;});
		
		angular.extend($scope.accountsSettings,HighChartsService.getBaseLineSettings('accountContainer'));
		$scope.accountChart = new Highcharts.Chart ($scope.accountsSettings,function(chart){$scope.accountChart = chart;});
		
		angular.extend($scope.programCorporateSettings,HighChartsService.getBasePieSettings('programCorporateValuesChart'));
		$scope.programCorporateChart = new Highcharts.Chart ($scope.programCorporateSettings,function(chart){$scope.programCorporateChart = chart;});
	}
	
	$scope.getPillNav = function(){
		var result = ["Programs"];
		
		if($scope.pillNames != undefined){
			if($scope.pillNames.length > 0){
				
				result = _.union(result,$scope.pillNames);
			}
		} 
		
		return result;
	}
	
	$scope.onPillNavItemClick = function(name,level){
		
		if(level == 0){
			$scope.pillNames=[];
		}
		
		if($scope.currentLevel != level){
			$scope.currentLevel = level;
			$scope.pillNames.splice($scope.currentLevel,$scope.pillNames.length-1);
			$scope.programCorporateChart.series[0].setData( HighChartsService.getLevel($scope.pillNames,$scope.currentLevel,$scope.pieData) );
		} 
	}
	
	$scope.getPreviousLevelPieChart = function(){
		if($scope.currentLevel != 0){
			$scope.currentLevel -=1;
			$scope.pillNames.splice($scope.currentLevel,1);
			$scope.programCorporateChart.series[0].setData( HighChartsService.getLevel($scope.pillNames,$scope.currentLevel,$scope.pieData) );
			
		}
	}
	
	$scope.getDataSourceValuesByName = function(queryName){
		return $scope.dataSources[queryName].values;
	}
	
	//modal functionality
	$scope.openPreview = function(popUpQueryName,title,totalRows){
    	if(totalRows){
    		$scope.popUpQueryName = popUpQueryName;
            $scope.title = title;
            $scope.totalPopUpRows = totalRows;
            
            var previewDialogOpts = {
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'resources/partials/modalContent/livestatsModalContent.html',
                controller: 'LiveStatsModalController',
                size : "lg",
                scope : $scope,
                windowClass : "previewModalContainer"
            };

            var d = $modal.open(previewDialogOpts);
    	}        
    };
	
    $scope.init();
});
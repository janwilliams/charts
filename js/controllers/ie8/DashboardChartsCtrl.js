angular.module('DashboardChartsCtrl', []).controller('DashboardChartsController', function(
		$scope, $http,InitialSiteService, ZoomHorizontal, AppService,EnvService,HighChartsService,$location) {
	
	InitialSiteService.hideInitialLoader();
	$scope.stp = AppService.getAppInfo().stp;
	$scope.activitytSettings = {series:[]};
	
    $scope.init = function(){
    	$scope.getActivityData();
    	$scope.getReachUtilData('dashboard_donut_util','givenChart',$scope.givenChart,"#98C4E9","#348AD3","utilCA");
    	$scope.getReachUtilData('dashboard_donut_reach','receivedChart',$scope.reachChart,"#F2A2A4","#E4484C","receivedCA");
    };
    
    $scope.getReachUtilData = function(queryName,container,chart,color1,color2,uiObj){
    	$scope.activityRequest = {stp:$scope.stp,queryName:queryName};
    	$http.post("secure/getDashboardDonutData",$scope.activityRequest).success(function(data) {
    		 var obj ={
    				 series: [{name: '',data: [],size: '0'},
    				 {name: '',data: [{name:"",y:data.donutModel.total,color:color1,point:{events:{click:$scope.onDPointClick}}},
    				                  {name:"",y:data.donutModel.currentActivity,color:color2}],size: '80%',innerSize: '50%',point:{events:{click:$scope.onDPointClick}}}]
    		 }
    		 
    		 $scope[uiObj] = {};
    		 $scope[uiObj].total = data.donutModel.currentActivity.format()
    		 $scope[uiObj].porcentage = Math.round( (data.donutModel.currentActivity * 100) /  data.donutModel.total) + "%";
    		 $scope.createAndRenderReachUtilChart(obj,container,chart);
    	});
    }
    
    $scope.getActivityData = function(){
    	$scope.activityRequest = {stp:$scope.stp,queryName:"dashboard_activity_resultset"};
    	$http.post("secure/getDashboardActivityData",$scope.activityRequest).success(function(data) {
    		$scope.awardActivityTotal = 0;
    		for(var i=0;i<data.model.length;i++){
    			var obj = {name:data.model[i].activity,data:[data.model[i].activities],color:$scope.getColor(data.model[i].activity),point:{events:{click:$scope.onAPointClick}}}
    			$scope.activitytSettings.series.push(obj); 
    			$scope.awardActivityTotal += data.model[i].activities;
    		}
    		$scope.awardActivityTotal = $scope.awardActivityTotal.format();
    		$scope.createAndRenderActivityChart();
    	});
    }
    
    $scope.onAPointClick = function(){
    	window.location.href =  '#/reachutilratiochart/activity';
    }
    
    $scope.onDPointClick = function(){
    	window.location.href =  '#/reachutilratiochart/details';
    }
    
    $scope.createAndRenderActivityChart = function(){
    	angular.extend($scope.activitytSettings,HighChartsService.getSemiDonutBaseSettings('activityChart',$scope.onAPointClick));
    	$scope.activityChart = new Highcharts.Chart ($scope.activitytSettings,function(chart){$scope.activityChart = chart;});
    };
    
    $scope.createAndRenderReachUtilChart = function(settings,container,gRchart){
    	angular.extend(settings,HighChartsService.getBaseReachUtilDonuts(container,$scope.onDPointClick));
    	gRchart = new Highcharts.Chart (settings,function(chart){gRchart = chart;});
    };
    
    $scope.getColor = function(name){
    	var colors = {Nominations:{color:"#A05FAC"},"Reward Codes":{color:"#BAD4C1"},eButtons:{color:"#E9A844"},"eButtons (monetary)":{color:"#e88143"},eCards:{color:"#6FB24A"},"eCards (monetary)":{color:"#518136"}};
    	return colors[name].color;
    }
    
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };
    
    $scope.init();
});
angular.module('ReachUtilRatioChartCtrl', []).controller('ReachUtilRatioChartController', ['$scope', 'ZoomDataSvc', 'SeacrhService', '$routeParams','InitialSiteService','HighChartsService','AppService','$http', function($scope, 
		zoomDataSvc,SeacrhService, $routeParams,InitialSiteService,HighChartsService,AppService,$http) {
	
	//initial
	InitialSiteService.hideInitialLoader();
	$scope.clientId = AppService.getAppInfo().customerID;
	$scope.stp = AppService.getAppInfo().stp;
	$scope.filtersBaseUrl = AppService.getAppInfo().solrDimensionsBaseUrl;
	$scope.stack = $routeParams.stack;
	$scope.seriesNames = [];
	$scope.chartData = [];
	$scope.dimensions = [
	                     {name:"Manager",value:"users",initialQueryName:"drillDownByManagerParents",queryName:"drillDownByManagerId",initialObj:{id:"-1", label:"Top Level"},init:true},
	                     {name:"Business Unit",value:"businessunits",initialQueryName:"drillDownByBusinessUnitParents",queryName:"drillDownByBusinessUnit",initialObj:{id:"-2", label:"Top Level"},init:false}
						]
	
	$scope.renderingChart = true;
	
	$scope.getChartData = function(id,func){
		$http.post("secure/getDrilldownByParentId",{
			clientId  : $scope.clientId,
			queryName : ($scope.currentDimension.init) ? $scope.currentDimension.initialQueryName : $scope.currentDimension.queryName,
			parentId  : (id)?id:$scope.currentDimension.initialObj.id}).success(function(data) {
				
				if($scope.currentDimension.init){
					
					if(data.values.length === 1){
						$scope.currentDimension.init = false;
						$scope.navigation.push({name:data.values[0].label,id:data.values[0].id});
						$scope.getChartData(data.values[0].id,$scope.createAndRenderChart);
						return false;
					}else{
						$scope.navigation.push({name:$scope.currentDimension.initialObj.label,id:$scope.currentDimension.initialObj.id});
						$scope.currentDimension.init = false;
					}
						
				}
				
				$scope.data = data.values;
				$scope.formatData();
				func();
			}
		);
	}
	
	//navigation
    $scope.navigation = [];
    $scope.categories = [];
    $scope.data = [];
      
    $scope.onNavItemClick = function(index,id){
    	
    	if(id === "-1" || id === "-2" ){
    		$scope.currentDimension.init = true;
    		$scope.navigation = [];	
    		id = null;
    		index = 0;
    	}
    	$("#tags").val('');
    	$scope.navigation.splice(index+1,$scope.navigation.length);
    	$scope.getChartData(id,$scope.reDrawChart);
    }
 
    $scope.onPointClick = function(e){
    	var currentIndex =e.point.x;
    	var currentObj = $scope.data[currentIndex]; 
    	
    	if(currentObj.childs > 0){
    	
    		if(!$scope.currentDimension.init){
    			$scope.navigation.push({name:currentObj.label,id:currentObj.id});
    		}
    		$scope.getChartData(currentObj.id,$scope.reDrawChart);
    		$scope.$apply();
    	}
    }
    
    $scope.reDrawChart = function(){
    	
    	//$scope.renderingChart = true;
    	
    	$scope.formatData();
    	$scope.stackedChart.xAxis[0].setCategories($scope.categories);
    	$scope.stackedChart.series[0].setData($scope.chartData[0].data);
    	$scope.stackedChart.series[1].setData($scope.chartData[1].data);
    	$scope.stackedChart.series[2].setData($scope.chartData[2].data);
    	$scope.stackedChart.series[3].setData($scope.chartData[3].data);
    	
    	if($scope.stack === "activity"){
    		$scope.stackedChart.series[4].setData($scope.chartData[4].data);
        	$scope.stackedChart.series[5].setData($scope.chartData[5].data);
    	}    	
    }
    
    $scope.formatData = function(){
    
    	$scope.categories = [];
    	$scope.chartData[0].data = [];
    	$scope.chartData[1].data = [];
    	$scope.chartData[2].data = [];
    	$scope.chartData[3].data = [];
    	
    	if($scope.stack === "activity"){
    		$scope.chartData[4].data = [];
        	$scope.chartData[5].data = [];
    	}
    	
    	for(var i=0; i<$scope.data.length;i++) {
    		var obj = $scope.data[i];
    		$scope.categories.push(obj.label)
    		$scope.chartData[0].data.push(Math.round(obj[ $scope.seriesNames[0] ] ));
    		$scope.chartData[1].data.push(Math.round(obj[ $scope.seriesNames[1] ] ));
    		$scope.chartData[2].data.push(Math.round(obj[ $scope.seriesNames[2] ] ));
    		$scope.chartData[3].data.push(Math.round(obj[ $scope.seriesNames[3] ] ));
    		
    		if($scope.stack === "activity"){
    			$scope.chartData[4].data.push(Math.round(obj[ $scope.seriesNames[4] ] ));
        		$scope.chartData[5].data.push(Math.round(obj[ $scope.seriesNames[5] ] ));
    		}
    		
    	}

    	$scope.renderingChart = false;
    	
    }
    
    $scope.createAndRenderChart = function(){
    	
    	Highcharts.setOptions({
			global:{
				useUTC:false
			},
			colors:["#A05FAC","#BAD4C1","#E9A844","#e88143","#6FB24A","#518136"]
		});
    	
    	$scope.stackedSettings = {
    		xAxis: {
    			categories: $scope.categories,
    			labels:{
    				formatter:function(){
    					var text = this.value;
                        var formatted = text.length > 5 ? text.substring(0,5) + '...' : text;
                        return formatted;
    				},
    				style: {
                        width: '150px'
                    },
                    useHTML: true
    			}
    	    },
    		series: $scope.chartData
    	}
    	
    	angular.extend($scope.stackedSettings,HighChartsService.getStackedBaseSettings('stackedContainer'));
		$scope.stackedChart = new Highcharts.Chart ($scope.stackedSettings,function(chart){$scope.stackedChart = chart;});
    }
    
    
    $scope.init = function(){
		$scope.currentDimension = $scope.dimensions[0];
		
		if($scope.stack === "details"){
			
			$scope.chartData = 
				 [{name:"Given",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"Not Given",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"Received",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"Not Received",data:[],point:{events:{click:$scope.onPointClick}}}];
			
			$scope.seriesNames.push("utilization");
			$scope.seriesNames.push("needUtilization");
			$scope.seriesNames.push("needReached");
			$scope.seriesNames.push("reach");
			
			
		}else if($scope.stack === "activity"){
			
			$scope.chartData = 
				 [
				  {name:"Nominations",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"Reward Codes",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"eButtons",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"eButtons (monetary)",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"eCards",data:[],point:{events:{click:$scope.onPointClick}}},
				  {name:"eCards (monetary)",data:[],point:{events:{click:$scope.onPointClick}}}
				 ];
			
			$scope.seriesNames.push("aNomination");
			$scope.seriesNames.push("aReward");
			$scope.seriesNames.push("aEbutton");
			$scope.seriesNames.push("aMoneButton");
			$scope.seriesNames.push("aEcard");
			$scope.seriesNames.push("aMoneCard");
		}
		
		$scope.getChartData(null,$scope.createAndRenderChart);
		
		$scope.typeaheadConf = new Bloodhound({
	    	datumTokenizer: function (datum) {
	            return Bloodhound.tokenizers.whitespace(datum.value);
	        },
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: '/secure/dimensions/'+$scope.currentDimension.value+'?customer='+$scope.stp+'&fields=id,label,attributes&q=%QUERY',
				filter: function(s){
					if(s.suggestions){
						return $.map(s.suggestions, function (su) {
							return {
								value: (su.attributes) ? su.label + " | " + su.attributes.businessUnit + " | " + su.id : su.label + " | " + su.id 
							};
			            });
					}else{
						return {}
					}
					
				}
			},			
			limit: 10,
			rateLimitWait: 600
		});
		    	 
		$scope.typeaheadConf.initialize(); 
		    	
	    $('#tags').typeahead(null, {
	    	name: 'suggestions',
	    	displayKey: 'value',
	    	hint: true,
	    	highlight: true,
	    	source: $scope.typeaheadConf.ttAdapter()
	    });
	    
	    $('#tags').on('typeahead:selected', function (e, datum) {
	        var n = datum.value.lastIndexOf("|");
	        var id = datum.value.substring(n+1,datum.value.length);
	        var label = ( datum.value.substring(0,datum.value.indexOf("|")) ).trim();
	        id = id.trim();
	        console.log(id);
	        
	        var url = '/secure/dimensions/'+$scope.currentDimension.value+'/'+id+'/parents';
	        $http.get(url, {params: {customer: $scope.stp,fields:"id,label,attributes"}
	    	}).success(function(data){
	    		$scope.navigation = [];
	    		for(var i=0;i<data.parents.length;i++){
	    			var obj = {name:data.parents[i].label,id:data.parents[i].id};
	    			$scope.navigation.push(obj);
	    		}
	    		$scope.navigation.push({name:label,id:id});
	    	});
	        
	        $scope.getChartData(id,$scope.reDrawChart);
	        
	    });
		
	}
   
    
    $scope.loadInitialDimension = function(){
    	 $scope.dimensions[0].init = false;
    	 $scope.dimensions[1].init = false;
    	 $scope.currentDimension.init = true;
    	 
    	 $scope.navigation = [];
    	 $("#tags").val('');
    	 
    	 $scope.typeaheadConf.remote.url = '/secure/dimensions/'+$scope.currentDimension.value+'?customer='+$scope.stp+'&fields=id,label,attributes&q=%QUERY';
    	 $scope.getChartData(null,$scope.reDrawChart);
    }
    
    //initial call
    $scope.init();
    
    
    
    
}]);
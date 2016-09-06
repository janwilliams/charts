angular.module('ReachUtilRatioChartCtrl', []).controller('ReachUtilRatioChartController',['$scope', 'ZoomDataSvc', 'SeacrhService', '$routeParams','InitialSiteService','$http','AppService', 
function($scope, zoomDataSvc,SeacrhService, $routeParams,InitialSiteService,$http,AppService) {

	//navbar
	setTimeout(function(){$('a[href="dashboard"]').addClass("active")},400);

	//initial values
	InitialSiteService.hideInitialLoader();
	$scope.clientId = AppService.getAppInfo().customerID;
	$scope.stp = AppService.getAppInfo().stp;
	$scope.filtersBaseUrl = AppService.getAppInfo().solrDimensionsBaseUrl;
	$scope.noDataForChart = false;
	$scope.dataLoaded = false;
	$scope.dictionary = languageData.dictionary;
	
	$scope.given = 0;
	$scope.received = 0;
	
	//chart initial values
	$scope.stack = $routeParams.stack;
	$scope.globalPath = [];
	$scope.fromActivity = false;
	$scope.seriesMap = {}; //using this to get the total of items for manager/business unit
	$scope.showScrollIndicator = false;
	$scope.viewItemsCount = 14;
	$scope.usePercentage = true;
    //series and stacks
    
    ga('send', 'pageview', '/dashboard');
    
	$scope.disabledColor = "#E2E2E2";
	$scope.stacksData = {given: {name: "Given",type:"normal"}, received: {name: "Received",type:"normal"}, activity: {name: "Activity",type:"normal"} };
    $scope.seriesData = [];
    $scope.givenSeriesData =  [
                               {id: "allGiven", name: "Given", data: {field: "utilization"},stack: "unique", style: {fillColor: "#257BC4"},enabled:true,customStyle:{'background-color':'#257BC4','border-color':''} },
                               {id: "allNotG", name: "Not Given", data: {field: "needUtilization"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:true,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                               {id: "nominationGiven", name: "Given", data: {field: "nominationGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} },
                               {id: "nominationNotG", name: "Not Given", data: {field: "nominationNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                               {id: "rewardsGiven", name: "Given", data: {field: "rewardsGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} }, 
                               {id: "rewardsNotG", name: "Not Given", data: {field: "rewardsNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} }, 
                               {id: "ebuttonGiven", name: "Given", data: {field: "ebuttonGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} }, 
                               {id: "ebuttonNotG", name: "Not Given", data: {field: "ebuttonNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} }, 
                               {id: "ecardGiven", name: "Given", data: {field: "ecardGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} }, 
                               {id: "ecardNotG", name: "Not Given", data: {field: "ecardNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                               {id: "monecGiven", name: "Given", data: {field: "monEcardGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} }, 
                               {id: "monecNotG", name: "Not Given", data: {field: "monEcardNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                               {id: "monebGiven", name: "Given", data: {field: "monEbuttonGiven"},stack: "unique", style: {fillColor: "#257BC4"},enabled:false,customStyle:{'background-color':'#257BC4','border-color':''} }, 
                               {id: "monebNotG", name: "Not Given", data: {field: "monEbuttonNotGiven"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} } ];
    
    $scope.receivedSeriesData = [
                                {id: "allReceived", name: "Received", data: {field: "reach"},stack: "unique", style: {fillColor: "#E3474B"},enabled:true,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "allNotR", name: "Not Received", data: {field: "needReached"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:true,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                                {id: "nominationReceived", name: "Received", data: {field: "nominationReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} },
                                {id: "nominationNotR", name: "Not Received", data: {field: "nominationNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} }, 
                                {id: "rewardsReceived", name: "Received", data: {field: "rewardsReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "rewardsNotR", name: "Not Received", data: {field: "rewardsNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} }, 
                                {id: "ebuttonReceived", name: "Received", data: {field: "ebuttonReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "ebuttonNotR", name: "Not Received", data: {field: "ebuttonNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} }, 
                                {id: "ecardReceived", name: "Received", data: {field: "ecardReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "ecardNotR", name: "Not Received", data: {field: "ecardNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                                {id: "monecReceived", name: "Received", data: {field: "monEcardReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "monecNotR", name: "Not Received", data: {field: "monEcardNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} },
                                {id: "monebReceived", name: "Received", data: {field: "monEbuttonReceived"},stack: "unique", style: {fillColor: "#E3474B"},enabled:false,customStyle:{'background-color':'#E3474B','border-color':''} }, 
                                {id: "monebNotR", name: "Not Received", data: {field: "monEbuttonNotReceived"}, stack: "unique", style: {fillColor: $scope.disabledColor},enabled:false,customStyle:{'background-color':$scope.disabledColor,'border-color':''} } ];
    
    $scope.activitySeriesData = [
                                 {id: "aMoneCard", name: "eCards (monetary)", data: {field: "aMoneCard"}, stack: "activity",style: {fillColor: "#518136"}, enabled:true,customStyle:{'background-color':'#518136','border-color':''}},
                                 {id: "aEcard", name: "eCards", data: {field: "aEcard"}, stack: "activity",style: {fillColor: "#6FB24A"}, enabled:true,customStyle:{'background-color':'#6FB24A','border-color':''}},
                                 {id: "aMoneButton", name: "eButtons (monetary)", data: {field: "aMoneButton"}, stack: "activity",style: {fillColor: "#e88143"}, enabled:true,customStyle:{'background-color':'#e88143','border-color':''}},
                                 {id: "aEbutton", name: "eButtons", data: {field: "aEbutton"}, stack: "activity",style: {fillColor: "#E9A844"}, enabled:true,customStyle:{'background-color':'#E9A844','border-color':''}},
                                 {id: "aReward", name: "Reward Codes", data: {field: "aReward"}, stack: "activity",style: {fillColor: "#BAD4C1"}, enabled:true,customStyle:{'background-color':'#BAD4C1','border-color':''}},
                                 {id: "aNomination",name: "Nominations", data: {field: "aNomination"}, stack: "activity",style: {fillColor: "#A05FAC"}, enabled:true,customStyle:{'background-color':'#A05FAC','border-color':''}} 
                                 ];
    
    
    $scope.uiSeries = [
                       {name:"Given",id:"GIVEN",customStyle:{'background-color':'#257BC4','border-color':''},fillColor:"#257BC4",enabled:true}, 
                       //{name:"Not Given",id:"NOTG",customStyle:{'background-color':'#9C9C9C','border-color':''},fillColor:"#9C9C9C",enabled:false}, 
                       {name:"Received",id:"RECEIVED",customStyle:{'background-color':'#E3474B','border-color':''},fillColor:"#E3474B",enabled:true}, 
                       //{name:"Not Received",id:"NOTR",customStyle:{'background-color':'#CCCCCC','border-color':''},fillColor:"#CCCCCC",enabled:false}
                       ];
    
    $scope.uiStacks = [{name:"All Activity",id:"ALL",customStyle:{'background-color':'#646464','border-color':''},fillColor:"#646464",enabled:true},
                       {name:"Nominations",id:"NOMINATION",customStyle:{'background-color':'','border-color':'#A05FAC'},fillColor:"#A05FAC",enabled:false}, 
                       {name:"eButtons",id:"EBUTTON",customStyle:{'background-color':'','border-color':'#E9A844'},fillColor:"#E9A844",enabled:false},
                       {name:"eCards",id:"ECARD",customStyle:{'background-color':'','border-color':'#6FB24A'},fillColor:"#6FB24A",enabled:false},
                       {name:"Reward Codes",id:"REWARDS",customStyle:{'background-color':'','border-color':'#BAD4C1'},fillColor:"#BAD4C1",enabled:false},
                       {name:"eButtons (monetary)",id:"MONEB",customStyle:{'background-color':'','border-color':'#e88143'},fillColor:"#e88143",enabled:false},
                       {name:"eCards (monetary)",id:"MONEC",customStyle:{'background-color':'','border-color':'#518136'},fillColor:"#518136",enabled:false}
                      ];
    
    $scope.uiStacksActivity = [
                               {name:"Nominations",id:"ANOMINATION",customStyle:{'background-color':'#A05FAC','border-color':''},fillColor:"#A05FAC",enabled:true}, 
                               {name:"eButtons",id:"AEBUTTON",customStyle:{'background-color':'#E9A844','border-color':''},fillColor:"#E9A844",enabled:true},
                               {name:"eCards",id:"AECARD",customStyle:{'background-color':'#6FB24A','border-color':''},fillColor:"#6FB24A",enabled:true},
                               {name:"Reward Codes",id:"AREWARD",customStyle:{'background-color':'#BAD4C1','border-color':''},fillColor:"#BAD4C1",enabled:true},
                               {name:"eButtons (monetary)",id:"AMONEBUTTON",customStyle:{'background-color':'#e88143','border-color':''},fillColor:"#e88143",enabled:true},
                               {name:"eCards (monetary)",id:"AMONECARD",customStyle:{'background-color':'#518136','border-color':''},fillColor:"#518136",enabled:true}
                              ];
    
    $scope.initSeries = function(){
    	
    	if($scope.stack === "details"){
    		
    		$scope.seriesData = _.union($scope.givenSeriesData,$scope.receivedSeriesData);
    		$scope.givenSeriesData.enabled = true;
    		$scope.receivedSeriesData.enabled = true;
    		
    		$scope.currentUiStack = $scope.uiStacks;
    		$scope.currentStack = $scope.currentUiStack[0];
    		
    		ga('send', 'event', 'Dashboard', 'view', 'Given/Received detail chart view');    		
    	}
    	
    	if($scope.stack === "activity"){
    		$scope.usePercentage = false;
    		$scope.fromActivity = true;
    		$scope.seriesData = _.union($scope.activitySeriesData);
    		$scope.activitySeriesData.enabled = true;
    		
    		$scope.currentUiStack = $scope.uiStacksActivity;
    		
    		ga('send', 'event', 'Dashboard', 'view', 'Award Activity detail chart view');
    	}
    	
        return $scope.seriesData; 
    }
    
    $scope.loadSerie = function(item,data){
    	
    	var currentStack = _.where($scope.uiStacks, {enabled:true})[0];
    	item.enabled = !item.enabled;
    	var enabledCount = _.where(data, {enabled:true}).length;
    	if(enabledCount > 0){
    		
    		for(var i=0;i<$scope.seriesData.length;i++){
    			if($scope.seriesData[i].id.toUpperCase().indexOf(currentStack.id+item.id) > -1){
    				$scope.seriesData[i].enabled = item.enabled
    			}
    		}
    		
        	$scope.updateStyle(item,item.fillColor);
        	$scope.facet_chart.replaceSeries($scope.seriesData);
        	
    	}else{
    		item.enabled = !item.enabled;
    	}
    }
    
    $scope.pickStack = function(item,data){
    	if($scope.fromActivity){
    		$scope.loadStackActivity(item,data);
    		ga('send', 'event', 'Dashboard', 'view', 'Award Activity detail chart series filter applied');
    	}else{
    		$scope.loadStack(item,data);
    		ga('send', 'event', 'Dashboard', 'view', 'Given/Received detail chart series filter applied');
    	}
    }
    $scope.loadStack = function(item,data){
    	$scope.currentStack = item;
    	item.enabled = true;
    	var enabledCount = _.where(data, {enabled:true}).length;
    	if(enabledCount > 0){
    		
    		for(var i=0;i<$scope.seriesData.length;i++){
    			if($scope.seriesData[i].id.toUpperCase().indexOf(item.id) > -1){
    				$scope.seriesData[i].enabled = item.enabled;
    			}else{
    				$scope.seriesData[i].enabled = false
    			}
    		}
    		
    		for(var j=0;j<data.length;j++){
    			if(data[j] !== item){
    				data[j].enabled = false;
    			}
    			$scope.updateStyle(data[j],data[j].fillColor);
    		}
        	
        	$scope.facet_chart.replaceSeries($scope.seriesData);
        	
    	}else{
    		item.enabled = !item.enabled;
    	}
    	
    	$scope.updateTotals({origin:"stack"});
    }
    
    $scope.loadStackActivity = function(item,data){
    	//console.log(item,data)
    	item.enabled = !item.enabled;
    	var enabledCount = _.where(data, {enabled:true}).length;
    	if(enabledCount > 0){
    		
    		for(var i=0;i<$scope.seriesData.length;i++){
    			if($scope.seriesData[i].id.toUpperCase().indexOf(item.id) > -1){
    				$scope.seriesData[i].enabled = item.enabled;
    			}
    		}
    		
    		console.log($scope.seriesData)
    		$scope.updateStyle(item,item.fillColor);
        	$scope.facet_chart.replaceSeries($scope.seriesData);
        	
    	}else{
    		item.enabled = !item.enabled;
    	}
    }
    
    $scope.updateStyle = function(obj,fillColor){
    	
    	if(obj.enabled){
    		obj.customStyle['background-color'] = fillColor;
    		obj.customStyle['border-color'] = "";
    	}else{
    		obj.customStyle['border-color'] = fillColor;
    		obj.customStyle['background-color'] = "";
    	}
    }
    
    // end of series and stacks
    
    //typeahead initial values
	$scope.filterItem={};
	$scope.filterValue="";
	$scope.dimensions = [{name:"Manager",value:"users",initialQueryName:"drillDownByManagerParents",queryName:"drillDownByManagerId",
						 initialObj:{id:"-1", label:"Top Level"},init:true,placeholder:"Enter Manager Name",totals:{}},
	                     {name:"Business Unit",value:"businessunits",initialQueryName:"drillDownByBusinessUnitParents",queryName:"drillDownByBusinessUnit",
					     initialObj:{id:"-2", label:"Top Level"},init:true,placeholder:"Enter Business Unit",totals:{}}]
	
	$scope.setInitialDimensionAndPrepareSeriesMap = function(){
		
		for(var i=0;i<$scope.dimensions.length;i++){
			$scope.seriesMap[ $scope.dimensions[i].value ] = {}
		}
		
		$scope.currentDimension=$scope.dimensions[0];
		
		$http.post("secure/getDrilldownByParentId",{
			clientId  : $scope.clientId,
			queryName : $scope.dimensions[0].initialQueryName,
			parentId  : $scope.dimensions[0].initialObj.id}).success(function(data) {
				
				$scope.renderingChart = true;
				
				if(data.values.length === 1){
					$scope.currentDimension.initialObj.id = data.values[0].id;
					$scope.currentDimension.initialObj.label = data.values[0].label;
					$scope.currentDimension.init=false; 
				}else{
					$scope.currentDimension.init=true;
					$scope.globalPath = [];
					$scope.globalPath.push({id:$scope.currentDimension.initialObj.id,label:$scope.currentDimension.initialObj.label});
				}
				
				$scope.facet_chart = new FacetChart($scope.facet_chart_settings);
				$scope.overrideInfoPopUpBuildHeaderFunction($scope.facet_chart);
				
				$scope.seriesMap["users"]["initial"] = data.values;
				
		});
		
		
		$http.post("secure/getDrilldownByParentId",{
			clientId  : $scope.clientId,
			queryName : $scope.dimensions[1].initialQueryName,
			parentId  : $scope.dimensions[1].initialObj.id}).success(function(data) {
				if(data.values.length === 1){
					$scope.dimensions[1].initialObj.id = data.values[0].id;
					$scope.dimensions[1].initialObj.label = data.values[0].label;
				}
				
				$scope.seriesMap["businessunits"]["initial"] = data.values;
		});
	
	}
	
	$scope.isFromInitialDimension = false;
	//on every change of the dimensions dropdown we reload the data and call the ws for a new query with the current view.
	
	$scope.loadInitialDimension = function(){
		
		$scope.isFromInitialDimension = true;
		$scope.globalPath = [];
		
		$scope.globalPath.push({id:$scope.currentDimension.initialObj.id,label:$scope.currentDimension.initialObj.label});
		if($scope.topLevel()){
			$scope.currentDimension.init=true;
		}else{
			$scope.currentDimension.init=false;
		}
		
		$scope.facet_chart.setPie([""]);
		$scope.facet_chart.reloadData();
	
		$scope.applyVisualEnhancements($scope.currentDimension.initialObj.id);
		
		if($scope.fromActivity){
			ga('send', 'event', 'Dashboard', 'view', 'Award Activity detail chart hierarchy selection');
		}else{
			ga('send', 'event', 'Dashboard', 'view', 'Given/Received detail chart hierarchy selection');
		}
		
	}
	
    $scope.facet_chart_settings = {
    	theme: TimeChart.themes.flat,
		title: {text: ""},
        container: document.getElementById("facet-chart"),
        series: $scope.initSeries(),
        stacks: $scope.stacksData,
        sortSettings: {
        	sortfunc : "sortByNameAsc", 
        	sortByNameAsc : function(array) {
        	    return array.sort(function(a, b) {
        	        var x = a.label; var y = b.label;
        	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        	    });
        	},
        	sortByNameDesc : function(array, key) {
        	    return array.sort(function(a, b) {
        	        var x = a.label; var y = b.label;
        	        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        	    });
        	},
        	sortByActivityAsc: function(array, key) {
        	    return array.sort(function(a, b) {
        	        var x = a.aMoneCard + a.aEcard + a.aMoneButton + a.aEbutton + a.aReward + a.aNomination;
        	        var y = b.aMoneCard + b.aEcard + b.aMoneButton + b.aEbutton + b.aReward + b.aNomination;
        	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        	    });
        	},
        	sortByActivityDesc: function(array, key) {
        	    return array.sort(function(a, b) {
        	        var x = a.aMoneCard + a.aEcard + a.aMoneButton + a.aEbutton + a.aReward + a.aNomination;
        	        var y = b.aMoneCard + b.aEcard + b.aMoneButton + b.aEbutton + b.aReward + b.aNomination;
        	        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        	    });
        	}
        },
        data: {
            dataFunction: function(id,limit,offset,success,error){
            	console.log("id to look",id)
            	
            	$http.post("secure/getDrilldownByParentId",{
            			clientId : $scope.clientId,
            			queryName : $scope.currentDimension.init?$scope.currentDimension.initialQueryName:$scope.currentDimension.queryName,
            			parentId:id?id:$scope.currentDimension.initialObj.id}).success(function(data) {
            		
            		$scope.currentDimension.init = false;
            		$scope.noDataForChart = true;
            		$scope.dataLoaded = true;
            		if(data.values.length > 0){

            			data.values = $scope.facet_chart_settings.sortSettings[$scope.facet_chart_settings.sortSettings.sortfunc](data.values);
            			$scope.seriesMap[$scope.currentDimension.value][data.values[0].parentId] = data.values; //assign the size of the whole data for this id.
            			$scope.noDataForChart = false;
            			success(data);
            		}else{
            			$scope.dataLoaded = false;
            			data.values = [];
            			success(data);
            		}
            		
            		$scope.applyVisualEnhancements(data.values[0].parentId)
            		
            	});
            	
            }
        },
        items: {
            styleFunction: function(item,data){
            	if($scope.currentDimension.value === "businessunits" ){
            		item.fullLabel = item.data.label +" ("+item.data.id+")";
            		item.label = item.data.label.substring(0,10)+"..."+" ("+item.data.id+")";
            	}else{
            		item.fullLabel = item.data.label;
            		item.label = item.data.label.substring(0,10)+"...";
            	}
            }
        },
        height: 350,
        valueAxis:{
        	"default":{
        		size:50,
        		scaleStep:($scope.stack !== "activity")?10:null,
        		valueFormatterFunction :function(value, unitName, unitValue, name){
        			
        			if($scope.stack !== "activity"){
        				if(value === 50){
            				value = 0;
            			}else if(value < 50){
            				value = value*2;
            			}else{
            				value = (value-50)*2;
            			}
        				
        				return value + "%"
        			}
        			
        			return value;
        		}
        	}
        },
        facetAxis:{
        	enabled:true,
        	labels:{
        		//angle:80,
        		//textStyle:{"font":"0px"}
        	},
        	size:50,
        	defaultUnitWidth:75
        },
        chartTypes: {
            columns: {style: {minHeight: 0,gradient:1,padding:[0.5,0.5]}}
        },
        events: {
            onChartUpdate: function(ev){
            	$scope.applyVisualEnhancements(null);
            	$scope.renderPath(ev);
            	$scope.updateTotals(ev);
            	
            },onClick: function(ev){
                if (ev.clickItem){
                    var d = ev.clickItem.data;
                    if(d.childs === 0){
                    	ev.preventDefault();
                    }

                }
            }
        },
        interaction:{
        	scrolling:{
        		enabled:true
        	},
        	zooming:{
        		swipe:false
        	},
        	resizing:{
        		enabled:false
        	}
        },
    	info:{
    		advanced:{
    			contentsFunction : function(slice){
    				var originalObj = arguments[2];
    				if($scope.stack !== "activity"){
    					return $scope.contentsFunction(slice);
					}else{
						return $scope.contentsFunctionActivity(slice,originalObj);
					}
    			}
    		}
    	}
    };
    
    
    $scope.contentsFunctionActivity = function(slice,originalObj){
    	
    	
    	var nameList = ($scope.currentDimension.value === "users") ? ["Manager*","Team"] : ["Unit","Sub-units"];
    	
		var templateTable ="<table cellspacing='0'><thead>$tableHeader$</thead><tbody>$tableBody$</tbody></table>";
		var templateTableHeader = '<tr> <th><h3 style="font-weight: bold;">Activity</h3></th> <th><h3 style="font-weight: bold;">'+nameList[0]+
									'</h3></th> <th><h3 style="font-weight: bold;">'+nameList[1]+
									'</h3></th> <th><h3 style="font-weight: bold;">Total</h3></th> </tr>';
		
		var templateTableRow = '<tr> <td style="color:$color$">$name$</td> <td style="text-align: center;">$manager$</td> <td style="text-align: center;">$team$</td> <td style="text-align: center; font-weight: bold;">$total$</td> </tr>';
		
		var result = "";
		var header = angular.copy(templateTableHeader);
		
		for(var i=0;i<slice.length;i++){
			var table = angular.copy(templateTable);
			var item = slice[i];
			var tableBody = "";
			for(var j=item.data.length-1;j>=0;j--){
				var row = angular.copy(templateTableRow);
				var rowData = item.data[j];
				row = row.replace("$color$",rowData.config.style.fillColor);
				row = row.replace("$name$",rowData.name);
				var addition = ($scope.usePercentage) ? "% " : "";
				
				var newData = $scope.returnActiviySetAccordingToName(rowData.config.id);
				var manager = 0;
				var team = 0;
				var total = 0;
				
				if(originalObj){
					manager = originalObj.data[newData[0]];
					team = originalObj.data[newData[1]];
					total = originalObj.data[newData[2]];
				}
				
				row = row.replace("$manager$",manager);
				row = row.replace("$team$",team);
				row = row.replace("$total$",total);
				
				tableBody += row;
			}
			result = table.replace("$tableHeader$",header);
			result = result.replace("$tableBody$",tableBody);
		}
		return result;
    }
    
    $scope.contentsFunction = function(slice){
    	var templateLabel = "<h3>$label$</h3>";
		
		var templateTable ="<table cellspacing='0'><tbody>$tableBody$</tbody></table>";
		var templateTableRow = '<tr><td style="color:$color$">$name$</td><td>$value$</td></tr>';
		
		var result = "";
		for(var i=0;i<slice.length;i++){
			var label = angular.copy(templateLabel);
			var table = angular.copy(templateTable);
			var item = slice[i];
			result += label.replace("$label$",item.name);
			var tableBody = "";
			for(var j=0;j<item.data.length;j++){
				var row = angular.copy(templateTableRow);
				var rowData = item.data[j];
				row = row.replace("$color$",rowData.config.style.fillColor);
				row = row.replace("$name$",rowData.name);
				var addition = ($scope.usePercentage) ? "% " : "";
				row = row.replace("$value$",(rowData.values.avg*2)+addition);
				tableBody += row;
			}
			
			result += table.replace("$tableBody$",tableBody);
		}
		return result;
    }
    
    $scope.returnActiviySetAccordingToName = function(name){
    	var map = {aNomination:["myNomination","chNomination","aNomination"],
    			   aReward:["myReward","chReward","aReward"],
    			   aEcard:["myEcard","chEcard","aEcard"],
    			   aMoneCard:["myMoneCard","chMoneCard","aMoneCard"],
    			   aEbutton:["myEbutton","chEbutton","aEbutton"],
    			   aMoneButton:["myMoneButton","chMoneButton","aMoneButton"],
    				} 
    	return map[name];
    }
    
    $scope.applyVisualEnhancements = function(id){
    	
    	var currentId = (id) ? id : $scope.facet_chart.getActiveFacet().data.values[0].parentId; 
    	$scope.showScrollIndicator = false;
    	
    	if($scope.seriesMap[$scope.currentDimension.value][currentId]){
    		
    		if($scope.seriesMap[$scope.currentDimension.value][currentId].length > $scope.viewItemsCount){
        		$scope.showScrollIndicator = true;
        	}
    		
    	}
    	
    }
    
    $scope.updateTotals = function(ev){
    	
    	var idFields =  { 	ALL:{given:"totalGiven",received:"totalReceived"},
			    			NOMINATION:{given:"totalNomGiven",received:"totalNomRecognized"},
			    			EBUTTON:{given:"totalEbuttonGiven",received:"totalEbuttonRecognized"},
			    			ECARD:{given:"totalEcardGiven",received:"totalEcardRecognized"},
			    			REWARDS:{given:"totalRewardGiven",received:"totalRewardRecognized"},
			    			MONEB:{given:"totalMebuttonGiven",received:"totalMebuttonRecognized"},
			    			MONEC:{given:"totalMecardGiven",received:"totalMecardRecognized"}
    					};

    	
    	if(!$scope.fromActivity){
    		
    		var currentId = ($scope.isFromInitialDimension) ? "initial" :$scope.facet_chart.getActiveFacet().data.values[0].parentId; 
        	var totalGiven = 0;
        	var totalReceived = 0;
       
        	//manager
        	var manager = {}; 
        	if(ev.origin === "init" || $scope.isFromInitialDimension){
        		manager = $scope.seriesMap[$scope.currentDimension.value]["initial"];
        	}else{
        		var parentId = $scope.seriesMap[$scope.currentDimension.value][currentId][0].parentId;
        		//console.log("looking for manager")
        		_.each($scope.seriesMap[$scope.currentDimension.value],function(value, key, list){
        			var foundObj = _.where(value, {id:parentId});
        			manager = (foundObj.length > 0) ? foundObj : manager; 
        		});
        	}
       
        	//console.log("manager ",manager)
        	var fields = idFields[$scope.currentStack.id];
        	totalGiven += manager[0][fields.given];
        	totalReceived += manager[0][fields.received];
        	
        	$scope.isFromInitialDimension = false;
        	$scope.given = comma(totalGiven);
        	$scope.received = comma(totalReceived);
    	}
    	
    }
    
   
    $scope.renderPath = function(ev){
    	
    	var obj = {}
    	if(ev.origin === "init"){
    		obj = $scope.currentDimension.initialObj;
    		$scope.onDimensionChange = false;
    	}else{
    		if(!ev.facet.parentItem){ //sometimes the top level brings the parent item in null
    			obj = ($scope.filterItem) ? $scope.filterItem : $scope.currentDimension.initialObj; 
    		}else{
    			if(ev.facet.parentItem){
        			obj= ev.facet.parentItem.data;
        		}else{
        			obj=$scope.filterItem;
        		}
    		}
    	}
    	
    	if(obj.id && obj.id !== "-1" && obj.id !== "-2"){
    		
    		var url = $scope.filtersBaseUrl + $scope.currentDimension.value + "/"+obj.id + "/parents";
        	$http.get(url,{params: {customer: $scope.stp}}).success(function(data) {
        		//console.log("parents data",data)
        		var path = data.parents;
        		path.push({id:obj.id,label:obj.label});
        		
        		if($scope.topLevel()){
        			$scope.globalPath = _.union($scope.globalPath[0],path);
        		}else{
        			$scope.globalPath = path;
        		}
        		
        		//check if there's already a digest in progress.
            	if(!$scope.$$phase) {
            		$scope.$apply();
            	}
            	
        	}); 
    	}
    	
    	if(ev.facet.data.values[0].parentId === 0){
    		$scope.globalPath = _.union($scope.globalPath[0],[]);
    		if(!$scope.$$phase) {
        		$scope.$apply();
        	}
    	}
    }
    
    $scope.onPathClicked = function(index,path){
    	$scope.noDataForChart = false;
    	$scope.filterItem = path;
    	
    	$scope.filterValue = "";
    	var pies = $scope.facet_chart.getPie();
    	if(index === 0){
    		pies = [""];
    		
    		if( $scope.topLevel() ){
    			$scope.currentDimension.init=true;
        		$scope.globalPath.splice(1,$scope.globalPath.length-1);
    		}
    		
    	}else{
    		pies.splice(index+1,pies.length-1);
    	}
    	console.log("path clicked",pies)
    	$scope.facet_chart.setPie(pies);
    	
    	if($scope.fromActivity){
			ga('send', 'event', 'Dashboard', 'view', 'Award Activity detail chart filter applied');
		}else{
			ga('send', 'event', 'Dashboard', 'view', 'Given/Received detail chart dependent filter applied');
		}
    }
    
    $scope.formatPathLabel = function(plabel,index){
    	var label = angular.copy(plabel);
    	if($scope.currentDimension.value === "businessunits" ){
    		if(index  !== 0 && index !== $scope.globalPath.length-1){
        		var index = label.lastIndexOf(" ");
        		label = label.substring(0,1);
        	}
    	}else{
    		if(index  !== 0 && index !== $scope.globalPath.length-1){
        		var index = label.lastIndexOf(" ");
        		label = label.substring(0,1) + label.substring(  index+1,index+2  );
        	}
    	}
    	
    	return label;
    }
    
    $scope.labelMaps = {};
    $scope.createPathLabel = function(plabel,index){
    	var label = angular.copy(plabel);
    	var result = "";
    	if($scope.stack === "activity"){
    		var currentId = 0;
    		var manager = 0;
    		var team = 0;
    		var obj = {}
    		
    		if(!$scope.labelMaps[$scope.currentDimension.value])$scope.labelMaps[$scope.currentDimension.value] = {};
    		currentId = (index === 0) ? "initial" : $scope.globalPath[index].id;
    		
    		if($scope.labelMaps[$scope.currentDimension.value][currentId]){
    			result = $scope.labelMaps[$scope.currentDimension.value][currentId].label;
    		}else{
    			
    			if(index === 0){
        			obj = $scope.seriesMap[$scope.currentDimension.value][currentId][0];
        		}else{
        			parentId = $scope.globalPath[index-1].id;
        			obj = _.findWhere($scope.seriesMap[$scope.currentDimension.value][parentId],{id:currentId});
        		}
    			
        		if(obj){
        			manager = obj.myAirThanks + obj.myEbutton + obj.myEcard + obj.myMoneButton  + obj.myMoneCard  + obj.myNomination  + obj.myOther  + obj.myReward;
        			team = obj.chAirThanks + obj.chEbutton + obj.chEcard + obj.chMoneButton  + obj.chMoneCard  + obj.chNomination  + obj.chOther  + obj.chReward;
        		}
        		result = label + " | Manager: " + manager + ", Team: " + team;
        		$scope.labelMaps[$scope.currentDimension.value][currentId] = {};
        		$scope.labelMaps[$scope.currentDimension.value][currentId].label = result;
    		}
    	}else{
    		result = label;	
    	}
    	return result;
    } 
    
    
    $scope.overrideInfoPopUpBuildHeaderFunction = function(chart){
    	//note we should override the buildValues function too if we want to not show some series in the pop up.
        chart._impl.events.paintOrder[4].buildHeader = function(t0,t1){
        	 	var facet, item, label;
        	    facet = this.scene.activeFacet;
        	    item = facet.items[t0 - facet.offset];
        	    label = item.fullLabel || item.label;
        	    return ($scope.currentDimension.value === "users") ? "<em></em><strong>" + label + "*</strong>" : "<em></em><strong>" + label + "</strong>";
        }
        
        chart._impl.events.paintOrder[4].buildContent = function(t0, t1, activeSeriesInd, activeStack) {
            var header, info, seriesObj, valueHtml;
            header = this.buildHeader(t0, t1);
            info = this.chart.renderer.exportData(t0, t1);
            if (this.scene.settings.info.advanced.contentsFunction) {
              seriesObj = null;
              if (activeSeriesInd !== null && this.scene.settings.series.length > activeSeriesInd) {
                seriesObj = this.scene.settings.series[activeSeriesInd];
              }
              valueHtml = this.scene.settings.info.advanced.contentsFunction.call(this.chart.api, info, seriesObj,this.scene.activeFacet.items[t0-this.scene.activeFacet.from]);
            } else {
              valueHtml = this.buildValues(info, activeSeriesInd, activeStack);
            }
            return header + valueHtml;
          };
    }
    
    //type ahead
    $scope.getFilters = function(val) {
    	var url = $scope.filtersBaseUrl + $scope.currentDimension.value;
    	return $http.get(url, {
    		params: {
    			q: val,
    			customer: $scope.stp,
    			fields:"id,label,attributes"
    		}
    	}).then(function(response){
    		
    		if(response.data.suggestions){
    			return response.data.suggestions.map(function(item){
        			return item;
        		});
    		}else{
    			return {};
    		}
    		
    	});
    };
    
    $scope.onFilterSelect = function($item, $model, $label){
    	$scope.noDataForChart = false;
    	$scope.filterItem = $item;
    	console.log("search id",$scope.filterItem)
    	$scope.loadData();
    	
    	if($scope.fromActivity){
			ga('send', 'event', 'Dashboard', 'view', 'Award Activity detail chart filter applied');
		}else{
			ga('send', 'event', 'Dashboard', 'view', 'Given/Received detail chart dependent filter applied');
		}
    };
    
    $scope.loadData = function(){
    	//console.log($scope.filterItem);
    	var url = $scope.filtersBaseUrl + $scope.currentDimension.value + "/"+$scope.filterItem.id +"/parents";
    	$http.get(url,{params: {customer: $scope.stp}}).success(function(data) {
    		var pies = _.pluck(data.parents, 'id');
    		pies.push($scope.filterItem.id);
    		if($scope.topLevel()){
    			pies.unshift("");
    		}else{
    			pies[0] = "";
    		}
    		$scope.facet_chart.setPie(pies);
    	});    	
    };
    //end of typeahead
    
    $scope.sortChart = function(sortFunName){
    	$scope.facet_chart_settings.sortSettings.sortfunc = sortFunName;
		$('.sort-chart-dropdown').removeClass('open');
    	$scope.facet_chart.reloadData();
    };
    
	$scope.exportChart = function(chart, contenttype, ext){
		$('.imageexport-dropdown').removeClass('open');
	    html2canvas(document.getElementById(chart), {
		    onrendered: function(canvas) {
		    	file = canvas.toDataURL(contenttype+'/'+ext, 1);
		    	var fileName = Math.random() + "_" + (new Date()).getTime()+ "_export";
		    	fileName = fileName.replace(".", '');
		    	fileName += "." + ext;
		    	var ifrm;
		    	var context = $('#imageFrame')[0].contentWindow.document;
		    	var $body = $('body', context);
		    	$body.html($("#imageForm").html());
		    	$body.find("#imageData").val(file);
		    	$body.find("#filename").val(fileName);
		    	$body.find("form")[0].submit();
		    }
	    });
	    if($scope.fromActivity){
			ga('send', 'event', 'Dashboard', 'download', 'Award Activity detail chart image export', ext);
		}else{
			ga('send', 'event', 'Dashboard', 'download', 'Given/Received detail chart image export', ext);
		}
	}
	
	$scope.setInitialDimensionAndPrepareSeriesMap();
	
	
	$scope.topLevel = function(){
		result = false;
		if($scope.currentDimension.initialObj.id === "-1" || $scope.currentDimension.initialObj.id === "-2"){
			result = true;
		}
		
		return result;
	}
	
	$scope.chartClickHandler = function() {
		if($scope.fromActivity){
			ga('send', 'event', 'Dashboard', 'click', 'Award Activity detail chart click');
		}else{
			ga('send', 'event', 'Dashboard', 'click', 'Given/Received detail chart click');
		}
	}
	
}]);
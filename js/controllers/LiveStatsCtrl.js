angular.module('LiveStatsCtrl', []).controller('LiveStatsController', function($scope, $http, $location, $interval, $filter, $timeout, ngTableParams, $rootScope,$modal,
		TimeStackChartService,LiveStatsPieChartService,AppService,InitialSiteService) {

	$scope.onlyie = IEUTILS.isIE;	
	$scope.clientId = AppService.getAppInfo().customerID;
	InitialSiteService.hideInitialLoader();
	
	$scope.midnight = moment().startOf('day');	
	$scope.socket = null;
	$scope.stompClient = null;
	$scope.isConnected = false;

    $scope.pageLangs = languageData.pages.livestat;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
	
    $scope.storedData = {};
    
    $scope.showClock = true; 
	
    $scope.refreshAll = function(){
    	$scope.dataSources = {};
    	TimeStackChartService.refreshAll();
    	LiveStatsPieChartService.refreshAll();
    };
    
    $(window).bind('beforeunload', function() {
    	$scope.socket.close();        
    });
    
    $scope.onSubscribe = function(data){   
    	var dataObject = JSON.parse(data.body);            	               	            	
    	if($scope.dataSources[dataObject.viewId] !== undefined){
    		
    		console.log("new socket message",JSON.stringify(dataObject));
    		
    		$scope.dataSources[dataObject.viewId].values.push(dataObject.date);
    		TimeStackChartService.addData(dataObject.viewId,dataObject.date);   
    		$scope.$apply();
    		var el=$('.chartTitle .stats.'+dataObject.viewId);
    		el.css({
	    		'-webkit-transition':'text-shadow 0s ease-in-out',
		        '-moz-transition':'text-shadow 0s ease-in-out',
		        '-o-transition':'text-shadow 0s ease-in-out',
		        '-ms-transition':'text-shadow 0s ease-in-out',
		        'transition':'text-shadow 0s ease-in-out',
		        'text-shadow': '2px 2px #d0d0d0'
	    	});        	    	
	    	$timeout(function(){
	    		el.css({
		    		'-webkit-transition':'text-shadow 2s ease-in-out',
			        '-moz-transition':'text-shadow 2s ease-in-out',
			        '-o-transition':'text-shadow 2s ease-in-out',
			        '-ms-transition':'text-shadow 2s ease-in-out',
			        'transition':'text-shadow 2s ease-in-out',
			        'text-shadow': '2px 2px #ffffff'
		    	});
	    	},300);
    	}else{
    		if($scope.storedData[dataObject.viewId] === undefined){
    			$scope.storedData[dataObject.viewId] = [];
    		}            		
    		$scope.storedData[dataObject.viewId].push(dataObject.date);
    	}
    };
    
	$scope.init = function(){		
		$http.get("secure/getRefreshInterval").success(function(interval){
			setInterval($scope.refreshAll, interval);
		});		
				
		$scope.socket = new SockJS('/livestatssocket');
		$scope.socket.debug = true;
		$scope.stompClient = Stomp.over($scope.socket); 
		//$scope.stompClient.debug = false;
		$scope.stompClient.connect({}, function(frame) {
			console.log("frame: " , frame);
            $scope.isConnected = true;
            $scope.stompClient.subscribe('/topic/livestatsdata.'+$scope.clientId, $scope.onSubscribe, {customerId : $scope.clientId} );
        },function(e){
        	console.log("error " , e);
        });
        
        ga('send', 'pageview', '/livestats');
	    
	};
	
	$scope.init();
	
    $scope.dataSources = {};  
    
    $scope.loadStoredData = function(viewId){
    	var storedData = $scope.storedData[viewId];
    	for(var i = 0; i < storedData.length; i++){
    		$scope.dataSources[viewId].values.push(storedData[i]);
    		TimeStackChartService.addData(viewId,storedData[i]);
    	}
    	console.log("final values " + viewId, $scope.dataSources[viewId].values.length);
    	$scope.storedData[viewId] = [];
    };
    
    $scope.getAwardActivityTotal = function(){
            if($scope.dataSources.nomination &&
                $scope.dataSources.approved &&
                $scope.dataSources.orders &&
                $scope.dataSources.reward_codes){
                return $scope.dataSources.nomination.values.length +
                    $scope.dataSources.approved.values.length + $scope.dataSources.orders.values.length +
                    $scope.dataSources.reward_codes.values.length;
            }
    };

    $scope.geteThanksActivityTotal = function(){
        if($scope.dataSources.eCard &&
            $scope.dataSources.eButton){
            return $scope.dataSources.eCard.values.length +
                $scope.dataSources.eButton.values.length;
        }
    };

    $scope.getAccountActivityTotal = function(){
        if($scope.dataSources.uniqueVisits &&
            $scope.dataSources.newAccounts){
            return $scope.dataSources.uniqueVisits.values.length +
                $scope.dataSources.newAccounts.values.length;
        }
    };

    $scope.loadData = function(from, to, step, success, fail,url,dataName){
        $http.get(url).success(function(data) {
            $scope.dataSources[dataName] = data;            
            success(data);
        });
    };

    $scope.loadDataLiveStats = function(from, to, step, success, fail,url,queryName){    	
    	if($scope.dataSources[queryName] === undefined){
	        $http.post(url,{clientId : $scope.clientId, unit: "s", queryName : queryName , beginDate : $scope.midnight,endDate : moment()}).success(function(data) {
	    	//$http.post(url,{clientId : 24535, unit: "s", queryName : queryName , beginDate : "17-MAY-2014 00:00:00",endDate : "17-MAY-2014 13:59:59"}).success(function(data) {
	        	
	        	var date = moment(data.dataLimitFrom);
	        	var date1 = moment(data.dataLimitTo);
	        	data.dataLimitFrom = date.valueOf() - new Date().getTimezoneOffset() * 60000;
	        	data.dataLimitTo = date1.valueOf()  - new Date().getTimezoneOffset() * 60000;
	        	$scope.dataSources[queryName] = data;
	        	for(var i = 0; i < data.values.length; i ++){
	        		data.values[i][0] = data.values[i][0] - new Date().getTimezoneOffset() * 60000;             		
	        	}	
	        	console.log("original values " +  queryName, data.values.length);
	        	if($scope.storedData[queryName] !== undefined){
	        		$scope.loadStoredData(queryName);
	        	}	        	
	        	success(data);            
	        });
    	}else{
    		success($scope.dataSources[queryName]);
    	}    	    	
    };       
    
    $scope.awardActivitySettings = {
        container: document.getElementById("awardActivityChart"),
        showLabels : false,
        series:[
            {
                name:"Submitting",
                type:"line",
                data:{ index:1, source: "nomination",noDataPolicy:"zero"},
                style:{fillColor: "#9F61AA", "lineColor": "#9F61AA", smoothing:true},
                stack: "default"
            },
            {
                name:"Approving",
                type:"line",
                data:{ index:1, source: "approved",noDataPolicy:"zero"},
                style:{fillColor: "#DE5258", "lineColor": "#DE5258", smoothing:true},
                stack: "default"
            },
            {
                name:"Ordering",
                type:"line",
                data:{ index:1, source: "orders",noDataPolicy:"zero"},
                style:{fillColor: "#F7A75F", "lineColor": "#F7A75F", smoothing:true},
                stack: "default"
            },
            {
                name:"Claiming",
                type:"line",
                data:{ index:1, source: "reward_codes",noDataPolicy:"zero"},
                style:{fillColor: "#ADD6C0", "lineColor": "#ADD6C0", smoothing:true},
                stack: "default"
            }
        ],
        data: [
            {
                name: "approved",
                units:["s"],                
                dataFunction: function(from, to, step, success, fail){
                    $scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","approved");
                }
            },
            {
                name: "nomination",
                units:["s"],
                
                dataFunction: function(from, to, step, success, fail){
                    $scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","nomination");
                }
            },
            {
                name: "orders",
                units:["s"],
                
                dataFunction: function(from, to, step, success, fail){
                    $scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","orders");
                }
            },
            {
                name: "reward_codes",
                units:["s"],
                
                dataFunction: function(from, to, step, success, fail){
                    $scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","reward_codes");
                }
            }
        ]
    };

    $scope.eThanksActivitySettings = {
        container: document.getElementById("eThanksActivityChart"),
        series:[
            {
                name:"eCards",
                type:"line",
                data:{ index:1, source: "eCard",noDataPolicy:"zero"},
                style:{fillColor: "#9F61AA", "lineColor": "#9F61AA", smoothing:true},
                stack: "default"
            },
            {
                name:"eButtons",
                type:"line",
                data:{ index:1, source: "eButton",noDataPolicy:"zero"},
                style:{fillColor: "#ADD6C0", "lineColor": "#ADD6C0", smoothing:true},
                stack: "default"
            }
        ],
        data: [
            {
                name: "eCard",
                units: ["s"],
                dataFunction: function(from, to, step, success, fail){
                	$scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","eCard");                    
                }
            },
            {
                name: "eButton",
                units: ["s"],
                dataFunction: function(from, to, step, success, fail){
                	$scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","eButton");                    
                }
            }
        ]
    };

    $scope.accountActivitySettings = {
        container: document.getElementById("accountActivityChart"),
        series:[
			{
			    name:"Return Visits",
			    type:"line",
			    data:{ index:1, source: "uniqueVisits",noDataPolicy:"zero"},
			    style:{fillColor: "#BF474C", "lineColor": "#BF474C", smoothing:true},
			    stack : "default"
			},
			{
			    name:"New Visits",
			    type:"line",
			    data:{ index:1, source: "newAccounts",noDataPolicy:"zero"},
			    style:{fillColor: "#F9A858", "lineColor": "#F9A858", smoothing:true},
			    stack : "default"
			},
        ],
        data: [
            {
                name: "uniqueVisits",
                units: ["s"],
                dataFunction: function(from, to, step, success, fail){
                	$scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","uniqueVisits");                    
                }
            },
            {
                name: "newAccounts",
                units: ["s"],
                dataFunction: function(from, to, step, success, fail){
                	$scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsTimeData","newAccounts");                    
                }
            }
        ]
    };       
    
    $scope.pieSettings = {
        container: document.getElementById("programCorporateValuesChart"),
        height: 300,
        data:{        	
        	autoCategories:["program", "award_type","award_level"],
            sortField:"program",
            dataFunction: function(from, to, step, success, fail){
            	$scope.loadDataLiveStats(from, to, step, success, fail,"secure/getLiveStatsDonutData","donut_chart");                    
            }            
        },
        pieChartDescContainer : "pieChartDescriptions"
    };    

    TimeStackChartService.mergeWithBaseSettings($scope.awardActivitySettings);
    TimeStackChartService.mergeWithBaseSettings($scope.eThanksActivitySettings);
    TimeStackChartService.mergeWithBaseSettings($scope.accountActivitySettings);

    LiveStatsPieChartService.mergeWithBaseSettings($scope.pieSettings);
    
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
	}	
});
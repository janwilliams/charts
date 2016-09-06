angular.module('LiveStatsModalCtrl', []).controller('LiveStatsModalController', function($scope, $http, $location, $interval,$timeout,$rootScope,$modalInstance) {
	
	$scope.isFirstTime = true;
	$scope.loading = true;
	$scope.showPreviewReports = false;
	$scope.loadingScroll = false;
	
	$scope.rowCount = 0;
	$scope.currentPage = 1;
	$scope.pageSize = 2000;
	
	$scope.endDate = moment();
	
	if($scope.onlyie){
		
		if(IE8UTILS.isIE){
			$scope.pageSize = 500;
		}
		
		if($scope.endDateIE !== undefined){
			$scope.endDate = $scope.endDateIE;
		}
		
	}
	
	$scope.recordCount = 0;

	$scope.requestObject = {
		pageSize : $scope.pageSize,
		pageNumber : $scope.currentPage,
		clientId : $scope.clientId,
		unit : "s",
		queryName : $scope.popUpQueryName,
		beginDate : $scope.midnight,
		endDate : $scope.endDate
	};
	
	//ng grid table variables
	$scope.filterOptions = {filterText: ''};
	$scope.tableData = [];
	
	$scope.colDefs = [];
	$scope.gridOptions = {
		data : 'tableData',
		enableColumnReordering : true,
		filterOptions : $scope.filterOptions,
		columnDefs : 'colDefs'
//		plugins : [ new ngGridFlexibleHeightPlugin() ]
	};
	
	$scope.keepLoading = true;
	$scope.fullyLoaded = false;
	$scope.totalDBRows = 0;
	
	$scope.loadingState = "loading";
	$scope._omitParamSortBy = "0";
	$scope._omitParamOrder = "asc";
	
	$scope.serialize = function(obj, prefix) {
		  var str = [];
		  for(var p in obj) {
		    if (obj.hasOwnProperty(p)) {
		      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
		      str.push(typeof v == "object" ?
		    	$scope.serialize(v, k) :
		        encodeURIComponent(k) + "=" + encodeURIComponent(v));
		    }
		  }
		  return str.join("&");
		};
	$scope.buildCsvLink = function(){
		var requestObj = {};			
		requestObj._omitParamqueryName = $scope.requestObject.queryName;
		requestObj._omitParambeginDate = $scope.requestObject.beginDate;
		requestObj._omitParamendDate = $scope.requestObject.endDate;
		requestObj._omitParamclientId = $scope.requestObject.clientId;
		requestObj._omitParampageSize = $scope.totalDBRows;
		requestObj._omitParamfileName = $scope.title;
		
		requestObj._omitParambeginDate = requestObj._omitParambeginDate.format();
		if (requestObj._omitParamndDate !== undefined){
			requestObj._omitParamendDate = requestObj._omitParamndDate.format();
		}
		
		if ($scope._omitParamSortBy !== undefined){
			requestObj._omitParamSortBy = $scope._omitParamSortBy;
			requestObj._omitParamOrder = $scope._omitParamOrder;
		}
		
		$("#getCsvA").attr("href","secure/downloadCSV?"+$scope.serialize($scope.props) + "&" + $scope.serialize(requestObj));
	};
		
	$scope.loadData = function(){        	
	    $http.post("secure/getLiveStatsPopupData",$scope.requestObject).success(function(data) {	
	    	
	    	if(data.values.length > 0){
	    		//$scope.totalDBRows = ($scope.totalDBRows === 0) ? data.totalRecords : $scope.totalDBRows;
	    		$scope.totalDBRows = data.totalRecords;
	    		if(_.isEmpty($scope.props)){
	    			$scope.props = $scope.buildProps(data.props);
	    		}		    		
		    	
	    		$scope.buildCsvLink();
	    		
		    	if($scope.isFirstTime){
		    		$scope.isFirstTime = false;
		    		var columDef = {};		    		
		             
		    		for(var p in $scope.props){
		    			columDef = {};
		    			columDef.field = p;
		    			columDef.displayName = $scope.props[p];
		    			columDef.sortFn = function (a, b) {
		    		           //compare age property of the object
		    		           if (a.toUpperCase() < b.toUpperCase()) {
		    		             return -1;
		    		           }
		    		           else if (a.toUpperCase() > b.toUpperCase()) {
		    		             return 1;
		    		           }
		    		           else {
		    		             return 0;
		    		           }
		    		         };
		    			$scope.colDefs.push(columDef);		    			
		             }
		    	}
		    	 
		    	$scope.tableData = _.union($scope.tableData,data.values);		        
		        $scope.rowCount =  $scope.tableData.length;
		        
		        $timeout(function(){
		        	
		        	$scope.loading = false;
		        	$scope.loadingScroll = false;
		        	$scope.showPreviewReports = true;
		        	
		        	$scope.prepareForGettingData();
		        },50);
	    	}else{
	    		$scope.fullyLoaded = true;
	    		$scope.keepLoading = false;
	    		$scope.loadingState = "loaded";
	    		$timeout(function(){
		        	$scope.loading = false;
		        	$scope.loadingScroll = false;			        	
		        },50);
	    	}		    			        
	    });
	};
	
	$scope.prepareForGettingData = function(){			
		if(!$scope.isFirstTime && $scope.keepLoading){
			//avoid double calls
			if(!$scope.loadingScroll){
				
				$scope.currentPage+=1;
				$scope.requestObject.pageNumber = $scope.currentPage;
				
				$scope.loadingScroll = true;
				$scope.loading = true;
				$scope.loadData();
				
			}
		}
	};				

	$scope.$on('ngGridEventColumns', function (e) {			
		$scope.props = {};
		$scope.csvcolumns = [];
		var propTpm;
		var propsDef = e.targetScope.columns;
		for(var i =0; i < propsDef.length; i++){
			propTpm = propsDef[i];
			$scope.props[propTpm.field] = propTpm.displayName;			
		}
		$scope.buildCsvLink();
	});
	
	$scope.$on('ngGridEventSorted', function (e, col) {
		$scope._omitParamSortBy = col.columns[0].field;
		$scope._omitParamOrder = col.columns[0].sortDirection;
		$scope.buildCsvLink();
	});
	
	$scope.$on('ngGridEventRows', function() {
		
		if($scope.gridOptions.ngGrid){
			$scope.recordCount = $scope.gridOptions.ngGrid.filteredRows.length;	
		}
	});
	
	$scope.init = function(){
		$scope.loadData();
	};
	
	$scope.cancel = function(){
		$scope.keepLoading = false;
		$modalInstance.dismiss();
		$scope.showPreviewReports = false;
	};
	
	$scope.init();
	
	$scope.buildProps = function(props){			
    	var propsResult = {};
    	var prop;
    	for(var i = 0; i < props.length; i++){
    		prop = props[i];
    		propsResult[prop[0]] = prop[1]; 
    	}
    	return propsResult;
    };

    $scope.gaTrackCsvDownloadEvent = function(category, action, label){
    	ga('send', 'event', 'Live Stats', 'download', $scope.title+' detail table export');
    }
});
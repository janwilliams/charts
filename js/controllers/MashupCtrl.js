angular.module('MashupCtrl', []).controller('MashupController', function($scope, $http, $location,$filter, $timeout, ngTableParams,AppService,InitialSiteService,$rootScope,uiGridConstants,$q,$modal) {
	
	$scope.stp = AppService.getAppInfo().stp;
	InitialSiteService.hideInitialLoader();
	
	$scope.midnight = moment().startOf('day');		

    $scope.pageLangs = languageData.pages.livestat;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
    
    $scope.initialUrl = "secure/getReport";
    $scope.mashupDataUrl = "secure/getMashupData";
    
    $scope.colDefs = [];
    $scope.colDefs2 = [];
    
    $scope.processComplete = false;
    $scope.applyingMashup = false;
    $scope.callMatchKeys = false;
    
    $scope.saveReportLegendStates = ["Save Report","Apply Mashup"];
    $scope.saveReportLegend = $scope.saveReportLegendStates[0];
    
    $scope.prevTableData = [];
    
    //date picker
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.dateOptions = {formatYear: 'yy',startingDay: 1};
    $scope.showDateRange = true;
    
    $scope.openStart = false;
    $scope.openEnd = false;
    $scope.showError = false;
    $scope.errorMessage = "";
    
    //timespan
    $scope.timespanSelected = "yeartodate"
    $scope.onCustomRange = false;        
    
    $scope.isFirstColumnLoading = true;
    $scope.originalColFields = [];
    
    $scope.matchingKeysArr = [];
    $scope.isFirstMatchKeys = true;
    
    $scope.open = function($event,open) {
    	$event.preventDefault();
        $event.stopPropagation();
        $scope[open] = !$scope[open];
    };
    
    $scope.onTimespanChange = function(){
    	if($scope.timespanSelected === "daterange"){
    		$scope.onCustomRange = true;
    	}else{
    		$scope.onCustomRange = false;
    	}
    };
    
    //date picker
    
    $scope.searchParams = {    		
    		queryName: "type_ahead",
    		stp : $scope.stp
    };
    
    $scope.requestObject = {
    		pageSize : 300,
    		pageNumber : 1,
    		stp : $scope.stp,    		
    		queryName : "demo_mashup",
    		beginDate : $scope.midnight,
    		endDate : moment(),
    		searchTags : [],    
    		orderBy : [],
    		columns :[],
    		tableName : "",
    		matchingKeys : []
    };
      
    $scope.requestMashupObject = {
    		pageSize : 300,
    		pageNumber : 1,
    		stp : $scope.stp,    		
    		queryName : "",
    		beginDate : $scope.midnight,
    		endDate : moment(),
    		tableName : ""
    };  
    
    $scope.filterOptions = {filterText: ''};
	$scope.tableData = [];
	$scope.totalDBRows = 0;
	
	$scope.tableDataMashed = [];
	
	$scope.saveReport = function(){
		
		$scope.savingReport = true;
		$scope.applyingMashup = false;
		$scope.callMatchKeys = false;
		
		$scope.saveReportLegend = $scope.saveReportLegendStates[0];
		
		setTimeout(function(){
			$scope.savingReport = false;
		}, 2000);
		
		//preparing table to the last state.
		
		$scope.gridOptions.enableColumnMenus = true;
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnMoving = true;
		
		var notOriginalCols = _.where($scope.colDefs,{colIdentifier:"notOriginalCol"});
		_.each($scope.colDefs,function(val,index,list){
			$scope.originalColFields.push(val.field);
		});
		
		$scope.emptyArray($scope.colDefs)
		$scope.loadTableData($scope.initialUrl,$scope.requestObject);
		
	};
	
	$scope.gridOptions = {
		data : $scope.tableData,
		filterOptions : $scope.filterOptions,
		columnDefs : $scope.colDefs,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		noUnselect: true,
		modifierKeysToMultiSelect: false,
		multiSelect : false,
		//enableColumnResizing: true,
		headerTemplate: 'resources/partials/mashup/header-template.html',
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;			
			$scope.gridApi.colMovable.on.columnPositionChanged($scope,function(){
				if($scope.processComplete){
					$scope.buildCsvLink(true);
				}
			});
						
			 $scope.gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
				 
				 var orderByObjects = [];
				 var tmp;
				 for(var i = 0; i < sortColumns.length; i++){
					 tmp = {};
					 tmp.orderBy = sortColumns[i].field;
					 tmp.orderType = sortColumns[i].sort.direction;	
					 orderByObjects.push(tmp);
				 }
				 $scope.requestObject.orderBy = orderByObjects;
				 
				 setTimeout(function(){
					 $scope.loadTableData($scope.initialUrl,$scope.requestObject);
				 }, 50); 
			 });
			
		}
	};
	
    $scope.showLeftPanel = false;
    $scope.showMashupTable = false;
    $scope.fileUploaded = false;
    $scope.fileUploadedName = "";
    $scope.tmpResponse = {};  
   
    $scope.disableColsOptions = function(){    	
    	_.each($scope.colDefs,function(val,index,list){    		
    		val.enableColumnMoving = false;
    	});
    	$scope.gridApi.cellNav.scrollTo($scope.gridApi.grid, $scope, $scope.gridOptions.data[0], $scope.gridOptions.columnDefs[$scope.gridOptions.columnDefs.length - 1]);
    	setTimeout(function(){
    		$scope.gridApi.cellNav.scrollTo($scope.gridApi.grid, $scope, $scope.gridOptions.data[0], $scope.gridOptions.columnDefs[0]);
    	}, 500);
    };
    
    $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
    	$scope.tags = [];
    	$scope.requestObject.orderBy = [];
    	$scope.requestObject.searchTags = [];
    	$scope.fileUploadedName = flowFile.name;
    	
    	$scope.showLeftPanel = true; 
    	$scope.showDateRange = false;
    	
    	
    	for(var i = 0; i < $scope.gridApi.grid.columns.length; i++){
    		$scope.gridApi.grid.columns[i].sort = {};
    	}
  	});
    
    $scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {
	  $flow.opts.target = "secure/uploadMashup";
	  $flow.upload();	  
	});
    
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile,response) {	    	
    	$scope.tmpResponse = JSON.parse(response); 
    	$scope.recordMatchedCount = $scope.tmpResponse.matchedRecordsCount;
    	$scope.originColumn = $scope.tmpResponse.matchingKeys[0][0];
    	$scope.finalColumn = $scope.tmpResponse.matchingKeys[0][1];    	
    	$scope.fileUploaded = true;
    	$flow.cancel();    	
  	});
	
	$scope.cancelUploadFileClicked = function(){
		$scope.showLeftPanel = false;
	};	
	
	$scope.continueMashupClicked = function(){		
    	
		$scope.showLeftPanel = false;
		$scope.showMashupTable = false;
		$scope.callMatchKeys = true;
		$scope.showDateRange = true;
		
		$scope.saveReportLegend = $scope.saveReportLegendStates[1];
		
		$scope.updateTableData($scope.tmpResponse.mashupData);
		$scope.applyMashup();
    	
	};			
	
	$scope.buildProps = function(props){			
    	var propsResult = {};
    	var prop;
    	for(var i = 0; i < props.length; i++){
    		prop = props[i];
    		propsResult[prop[0]] = prop[1];    		
    	}
    	return propsResult;
    };
	
    function changeColState() {
		var existingCol = this.context.col;		
		if(existingCol.colDef.enable){
			cellName = "disableCell";
			existingCol.colDef.enable = false;
		}else{
			cellName = "";
			existingCol.colDef.enable = true;
		}		
		
		var index = $scope.colDefs.indexOf(_.findWhere($scope.colDefs, {field:existingCol.field}));
		$scope.colDefs.splice(index,1); 
		setTimeout(function(){
			if(existingCol.colDef.enable){
				$scope.colDefs.unshift($scope.createBaseCol(existingCol.field,existingCol.displayName,existingCol.colDef.enable,"Enable/Disable","ui-grid-icon-cancel",changeColState));
			}else{
				$scope.colDefs.push($scope.createBaseCol(existingCol.field,existingCol.displayName,existingCol.colDef.enable,"Enable/Disable","ui-grid-icon-cancel",changeColState));
			}
			
		},50);
		
    }
    
    
    $scope.createBaseCol = function(field,displayName,state,menuItemsTitle,menuItemsIcon,menuItemsActionfunction){
    	var columDef = {};		
		columDef.field = field;
		columDef.enable = state;							
		
		columDef.enableColumnMenus = true;
		columDef.enableColumnMoving = true;
		columDef.enableSorting = true;
		
		if(_.contains($scope.originalColFields, field)){
			columDef.colIdentifier = "originalCol";
		}else{
			columDef.colIdentifier = "notOriginalCol";
		}		
		 
		columDef.displayName = displayName;
		columDef.menuItems = [{
			title: menuItemsTitle,
			icon:menuItemsIcon,
			action: menuItemsActionfunction
		}];
		columDef.width= "150";
		return columDef;
    };      
    
    $scope.matchKeys = function(keys){
    	
    	$scope.showDateRange = true;
    	  	
    	var index,index2;
    	var randomColorKey;
    	var keyHolder;
    	for(var i = 0; i < keys.length; i ++){
    		index = $scope.colDefs.indexOf(_.findWhere($scope.colDefs, {field:keys[i][0]}));
    		index2 = $scope.colDefs.indexOf(_.findWhere($scope.colDefs, {field:keys[i][1]}));    	
    		
    		if(index !== -1 && index2 !== -1){
    			
    			keyHolder = {};    			    			
    			keyHolder.id = "keyHolderId-" + i;
    			
    			$scope.colDefs[index].keyObject = {};
        		$scope.colDefs[index2].keyObject = {};
        		
        		randomColorKey = randomColor({luminosity: 'dark',hue: 'random'});        		
        		
    			$scope.colDefs[index].keyObject.color = randomColorKey;
        		$scope.colDefs[index2].keyObject.color = randomColorKey; 
        		
        		$scope.colDefs[index].keyObject.key = keys[i][0];
        		$scope.colDefs[index2].keyObject.key = keys[i][1];
        		
        		$scope.colDefs[index].keyObject.parentId = keyHolder.id;
        		$scope.colDefs[index2].keyObject.parentId = keyHolder.id;      		        		
        		
        		keyHolder.rigthKey = $scope.colDefs[index2].keyObject;
        		keyHolder.leftKey = $scope.colDefs[index].keyObject;
        		
        		$scope.matchingKeysArr.push(keyHolder);
        		
    		}    			    		    		
    	} 
    	
    	$scope.gridOptions.enableColumnMenus = false;
    	$scope.gridOptions.enableSorting = false;
    	
    	$scope.disableColsOptions();
    	$scope.buildCsvLink();
    };
    
    $scope.updateTableData = function(data){    	    	
    	
    	$scope.tableData = data.values;	
    	$scope.prevTableData = $scope.tableData;
        $scope.rowCount =  $scope.tableData.length;
        $scope.gridOptions.data = $scope.tableData;
        $scope.gridOptions.columnDefs = $scope.colDefs;
        $scope.applyingMashup = false;         
        $scope.isLoadingMainData = false;  
        $scope.buildCsvLink();
       
    };        
    
    $scope.loadTableData = function(url,request){
    	$scope.isLoadingMainData = true;
    	$scope.tableData = [];	
    	$scope.gridOptions.data = [];
    	request.columns = ["bu.BUSINESS_UNIT_NAME","bu.BUSINESS_UNIT_CD"];
    	
    	if($scope.tmpResponse.clientMashupData){
			for(var i = 0; i < $scope.tmpResponse.clientMashupData.props.length; i++){
	    		request.columns.push($scope.tmpResponse.clientMashupData.props[i][0]);
	    	}
		}
    	
    	$scope.getCurrentDateRange(request);
    	
    	if($scope.matchingKeysArr.length > 0){
    		request.matchingKeys = [];
    		for(var i = 0; i < $scope.matchingKeysArr.length; i++){
    			request.matchingKeys.push([$scope.matchingKeysArr[i].leftKey.key,$scope.matchingKeysArr[i].rigthKey.key]);    			
    		}
    	}
    	
    	$http.post(url,request).success(function(data) {
    		
    		if(data.statusCode === 1722){
    			$scope.errorMessage = "Selected key columns type mismatch";
    			$scope.showError = true;    			
    		}else{
    			$scope.errorMessage = "";
    			$scope.showError = false;
    		}
    		
			$scope.totalDBRows = data.totalRecords;					
			var index = -1;		
			
			if(data.props.length === 0){
				var emptyRow = {};
				for(var i = 0; i < $scope.colDefs.length; i++){
					emptyRow[$scope.colDefs[i].field] = "";
				}
				data.values.push(emptyRow);
			}
			
			for(var i = 0; i < data.props.length; i ++){
				var enable = (data.props[i][2] === "true") ? true : false;
				index = $scope.colDefs.indexOf(_.findWhere($scope.colDefs, {field:data.props[i][0]}));
				if(index < 0){
					if($scope.isFirstColumnLoading){						
					    $scope.originalColFields.push(data.props[i][0]);	   
					}
					$scope.colDefs.push( $scope.createBaseCol(data.props[i][0],data.props[i][1],enable,"Enable/Disable","ui-grid-icon-cancel",changeColState)    );					
				}   			
             }
			
			//sort by enable,disables at the bottom.
			$scope.colDefs = _.sortBy($scope.colDefs,function(item){return item.enable === false});
    		$scope.updateTableData(data);
    		
    		if($scope.callMatchKeys){
    			if($scope.isFirstMatchKeys){
    				$scope.matchKeys($scope.tmpResponse.matchingKeys);
    				$scope.isFirstMatchKeys = false;
    			}
    			 
    		}
    		
    		if($scope.isFirstColumnLoading){
				$scope.isFirstColumnLoading = false;			      
			}
        });
    };
    
    $scope.getCurrentDateRange = function(request){
    	if($scope.timespanSelected === "daterange"){
        	request.beginDate = moment($scope.startDate).format("YYYYMMDD");
        	request.endDate =  moment($scope.endDate).format("YYYYMMDD");
    	}
    	
    	if($scope.timespanSelected === "yeartodate"){
        	request.beginDate = moment().year()+"0101";
        	request.endDate = moment().format("YYYYMMDD");
    	}
    	
    	if($scope.timespanSelected === "lastquarter"){
        	var quarterAdjustment= (moment().month() % 3) + 1;
        	var lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month');
        	var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 3 }).startOf('month');
        	request.beginDate = lastQuarterStartDate.format("YYYYMMDD");
        	request.endDate = lastQuarterEndDate.format("YYYYMMDD");
    	}
    	
    	if($scope.timespanSelected === "lastmonth"){
        	var lastQuarterStartDate = moment().subtract({ months: 1 }).startOf('month');
        	var lastQuarterEndDate = moment().subtract({ months: 1 }).endOf('month');
        	request.beginDate = lastQuarterStartDate.format("YYYYMMDD");
        	request.endDate = lastQuarterEndDate.format("YYYYMMDD");
    	}
    }
    
	$scope.buildCsvLink = function(fromMove){
		
		var requestObj = angular.copy($scope.requestObject);
		console.log("csv",requestObj)
		requestObj.fileName = "Report";
		
		$scope.getCurrentDateRange(requestObj);
		
		requestObj.tableHeaders = [];
		requestObj.columns = ["bu.BUSINESS_UNIT_NAME","bu.BUSINESS_UNIT_CD"];
		
		if($scope.tmpResponse.clientMashupData){
			for(var i = 0; i < $scope.tmpResponse.clientMashupData.props.length; i++){
	    		requestObj.columns.push($scope.tmpResponse.clientMashupData.props[i][0]);
	    	}
		}
		
    	var tmp = null;
    	
    	if(fromMove){
    		for(var i = 0; i < $scope.gridApi.grid.columns.length; i++){
        		tmp = $scope.gridApi.grid.columns[i].colDef;
        		if(tmp.enable){
        			requestObj.tableHeaders.push(tmp.field);
        			requestObj.tableHeaders.push(tmp.displayName);
        		}    		
        	}
    	}else{
    		for(var i = 0; i < $scope.colDefs.length; i++){
        		tmp = $scope.colDefs[i];
        		if(tmp.enable){
        			requestObj.tableHeaders.push(tmp.field);
        			requestObj.tableHeaders.push(tmp.displayName);
        		}    		
        	}    		    		
    	}    	    	
    	
    	var orderByP = [];
    	
    	if(requestObj.orderBy.length > 0){
    		for(var i = 0; i < requestObj.orderBy.length; i++){
    			orderByP.push(requestObj.orderBy[i].orderBy);
    			orderByP.push(requestObj.orderBy[i].orderType);
    		}
    		requestObj.orderBy = orderByP;
    	}
    	 
    	//creating matching keys
    	if($scope.matchingKeysArr.length > 0){
    		requestObj.matchingKeys = [];
    		for(var i = 0; i < $scope.matchingKeysArr.length; i++){
    			requestObj.matchingKeys.push([$scope.matchingKeysArr[i].leftKey.key,$scope.matchingKeysArr[i].rigthKey.key]);    			
    		}
    	}
    	
    	$("#getMashupCsvA").attr("href","secure/downloadMashupCSV?"+ $.param( requestObj , true));
	};
	
    $scope.applyMashup = function(){
    	
    	$scope.applyingMashup = true;
    	$scope.showMashupTable = false;
    	$scope.fileUploaded = false;
    	$scope.showDateRange = false;
    	
    	$scope.requestMashupObject.tableName = $scope.tmpResponse.tableName;
    	$scope.requestObject.tableName = $scope.tmpResponse.tableName;
    	$scope.requestMashupObject.queryName = "mashupApplied";
    	$scope.requestObject.queryName = "demo_mashup_applied";
    	$scope.emptyArray($scope.colDefs);
    	$scope.loadTableData($scope.mashupDataUrl,$scope.requestMashupObject);    	
    	$scope.processComplete = true;
    	$scope.searchParams.tableName = $scope.tmpResponse.tableName;
    	$scope.searchParams.columns = "";
    	    	
    	for(var i = 0; i < $scope.tmpResponse.clientMashupData.props.length; i++){
    		$scope.searchParams.columns += $scope.tmpResponse.clientMashupData.props[i][0];
    		$scope.searchParams.columns += ",";
    	}
    	
    	$scope.searchParams.columns = $scope.searchParams.columns.substring(0, $scope.searchParams.columns.length - 1);
    	
    };
    
    $scope.startOver = function(){    	
    	window.location.reload();
    };
    
    $scope.emptyArray = function(array){    	
    	while(array.length > 0) {
    		array.pop();
    	}
    };
    
	$scope.init = function(){				
	    $scope.loadTableData($scope.initialUrl,$scope.requestObject);	    
	};
		
//	DEPENDANT FILTERS LOGIC
	
	$scope.tags = [];
	
    $scope.onTagAdded = function($tag){    	
    	$scope.search = $tag.text;    	
    	$scope.filterTable();    	
    };
    
    $scope.onTagRemoved = function($tag){
    	$scope.search = "";
    	    	
    	$scope.filterTable();
    };
    
	$scope.loadTags = function(query) {	
		var deferred = $q.defer();
		$scope.searchParams.searchText = query;
		$http.get("secure/search",{params: $scope.searchParams}).success(function(data){
			var results = angular.fromJson(data.results);
			var tagsResults = [];
			var index = -1;
			var tmp;
			for(var i = 0; i < results.length; i++){
				tmp = results[i];
				index = tagsResults.indexOf(_.findWhere(tagsResults, {text:tmp[1]}));
				if(index < 0){
					tagsResults.push({text : tmp[1],ldesc:"",rdesc: tmp[0],getChildColor:{"background-color":"#74ACBD"}});
				}	
				if(tagsResults.length === 10){
					i = results.length + 1;
				}
			}			
			deferred.resolve(tagsResults);						
		});
		return deferred.promise;
	};
	
	$scope.filterTable = function(){
		var tagsToSend = [];
		for(var i = 0; i < $scope.tags.length; i++){
			tagsToSend.push($scope.tags[i].text);
		}
		$scope.requestObject.searchTags = tagsToSend;
		$scope.loadTableData($scope.initialUrl,$scope.requestObject);		
	};
	
	$scope.init();
});
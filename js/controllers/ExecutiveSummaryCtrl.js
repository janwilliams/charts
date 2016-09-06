angular.module('ExecutiveSummaryCtrl', []).controller('ExecutiveSummaryController', function($scope, $http, $location,$filter, $timeout, ngTableParams,AppService,InitialSiteService,$rootScope,uiGridConstants,$q,$modal) {
	 	  
	$scope.flowObj = null;
	
	$scope.stp = AppService.getAppInfo().stp;
	InitialSiteService.hideInitialLoader();
	
	$scope.midnight = moment().startOf('day');		

    $scope.pageLangs = languageData.pages.livestat;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
    
    $scope.initialUrl = "secure/summaryreport/getReport";
    $scope.createSummaryUrl = "secure/summaryreport/createSummary";
    
    $scope.csvUrl = "";
    $scope.csvHeaders = [];
	$scope.csvValues = [];
    
    $scope.colDefs = [];
    $scope.colDefs2 = [];
    $scope.prevTableData = [];
    $scope.originalColFields = [];
    $scope.filterOptions = {filterText: ''};
	$scope.tableData = [];
	$scope.tableDataMashed = [];
	$scope.totalDBRows = 0;
	$scope.fileUploadedName = "";
	$scope.tmpResponse = {};  
    //date picker
    
	$scope.hiddenColumns = ["UNIQUE_ID"];	
    $scope.duplicates = [];
    $scope.notFoundKeys = [];	      
    $scope.currentRollupCol = "";
    $scope.rollupCols = [];
    
    //FLAGS
    $scope.isFirstColumnLoading = true;
    $scope.showDateRange = true;
    $scope.showUploadFile = true;
    $scope.showTitle = true;
    $scope.showProcessComplete = false; //for the csv
   	
    $scope.showDuplicatePopUp = false;
    
    $scope.showRollupKeySelection = false;
    
    $scope.showSavingReport = false;
    $scope.showError = false;
    $scope.showApplyingReport = false;
    $scope.showUploadingFile = false;
    $scope.showFileUploaded = false;
    $scope.isLoadingLastData = false;
    $scope.showLoadingData = false;
    $scope.showGrid = false;
    $scope.fileUploaded = false;
    $scope.processComplete = false;
    
    
    //bread crumbs
    $scope.showBreadcrumb = false;
    $scope.globalPath = [{id:null,level:1,label:"All"}];
    
    $scope.onPathClicked = function(index,obj){
    	$scope.globalPath.splice(index+1,$scope.globalPath.length);
    	$scope.requestObject.level = obj.level;
    	$scope.requestObject.parentID = obj.id;				 
    	$scope.loadNewData();
    };
    
// TABLE DATA & FUNCTIONS
    $scope.searchParams = {    		
    		queryName: "type_ahead",
    		stp : $scope.stp
    };
    
    $scope.requestObject = {
    		pageSize : 300,
    		pageNumber : 1,
    		stp : $scope.stp,    		
    		queryName : "summary_report",
    		beginDate : $scope.midnight,
    		endDate : moment(),
    		searchTags : [],    
    		orderBy : [],
    		columns :[],
    		tableName : "",
    		level : 1,
    		parentID : null,
    		rollupKeyName : $scope.currentRollupCol,
    		hiddenCols : $scope.hiddenColumns,
    		userDefinedCols : []
    };
    
    function rowTemplate(){    
    	return "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" popovercontrol=\"200\" class=\"ui-grid-cell\" " +
    			"popover-placement=\"top\" popover=\"{{row.entity[col.colDef.name]}}\" popover-trigger=\"mouseenter\" popover-append-to-body=\"true\" " +
    			"ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell>" +
    			"</div>";
    };
    
    $scope.onRollupColClicked = function(col){    	
    	$scope.currentRollupCol = col;
	};
    
	$scope.gridOptions = {
		rowTemplate: rowTemplate(),
		data : $scope.tableData,
		filterOptions : $scope.filterOptions,
		columnDefs : $scope.colDefs,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		noUnselect: true,
		modifierKeysToMultiSelect: false,
		multiSelect : false,
		onRegisterApi: function(gridApi) {
			
			$scope.gridApi = gridApi;			
			
			$scope.gridApi.colMovable.on.columnPositionChanged($scope,function(){
				if($scope.processComplete){
					$scope.buildCsvLink(true);
				}
			});
				
			 gridApi.selection.on.rowSelectionChanged($scope,function(row){				 
				 
				 $scope.requestObject.level = $scope.requestObject.level+1;
				 $scope.requestObject.parentID = row.entity.UNIQUE_ID;				 
				 $scope.loadNewData();
				 var labelPath = "";
				 
				 if(row.entity.BUSINESS_UNIT_NAME === null){
					 for(var p in row.entity){
						 if(p !== $scope.currentRollupCol && row.entity[p] !== null && _.contains($scope.tmpResponse.userDefinedCols,p)){
							 labelPath =  row.entity[p];
						 }						 
					 } 
				 }else{
					 labelPath = row.entity.BUSINESS_UNIT_NAME;
				 }				 				 
				 
				 $scope.globalPath.push({id:row.entity.UNIQUE_ID,label:labelPath,level:$scope.requestObject.level});
				 
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
	
	$scope.onContinueRollupSelectedClicked = function(){
		var req = {};
		req.stp = $scope.requestObject.stp;
		req.date = $scope.requestObject.endDate;
		req.rollupKeyName = $scope.currentRollupCol;
		req.url = $scope.csvUrl;
		req.headers = $scope.csvHeaders;
		req.values = $scope.csvValues;
		
		$scope.showRollupKeySelection = false;
		$scope.showApplyingReport = true;		
		
		
		$http.post($scope.createSummaryUrl,req).success(function(data) {
			$scope.globalPath = [{id:null,level:1,label:"All"}];
	    	$scope.tmpResponse = data; 
	    	$scope.recordMatchedCount = $scope.tmpResponse.matchedRecordsCount;
	    	$scope.fileUploaded = true;
	    	$scope.isLoadingLastData = true;    	
	    	
	    	$scope.startDate = $scope.requestObject.beginDate;
	    	$scope.endDate = $scope.requestObject.endDate;
	    	
	    	if(!_.contains($scope.hiddenColumns, $scope.currentRollupCol)){
	    		$scope.hiddenColumns.push($scope.currentRollupCol);
	    	}    	    	
	    	
	    	$scope.requestObject = {
	        		pageSize : 300,
	        		pageNumber : 1,
	        		stp : $scope.stp,    		
	        		queryName : "summary_report_rolledup",
	        		beginDate : $scope.startDate,
	        		endDate : $scope.endDate,
	        		searchTags : [],    
	        		orderBy : [],
	        		columns :$scope.tmpResponse.columns,
	        		tableName : $scope.tmpResponse.resultSetTableName,
	        		mappingTable:$scope.tmpResponse.tableName,
	        		updateTableNeeded:false,
	        		level : 1,
	        		parentID : null,
	        		rollupKeyName : $scope.currentRollupCol,
	        		hiddenCols : $scope.hiddenColumns,
	        		userDefinedCols : $scope.tmpResponse.userDefinedCols
	        };
	    	
	    	$scope.currentRollupCol = "";
	    	
	    	if($scope.tmpResponse.duplicateFoundOrKeyNotFound){
	    		
	    		$scope.duplicates = [];
	    	    $scope.notFoundKeys = [];
	    	    
	    		var dup = null;
	    		var nfk = null;
	    		
	    		if($scope.tmpResponse.duplicates.values.length > 0){
	    			_.each($scope.tmpResponse.duplicates.values,function(value, key, list){
	        			dup = {};    			
	        			dup.key = value[$scope.tmpResponse.duplicates.props[0][0]];
	        			dup.desc = value[$scope.tmpResponse.duplicates.props[1][0]];  
	        			$scope.duplicates.push(dup);
	        		});  
	    		}
	    		
	    		if($scope.tmpResponse.notFoundKeys.values.length > 0){
	    			_.each($scope.tmpResponse.notFoundKeys.values,function(value, key, list){
	        			nfk = {};    			
	        			nfk.key = value[$scope.tmpResponse.notFoundKeys.props[0][0]];
	        			nfk.desc = value[$scope.tmpResponse.notFoundKeys.props[1][0]];  
	        			$scope.notFoundKeys.push(nfk);
	        		});
	    		}    		
	    		
	    		$scope.showDuplicatePopUp = true;
	    		
	    		$scope.prepareCommonLoaders();    		
	    	}else{
	    		$scope.duplicates = [];
	    	    $scope.notFoundKeys = [];
	    		$scope.showDuplicatePopUp = false;
	    		$scope.emptyArray($scope.colDefs);
	        	$scope.loadTableData($scope.initialUrl,$scope.requestObject);
	    	}
		});
								
	};
	
// TABLE DATA & FUNCTIONS
    
// UPLOAD FUNCTIONS 
    $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {    	
    	$scope.tags = [];
    	$scope.requestObject.orderBy = [];
    	$scope.requestObject.searchTags = [];
    	$scope.fileUploadedName = flowFile.name;
    	
    	//FLAGS
    	$scope.showDateRange = false;
    	$scope.showTitle = false;
    	$scope.showUploadFile = false;
    	$scope.showApplyingReport = true;
    	
    	for(var i = 0; i < $scope.gridApi.grid.columns.length; i++){
    		$scope.gridApi.grid.columns[i].sort = {};
    	}
    	
    	$flow.opts.target = "secure/summaryreport/uploadHierarchy2";
    	$flow.opts.query.stp = $scope.requestObject.stp;
    	$flow.opts.query.date = $scope.requestObject.endDate;    	
    	$flow.opts.query.rollupKeyName = $scope.currentRollupCol;
    	
    	$scope.prepareCommonLoaders();
    	
    	$scope.showRollupKeySelection = false;   
  	});
    
   
    
    $scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {    	
    	$flow.upload();
    });
    
    //STEP #1
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile,response) {      	
    	var cResponse = JSON.parse(response);
    	$flow.cancel();
    	$scope.showRollupKeySelection = true;    	
    	$scope.rollupCols = cResponse.headers;
    	$scope.$apply();
    	loadCheckboxCss();
    	$scope.csvUrl = cResponse.url;
        $scope.csvHeaders = cResponse.headers;
    	$scope.csvValues = cResponse.values;
  	});
   
	$scope.cancelUploadFileClicked = function(){
		
	};	
// UPLOAD FUNCTIONS
	
	//STEP #2
	$scope.updateTableData = function(data){    	    	
    	
    	$scope.tableData = data.values;	
    	$scope.prevTableData = $scope.tableData;
        $scope.rowCount =  $scope.tableData.length;
        $scope.gridOptions.data = $scope.tableData;
        $scope.gridOptions.columnDefs = $scope.colDefs;        
        $scope.buildCsvLink();
        
        //doing this here for every change in the datetime picker or date combo.
        $scope.showTitle = true;
        $scope.showDateRange = true;
    	$scope.showApplyingReport = false;
    	$scope.showLoadingData = false;
    	$scope.showGrid = true;
    	$scope.showProcessComplete = true;
    	$scope.showBreadcrumb = true;
    	
    	$scope.requestObject.updateTableNeeded = true;
    	
    };        
    
    $scope.prepareCommonLoaders = function(){    	
    	$scope.isLoadingLastData = false;
    	$scope.showBreadcrumb = false;
    	$scope.showApplyingReport = false;    	    	
    };
    
    $scope.prepareLoadingTableDataLoaders = function(){
    	$scope.isLoadingMainData = true;
    	$scope.showLoadingData = true;
    };
    
    $scope.loadTableData = function(url,request){  
    	$scope.prepareCommonLoaders();
    	$scope.prepareLoadingTableDataLoaders();
    	$scope.tableData = [];	
    	$scope.gridOptions.data = [];    	
    	request.columns = ["bu.BUSINESS_UNIT_NAME","bu.BUSINESS_UNIT_CD"];
    	
    	if($scope.tmpResponse.columns){
    		request.columns = $scope.tmpResponse.columns;
		}
    	
    	$http.post(url,request).success(function(data) {
    		
    		
    		data = $scope.formatData(data);
    		
    		$scope.errorMessage = "";
			$scope.showError = false;
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
    		
    		if($scope.isFirstColumnLoading){
				$scope.isFirstColumnLoading = false;			      
			}
        });
    };
    
    $scope.formatData = function(data){
    
    	_.each(data.values,function(value, key, list){
    		_.each(value,function(v, k, l){
    			if(parseFloat(v)){
    				if(k === "% Spent"){
    					l[k] = v+'%';
    				}else if(k === "UNIQUE_ID"){
    					l[k] = v;	
    				}else{    					
    					n = parseFloat(v);
        				n = n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    					l[k] = '$'+n;
    				}
    			}
    		})
    	})
    	
    	return data;
    }
    
	$scope.buildCsvLink = function(){	
		var requestObj = angular.copy($scope.requestObject);
		requestObj.columns = _.without($scope.requestObject.columns, $scope.hiddenColumns);
    	$("#getMashupCsvA").attr("href","secure/summaryreport/downloadReportCSV?"+ $.param( requestObj , true));
	};
	
   
	$scope.init = function(){				
			    
	};
	
	//step #  - saveReport
	$scope.saveReport = function(){
		
		$scope.showSavingReport = true;
		
		setTimeout(function(){
			$scope.showSavingReport = false;
		}, 2000);
	};
	
	//step# - onUploadNewFile
	
	$scope.onUploadNewFile = function(){
		$scope.showDuplicatePopUp = false;
		$scope.showGrid = false;
		$scope.showUploadFile = true;
		
		$scope.showTitle = false;
		$scope.showDateRange = false;
		$scope.showBreadcrumb = false;
	};	
	
	
	// must upload a corrected file
	$scope.onDuplicatesOkClicked = function(){
		$scope.showTitle = true;
        $scope.showDateRange = true;
		$scope.showDuplicatePopUp = false;
		$scope.showGrid = false;
		$scope.showUploadFile = true;
	};	
	
	
//NOT STEPS - OTHER PROCESS
	
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
	
	//	DEPENDANT FILTERS LOGIC
	
	 $scope.startOver = function(){    	
		 window.location.reload();
	 };
	    
	 $scope.emptyArray = function(array){    	
		while(array.length > 0) {
			array.pop();
		}
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
    	
    	if(_.contains($scope.hiddenColumns,field)){
    		columDef.visible = false;
    	}
    	
		columDef.field = field;		
		columDef.enable = state;
		columDef.allowCellFocus = false;
		
		columDef.enableColumnMenus = true;
		columDef.enableColumnMoving = true;
		columDef.enableSorting = true;
		
		if(_.contains($scope.originalColFields, field)){
			columDef.colIdentifier = "originalCol";
		}else{
			columDef.colIdentifier = "notOriginalCol";
		}		
		 
		columDef.displayName = displayName;		
		
		if(columDef.displayName === '% spent'){
			columDef.displayName = '% Spent';
			columDef.cellClass = "pspend";
		}else{
			columDef.cellClass = columDef.field;
		}
		
		if(columDef.displayName === "Plan" || columDef.displayName === "Available" || columDef.displayName === "Spent" || columDef.displayName === "% Spent"){
			columDef.width= "120";
		}else{
			columDef.width= "200";
		}
		
		//columDef.cellTemplate='<div class="hola"></div>';
		
		return columDef;
    };      

//NOT STEPS - OTHER PROCESS
	
	$scope.init();
	
	$scope.getLastQuarter = function(flag){
		var quarterAdjustment= (moment().month() % 3) + 1;
		var result;
		var lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month');
		if(flag === "start"){
			var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 2 }).startOf('month');
			result = lastQuarterStartDate;
		}else{
			result = lastQuarterEndDate
		}
		return result;
	}
	
	$scope.loadNewData = function(){
		if($scope.showGrid){
      	  $scope.showTitle = false;
      	  $scope.showDateRange = false;
      	  $scope.showGrid = false;
      	  $scope.showApplyingReport = true;
      	  $scope.loadTableData($scope.initialUrl,$scope.requestObject);
        }	
	};
	
	angular.element(document).ready(function() {

        var cb = function(start, end, label) {
          //console.log(start.format('YYYYMMDD'),end.format('YYYYMMDD'), label);
          $scope.requestObject.beginDate = start.format('YYYYMMDD');
          $scope.requestObject.endDate = end.format('YYYYMMDD');
          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
          
          $scope.loadNewData();
          
        }

        var optionSet1 = {
          startDate: moment(),
          endDate: moment(),
          minDate: '01/01/2012',
          maxDate: '12/31/2015',
          dateLimit: { days: 60 },
          showDropdowns: true,
          showWeekNumbers: true,
          timePicker: false,
          timePickerIncrement: 1,
          timePicker12Hour: true,
          ranges: {
             'Year To Date': [moment().startOf('year'), moment()],
             'Last Quarter': [$scope.getLastQuarter('start'),$scope.getLastQuarter('end')],
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             'This Month': [moment().startOf('month'), moment().endOf('month')]
          },
          opens: 'left',
          buttonClasses: ['btn btn-default'],
          applyClass: 'btn-small btn-primary',
          cancelClass: 'btn-small',
          format: 'MM/DD/YYYY',
          separator: ' to ',
          locale: {
              applyLabel: 'Submit',
              cancelLabel: 'Clear',
              fromLabel: 'From',
              toLabel: 'To',
              customRangeLabel: 'Custom Range',
              daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
              monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              firstDay: 1
          }
        };
        
        $scope.requestObject.beginDate = moment().startOf('year').format('YYYYMMDD');
        $scope.requestObject.endDate = moment().format('YYYYMMDD');
        $('#reportrange span').html(moment().startOf('year').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#reportrange').daterangepicker(optionSet1, cb);
        
	});
	
	function loadCheckboxCss(){
		$('.list-group.checked-list-box .list-group-item').each(function () {
	        
	        // Settings
	        var $widget = $(this),
	            $checkbox = $('<input type="checkbox" class="hidden" />'),
	            color = ($widget.data('color') ? $widget.data('color') : "primary"),
	            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
	            settings = {
	                on: {
	                    icon: 'glyphicon glyphicon-check'
	                },
	                off: {
	                    icon: 'glyphicon glyphicon-unchecked'
	                }
	            };
	            
	        $widget.css('cursor', 'pointer');
	        $widget.append($checkbox);

	        // Event Handlers
	        $widget.on('click', function () {
	        	$('.list-group.checked-list-box .list-group-item').each(function () {
	        		checkWidget($(this),'');        	
	        	});         	
	        	checkWidget($widget,'true');        	
	        });
	        
	        $checkbox.on('change', function () {
	            updateDisplay($widget,$checkbox);
	        });
	          
	        function checkWidget(widget,condition){
	        	var checkBox = widget.find("input");
	        	checkBox.prop('checked', condition);
	        	checkBox.triggerHandler('change');
	            updateDisplay($widget,checkBox);
	        }
	        
	        // Actions
	        function updateDisplay(widget,checkbox) {        	        
	            var isChecked = checkbox.is(':checked');            
	            // Set the button's state
	            widget.data('state', (isChecked) ? "on" : "off");

	            // Set the button's icon
	            widget.find('.state-icon')
	                .removeClass()
	                .addClass('state-icon ' + settings[widget.data('state')].icon);

	            // Update the button's color
	            if (isChecked) {
	                widget.addClass(style + color + ' active');
	            } else {
	                widget.removeClass(style + color + ' active');
	            }
	        }

	        // Initialization
	        function init() {
	            
	            if ($widget.data('checked') == true) {
	                $checkbox.prop('checked', !$checkbox.is(':checked'));
	            }
	            
	            updateDisplay($widget,$checkbox);

	            // Inject the icon if applicable
	            if ($widget.find('.state-icon').length == 0) {
	                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
	            }
	        }
	        init();
	    });
	}
	
});
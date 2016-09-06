angular.module('BudgetReportController', []).controller('BudgetReportController', function($scope, $http, $location,$filter, $timeout, ngTableParams,AppService,InitialSiteService,$rootScope,uiGridConstants,$q,$modal) {
	
	$scope.flowObj = null;
	
	$scope.stp = AppService.getAppInfo().stp;
	InitialSiteService.hideInitialLoader();	
    
    $scope.initialUrl = "secure/budgetreport/getReport";
    
    $scope.requestObject = {
    		pageSize : 300,
    		pageNumber : 1,
    		stp : $scope.stp,    		
    		queryName : "budget_report",
    		beginDate : $scope.midnight,
    		endDate : moment(),
    		searchTags : [],    
    		orderBy : [],
    		columns :[]    		
    };
    
    $scope.colDefs = [];
    $scope.colDefs2 = [];
   
    $scope.gridOptions = {    		
		data : $scope.tableData,    		
		columnDefs : $scope.colDefs,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		noUnselect: true,
		modifierKeysToMultiSelect: false,
		multiSelect : false,		
		headerTemplate: 'ui-grid/ui-grid-header-custom',
		onRegisterApi: function(gridApi) {
			$scope.gridApiL = gridApi;
			$scope.gridApiL.grid.api.core.on.scrollEvent($scope,function(scrollEvent){
				var position = scrollEvent.sourceRowContainer.prevScrollTop;
				$(".grid2 .ui-grid-render-container .ui-grid-viewport").scrollTop(position);
			});
		}
    };
    
    $scope.gridOptions2 = {    		
		data : $scope.tableData,    		
		columnDefs : $scope.colDefs2,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		noUnselect: true,
		modifierKeysToMultiSelect: false,
		multiSelect : false,		
		headerTemplate: 'ui-grid/ui-grid-header-custom',
		onRegisterApi: function(gridApi) {
			$scope.gridApiR = gridApi;
			$scope.gridApiR.grid.api.core.on.scrollEvent($scope,function(scrollEvent){
				var position = scrollEvent.sourceRowContainer.prevScrollTop;
				$(".grid1 .ui-grid-render-container .ui-grid-viewport").scrollTop(position);
			});
		}
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
		
    };
    
    $scope.createBaseCol = function(field,displayName,state,menuItemsTitle,menuItemsIcon,menuItemsActionfunction){
    	var columDef = {};	
    	columDef.headerCellTemplate = "ui-grid/uiGridHeaderCellCustom";
    	if(_.contains($scope.hiddenColumns,field)){
    		columDef.visible = false;
    	}
    	
		columDef.field = field;		
		columDef.enable = state;
		columDef.allowCellFocus = false;
		
		columDef.enableColumnMenus = false;
		columDef.enableColumnMoving = true;
		columDef.enableSorting = true;
		
		if(_.contains($scope.originalColFields, field)){
			columDef.colIdentifier = "originalCol";
		}else{
			columDef.colIdentifier = "notOriginalCol";
		}		
		 
		columDef.displayName = displayName;		
		
		columDef.width= "150";
		
		return columDef;
    };     
    
    function isNumber(n)
    {
       return n === parseFloat(n);
    }
    
    function isEven(n) {
       return isNumber(n) && (n % 2 == 0);
    };
    
    $scope.loadTableData = function(url,request){  

    	$scope.tableData = [];	
    	$scope.gridOptions.data = [];
    	$scope.gridOptions2.data = []; 
    	request.columns = ["bu.BUSINESS_UNIT_NAME","bu.BUSINESS_UNIT_CD"];
    	
    	$http.post(url,request).success(function(data) {    	
			
			for(var i = 0; i < data.props.length; i ++){
				var enable = (data.props[i][2] === "true") ? true : false;									
				if(isEven(i)){					
					$scope.colDefs.push( $scope.createBaseCol(data.props[i][0],data.props[i][1],enable,"Enable/Disable","ui-grid-icon-cancel",changeColState)    );
				}else{					
					$scope.colDefs2.push( $scope.createBaseCol(data.props[i][0],data.props[i][1],enable,"Enable/Disable","ui-grid-icon-cancel",changeColState)    );
				}																		   		
             }
			
			//sort by enable,disables at the bottom.
			$scope.colDefs = _.sortBy($scope.colDefs,function(item){return item.enable === false;});
			$scope.colDefs2 = _.sortBy($scope.colDefs2,function(item){return item.enable === false;});
			
			$scope.tableData = data.values;
			
			$scope.gridOptions.data = $scope.tableData;
	        $scope.gridOptions.columnDefs = $scope.colDefs; 
	        
	        $scope.gridOptions2.data = $scope.tableData;
	        $scope.gridOptions2.columnDefs = $scope.colDefs2;
	            		
        });
    };
    
    
    $scope.init = function(){
    	$scope.loadTableData($scope.initialUrl,$scope.requestObject);	
    };
            
    $scope.init();
});
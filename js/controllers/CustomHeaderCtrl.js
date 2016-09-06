angular.module('CustomHeaderCtrl', []).controller('CustomHeaderController', function($scope,$q) {   
	$scope.draggingKey = null;
	var mashupScope = angular.element($(".mashupGeneralContainer")).scope();	
	
	var leftLimit = 344;
	var rightLimit = 1455;
	
	$scope.initialCol = $scope.grid.minColumnsToRender();
	$scope.currentCol = $scope.grid.minColumnsToRender();	
	$scope.maxCols = $scope.grid.columns.length;
	console.log($scope.grid.columns.length);
	$scope.calculating = false;	
	
	$scope.getColIdentifier = function(identifier,enable){
		if(enable){
			return identifier;
		}else{
			return "disabled";
		}
	};
	
	$scope.onBeforeDrop = function(event,drag){
		var target = $scope.colContainer.renderedColumns[$(event.target).attr("custom-index")].colDef;
		var deferred = $q.defer();
		if(target.keyObject){	
			deferred.reject();
		}else{
			deferred.resolve();			
		}			   
	    return deferred.promise; 
	};
	
	$scope.onDropCallback = function(event,drag){		
		if(drag.draggable.hasClass("newKeyDraggable")){	
			console.log(mashupScope.matchingKeysArr);
			var target = $scope.colContainer.renderedColumns[$(event.target).attr("custom-index")].colDef;
			var randomColorKey = randomColor({luminosity: 'dark',hue: 'random'});
			
			var keyHolder = {};
			keyHolder.id = "keyHolderId-" + mashupScope.matchingKeysArr.length;
			
			var guessingKey;
			var identifier = (target.colIdentifier === "originalCol") ? "notOriginalCol" : "originalCol";						
			guessingKey = _.findWhere(mashupScope.colDefs, {colIdentifier : identifier, keyObject : undefined});
			
			target.keyObject = {};			
			guessingKey.keyObject = {};
			
			target.keyObject.key = target.field;			
			target.keyObject.color = randomColorKey;
			target.keyObject.parentId = keyHolder.id;
			
			guessingKey.keyObject.color = randomColorKey;
			guessingKey.keyObject.key = guessingKey.field;
			guessingKey.keyObject.parentId = keyHolder.id;
			
			keyHolder.rigthKey = (target.colIdentifier === "originalCol") ? guessingKey.keyObject : target.keyObject;
    		keyHolder.leftKey = (target.colIdentifier === "notOriginalCol") ? guessingKey.keyObject : target.keyObject;
    		
    		mashupScope.matchingKeysArr.push(keyHolder);    		
    		
    		mashupScope.loadTableData(mashupScope.initialUrl,mashupScope.requestObject);     		
			console.log(mashupScope.matchingKeysArr);
			
			
		}else{
			var origin = $scope.colContainer.renderedColumns[$(drag.draggable).attr("custom-index")].colDef;
			var target = $scope.colContainer.renderedColumns[$(event.target).attr("custom-index")].colDef;
			
			if(origin.field !== target.field){
				target.keyObject = angular.copy(origin.keyObject);
				target.keyObject.key = target.field;
				delete origin.keyObject;
				
				var keyHolder = _.findWhere(mashupScope.matchingKeysArr,{id:target.keyObject.parentId});
				
				if(keyHolder.rigthKey.key === origin.field){
					keyHolder.rigthKey.key = target.keyObject.key;
				}else if(keyHolder.leftKey.key === origin.field){
					keyHolder.leftKey.key = target.keyObject.key;
				}
				
				mashupScope.loadTableData(mashupScope.initialUrl,mashupScope.requestObject);
			}	
		}					
	};
	
	$scope.onDragCallback = function(evt){
		$scope.maxCols = $scope.grid.columns.length;
		console.log(evt.clientX);
//		console.log($scope.currentCol);
//		console.log($scope.maxCols);
		console.log($scope.calculating);
		console.log(evt.clientX <= leftLimit);
		if(evt.clientX >= rightLimit && $scope.currentCol <= $scope.maxCols){			
			$scope.grid.api.cellNav.scrollTo($scope.grid, mashupScope, mashupScope.gridOptions.data[0], mashupScope.gridOptions.columnDefs[$scope.currentCol]);			
			$scope.currentCol += 1;			
		}else if(evt.clientX <= leftLimit && $scope.currentCol >= 0){				
			if($scope.currentCol === $scope.maxCols){
				$scope.currentCol -= 1;
			}						
			$scope.grid.api.cellNav.scrollTo($scope.grid, mashupScope, mashupScope.gridOptions.data[0], mashupScope.gridOptions.columnDefs[$scope.currentCol]);
			$scope.currentCol -= 1;			
		}
		
		if($scope.currentCol === -1){
			$scope.currentCol = 0;
		}
		
		
	};
});

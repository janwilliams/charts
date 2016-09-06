angular.module('DependantFiltersCtrl', []).controller('DependantFiltersController',function($scope, $http,$q,$filter, ngTableParams,InitialSiteService) {
	
	InitialSiteService.hideInitialLoader();
	
	$scope.filtersTableData;
	$scope.loadingMainData = false;
	
	$scope.tags = [];
	
	$scope.generateRandomColors = function(){
		var color = '#'+Math.floor(Math.random()*16777215).toString(16);
		var style = {"background-color":color};
		return style;
	}
	
	$scope.globalTags = [ {text : 'Pete Lasko',ldesc:"PRODUCT DEVELOPMENT",rdesc:"Mgr LVL 1",getChildColor:$scope.generateRandomColors()}, 
	                      {text : 'David Peterson',ldesc:"EXECUTIVE",rdesc:"Mgr LVL 4",getChildColor:$scope.generateRandomColors()},
	                      {text : 'St.Petersburg.',ldesc:"RUSSIA",rdesc:"City",getChildColor:$scope.generateRandomColors()}
	                	];
	
	$scope.search;
	
    $scope.loadTable = function () {

        $scope.loadingMainData = true;

        $http.get('resources/data/filters_sample_data.json').success(function(data) {
            $scope.filtersTableData = data;
            $scope.loadFiles();
        });
       
    }
	
	$scope.loadFiles = function(){
         $scope.loadingMainData = false;
         initializeTable();
    };
    
    $scope.filterTable = function () {
        $scope.tableParams.reload();
    };
    
    function initializeTable(){
        $scope.tableParams = new ngTableParams({
            page: 1,    // show first page
            count: 10, // count per page
            sorting: {
                date: 'asc'
            }
        }, {
            total: $scope.filtersTableData.length,  // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var filteredData = params.filter() ? $filter('filter')($scope.filtersTableData, getFilterObject() ) : $scope.filtersTableData;
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : $scope.filtersTableData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }
    
    function getFilterObject(){
        var result = {};
        result.$ = $scope.search;
        return result;
    }
    
    $scope.onTagAdded = function($tag){
    	$tag.getChildColor = $scope.generateRandomColors();
    	$scope.search = $tag.text;
    	$scope.filterTable();
    }
    
    $scope.onTagRemoved = function($tag){
    	$scope.search = "";
    	$scope.filterTable();
    }
    
	$scope.loadTags = function(query) {
		
		var deferred = $q.defer();
		deferred.resolve($scope.globalTags);
		return deferred.promise;
	};
	
	//browse pop over functionality
	$scope.nodes;
	$scope.isBrowsePopoverOpen = false;
	$scope.currentNode;
	$scope.lastNodes = [];
	$scope.lastNodesIndex = 0;

	$scope.openBrowsePopover = function(event){
		if(!$scope.isBrowsePopoverOpen){
			$('#browsePopover').css("display",'block');
		}else{
			$('#browsePopover').css("display",'none');
		}
		
		if(event !== undefined){
			
			var offsetH = ($('#browsePopover').height() / 2) + 10 ;
			var offsetW = 10;
			var $currentPos = $(event.currentTarget).offset(); 
			$('#browsePopover').css({
				"top":$currentPos.top - $('#browsePopover').height() + offsetH,
				"left":$currentPos.left - $('#browsePopover').width() - offsetW
			});
			
		}
		
		$scope.isBrowsePopoverOpen = !$scope.isBrowsePopoverOpen;
	}
	
	$scope.loadNodes = function(){
		$http.get('resources/data/filters_browse_sample_data.json').success(function(data) {
			$scope.nodes = data;			
			$scope.currentNode = data[0];
		});
	}
	
	$scope.loadChildItems = function(item){
		if(item.items.length > 0){
			$scope.lastNodesIndex++;
			$scope.lastNodes.push($scope.currentNode); 
			$scope.currentNode = item;
		}
	}
	
	$scope.loadPreviousChildItems = function(){
		console.log($scope.lastNodes)
		$scope.lastNodesIndex = $scope.lastNodesIndex -1;
		$scope.currentNode = $scope.lastNodes[$scope.lastNodesIndex]; 
	}
	
	$scope.addItemToTags = function(item){
		var newTag = {};
		newTag.text = item.name;
		$scope.tags.push(newTag);
		$scope.onTagAdded(newTag);
	}
	$scope.itemHaveDescription = function(item){
		return item.description != '' ? true : false;
	}
	//-------------------
	
	$scope.init = function(){
		$scope.loadTable();
		$scope.loadNodes();
	}
	
	$scope.init();
});
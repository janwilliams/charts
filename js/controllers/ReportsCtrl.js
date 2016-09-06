angular.module('ReportsCtrl', []).controller('ReportsController', function ($http,$scope, $filter, ngTableParams, $rootScope,$modal,InitialSiteService,$location) {
	InitialSiteService.hideInitialLoader();
    
	/*
	 * Commenting following code for now may be we can reuse most of it
	 */
	/*
	 * 

	$scope.loadingMainData = true;

    $scope.pageLangs = languageData.pages.reports;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;

    $scope.reports = [];
    $scope.reportsToShow = [];
    $scope.search = "";
    $scope.searchPreview = "";
    $scope.previewReports = [];
    $scope.reportSelectedName = "";

    $scope.selectedReport = {};

    $scope.showPreviewReports = false;

    $scope.datasets = [{label: "All" ,value:"ALL"},{label:"Seen" ,value : true}, {label : "Unseen" ,value : false}];

    $scope.dataset = $scope.datasets[0];

    $scope.files = ["resources/data/0001521432_120631.json","resources/data/0001521432_120554.json"];
    $scope.currentFile = 0;

    $scope.redirect = function(i){
    	if(i===0){
    		$location.url("/datamashup");
    	}else if(i=== 1){
    		$location.url("/executivesummaryreport");
    	}
    };
    
    $scope.loadReport = function () {

        $scope.loadingMainData = true;

        $http.get('resources/data/0001521432_detailed_reports_list.json').success(function(data) {

            $scope.reports = data;

            $scope.loadFiles(function(){
                completeReportsToShow();

                $scope.loadingMainData = false;

                initializeReportsToShowTable();
            });
        });
    }

    $scope.loadFiles = function(callback){
        for(var i = 0; i < $scope.files.length; i++){
            $scope.loadFile(i,function(){
                $scope.currentFile ++;
                if($scope.currentFile === $scope.files.length ){
                    callback();
                }
            });
        }

    };

    $scope.loadFile = function(index,callback){
        $http.get($scope.files[index]).success(function(previewData) {
            completeReportsPreview(previewData);
            callback();
        });
    };

    function completeReportsToShow(){
        for(var i = 0; i < $scope.reports.length; i ++){
            var report = $scope.reports[i];
            var reportToPush = {};

            reportToPush.index = i;
            reportToPush.markAsSeen = true;
            reportToPush.report_name = report.report_name;
            reportToPush.subject_area = report.subject_area;
            reportToPush.status = report.status;
            reportToPush.frequency = report.frequency;
            reportToPush.start_date = report.start_date;
            reportToPush.end_date = report.end_date;
            reportToPush.starred = false;

            $scope.reportsToShow.push(reportToPush);
        }
    };

    function completeReportsPreview(data){
        for(var i = 0; i < data.length; i ++){
            var report = data[i];
            var reportToPush = {};

            reportToPush.report_id = report.report_id;
            reportToPush.transaction_id = report.transaction_id;
            reportToPush.recipient_first_name = report.recipient_first_name;
            reportToPush.proxy_first_name = report.proxy_first_name;
            reportToPush.proxy_last_name = report.proxy_last_name;
            reportToPush.proxy_email = report.proxy_email;
            reportToPush.thank_you_message = report.thank_you_message;
            reportToPush.service_values_and_behaviors = report.service_values_and_behaviors;
            reportToPush.cost_center = report.cost_center;
            reportToPush.job_family_description = report.job_family_description;
            reportToPush.receiver_location_code = report.receiver_location_code;


            $scope.previewReports.push(reportToPush);
        }
    };

    function initializeReportsToShowTable(){
        $scope.tableParams = new ngTableParams({
            page: 1,    // show first page
            count: 10, // count per page
            sorting: {
                status: 'asc'
            }
        }, {
            total: $scope.reports.length,  // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var filteredData = params.filter() ?
                    $filter('filter')($scope.reportsToShow, getFilterObject()) :
                    $scope.reportsToShow;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.reportsToShow;

                if($scope.search !== ""){
                    var filteredPreview = $filter('filter')($scope.previewReports, {$:$scope.search});
                    if(filteredPreview.length > 0){

                        var uniqueIds = _.chain(filteredPreview)
                            .pluck('report_id')
                            .flatten()
                            .unique()
                            .value();
                        var filteredReports = [];
                        for(var i = 0; i < uniqueIds.length; i ++){
                            filteredReports = $filter('filter')($scope.reports, {report_id:uniqueIds[i]});
                            if(filteredReports.length > 0){
                                var report = filteredReports[0];
                                report.index = $scope.reports.indexOf(report);
                                report.starred = true;
                                orderedData.push(report);
                            }
                        }
                    }
                }

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }

    function getFilterObject(){
        var result = {};
        result.$ = $scope.search;

        if($scope.dataset.value === false || $scope.dataset.value === true){
            result.markAsSeen = $scope.dataset.value;
        }
        return result;
    }

    $scope.openPreview = function(report,event){
        if ( !$( event.target ).is( ":button" ) && !$( event.target ).hasClass("btn")) {
            $scope.selectedReport = report;
            $scope.reportSelectedName = report.report_name;

            var previewDialogOpts = {
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'preview.html',
                controller: PreviewController,
                size : "lg",
                scope : $scope,
                windowClass : "previewModalContainer"
            };

            var d = $modal.open(previewDialogOpts);
        }
    };

    $scope.openDownload = function(report,event){
        event.stopPropagation();
        $scope.selectedReport = report;
        $scope.reportSelectedName = report.report_name;

        var previewDialogOpts = {
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'download.html',
            controller: DownloadController,
            scope : $scope
        };

        var d = $modal.open(previewDialogOpts);

    };

    $scope.FilterReport = function () {
        $scope.tableParams.reload();
    };

    $scope.loadReport();

    var PreviewController = function($modalInstance){

        $scope.searchPreview = "";

        $scope.loading = true;

        $scope.filteredReports = [];

        $scope.init = function(){

            $scope.filteredReports  = $filter('filter')($scope.previewReports, {report_id:$scope.reports[$scope.selectedReport.index].report_id});

            if($scope.filteredReports.length > 0){
                $scope.showPreviewReports = true;
            }

            $scope.loading = false;

            $scope.initializeReportsPreviewTable();
            $scope.maxSize = $scope.previewTableParams.count();
            $scope.bigTotalItems =  $scope.previewTableParams.total();
            $scope.currentPage = 1;
        };

        $scope.FilterPreviewReport = function (text) {
            $scope.searchPreview = text;
            $scope.previewTableParams.reload();
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
            $scope.showPreviewReports = false;
            $scope.reportSelectedName = "";
            $scope.selectedReport = {};
        };

        $scope.setPage = function (pageNo) {
            $scope.previewTableParams.page(pageNo);

        };

        $scope.initializeReportsPreviewTable = function(){
            $scope.previewTableParams = new ngTableParams({
                page: 1,    // show first page
                count: 10, // count per page
                sorting: {
                    nominee_first_name: 'asc'     // initial sorting
                }
            }, {
                total: $scope.filteredReports.length,
                getData: function($defer, params) {
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.filteredReports, {$:$scope.searchPreview}) :
                        $scope.filteredReports;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.filteredReports;
                    params.total(orderedData.length); // set total for recalc pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }
        $scope.init();
    };

    var DownloadController = function($modalInstance){

        $scope.init = function(){
        	
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
        };

        $scope.init();
    };
    */
    $scope.share = "/resources/img/share.png";
    $scope.edit = "/resources/img/edit.png";
    $scope.deleteImage = "/resources/img/delete.png";

    $scope.onEditClicked = function(row){
    	if(row.rowIndex === 0){
    		$location.path("/datamashup");
    	}else if(row.rowIndex === 1){
    		$location.path("/executivesummaryreport");
    	}
    };
    
    $http({
        url: "/secure/getReports",
        method: "POST",
        data: JSON.stringify({"queryName": "report_budget"})
    }).success(function(data, status, headers, config) {
    	$scope.reportsData = data.values;
    	$scope.gridOptions.footerTemplate = '<div style="width: 200px; display: inline-block;">one</div><div style="width: 200px; display: inline-block;">32</div><div style="width: 200px; display: inline-block;">43</div>';
    	$scope.gridOptions.showFooter = true;
    }).error(function(data, status, headers, config) {
      console.log(status);
    });

    
    $scope.reportsData = [{}];

  	$scope.gridOptions = {
  		enableSorting: false,
        data: 'reportsData',
  		visible:false,
        enableCellSelection: false,
        enableRowSelection: false,
  		headerRowTemplate: '<div ng-style="{ height: col.headerRowHeight }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngHeaderCell"><div ng-header-cell></div></div>',
        columnDefs: [{ field: "REPORT_NAME",displayName: 'REPORT NAME', width: 280 },
                      { field: "AUTHOR",displayName: 'AUTHOR', width: 140 },
                      { field: "CREATED",displayName: 'CREATED', width: 140 },
                      { field: "SCHEDULED", displayName: 'SCHEDULED',width: 200 },
  				      { field: "LAST_RUN",displayName: 'LAST RUN', width: 130 },
                      { field: "NEXT_RUN", displayName: 'NEXT RUN',width: 130 },
  					  { cellClass: 'cellToolTip', field: "action", displayName: 'ACTION',width: 95, cellTemplate: '<div class="ngCellText"><img class="popoverShow small-img" data-placement="top" data-toggle="popover" original-title="popover" ng-bind="row.getProperty(col.field)" action="share" ng-src="{{share}}"/> <img ng-click = "onEditClicked(row)" class="small-img-1" ng-bind="row.getProperty(col.field)" action="edit" ng-src="{{edit}}"/><img ng-click = "foo($event)" class="small-img-2" ng-bind="row.getProperty(col.field)" action="delete" ng-src="{{deleteImage}}"/></div>'}]
      };

      setTimeout(function(){
    	  $('body').on('click', function (e) {
              if (!$(e.target).hasClass("popoverShow") && (!$(e.target).parents().hasClass("popover") && !$(e.target).parents().hasClass('in'))) {
                  $('.popoverShow').popover('hide');
              }
          });
          $(".popoverShow").popover({
	              html: true,
	              placement: "left",
	              container:".body-wapper",
	              content: function() { 
	              $(".popover.in").each(function(){	
	                  $($(this).siblings(".popoverShow")[0]).popover("hide");
	              });
	
	              $(".popover-content").html("");
	              return $('#popover-content').html();
	          },
	          title: function () {
	              return '<h4>Share "Money And Stuff" Activity Report</h4>';
	          }
          });
      }, 1000);
});
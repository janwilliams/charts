angular.module('ZoomActivityChartCtrl', []).controller('ZoomActivityChartsController', ['$scope', 'ZoomDataSvc', 'SeacrhService','InitialSiteService', function($scope, zoomDataSvc, SeacrhService,InitialSiteService) {
	InitialSiteService.hideInitialLoader();
	$scope.dictionary = languageData.dictionary;
	var dataSchema = [
                {type: "date", name: "date", format:"([0-9]+)", fields: [1,2,3], process: [null, null, function(a){return 0}, function(a){return 1}]},
                {type: "decimal", name: "id"},
                {type: "string",  name: "user_fname"},
                {type: "string",  name: "user_lname"},
                {type: "decimal", name: "manager_id"},
                {type: "string",  name: "manager_fname"},
                {type: "string",  name: "manager_lname"},
                {type: "decimal", name: "len"},
                {type: "decimal", name: "enomination"},
                {type: "decimal", name: "ecard"},
                {type: "decimal", name: "ebutton"},
                {type: "decimal", name: "mecard"},
                {type: "decimal", name: "mebutton"},
                {type: "decimal", name: "u_enomination"},
                {type: "decimal", name: "u_ecard"},
                {type: "decimal", name: "u_ebutton"},
                {type: "decimal", name: "u_mecard"},
                {type: "decimal", name: "u_mebutton"}
            ];

    $scope.api = zoomDataSvc.getZoomDataApi($("#zoom-chart").attr("data-src"), dataSchema);
    $scope.top_manager_fname = "Richard";
    $scope.top_manager_lname = "Davis";
    $scope.top_manager_id = $scope.manager_id = "2660426";
    $scope.year = 2014;
    $scope.month = null; 
    $scope.week = null;
    $scope.path = [];
    $scope.searchKeys = ["user_fname"];
    $scope.searchAppendKey = "user_lname";
    $scope.sumKey = [" ", "user_fname", "user_lname"];
    $scope.searchInstance = SeacrhService.getSearchInstance();
    if (!$scope.searchEvent){
        $scope.searchEvent = function(){};
    }
    $scope.seriesData = [
                {id: "r_enomination", name: "ENomination", data: {field: "enomination"}, stack: "reach", style: {fillColor: "#00D6FF"}},
                {id: "r_ecard",  name: "ECard", data: {field: "ecard"}, stack: "reach", style: {fillColor: "#FF8100"}},
                {id: "r_ebutton",  name: "EButton", data: {field: "ebutton"}, stack: "reach", style: {fillColor: "#22B38C"}}
            ];

    $scope.hideStacks = true;
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
}]);
angular.module('ReportsCreationCtrl', []).controller('ReportsCreationController', function ($scope, $sce, $filter, ngTableParams, $rootScope, $window, $location, checkValidation,InitialSiteService) {
	InitialSiteService.hideInitialLoader();
    $rootScope.addRpt = false;
    $scope.reportShown = true;
    $scope.endResult = {};
    $scope.endResult = {
        reportGenDate:'',
        reportGenTimes:'',
        schedulingTime:'',
        manualRange: '',
        manualRangeEntry: '',
        dayId: '',
        reportName: '',
        reportType: '',
        schedulingType: '',
        reportGenerationType : '',
        monthDate :'',
        yearDate : '',
        scheduleType:'',
        schedulingTimeErrorFlag:''
        //reportMonthSel:'',
    };
    
    $scope.pageLangs = languageData.pages.login;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
    
    $scope.modalShown = false;

    $scope.steps = [{text : "Report Information",index : 1},{text : "Report Time Period",index : 2},{text : "Apply Filters",index : 3}];
    $scope.currentStep = $scope.steps[0];

    $scope.nextStep = function(){
        $scope.currentStep = $scope.steps[$scope.steps.indexOf($scope.currentStep) + 1];
        $scope.$apply();
    }

    $scope.prevStep = function(){
        $scope.currentStep = $scope.steps[$scope.steps.indexOf($scope.currentStep) - 1];
        $scope.$apply();
    }

    $scope.initSteps = function(){
        $scope.currentStep = $scope.steps[0];
    }

    $scope.initSteps();

    // start time picker
    //$scope.endResult.schedulingTime = new Date().time;
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.scheduledTimePicker = function () {
        if(!$scope.endResult.schedulingTime){
            $scope.endResult.schedulingTimeErrorFlag = true;
        }



    };
    // end time picker

    $scope.reportTypes = [
        {id: 'type1', title: "Activity"  },
        {id: 'type2', title: "Budget" },
        {id: 'type1', title: "Payroll"  },
        {id: 'type1', title: "Reach and Utilization"  }
    ];

    function errorMessage(inValidElements){
        var errMsg = inValidElements.join(' , ');
        if (inValidElements.length === 1) {
            errMsg = errMsg;
            //errMsg = ' a ' + errMsg;
        }
        else {
            var pos = errMsg.lastIndexOf(',');
            errMsg = errMsg.substring(0, pos) + 'and' + errMsg.substring(pos + 1);
        }
        return 'Please specify ' + errMsg+'.';
    }

    $scope.datasets = ["Seen", "Unseen"];

    $scope.Emails = ["abc@yopmail.com",
        "appel@yopmail.com",
        "arial@yopmail.com",
        "bca@yopmail.com",
        "bell@yopmail.com",
        "bcd@yopmail.com",
        "com@yopmail.com",
        "cam@yopmail.com",
        "crook@yopmail.com",
        "dca@yopmail.com",
        "dml@yopmail.com",
        "dk@yopmail.com",
        "echo@yopmail.com",
        "excel@yopmail.com",
        "email@yopmail.com",
        "frend@yopmail.com",
        "fake@yopmail.com",
        "fish@yopmail.com",
        "go@yopmail.com",
        "goa@yopmail.com",
        "gone@yopmail.com",
        "hike@yopmail.com",
        "hide@yopmail.com",
        "hello@yopmail.com",
        "ill@yopmail.com",
        "iab@yopmail.com",
        "ink@yopmail.com",
        "joker@yopmail.com",
        "joke@yopmail.com",
        "jail@yopmail.com",
        "kbc@yopmail.com",
        "kkk@yopmail.com",
        "kcv@yopmail.com",
        "lal@yopmail.com",
        "lake@yopmail.com",
        "less@yopmail.com",
        "make@yopmail.com",
        "memo@yopmail.com",
        "mak@yopmail.com",
        "neno@yopmail.com",
        "name@yopmail.com",
        "net@yopmail.com",
        "ok@yopmail.com",
        "oml@yopmail.com",
        "ong@yopmail.com",
        "pen@yopmail.com",
        "pack@yopmail.com",
        "pull@yopmail.com",
        "qc@yopmail.com",
        "qa@yopmail.com",
        "qb@yopmail.com",
        "renk@yopmail.com",
        "radio@yopmail.com",
        "ra@yopmail.com",
        "sam@yopmail.com",
        "son@yopmail.com",
        "shok@yopmail.com",
        "tm@yopmail.com",
        "tell@yopmail.com",
        "tom@yopmail.com",
        "uk@yopmail.com",
        "ua@yopmail.com",
        "up@yopmail.com",
        "vell@yopmail.com",
        "vs@yopmail.com",
        "vk@yopmail.com",
        "wq@yopmail.com",
        "wake@yopmail.com",
        "was@yopmail.com",
        "xa@yopmail.com",
        "xb@yopmail.com",
        "xc@yopmail.com",
        "ya@yopmail.com",
        "yc@yopmail.com",
        "yl@yopmail.com",
        "zoom@yopmail.com",
        "zk@yopmail.com",
        "zx@yopmail.com"];


    $scope.onDataBindComplete = "onDataBindComplete";
    angular.element('#emailSucessMessageDiv').hide();

    //$scope.$on($scope.onDataBindComplete, function (ngRepeatFinishedEvent) {

    //    var report = angular.element('#reportTable');

    //    // Loading data to table.
    //    report.dataTable();

    //    //Show report table.
    //    report.show();

    //    //Hiding wait div.
    //    angular.element('#waitDiv').hide();

    //	angular.element('#btnDiv').show();

    //});

    $scope.cancelReportCreate = function () {
        $scope.endResult = {};
        $scope.value = '';
        $scope.reportInit = false;
        var carousel = $("#steps-form");
        carousel.trigger('owl.jumpTo', 0);
        $scope.currentStep = $scope.steps[0];

    };















    /*$scope.submitReportInfo = function(){
     $scope.reportInfoPop = false;
     $scope.scheduleInfoPop = false;
     $scope.submitReportInfoPop();
     if($scope.reportInfoPop){

     $scope.submitSchedule();
     }


     //$scope.submitSchedule();
     }*/

    // get the report name and report type
    $scope.submitReportInfoPop_0 = function () {

        $scope.errMsg = '';
        // assumes none of invalid elements contains a comma (,) or a dot (.)
        var inValidElements = [];
        $scope.formValid = true;
        if (!$scope.endResult.reportName) {
            $scope.formValid = false;
            $scope.reportInit = true;
            inValidElements.push("report name");
        }

        if (!$scope.endResult.reportType) {
            $scope.formValid = false;
            $scope.reportInit = true;
            inValidElements.push("report type");
        }

        if (!inValidElements.length) {
            $scope.reportInfoPop = true;
            // closeModal('#myModal');
            // toggleModal();
        }
        else {
            /*var errMsg = inValidElements.join(' , ');
             if (inValidElements.length === 1) {
             errMsg = ' a ' + errMsg;
             }
             else {
             var pos = errMsg.lastIndexOf(',');
             errMsg = errMsg.substring(0, pos) + '&' + errMsg.substring(pos + 1);
             }*/
            $scope.errMsg = errorMessage(inValidElements);
        }
    };



    $scope.change = function (option) {
    };

    $scope.actOnBsModal = function (id, action) {
        if (id && action) {
            angular.element('#' + id).modal(action);
        }
    };

    $scope.reportModal = function () {
        angular.element('#myModal').modal('show');
    };

    function closeModal(id) {
        angular.element(id).modal('toggle');
        angular.element.removeData(id);
        $scope.currentStep = $scope.steps[0];
    }

    function toggleModal() {
        $scope.currentStep = $scope.steps[0];
        angular.element('#showmodal').modal('show');
    }
    
    // get the scheduling type
    $scope.newValue = function (value) {
        $scope.errMsg = '';
        $scope.errMsgManualRange = '';
        $scope.endResult.schedulingType = value;

    };
    $scope.reportGenType = function (value) {
        $scope.endResult.reportGenerationType = value;
    };

    $scope.submitReportList = function () {
        $scope.reportList = true
    }

    // submit schedule type

    $scope.submitSchedule = function () {

        //var info = "Report Name:"+$scope.endResult.reportName;
        //endResult = JSON.stringify($scope.endResult);

        var inValidElements = [];

        if (!$scope.endResult.schedulingType) {
            $scope.errMsg = "Please specify a report schedule";
            return;
        }
        $scope.sheduleForum = true;
        if ($scope.endResult.schedulingType === "manual") {

            if (!$scope.endResult.manualRangeEntry) {
                $scope.sheduleForum = false;
                inValidElements.push(" time period");
            }
            else{
                var numberCheck = checkValidation.numberCheck($scope.endResult.manualRangeEntry);
                if(numberCheck){
                    $scope.sheduleForum = false;
                    inValidElements.push("valid time period");
                }

            }

            if (!$scope.endResult.manualRange) {
                $scope.sheduleForum = false;
                inValidElements.push("range quantity");
            }




            //$scope.errMsgManualRange = errorMessage(inValidElements);
        }
        else {
            if(!$scope.endResult.manualRangeSchedulDay && !$scope.endResult.schedulingTime && !$scope.endResult.reportGenerationType) {
                $scope.sheduleForum = false;
                inValidElements.push(" a report schedule");
            }
            else {


                if (!$scope.endResult.manualRangeSchedulDay) {
                    $scope.sheduleForum = false;
                    inValidElements.push("scheduling time ");
                }
                else{
                    var manualRangeEntrySchedulDay = checkValidation.numberCheck($scope.endResult.manualRangeSchedulDay);
                    if(manualRangeEntrySchedulDay){
                        $scope.sheduleForum = false;
                        inValidElements.push(" valid scheduling time");
                    }
                }

                if($scope.endResult.scheduleType){
                    if($scope.endResult.scheduleType == 'day'){

                        if(!$scope.endResult.schedulingTime){
                            if($scope.endResult.schedulingTimeErrorFlag)
                            {
                                $scope.sheduleForum = false;
                                inValidElements.push("a valid scheduling time ");
                            }
                            else{
                                $scope.sheduleForum = false;
                                inValidElements.push(" scheduling time ");
                            }
                        }

                    }

                    else if($scope.endResult.scheduleType == 'week'){
                        for (var k in $scope.selections.ids) {
                            if (!$scope.selections.ids.hasOwnProperty(k)) continue;
                            if ($scope.selections.ids[k] == false) {
                                $scope.sheduleForum = false;
                                inValidElements.push(" day ");
                            }
                            // else{
                            //   inValidElements.pop();
                            // }
                        }
                        if(!$scope.endResult.schedulingTime){
                            if($scope.endResult.schedulingTimeErrorFlag)
                            {
                                $scope.sheduleForum = false;
                                inValidElements.push("a valid scheduling time ");
                            }
                            else{
                                $scope.sheduleForum = false;
                                inValidElements.push(" scheduling time ");
                            }
                        }
                    }

                    // else if($scope.endResult.scheduleType == 'week'){

                    //     if(!$scope.selections){
                    //         inValidElements.push(" day ");
                    //     }
                    //     if(!$scope.endResult.schedulingTime){
                    //         inValidElements.push(" scheduling time ");
                    //     }
                    // }

                    // else if($scope.endResult.scheduleType == 'week'){

                    //     if(!$scope.selections){
                    //         inValidElements.push(" day ");
                    //     }
                    //     if(!$scope.endResult.schedulingTime){
                    //         inValidElements.push(" scheduling time ");
                    //     }
                    // }
                    else if($scope.endResult.scheduleType == 'month'){

                        if(!$scope.endResult.monthDate){
                            $scope.sheduleForum = false;
                            inValidElements.push(" on which day ");
                        }
                        else{
                            var manualRangeEntryMonthDate = checkValidation.numberCheck($scope.endResult.monthDate);
                            if(manualRangeEntryMonthDate){
                                $scope.sheduleForum = false;
                                inValidElements.push(" day as number");
                            }
                            else if($scope.endResult.monthDate > 31 || $scope.endResult.monthDate < 1){
                                $scope.sheduleForum = false;
                                inValidElements.push(" number between 1 and 31");
                            }
                            else{
                                $scope.endResult.monthDate = parseInt($scope.endResult.monthDate)
                            }

                        }
                        if(!$scope.endResult.schedulingTime){
                            if($scope.endResult.schedulingTimeErrorFlag)
                            {
                                $scope.sheduleForum = false;
                                inValidElements.push("a valid scheduling time ");
                            }
                            else{
                                $scope.sheduleForum = false;
                                inValidElements.push(" scheduling time ");
                            }

                        }
                    }

                    else if($scope.endResult.scheduleType == 'year'){
                        if(!$scope.endResult.month && !$scope.endResult.date){
                            $scope.sheduleForum = false;
                            inValidElements.push(" the date ");
                        }
                        var manualRangeEntrySchedulDay = checkValidation.numberCheck($scope.endResult.manualRangeSchedulDay);
                        if(manualRangeEntrySchedulDay){
                            $scope.sheduleForum = false;
                            inValidElements.push(" number");
                        }

                        if($scope.endResult.date) {
                            inValidElements.pop();
                            var numberCheck = checkValidation.numberCheck($scope.endResult.date);
                            if(numberCheck){
                                $scope.sheduleForum = false;
                                inValidElements.push("a valid date");
                            }

                            else {
                                if($scope.endResult.month) {
                                    var currentMonth;
                                    var monthArray =  [
                                        {id: 0, name: 'Jan'},
                                        {id: 1, name: 'Feb'},
                                        {id: 2, name: 'Mar'},
                                        {id: 3, name: 'Apr'},
                                        {id: 4, name: 'May'},
                                        {id: 5, name: 'Jun'},
                                        {id: 6, name: 'Jul'},
                                        {id: 7, name: 'Aug'},
                                        {id: 8, name: 'Sep'},
                                        {id: 9, name: 'Oct'},
                                        {id: 10, name: 'Nov'},
                                        {id: 11, name: 'Dec'}
                                    ];
                                    for(var i in monthArray) {
                                        if( monthArray[i].name ==  $scope.endResult.month) {
                                            currentMonth =  monthArray[i].id;
                                        }

                                    }
                                    var date = new Date();
                                    var firstDay = new Date(date.getFullYear(), currentMonth, 1).getDate();
                                    var lastDay = new Date(date.getFullYear(), currentMonth + 1, 0).getDate();

                                    if($scope.endResult.date < firstDay || $scope.endResult.date > lastDay ){
                                        $scope.sheduleForum = false;
                                        inValidElements.push(" valid date ");
                                    }

                                    /* if($scope.endResult.month == 'Feb') {
                                     var date = new Date();
                                     var year = date.getFullYear();
                                     if(leapYear(year) == "false") {
                                     if($scope.endResult.date > 29) {
                                     inValidElements.push(" valid date ");
                                     }
                                     }
                                     else if($scope.endResult.date > 28) {
                                     inValidElements.push("the number below 29");
                                     }
                                     }
                                     else {
                                     if($scope.endResult.date > 31) {
                                     inValidElements.push("number below 31");
                                     }
                                     }
                                     */
                                }
                            }



                            // else {
                            //     if($scope.endResult.month) {
                            //         if($scope.endResult.month == 'Feb') {
                            //             var date = new Date();
                            //             var year = date.getFullYear();
                            //             if(leapYear(year) == "false") {
                            //                 if($scope.endResult.date > 29) {
                            //                     inValidElements.push(" valid date ");
                            //                 }
                            //             }
                            //             else if($scope.endResult.date > 28) {
                            //                 inValidElements.push("the number below 29");
                            //             }
                            //         }
                            //         else {
                            //             if($scope.endResult.date > 31) {
                            //                 inValidElements.push("number below 31");
                            //             }
                            //         }
                            //     }
                            // }



                        }

                        if(!$scope.endResult.schedulingTime){
                            if($scope.endResult.schedulingTimeErrorFlag)
                            {
                                $scope.sheduleForum = false;
                                inValidElements.push("a valid scheduling time ");
                            }
                            else{
                                $scope.sheduleForum = false;
                                inValidElements.push(" scheduling time ");
                            }
                        }
                        if(!$scope.endResult.month) {
                            $scope.sheduleForum = false;
                            inValidElements.push(" the month ");
                        }
                    }


                }
                else{
                    $scope.sheduleForum = false;
                    inValidElements.push("scheduling type ");
                }


                if($scope.endResult.reportGenerationType){

                    if ($scope.endResult.reportGenerationType == 'times' && !$scope.endResult.reportGenTimes) {
                        $scope.sheduleForum = false;
                        inValidElements.push("report generation times ");
                    }
                    else if($scope.endResult.reportGenerationType == 'times' && $scope.endResult.reportGenTimes) {
                        var manualRangeEntryCheck = checkValidation.numberCheck($scope.endResult.reportGenTimes);
                        if(manualRangeEntryCheck){
                            $scope.sheduleForum = false;
                            inValidElements.push(" number");
                        }
                    }
                    else if ($scope.endResult.reportGenerationType == 'until' && !$scope.endResult.reportGenDate) {
                        $scope.sheduleForum = false;
                        inValidElements.push("report generation date ");
                    }
                    else if ($scope.endResult.reportGenerationType == 'until' && $scope.endResult.reportGenDate) {
                        $scope.endResult.reportGenDate = new Date($scope.endResult.reportGenDate)
                        var year = $scope.endResult.reportGenDate.getFullYear()+"";
                        var month = ($scope.endResult.reportGenDate.getMonth()+1)+"";
                        var day = $scope.endResult.reportGenDate.getDate()+"";
                        $scope.endResult.reportGenDate = year + "-" + month + "-" + day;
                        //$scope.endResult.reportGenDate = new Date($scope.endResult.reportGenDate)

                    }
                }
                else{
                    $scope.sheduleForum = false;
                    inValidElements.push("report generation count ");
                }





            }

        }

        //$scope.errMsgManualRangeSchedule = errorMessage(inValidElements);

        if (!inValidElements.length) {
            $scope.errMsgManualRange = '';
            //alert(JSON.stringify($scope.endResult));
        }
        else{
            $scope.errMsgManualRange = errorMessage(inValidElements);
        }
    };



    $scope.runschedules = [
        {id: '1', name: 'hour(s)'},
        {id: '2', name: 'day(s)'},
        {id: '3', name: 'week(s)'},
        {id: '4', name: 'month(s)'},
        {id: '5', name: 'year(s)'}
    ];

    $scope.selectedRunschedule = function (runscheduleType) {

        $scope.runReport = runscheduleType;
        $scope.errMsgManualRangeSchedule = '';
        $scope.endResult.dayId = runscheduleType;

    };


    $scope.reportMonthSelection = [
        {id: '1', name: 'Jan'},
        {id: '2', name: 'Feb'},
        {id: '3', name: 'Mar'},
        {id: '4', name: 'Apr'},
        {id: '5', name: 'May'},
        {id: '6', name: 'Jun'},
        {id: '7', name: 'Jul'},
        {id: '8', name: 'Aug'},
        {id: '9', name: 'Sep'},
        {id: '10', name: 'Oct'},
        {id: '11', name: 'Nov'},
        {id: '12', name: 'Dec'}
    ];


    // $scope.selectedMonth = function (selMonth) {

    //     $scope.endResult.reportMonthSel = selMonth;
    //     alert($scope.endResult.reportMonthSel)

    // };



    $scope.selections = {
        ids: {"monday": true}
    };

    $scope.days = [
        { "name": "monday", "id": "1" } ,
        { "name": "tuesday", "id": "2" } ,
        { "name": "wednesday", "id": "3" } ,
        { "name": "thursday", "id": "4" } ,
        { "name": "friday", "id": "5" } ,
        { "name": "saturday", "id": "6" } ,
        { "name": "sunday", "id": "7" }
    ];

    // using for manual sheduling options
    $scope.ranges = [
        {id: '1', name: 'month(s)'},
        {id: '2', name: 'year(s)'}
    ];

    $scope.reportGenerationTime = [
        {id: '1', name: 'indefinitely'},
        {id: '2', name: 'times'},
        {id: '3', name: 'until'}

    ];

    $scope.selectedRange = function (rangeType) {
        $scope.endResult.manualRange = rangeType;
    };



    // start date picker

    //$scope.formData = {} ;
    $scope.datepickers = {
        yearDate: false,
        reportGenDate: false
    }
    // $scope.todayReport = function() {
    //   $scope.endResult.yearDate = new Date();
    //   $scope.endResult.reportGenDate = new Date();
    // };
    //$scope.todayReport();
    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.yearDate = null;
    };

    // Disable weekend selections
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openReprtDate = function($event, which) {
        if (which == 'yearDate'){
            $scope.format = $scope.formats[3];
        }
        else{
            $scope.format = $scope.formats[1];
        }

        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which]= true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate','dd-MM'];
    //$scope.format = $scope.formats[0];
    //  end date picker

    $scope.previousSlide = function() {
        $scope.errMsg = '';
    };


    // Report Data for preview report
    $scope.previewData = reportPreviewData;
    $scope.typeAheadData = [];
    $scope.optionsSelect = [{ key : "NOMINEE_FIRST_NAME", name : "First Name"},
                            { key : "NOMINEE_FIRST_NAME", name : "Last Name"},
                            { key : "NONINEE_SHIPPING_CITY", name : "City"},
                            { key : "NONINEE_SHIPPING_STATE", name : "State"}];

    $scope.setTypeAheadSource = function(){
        var i = 0, tempData, tempArray = [];
        var type = $("#filterreport").val();
        $scope.typeAheadData = [];
        if (type === undefined ){
            type = "NOMINEE_FIRST_NAME" ;
        } 
        for (i = 0; i < reportPreviewData.length; i ++){
            tempData = {};
            tempData.fname = reportPreviewData[i][type];

            if (tempArray.indexOf(tempData.fname) < 0){
                tempArray.push(tempData.fname);
                $scope.typeAheadData.push(tempData);
            }
        }
    }

    var filterdata = function(apply){
        var i, filterz = $("#reportPTags").find("li");
        if (filterz.length > 0){
            $scope.previewData = [];
        }
        else{
            $scope.previewData = reportPreviewData;
        }
        for (i = 0; i < filterz.length; i++){
            for (j = 0; j < reportPreviewData.length; j++){
                if ($(filterz[i]).attr("val") === reportPreviewData[j][$(filterz[i]).attr("type")]){
                    $scope.previewData.push(reportPreviewData[j]);
                }
            }
        }


        $scope.previewDataTable.total($scope.previewData.length);
        $scope.previewDataTable.reload();
        try{
            if (apply){
                $scope.$root.$apply();
            }
        }catch(e){
            console.log("NG digest in progress");
        }
    };

    $scope.createTag = function(a, b ,c){
        var elem = $("<li>")
        .attr("class", "tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable");
        
        var span = $("<span>").addClass("tagit-label").text($(".dropdown-menu li.active").text().trim());
        var close = $('<a class="tagit-close"><span class="text-icon">×</span><span class="ui-icon ui-icon-close"></span></a>');
        
        elem.append(span);
        elem.append(close);
        elem.attr("val", $(".dropdown-menu li.active").text().trim());
        elem.attr("type", $("#filterreport").val());
        $("#reportPTags").append(elem);
        $(close).click(function(){
            $(this).closest("li").remove();
            filterdata(true);
        });
        filterdata();
    };

    $scope.setTypeAheadSource();

    $scope.previewDataTable = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.previewData.length, // length of data
        getData: function($defer, params) {
            $defer.resolve($scope.previewData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });



});

// Fn for checking leap year.
function leapYear (year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}



// factory use for validations (numberCheck : use for number validation)
app.factory('checkValidation', function () {
    return {
        numberCheck: function (inputValue) {
            if(isNaN(inputValue)){
                return 1
            }

        }

    }
});

// new design slider start
//var tt = "yyy"
app.directive('sliderDirective', [ function () {
    return {
        restrict: 'A',
        scope: 'new',
        link: function (scope, element,attr) {
            element.owlCarousel({
                navigation : true, // Show next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem:true,
                mouseDrag : false,
                touchDrag : false,
                beforeMove: moved,
                afterMove:  classAdding,
                afterAction : afterAction

                // "singleItem:true" is a shortcut for:
                // items : 1,
                // itemsDesktop : false,
                // itemsDesktopSmall : false,
                // itemsTablet: false,
                // itemsMobile : false
            });


            //Custom Navigation Events
            angular.element(".continue").click(function(){
                var form_no = 0;
                var owl = angular.element(".owl-carousel").data('owlCarousel');
                form_no = owl.currentItem;
                //console.log($(element).find('#form_'+form_no).attr('valid'))
                //console.log($(element).find('#form_'+form_no).attr('confirm-action'))
                var action = element.find('#form_'+form_no).attr('confirm-action');
                scope.$apply(action);
                var isFormValid = element.find('#form_'+form_no).attr('valid');

                if(isFormValid == 'true'){
                    scope.nextStep();
                    element.trigger('owl.next');
                }

            });
            angular.element(".preButton").click(function() {
                element.trigger('owl.prev');
                scope.prevStep();
            });

            // when slider moved - pre -next button adding
            function moved() {
                var owl = angular.element(".owl-carousel").data('owlCarousel');
                if (owl.currentItem + 1 === owl.itemsAmount) {

                    angular.element(".continue").hide();

                }else{
                    angular.element(".continue").fadeIn();
                }
                if( owl.currentItem > 0 ){
                    angular.element(".preButton").show();
                }else{
                    angular.element(".preButton").hide();
                }
            }

            // pre class Adding
            function classAdding(){
                var prevItem = this.prevItem;
                var currentItem = this.currentItem -1;
                var owl = angular.element(".owl-carousel").data('owlCarousel');
                angular.element(".owl-carousel").find(".owl-item").removeClass("prevItem").eq(currentItem).addClass("prevItem");
                angular.element('.preButton').height( angular.element(".owl-carousel").find(".owl-item").eq(currentItem).height() );
            }

            function afterAction(){ 
                if ($('#reportPreviewTable .glyphicon-remove').length < 1 && this.owl.currentItem === 2){
                    $('#reportPreviewTable').dragtable();
                    $('#reportPreviewTable th').css("cursor", "move");
                    /*$('#reportPreviewTable th').each(function(index){
                        var parent = $(this).find("div:first");
                        var elem = $('<span class="pull-right" index="' + index + '"><i class="glyphicon glyphicon-remove"></i></span>');
                        $(parent).append(elem);
                        $(elem).click(function(){
                            var tdIndex = $(this).attr("index");
                            $('#reportPreviewTable tr').each(function(){
                                $(this).remove(":nth-child(" + tdIndex + ")");
                            });
                        });
                    });*/
                }
                updateResult(".owlItems", this.owl.owlItems.length);
                updateResult(".currentItem", this.owl.currentItem);
                updateResult(".prevItem", this.prevItem);
                updateResult(".visibleItems", this.owl.visibleItems);
                updateResult(".dragDirection", this.owl.dragDirection);
            }

            function updateResult(pos,value){
            }

            // carousel jumTo first item (when popup re open time)

            element.trigger('owl.jumpTo', 0);
        }
    };
}]);
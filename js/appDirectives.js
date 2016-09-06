
angular.module('appDirectives', [])
.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var prevDisp = element.css('display');
            $rootScope.$watch('user.role', function(role) {
                if(!Auth.authorize($rootScope.userRoles[attrs.accessLevel])){
                    //element.css('display', 'none');
                }
                else{
                    //element.css('display', prevDisp);
                }
            });
        }
    };
}])

.directive('customTable', function($compile) {
    return {
        restrict: 'E',
        scope: true,
        priority: 1002,
        compile: function (element) {
            return function (scope, element, attrs) {

                var loaded = false;

                scope.$watch(attrs.data,function(){
                    if(!loaded){
                        if(scope[attrs.data].length > 0){
                            loaded = true;
                            var html = '<table custom-draggable-table data-ng-table="previewTableParams" template-pagination="custom/pager" class="table table-striped table-hover" id="reportTablePreview" export-csv="csv">';
                            html += '<tr ng-repeat="row in $data">';
                            for(var i = 0; i <  scope[attrs.columns].length; i++){
                                html+= '<td data-title="\''+scope[attrs.columns][i].value+'\'" sortable="\''+scope[attrs.columns][i].colName+'\'" filter="{ \''+scope[attrs.columns][i].colName+'\': \'text\' }">';
                                html+= '<span>{{row[\''+scope[attrs.columns][i].colName+'\']}}</span>';
                                html+= '</td>';
                            }
                            html+= '</tr> </table>';
                            var el = $compile(html)(scope);
                            element.prepend(el);
                        }
                    }
                })
            }
        }
    };
})

.directive('smartTableDir', function($compile) {
    return {
        restrict: 'E',
        scope: true,
        priority: 1002,
        compile: function (element) {
            return function (scope, element, attrs) {
                var loadeddir = false;
                scope.$watch(attrs.data,function(){
                    if(!loadeddir){
                        if(scope[attrs.data].length > 0){                        	
                        	var html = '<table st-table="' + attrs.data + '" class="table table-striped smarttable" st-safe-src="'+attrs.srcdata+'" csvdata="'+attrs.csvdata+'">';
                        	html += '<thead>';
                        		html += '<tr><td colspan="{{'+attrs.columns+'.length}}">';
                        			html += '<label class="control-label smarttable-searchinputlabel">Filter by Contents: </label><div class="input-group"><input st-search placeholder="Filter by Contents" class="form-control smarttable-searchinput" type="search"/><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>';
                        		html += '</td></tr>';
                        		html += '<tr>';
                        			html += '<th lr-drag-src="headers1" lr-drop-target="headers1" ng-repeat="col in '+attrs.columns+'" st-sort="{{col}}">{{'+attrs.columnlabels+'[col]}}</th>';
                    			html += '</tr>';
                    		html += '</thead>';
                        	html += '<tbody>';
                        		html += '<tr ng-repeat="row in '+attrs.data+'">';
                        			html += '<td ng-repeat="col in '+attrs.columns+'">{{row[col]}}</td>';
                        		html += '</tr>';
                        	html += '</tbody>';
                        	html += '<tfoot>';
                        	if(attrs.enablePagination === "true"){
                        		html += '<tr><td colspan="{{'+attrs.columns+'.length}}" class="text-center">';
                    				html += '<div st-pagination="" st-items-by-page="10" st-displayed-pages="10" class="smarttable-pagination"></div>';
                        		html += '</td></tr>';
                        	}
                        	
                        	html += '</tfoot>';                        	
                        	html += '</table>';
                        	var el = $compile(html)(scope);
                            element.prepend(el);
                            loadeddir = true;
                        }
                    }
                })
            }
        }
    };
})

.directive('customDraggableTable', function($compile) {
    return {
        restrict: 'A',
        compile: function (element) {
            return function (scope, element, attrs) {
                console.log("draggable " , element);
                setTimeout(function(){
                    $(element).dragtable();
                },100);
            }
        }
    };
})

.directive('previewDirective', function($rootScope, Auth) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            function onResize(){
                var windowHeight = $(window).height();
                var windowWidth = $(window).width();
                var elem = $(element);
                elem.height(windowHeight - 190);
                elem.parent().parent().width(windowWidth - 100);
            }
            onResize();
            $(window).on("resize",onResize);
        }
    };
})

.directive('uiGridMenuItem', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            $(element).attr("title","");
        }
    };
})

.directive('timeStackChart', ["$parse","TimeStackChartService","$timeout",function($parse,TimeStackChartService,$timeout) {
    return {
        restrict: 'A',        
        link: function(scope, element, attrs) {
        	var directive = function(){
	            var settings = $parse(attrs.timeStackChart)(scope);
	            var t = new TimeChart(settings);
	            TimeStackChartService.overrideInfoPopUp(t);
	            TimeStackChartService.setChart(attrs.timeStackChart,t);
        	}
        	$timeout(directive,0);
        }
    };
}])

.directive("liveStatsPieChart",["$parse","LiveStatsPieChartService","$timeout",function($parse,LiveStatsPieChartService,$timeout){

        return{
            restrict : "A",
            link: function(scope,element,attrs){            	
                var directive = function(){
                	var settings = $parse(attrs.liveStatsPieChart)(scope);
                    var t = new PieChart(settings);
                    LiveStatsPieChartService.setChart(attrs.liveStatsPieChart,t);
                }
                $timeout(directive,0);
            }
        }

}])

.directive('stackHorizontal',function($http,$parse,ZoomHorizontal,$timeout) {
	var elem;
	var preloaded;
	var t;
    return {
        restrict: 'A',        
        link: function(scope, element, attrs) {
        	elem = element;
        	var directive = function(){
	            var settings = $parse(attrs.stackHorizontal)(scope);
	            if (settings.container === null){
	            	settings.container = elem[0];
	            	settings.height = $(elem).parent().parent().width()
	            }
	            
	            settings.data =
	            {	            	
	                units:["d"],
	                dataFunction: function(from, to, step, success, fail){	 
	                	
	                	$http.post(settings.wsUrl,{stp : settings.stp,  queryName : settings.queryName}).success(function(data) {    		    			    		
	                		var dataObj = {unit: "d",values: []};
	                		var tmpArr = [];
	                		var total = 0;
	                		var tmp;
	                		var seriesId; 
	                		var tmpSerie;
	                		
	                		//           nomination - reward - ebutton - monetary button - ecard - monetary ecard 
	                		var colors = ["#A05FAC","#BAD4C1","#E9A844","#e88143","#6FB24A","#518136"];
	                		
	                		var stacks = {};
	                		var series = [];
	                		tmpArr.push(0);
	                		for(var i = 0; i <  data.model.length; i++){	
	                			tmp = data.model[i];
	                			seriesId = "series" + (i + 1);
	                			tmpArr.push(tmp.activities);
	                			total += tmp.activities;
	                			
	                			stacks[seriesId] = {name : tmp.activity, enabled : true};
	                			
	                			tmpSerie = {
		                                name:tmp.activity,
		                                id:seriesId,
		                                type:"columns",
		                                data:{
		                                    index:(i + 1),
		                                    aggregation:"sum"
		                                },
		                                stack: "default",
		                                style:{
		                                    fillColor:colors[i]
		                                }
		                            };
	                			series.unshift(tmpSerie);
	                		}	                	
	                		
	                		dataObj.values.push(tmpArr);
	                		
		                	preloaded = dataObj;
		                	var newSettings = {};
		                	
		                	newSettings.stackId = "#horStackLegend";
		                	newSettings.seriesId = "#horSeriesLegend";		    	           		    	            		    	            
		    	            
		    	            newSettings.stacks = stacks;
		    	            newSettings.series = series;		    	            
		    	            newSettings.valueAxis = {
		    		                "default": {
		    		                    maxValue: total,
		    		                    enabled : false
		    		                }};		    	            		    	           
		    	            
		    	            scope.awardActivityTotalValue = comma(total);
		    	            ZoomHorizontal.createLegend(t,newSettings,preloaded,data.model);
		    	            t.updateSettings(newSettings);
		                	success(dataObj);
		                	
	                	}); 	                	                	
	                }
	            };	           
	            
	            t = new TimeChart(settings);
	            
        	}
        	$timeout(directive, 0);
        }
    };
})

.directive('singleBar', function () {

    
    
    return {
        restrict: 'EA', 
        scope: {
            'data': '='
        }, 

        link: link


    };



    function link(scope, element){

        var sb = new singleBar(element[0],  scope.data);

       
   

         scope.$watch(function(){


            //console.log(scope.screensize)

                sb.resize();
            });
       


                            

    };


    







})

.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (/^#(?!\/)/.test(attrs.href)) {
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
    };
})

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if(scope.$last === true) {
                $timeout(function () {
                    scope.$emit(scope.$eval(attr.onFinishRender));
                });
            }
        }
    }
})

.directive('hrzBars', function(){

        return {
        restrict: 'EA', 
        scope: {
            'data': '='
        }, 

        link: link


    };


    function link(scope, element){



        

        var dimensions = {'width': 330, 'height': 200};

        
        var ele = d3.select(element[0]);

        

        var chart = new hrzBars(ele, dimensions, scope.data);


        // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {

            chart.update(newVals)
          }, true);

        

         



                                

    };
})

.directive('vertBars', function(){

        return {
            restrict: 'EA',
            scope: {
                'data': '='
            },

            link: link


        };


 function link(scope, element){



             // Browser onresize event
        

            


            var vert = new vertBars(element[0], scope.data);

          
               scope.$watch(function(){

                vert.resize(element[0]);
            });



        };
    })

.directive('projectionChart', function(){

        return {
            restrict: 'EA',
            /*
            scope: {
                'data': '='
            },
*/
            link: link


        };


        function link(scope, element){


            var dimensions = {'width': 500, 'height': 200};
            var ele = d3.select(element[0]);

            var chart;

       
            d3.json(SAC.CHARTS_TEMP_DATA, function(error, json){
                    data = json;
                    
                chart = new projectionChart(element[0], data);
                scope.$watch(function(){
                    
                    chart.resize(element[0]);
                });

           });


            

           


        };
    })

.directive('donutChart', function($parse,$http){

    return {
        restrict: 'E',               
        link: link
    };

    function link(scope, element, attrs){
    	var ele = element[0];
    	var data = $parse(attrs.data)(scope);
    	var settings = $parse(attrs.settings)(scope);    	
    	var donut = new donutChart(ele, data, attrs.title, attrs.color1, attrs.color2,attrs.color3,$http,attrs,settings);    	    	    	       
    };
})
    
.directive('zoomChart', function () { 
    return function (scope, element, attrs) {

        var top_manager_fname = scope.top_manager_fname;
        var top_manager_lname = scope.top_manager_lname;
        var top_manager_id = manager_id = scope.top_manager_id;
        var year = scope.year;
        var month = scope.month;
        var week = scope.week;
        var path = scope.path;
        var api = scope.api;
        var seriesData = scope.seriesData;
        var infoCustom = {
                advanced: {
                    scope: "stack",
                    showOnlyHoveredSeries: true
                }
            };

        if (scope.infoContents !== undefined){
            infoCustom.contentFunction = scope.infoContents;
        }

        var curStack, stacksData = {
                reach: {name: "Reach", enabled: true},
                utilization: {name: "Utilization", enabled: true},
                adoption: {name: "Adoption", enabled: true},
                redemption: {name: "Redemption", enabled: true}
            };

        for (curStack in stacksData){
            if (stacksData.hasOwnProperty(curStack)){
                if (scope.stack !== undefined && 
                    scope.stack.toLowerCase() !== stacksData[curStack].name.toLowerCase()){
                    stacksData[curStack].enabled = false;
                }
            }
        }
        $($(element)[0]).mousemove(function(evt){
            if (facet_chart !== undefined && facet_chart._scene !== undefined){
                var t = facet_chart._scene.xToPosition(evt.offsetX);
                var facet = facet_chart._scene.activeFacet;
                var t0 = Math.floor(t);
                var t1 = Math.ceil(t);
                if (t0 === t1) {
                  t1 = t0 + 1;
                }
                if (t0 < 0 || t0 >= facet.items.length) {
                  return null;
                }
                facet_chart.settings.currentPos = [t0, t1];
            }
        });
        var infoContent = scope.infoContents;
        var facet_chart_settings = {
            title: {text: ""},
            container: $(element)[0],
            series: seriesData,
            stacks: stacksData,
            data: {
                dataFunction: function(id,limit,offset,success,error){
                    api.getData(id?id:manager_id,year,month,week, function(data){
                        manager_id = id?id:manager_id;
                        success(data);
                    }); // replace with call to your rest API
                }
            },
            items: {
                styleFunction: function(item){
                    item.label = item.data.user_fname + " " + item.data.user_lname;
                }
            },
            height: 300,
            chartTypes: {
                columns: {style: {minHeight: 0}}
            },
            info: infoCustom,
            events: {
                onClick: function(ev){
                    if (ev.clickItem){
                        var d = ev.clickItem.data;
                        var i = 0, cPath = getPath();
                        // check if we there are no more levels
                        for (; i < cPath.length; i++){
                            if (cPath[i].id === d.id){
                                return;
                            }
                        }
                        path.push({id: d.id, user_fname: d.user_fname, user_lname: d.user_lname});
                        pathRebuild();
                    }
                },
                onChartUpdate: function(ev){
                    pathRebuild();
                }
            }
        };
        facet_chart = new FacetChart(facet_chart_settings);
        function pathRebuild(){
            var pies = facet_chart.getPie();
            var p = $("#zoomcharts-legend");
            p.html("");
            for (var x in path){
                var c;
                if (path[x].id != pies[x]){
                    break;
                }
                if (x == path.length - 1){
                    c = $("<span>" + path[x].user_fname + " " + path[x].user_lname + "</span>");
                } else {
                    c = $("<a href=\"#\" rel=\"" + path[x].id + "\">" + path[x].user_fname + " " + path[x].user_lname + "</a>");
                    c.on("click", function(ev){
                        ev.preventDefault();
                        var id = $(this).attr("rel");
                        var p2 = [];
                        var pies = [];
                        for (var p in path){
                            pies.push(path[p].id);
                            p2.push(path[p]);
                            if (path[p].id == id){
                                /* found stop */ 
                                break;
                            }
                        }
                        path = p2;
                        facet_chart.setPie(pies);
                        pathRebuild();
                    });
                }
                p.append(c);
            }
        }
        /* build labels and toggle */
        function buildLabels(){
            var sc = $(".zoomcharts-series-toggle.series").html("<span>Series</span>");
            for (var x in facet_chart_settings.series){
                var s = facet_chart_settings.series[x];
                if(facet_chart_settings.series[x].hide === undefined || !facet_chart_settings.series[x].hide){
                    var sj = $("<a rel=\"" + s.id + "\"><span style=\"background-color:" + s.style.fillColor + "\"></span> " + s.name + "</a>");
                    sc.append(sj);
                    sj.on("click", function(ev){
                        var sr = facet_chart_settings.series;
                        var enabled;
                        var id = $(this).attr("rel").replace("r_", "");
                        if (!$(this).hasClass("zoomcharts-series-hidden")){
                            enabled = false;
                            $(this).addClass("zoomcharts-series-hidden");
                            $(this).children("span").css("border-color", $(this).children("span").css("background-color"));
                            $(this).children("span").css("background-color", "");
                        } else {
                            enabled = true;
                            $(this).removeClass("zoomcharts-series-hidden");
                            $(this).children("span").css("background-color", $(this).children("span").css("border-color"));
                            $(this).children("span").css("border-color", "");
                        }
                        for (var x in sr){
                            if (sr[x].id.indexOf(id) > -1){
                                if (enabled && !facet_chart_settings.stacks[sr[x].stack].enabled){
                                    continue;
                                }
                                sr[x].enabled = enabled;
                            }
                        }
                        facet_chart.replaceSeries(sr);
                    });
                }
            }
            var st = $(".zoomcharts-series-toggle.stack").html("<span>Stacks</span>");
            stacks = ["reach","utilization"];
            for (var x in stacks){
                var s = stacks[x];
                var sj = $("<a rel=\"" + s + "\"><span style=\"background-color: gray\"></span>" +  s.charAt(0).toUpperCase() + s.slice(1) + "</a>");
                st.append(sj);
                sj.on("click", function(){
                    var sr = facet_chart_settings.series;
                    var enabled;
                    var stack = $(this).attr("rel");
                    if (!$(this).hasClass("zoomcharts-series-hidden")){
                        enabled = false;
                        facet_chart_settings.stacks[stack].enabled = false;
                        $(this).addClass("zoomcharts-series-hidden");
                        $(this).children("span").css("border-color", $(this).children("span").css("background-color"));
                        $(this).children("span").css("background-color", "");
                    } else {
                        enabled = true;
                        facet_chart_settings.stacks[stack].enabled = true;
                        $(this).removeClass("zoomcharts-series-hidden");
                        $(this).children("span").css("background-color", $(this).children("span").css("border-color"));
                        $(this).children("span").css("border-color", "");
                    }
                    for (var x in sr){
                        if (sr[x].stack == stack){
                            if (enabled == true){
                                var i = sr[x].id.replace("u_", "r_");
                                if ($("a[rel=" + i + "]").hasClass("zoomcharts-series-hidden")){
                                    continue;
                                }
                            }
                            sr[x].enabled = enabled;
                        }
                    }
                    facet_chart.replaceSeries(sr);
                });
            }
            // TODO Faisal Irfan after Demo this should be improved
            if (scope.hideStacks){
                $('.zoomcharts-series-toggle.stack').hide();
            }
            if (scope.stack !== undefined){
            	$('.zoomcharts-series-toggle.stack a').click();
                $('a[rel=' + scope.stack.toLowerCase() + ']').click();
            }
        }

        function getPath(){
            return path;
        }

        buildLabels();
        
        path.push({id: "", user_fname: top_manager_fname,user_lname: top_manager_lname});

        pathRebuild();

        function updateFacetChart(){
            facet_chart.reloadData();
        }

        scope.$parent.searchEvent = function(cPath, pies){
            path = cPath;
            facet_chart.setPie(pies);
            pathRebuild();
        }
    }
     
}).directive('searchCharts', ["SeacrhService", function($timeout, SeacrhService) {

    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }

    var cfilter = undefined;

    return {

        restrict:'EA',
        require: "?ngModel",
        
        link: function(scope, iElement, iAttrs, ngModel) {

              var source = [], dimensionAll = undefined;

              var filteredData = [];
              var parent = $(iElement).parent();

              iElement.bind("keyup", function(e) {
                    if ($(iElement).val() === ''){
                        $($(".typeahead.dropdown-menu")[0]).remove();
                        return;
                    }  

                    source = [];
                    if (cfilter === undefined){
                        // placed filter here so the data loads only once
                        cfilter = crossfilter(bibox.data.values);
                    }

                    dimensionAll = cfilter.dimension(function(d) {
                        return d; 
                    });
                    var sKeys = scope[iAttrs.searchKeys];
                    var aggKey = scope[iAttrs.sumKeys];

                    var list;

                    if ($(".typeahead.dropdown-menu").length > 0){
                        list = $($(".typeahead.dropdown-menu")[0]);
                        list.html("");
                    }
                    else{
                        list = $("<ul>")
                                .appendTo(parent)
                                .attr("class", "typeahead dropdown-menu customth")
                                .css("top", $(iElement).position().top + $(iElement).height())
                                .css("left", $(iElement).position().left)
                                .css("width", $(iElement).width());

                        if (iAttrs.topBuffer !== undefined){
                            list.addClass("top-buffer");
                        }
                    }

                    var setListEvents = function(list){
                        list.find("li").hover(function(){
                            $(this).addClass("active");
                        })
                        .mouseout(function(){
                            $(this).removeClass("active");
                        }).click(function(){
                            var value = $(this).text();
                            $(iElement).val(value);
                            $(list).remove();

                            var data;
                            if (value.length > 0){
                                data = [];
                                var pies = [], currentData = bibox.getSub({id: $(this).attr("rel")}, null, "obj")[0];
                                data.push({id: currentData.id, user_fname: currentData.user_fname, user_lname: currentData.user_lname});
                                pies.push(currentData.id);
                                var drillLength = currentData.len;
                                while(drillLength > 0){
                                    currentData = bibox.getSub({id: currentData.manager_id}, null, "obj")[0];
                                    if (currentData === undefined){
                                        break;
                                    }
                                    data.unshift({id: currentData.id, user_fname: currentData.user_fname, user_lname: currentData.user_lname});
                                    pies.unshift(currentData.id);
                                    drillLength = currentData.len;
                                }
                                scope.$parent.searchEvent(data, pies);
                            }
                        });
                    };

                    list.show();
                    var i, li, lnameSrc = [], currentVal = iElement.val().toLowerCase();
                    var appnedKeyEsists = iAttrs.searchAppendKey !== undefined && iAttrs.searchAppendKey !== "";
                    for(i = 0; i < sKeys.length; i++){
                        dimensionAll.filterFunction(function(person){
                        	var aggSearch = person[aggKey[1]].toLowerCase() + aggKey[0] + person[aggKey[2]].toLowerCase();
                            if ((person[sKeys[i]].toLowerCase().indexOf(currentVal) === 0 || aggSearch.indexOf(currentVal) === 0) && appnedKeyEsists){
                                li = " <li class='autoElem' rel='" + person.id + "'>" + person[sKeys[i]] +
                                 ", " + person[scope.searchAppendKey] + "</li>";
                                source.push(li);
                            }
                            else if (person[sKeys[i]].toLowerCase().indexOf(currentVal) === 0 || aggSearch.indexOf(currentVal) === 0){
                                li = " <li class='autoElem' rel='" + person.id + "'>" + person[sKeys[i]] +
                                 ", " + person[scope.searchAppendKey] + "</li>";
                                source.push(li);
                            }
                            return false;
                        }); 
                    }

                    if (source.length === 0){
                        list.remove();
                    }
                    else{
                        var start = 0;
                        var end = 29;
                        var lastScrollTop = 0;
                        for (var i0 = 0; i0 < end && i0 < source.length; i0++){
                            if (list.find("li").length < 30){
                                list.append(source[i0]);
                            }
                        }
                        list.scroll(function(event){
                            var st = $(this).scrollTop();
                            var tempLast = parseInt(lastScrollTop);
                            lastScrollTop = st;
                            if (st > tempLast){
                               // downscroll code should be omproved I KNOW :)
                               for (var j = 0; j < 100 && end < source.length; j++){
                                   $(this).append(source[end++]);
                                   start++;
                               }
                            } 
                            setListEvents(list);
                        });
                        setListEvents(list);
                    }

                    

                    $(iElement).blur(function(){
                        setTimeout(function(){
                            $(".typeahead.dropdown-menu").remove();
                        }, 200);
                    });
                
                });

        }
    };
}
]).directive('infiniteScrollInModal',function() {
	return {

        restrict:'A',
        require: "",
        
        link: function(scope,iAttrs) {
        	
	    	$('.modal-body').css({
	    		//'overflow-y': 'auto'
	    		'overflow': 'hidden'
	    	});
	    	
	    	$('.table').css({
	    		'margin-bottom':'0px'
	    	});
	    	
	    	$('.modal-footer').css({
	    		'margin-top':'0px'
	    	});
	    	
	    	$('.popUpLoader').css({
	    		'position':'fixed'
	    	});
	    	
	    	function onResize(){
	    		var offset = 0;
		    	var size = $('.modal-body').height() - offset
		    	$('.modal .gridStyle').css({
		    		'height': size+"px"
		    	});
            }
            onResize();
            $(window).on("resize",onResize);
	    		    	
        }
	}
})
.directive('popovercontrol', ["$parse","$timeout",function($parse,$timeout) {
    return {
        restrict: 'A',        
        link: function(scope, element, attrs) {
        	$("body").append('<div class="testText" style="display: table;visibility: hidden;"></div>');
        	$('.testText').html(attrs.popover)
        	var w = $('.testText').width();
			if(w < attrs.popovercontrol){
				console.log("menooor");
				attrs["popoverTrigger"] = " ";
			}
			$(".testText").remove();
        }
    };
}])
.directive('budgetChart', ["$parse","TimeStackChartService","$timeout",function($parse,TimeStackChartService,$timeout) {
    return {
        restrict: 'A',        
        link: function(scope, element, attrs) {
        	var directive = function(data){
        		var offset = new Date().getTimezoneOffset();
        		data.dataLimitFrom = data.dataLimitFrom - offset*60000;
        		data.dataLimitTo = data.dataLimitTo - offset*60000;
        		for(i=0; i<data.values.length; i++){
        			data.values[i][0] = data.values[i][0] - offset*60000;
        		}
        		
        		var now = new Date().getTime();
        		var newvalues = [[],[],[],[],[]];
        		i = 0;
        		while(data.values[i][0]<now){
        			newvalues[0].push([data.values[i][0], data.values[i][1]]);
        			newvalues[1].push([data.values[i][0],0]);
        			newvalues[2].push([data.values[i][0],0]);
        			newvalues[3].push([data.values[i][0],0]);
        			newvalues[4].push([data.values[i][0],0]);
        			i++;
        		}
        		while(i<data.values.length){
        			newvalues[0].push([data.values[i][0],0]);
        			newvalues[1].push([data.values[i][0], Math.floor(data.values[i][1]*0.95)]);
        			newvalues[2].push([data.values[i][0], Math.floor(data.values[i][1]*0.05)]);
        			newvalues[3].push([data.values[i][0], Math.floor(data.values[i][1]*0.05)]);
        			newvalues[4].push([data.values[i][0], Math.floor(data.values[i][1]*0.05)]);
        			i++;
        		}
        		var newdata = [];
        		for(i=0; i<5; i++){
        			newdata.push({
        				id: "series"+i,
        				units: ["d"],
        				preloaded: {
        					"dataLimitFrom": data.dataLimitFrom,
        					"dataLimitTo": data.dataLimitTo,
        					"unit": "d",
        					"data": newvalues[i]
    					}
    				});
        		}
        		var series = [
		        	{
		                type:"line",
		                data:{ index:1, source: "series0", aggregation: "max"},
		                style:{fillColor: "rgba(46,136,214,1)", "lineColor": "rgba(255,255,255,0)", smoothing:true},
		                stack: "default"
		            },
		            {
		                type:"line",
		                data:{ index:1, source: "series1", aggregation: "max"},
		                style:{fillColor: "rgba(68,157,87,1)", "lineColor": "rgba(255,255,255,0)", smoothing:true},
		                stack: "default"
		            },
		            {
		                type:"line",
		                data:{ index:1, source: "series2", aggregation: "max"},
		                style:{fillColor: "rgba(68,157,87,0.8)", "lineColor": "rgba(255,255,255,0)", smoothing:true},
		                stack: "default"
		            },
		            {
		                type:"line",
		                data:{ index:1, source: "series3", aggregation: "max"},
		                style:{fillColor: "rgba(68,157,87,0.6)", "lineColor": "rgba(255,255,255,0)", smoothing:true},
		                stack: "default"
		            },
		            {
		                type:"line",
		                data:{ index:1, source: "series4", aggregation: "max"},
		                style:{fillColor: "rgba(68,157,87,0.4)", "lineColor": "rgba(255,255,255,0)", smoothing:true},
		                stack: "default"
		            }
		        ];
		        
        		var t = new TimeChart({
			        container: document.getElementById("budgetChart"),
			        data: newdata,
			        series: series,
			        area:{
			        	initialDisplayUnit: "day",
			        	style: {
			        		fillColor: "#f4f4f4"
		        		}
		        	},
		        	toolbars: {
	                    "export" : false,
	                    logScale : false,
	                    periodButtons : false,
                    	periodSelection : false,
                    	displayUnit : false,
                    	zoomOut: false,
                    	back: false
	                },
	                interaction: {
	                	scrolling : {
	                    	limitFrom: data.dataLimitFrom,
	                        limitTo:  data.dataLimitTo,
	                        enabled: false
	                    },
	                    zooming: {
	                    	enabled: false,
	                    	keyboardFactor: 1,
	                    	fingers: false
                    	},
                    	resizing: {
                    		enabled: false
                		}
	                },
	                currentTime:{
	                	style: {
	                		fillColor: "rgb(0,0,0)",
	                		lineColor: "rgb(0,0,0)"
	                	}
	                },
	                events : {
                		onClick : function(event){	                		
                    		event.preventDefault();
	                	}
	                },
	                valueAxis: {
	                	"default": {
	                		hgrid: false,
	                		valueFormatterFunction: function(value, unitName, unitValue, name) {
	                			return '$' + value/1000000 + "M";
	                		},
	                		style: {
	                			tick: {
	                				lineColor: "rgba(255,255,255,0)"
	                			}
	                		}
                		}	                	
	                },
	                timeAxis: {
	                	style: {
	                		vgrid: {
	                			lineColor: "#ffffff"
	                		}
	                	}
	                }
			    });
    
			    t._impl.infoPopup.buildValues = function(info, selectedSeriesIndex, selectedStack){
			    	var out = '<table>';
			    	if(info[0].data[0].values.max>0){
			    		out += ('<tr><td>Budget spent</td><td>'+ info[0].data[0].values.max+'</td></tr>');
			    	}else{
			    		out += ('<tr><td>Budget trending +10%</td><td>'+ (info[0].data[1].values.max+info[0].data[2].values.max+info[0].data[3].values.max+info[0].data[4].values.max)+'</td></tr>');
			    		out += ('<tr><td>Budget trending +5%</td><td>'+ (info[0].data[1].values.max+info[0].data[2].values.max+info[0].data[3].values.max)+'</td></tr>');
			    		out += ('<tr><td>Budget trending </td><td>'+ (info[0].data[1].values.max+info[0].data[2].values.max)+'</td></tr>');
			    		out += ('<tr><td>Budget trending -5%</td><td>'+ info[0].data[1].values.max+'</td></tr>');
			    	}
			    	out += '</table>';
			    	return out;
			    };
        	}
        	
        	scope.$watch(attrs.data, function(data){        		
        		if(data){
        			directive(data);
    			}
        	});
        }
    };
}])
.directive('uiGridHeaderCellCustom', ['$compile', '$timeout', '$window', '$document', 'gridUtil', 'uiGridConstants', 'ScrollEvent',
  function ($compile, $timeout, $window, $document, gridUtil, uiGridConstants, ScrollEvent) {
    // Do stuff after mouse has been down this many ms on the header cell
    var mousedownTimeout = 500;

    var uiGridHeaderCell = {
      priority: 0,
      scope: {
        col: '=',
        row: '=',
        renderIndex: '='
      },
      require: ['?^uiGrid', '^uiGridRenderContainer'],
      replace: true,
      compile: function() {
        return {
          pre: function ($scope, $elm, $attrs) {        	  
            var cellHeader = $compile($scope.col.headerCellTemplate)($scope);
            $elm.append(cellHeader);
          },
          
          post: function ($scope, $elm, $attrs, controllers) {
        	 
            var uiGridCtrl = controllers[0];
            var renderContainerCtrl = controllers[1];

            $scope.grid = uiGridCtrl.grid;

            $scope.renderContainer = uiGridCtrl.grid.renderContainers[renderContainerCtrl.containerId];
            
            var initColClass = $scope.col.getColClass(false);
            
            $elm.addClass(initColClass);
    
            // Put asc and desc sort directions in scope
            $scope.asc = uiGridConstants.ASC;
            $scope.desc = uiGridConstants.DESC;    
    
            var $contentsElm = angular.element( $elm[0].querySelectorAll('.ui-grid-cell-contents') );
    

            // apply any headerCellClass
            var classAdded;
            var updateClass = function( grid ){
              var contents = $elm;
              if ( classAdded ){
                contents.removeClass( classAdded );
                classAdded = null;
              }
  
              if (angular.isFunction($scope.col.headerCellClass)) {
                classAdded = $scope.col.headerCellClass($scope.grid, $scope.row, $scope.col, $scope.rowRenderIndex, $scope.colRenderIndex);
              }
              else {
                classAdded = $scope.col.headerCellClass;
              }
              contents.addClass(classAdded);
              
              var rightMostContainer = $scope.grid.renderContainers['right'] ? $scope.grid.renderContainers['right'] : $scope.grid.renderContainers['body'];
              $scope.isLastCol = ( $scope.col === rightMostContainer.visibleColumnCache[ rightMostContainer.visibleColumnCache.length - 1 ] );
            };

            $scope.$watch('col', function (n, o) {
              if (n !== o) {
                // See if the column's internal class has changed
                var newColClass = $scope.col.getColClass(false);
                if (newColClass !== initColClass) {
                  $elm.removeClass(initColClass);
                  $elm.addClass(newColClass);
                  initColClass = newColClass;
                }
              }
            });
  
            updateClass();
            
            // Register a data change watch that would get triggered whenever someone edits a cell or modifies column defs
            var dataChangeDereg = $scope.grid.registerDataChangeCallback( updateClass, [uiGridConstants.dataChange.COLUMN]);

            $scope.$on( '$destroy', dataChangeDereg );            


            // Figure out whether this column is sortable or not
            if (uiGridCtrl.grid.options.enableSorting && $scope.col.enableSorting) {
              $scope.sortable = true;
            }
            else {
              $scope.sortable = false;
            }
    
            // Figure out whether this column is filterable or not
            if (uiGridCtrl.grid.options.enableFiltering && $scope.col.enableFiltering) {
              $scope.filterable = true;
            }
            else {
              $scope.filterable = false;
            }
                       
    
            function handleClick(event) {
              // If the shift key is being held down, add this column to the sort
              var add = false;
              if (event.shiftKey) {
                add = true;
              }
    
              // Sort this column then rebuild the grid's rows
              uiGridCtrl.grid.sortColumn($scope.col, add)
                .then(function () {
                  if (uiGridCtrl.columnMenuScope) { uiGridCtrl.columnMenuScope.hideMenu(); }
                  uiGridCtrl.grid.refresh();
                });
            }
    
            /**
            * @ngdoc property
            * @name enableColumnMenu
            * @propertyOf ui.grid.class:GridOptions.columnDef
            * @description if column menus are enabled, controls the column menus for this specific
            * column (i.e. if gridOptions.enableColumnMenus, then you can control column menus
            * using this option. If gridOptions.enableColumnMenus === false then you get no column
            * menus irrespective of the value of this option ).  Defaults to true.
            *
            */
            /**
            * @ngdoc property
            * @name enableColumnMenus
            * @propertyOf ui.grid.class:GridOptions.columnDef
            * @description Override for column menus everywhere - if set to false then you get no
            * column menus.  Defaults to true.
            *
            */

            if ($scope.sortable) {
              // Long-click (for mobile)
              var cancelMousedownTimeout;
              var mousedownStartTime = 0;

              var downEvent = gridUtil.isTouchEnabled() ? 'touchstart' : 'mousedown';
              $contentsElm.on(downEvent, function(event) {
                //event.stopPropagation();

                if (typeof(event.originalEvent) !== 'undefined' && event.originalEvent !== undefined) {
                  event = event.originalEvent;
                }
      
                // Don't show the menu if it's not the left button
                if (event.button && event.button !== 0) {
                  return;
                }
      
                mousedownStartTime = (new Date()).getTime();
      
                cancelMousedownTimeout = $timeout(function() { }, mousedownTimeout);
      
                cancelMousedownTimeout.then(function () {
                  if ( $scope.colMenu ) {
                    uiGridCtrl.columnMenuScope.showMenu($scope.col, $elm, event);
                  }
                });

                uiGridCtrl.fireEvent(uiGridConstants.events.COLUMN_HEADER_CLICK, {event: event, columnName: $scope.col.colDef.name});
              });
        
              var upEvent = gridUtil.isTouchEnabled() ? 'touchend' : 'mouseup';
              $contentsElm.on(upEvent, function () {
                $timeout.cancel(cancelMousedownTimeout);
              });
  
              $scope.$on('$destroy', function () {
                $contentsElm.off('mousedown touchstart');
              });
            }
    
            // If this column is sortable, add a click event handler
            if ($scope.sortable) {
              var clickEvent = gridUtil.isTouchEnabled() ? 'touchend' : 'click';
              $contentsElm.on(clickEvent, function(event) {
                //event.stopPropagation();
    
                $timeout.cancel(cancelMousedownTimeout);
    
                var mousedownEndTime = (new Date()).getTime();
                var mousedownTime = mousedownEndTime - mousedownStartTime;
    
                if (mousedownTime > mousedownTimeout) {
                  // long click, handled above with mousedown
                }
                else {
                  // short click
                  handleClick(event);
                }
              });
    
              $scope.$on('$destroy', function () {
                // Cancel any pending long-click timeout
                $timeout.cancel(cancelMousedownTimeout);
              });
            }
    
            if ($scope.filterable) {
              var filterDeregisters = [];
              angular.forEach($scope.col.filters, function(filter, i) {
                filterDeregisters.push($scope.$watch('col.filters[' + i + '].term', function(n, o) {
                  if (n !== o) {
                    uiGridCtrl.grid.api.core.raise.filterChanged();
                    uiGridCtrl.grid.refresh()
                      .then(function () {
                        if (uiGridCtrl.prevScrollArgs && uiGridCtrl.prevScrollArgs.y && uiGridCtrl.prevScrollArgs.y.percentage) {
                          var scrollEvent = new ScrollEvent(uiGridCtrl.grid,null,null,'uiGridHeaderCell.toggleMenu');
                          scrollEvent.y.percentage = uiGridCtrl.prevScrollArgs.y.percentage;
                          scrollEvent.fireScrollingEvent();
                        }
                      });
                  }
                }));  
              });
              $scope.$on('$destroy', function() {
                angular.forEach(filterDeregisters, function(filterDeregister) {
                  filterDeregister();
                });
              });
            }
          }
        };
      }
    };

    return uiGridHeaderCell;
  }])

  
  .directive('uiGridHeaderCellCustom', ['$q', 'gridUtil', 'uiGridMoveColumnService', '$document', '$log', 'uiGridConstants', 'ScrollEvent', 'uiGridDraggingColumnService',
    function ($q, gridUtil, uiGridMoveColumnService, $document, $log, uiGridConstants, ScrollEvent,uiGridDraggingColumnService) {
      return {
        priority: -10,
        require: '^uiGrid',
        compile: function () {
          return {
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
            	$scope.getHelper = function(){            		
            		var el = $elm.clone();    
            		el.css("width",$elm.width());
            		el.css("background-color","transparent");
            		return el;
            	};
            	
            	$scope.onDragCallback = function(event,drag){            		            		
            		uiGridDraggingColumnService.setDraggingColumn($scope.col);
            	};
            	
            	$scope.onDropCallback = function(event,dropEvent){            		            		
            		var header = $($scope.col.getRenderContainer().header);
            		var parentOffset = header.offset();
            		var l = parentOffset.left;
            		var r = parentOffset.left + header.width();            		
            		
            		if(event.pageX >= l && event.pageX <= r){
            			var draggableCol = uiGridDraggingColumnService.getDraggingColumn();
            			var dragColName = draggableCol.colDef.name;            		            		
                		var columns = $scope.grid.columns;
                		var dragColumns = draggableCol.grid.options.columnDefs;
                        var columnIndex = 0;
                        var dropColIndex = 0;
                        
                        for (var i = 0; i < columns.length; i++) {                    	
                          if (columns[i].colDef.name !== dragColName) {                        	                     	 
                            columnIndex++;
                          }
                          else {
                            break;
                          }
                        }                    
                        
                        for (var i = 0; i < columns.length; i++) {                    	
                            if (columns[i].colDef.name !== $scope.col.colDef.name) {
                            	dropColIndex++;
                            }
                            else {
                              break;
                            }
                          }
                        
                        if(columnIndex === columns.length){
                        	columnIndex = 0;
                        	for (var i = 0; i < dragColumns.length; i++) {                         		
                                if (dragColumns[i].name !== dragColName) {                        	                     	 
                                  columnIndex++;
                                }
                                else {
                                  break;
                                }
                              }
                        	
                        	var columnToAdd = angular.copy(draggableCol.colDef);                          	
                        	$scope.grid.options.columnDefs.splice(dropColIndex,0,columnToAdd);
                        	console.log(columnIndex);
                        	dragColumns.splice(columnIndex,1);                         	           	
                        }else{                        	
                            if(dropColIndex === 0){                    	
                            	uiGridMoveColumnService.redrawColumnAtPosition
                                ($scope.grid, columnIndex, 0);
                            }else if(dropColIndex < columnIndex || dropColIndex > columnIndex){
                            	uiGridMoveColumnService.redrawColumnAtPosition
                                ($scope.grid, columnIndex, dropColIndex);
                            }else{
                            	uiGridMoveColumnService.redrawColumnAtPosition
                                ($scope.grid, columnIndex, columns.length - 1);
                            }                        	
                        }
                        uiGridDraggingColumnService.setDraggingColumn(null);
            		}            		            		                   
            		
            	};            	
            }
          };
        }
      };
    }])
;

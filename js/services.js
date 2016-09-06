app.factory('Auth', function($http, $rootScope, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') ||
        { username: '', role: userRoles.public };

    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;
    $rootScope.user = currentUser;

    return {
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser,
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = $rootScope.user.role;
            return (accessLevel.bitMask & role.bitMask);
        },

        isLoggedIn: function(user) {
            if(user === undefined)
                user = $rootScope.user;
            return user.role.bitMask === userRoles.user.bitMask || user.role.bitMask === userRoles.admin.bitMask;
        },

        isServerLoggedIn: function(callback) {
            $http.post('auth/checkUser').success(function(response){
                var user = $cookieStore.get('user');
                // if(response.code === -1){
                if(user === undefined){
                    // $rootScope.user = { username: '', role: userRoles.public
					// }
                    user = { username: '', role: userRoles.public };
                }
                callback(user.role.bitMask === userRoles.user.bitMask || user.role.bitMask === userRoles.admin.bitMask);
            }).error(function(){});
        },

        register: function(user, success, error) {
            $http.post('register', user).success(success).error(error);
        },

        login: function(user, success, error) {
            $http.post('auth/login', user).success(function(user){
                if(user.username !== "")
                    $cookieStore.put('user',user);
                $rootScope.user = user;
                success(user);
            }).error(function(data, status, headers, config){
            	error(data);
            });
        },

        logout: function(success, error) {
            $http.post('logout').success(function(){
                $rootScope.user = {
                    username : '',
                    role : userRoles.public
            };
            success();
            }).error(error);
        }
    };

});

app.factory('uiGridDraggingColumnService', function(){

    var currentCol = null;

    return {        
        getDraggingColumn: function() {
            return currentCol;
        },
        setDraggingColumn: function(col){
        	currentCol = col;
        }
    };

});

app.factory('EnvService', function($http){
	var isDemo = null;
	
    return {
        getIsDemo : function(callback){
        	if(isDemo === null){
        		$http.post('getIsDemo').success(function(isDemoP){
        			isDemo = angular.fromJson(isDemoP);
    	    		callback(isDemo);
    	    	});	
        	}else{
        		callback(isDemo);
        	}
	    	              
    	}
    };

});

app.factory('AppService', function($http){
	var appInfo;
	var hasDashPerms = false;
	var hasLiveStatsPerms = false;
	var hasReportsPermissions = false;
	var hasProxyClientPermissions = false;
    return {

    	setCustomerPermissions: function(redirect,viewToAccess){
    		var $this = this;
    		console.log("checking permissions");
	    	var promise = $http.get('secure/getPermissions').success(function(data){
	    		userPermissions = angular.fromJson(data).activities;	    		
	    		hasDashPerms = false;
	    		hasReportsPermissions = false;
	    		try{	    			
		    		for (var activity in userPermissions){
		    			
		    			if (SAC.PERMISSIONS.DASHBOARD.indexOf(userPermissions[activity]) > -1){
		    				hasDashPerms = true;
		    			}
		    			
		    			if (SAC.PERMISSIONS.LIVE_STATS.indexOf(userPermissions[activity]) > -1){
		    				hasLiveStatsPerms = true;
		    			}
		    			
		    			if (SAC.PERMISSIONS.REPORTS.indexOf(userPermissions[activity]) > -1){
		    				hasReportsPermissions = true;
		    			}		    			
		    			
		    			if (SAC.PERMISSIONS.PROXY_CLIENT.indexOf(userPermissions[activity]) > -1){
		    				hasProxyClientPermissions = true;
		    			}
		    			
		    		}
		    		$this.checkViewPermissions(viewToAccess);
	    		}
	    		catch(e){
	    			console.log(e);
	                window.location.href = "https://www.appreciatehub.com/";
	    		}
	    		return data;
	    	});	          
	    	return promise;
    	},    	
    	checkViewPermissions : function(viewToAccess){
    		console.log("checking view permissions " , viewToAccess);
    		switch (viewToAccess) {
			case SAC.VIEW_PERMISSIONS.VIEW_DASHBOARD:
				if (!hasDashPerms){
	                window.location.href = "https://www.appreciatehub.com/";
	    		}
				break;
			case SAC.VIEW_PERMISSIONS.VIEW_LIVE_STATS:
				if (!hasLiveStatsPerms){
	                window.location.href = "https://www.appreciatehub.com/";
	    		}
				break;
			case SAC.VIEW_PERMISSIONS.VIEW_REPORTS_2_0:
				if (!hasReportsPermissions){
	                window.location.href = "https://www.appreciatehub.com/";
	    		}
				break;
			default:
				break;
			}
    	},    	
    	hasDashboardPermissions: function(){
    		return hasDashPerms;
    	},
    	hasLiveStatsPermissions: function(){
    		return hasLiveStatsPerms;
    	},
    	hasReportsPermissions : function(){
    		return hasReportsPermissions;
    	},
    	hasProxyClientPermissions : function(){
    		return hasProxyClientPermissions;
    	},    	
    	loadAndSaveAppInfo : function(){
	    	var promise = $http.get('secure/getAppInfo').success(function(data){
	    		appInfo = angular.fromJson(data);
	    		return appInfo;
	    	});	          
	    	return promise;
    	},
    	getAppInfo : function(){
    		$("#appLoading").hide();
    		return appInfo;
    	}
    };

});

app.factory('LoginService', function(){
	return {
    	setCurrentUser : function(user){
    		localStorage["cuser"] = user.username;
    	},
    	getCurrentUser : function(){
    		return localStorage["cuser"];
    	}
    };
});

app.factory('RedirectService', function($http){
    var loginDefaultUrl = "/dashboard";
	return {
    	setUserRedirectUrl:function(obj){
    		var user = {username:obj.username,lastVisitedUrl:obj.path};
    		localStorage[user.username] = JSON.stringify(user);
    	},
    	getUserRedirectUrl:function(obj){
    		console.log(localStorage[obj.username]);
    		var url = (localStorage[obj.username]) ? JSON.parse(localStorage[obj.username]).lastVisitedUrl : loginDefaultUrl;
    		return url;
    	}
    };

});



app.factory('InitialSiteService', function($http){
    return {
    	hideInitialLoader : function(){
    		$("#appLoading").hide();
    	}
    };
});


app.factory('LiveStatsPieChartService', function($http){
	var charts = {};
    var lastTimeStamp = 0;
	return {
    	
        refreshAll : function(){
        	for(var chart in charts){        		
        		charts[chart].reloadData();
        	}
        },
        
        setChart : function(pieChart,t){
            charts[pieChart] = t;
        },

        mergeWithBaseSettings : function(settings){

            var usedColors = [];
            var actualDepth = 1;
            var autoExpand = true;
            var usedColorsObj = {};
            var cPie = null;
            

            var hexDigits = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

		    var namekey = function (pieName) {
            	pieName = pieName.replace(" ", "_");
            	pieName = pieName.replace("/", "_");
		        return pieName.toLowerCase();
		    };
		    
		    var rgbToHex = function (rgb) {
		       rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		       return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		    };

            var baseSettings = {
                labels: {
                    enabled: true
                },
                interaction : {
                    others : {
                        centerGoesToPrevious : true
                    }
                },
                pie: {
                    style : {
                        sliceColors: [
                            "#8c5499",
                            "#fba752",
                            "#e3484c",
                            "#358ad4",
                            "#abd5bf",
                            "#bb2e5a",
                            "#8aa15f",
                            "#6a5fbb",
                            "#60bedd",
                            "#995f25",
                            "#9a2528",
                            "#1d5a8f",
                            "#589977",
                            "#741533",
                            "#2c5b32",
                            "#483e94",
                            "#1f7693"
                            
                        ]
                    },
                    styleFunction : function(pie){
                        if(pie.colored === undefined ) pie.colored = false;

                        if(!pie.colored){
                            var slices = pie.slices;

                            var randomColors = removedUsedColors(pie.sliceColors.slice(0));

                            var randomIndex = 0;

                            for(var i = 0; i < slices.length; i++){

                            	var name = namekey(pie.slices[i].data.name);
                            	var customColor = "";
                            	if (usedColorsObj.hasOwnProperty(name)){
                            		customColor = usedColorsObj[name];
                            	}
                            	else if (pie.slices[i].hasOwnProperty("data")
                            			&& pie.slices[i].data.hasOwnProperty("program")){
                            		var pName = namekey(pie.slices[i].data.program);
                            		name = pName + "_" + name;
                            		customColor = usedColorsObj[name];
                            	}
                            	if (customColor === undefined || customColor === ""){
                            		if (randomColors[i] !== null){
                                		customColor = randomColors[i];
                            		}
                            	}
                            	
                                pie.slices[i].customColor = customColor;
                            }
                            pie.colored = true;
                        }
                    },
                    margin: 0,
                    centerMargin: 0
                },
                slice : {
                    hoverStyle: {
                        "brightness": 1.05
                    },
                    styleFunction : function(slice){
                        if(slice.customColor){
                            slice.fillColor = slice.customColor;
                        }
                    },
                    expandableMarkStyle: {
                    	"lineWidth": 0,
                    	"distance": 0
                    },
                    margin: 0
                },
                info: {
                    contentsFunction: function(chart, sliceData,slice,callback){
                        var popUp ="<div class='customPieChartPopUp'><em></em>";
                        var html = '';
                        if (sliceData.value){
                        	if(actualDepth == getDepth(sliceData.pie)+1){
                        		var flag = true;
                                var currentSlice = sliceData;
                                var elhtml = '';
                                while(flag){                                	
                                	elhtml="<p>";
                                	elhtml+=("<span class='popUpTitle'>["+currentSlice.data.name+"]</span> ");
                                	elhtml+=("<span class='popUpValue'>"+currentSlice.data.value+"</span>, ");
                                	elhtml+=("<span class='popUpPercent'>"+(Math.round(currentSlice.data.fraction*10000)/100)+"%</span>");
                                	elhtml+="</p>";
                                    if(currentSlice.pie && currentSlice.pie.parentSlice){
                                        currentSlice = currentSlice.pie.parentSlice;                                        
                                    }else{
                                    	flag = false;
                                    }
                                    html=elhtml+html;
                                }
                        	}else{
                        		html+="<p class='popUpTitle'>"+sliceData.data.name+"</p>";
                        		html+="<p class='popUpValue'><span>"+sliceData.value+"</span> instances</p>";
                        		html+="<p class='popUpPercent'>"+Math.round(sliceData.percent*100)/100+"\%</p>";
                        	}
                        }
                        popUp+=html;
                        popUp+="</div>";
                        return popUp;
                    }
                },
                events:{
                	onClick: function(e){
                		ga('send', 'pageview', '/livestats');
                        ga('send', 'event', 'Live Stats', 'click', 'Activity by Program chart click');
                		if(e.clickSlice){
                			if(isLeaf(e.clickSlice.data.subvalues)){
                				if(e.clickSlice.lineDecoration && e.clickSlice.lineDecoration=="zigzag"){
                					
                				}else{
                					e.preventDefault();
                				}
                			}else{
                				e.preventDefault();                				
                				e.chart.expandSlice(e.clickSlice);
                				cpie = e.chart.getActivePie();
                				ii=0;
                				while(cpie.slices.length==1 && !isLeaf(cpie.slices[0].data.subvalues) && ii<4){
                					e.chart.expandSlice(cpie.slices[0]);                					
                					cpie = e.chart.getActivePie();
                					ii++;
                				}
                			}
                		}else{
                			e.preventDefault();
                			e.chart.expandSlice(e.pie.parentSlice);
                			cpie = e.chart.getActivePie();
                			while(cpie.slices.length==1 && cpie.parentSlice){
                				e.chart.expandSlice(cpie.parentSlice);
                				cpie = e.chart.getActivePie();
                			}
                		}
                	},
                    onChartUpdate: function(e){

                    	// updateBackFunctionality(e);
                        var pie = e.pie;
                        var i = 0;

                        var depth = getDepth(pie);

                        if(depth === 1){
                            usedColors = [];
                        }else if(depth > actualDepth){
                            usedColors.push(pie.parentSlice.fillColor);
                        }else if(depth < actualDepth){
                            usedColors.pop();
                        }

                        actualDepth = depth;

                        $("#piePath").html(getpath(pie));
                        addPathEvents(e.chart);
                        createPieDescriptions(pie);
                        cPie = pie;
                        setTimeout(function(){
                        	var pie = cPie;
                            for(var i = 0; i < pie.slices.length; i++){
                            	var pieName = pie.slices[i].data.name;
                            	pieName = namekey(pieName);
                            	if (pie.parentSlice !== null){
                                	var pPieName = pie.parentSlice.data.name;
                                	pPieName = namekey(pPieName);
                                	pieName = pPieName + "_" + pieName;
                            	}
                            	if (!usedColorsObj.hasOwnProperty(pieName)){
                                    usedColorsObj[pieName] = pie.slices[i].fillColor;
                            	}
                            }
                        }, 100);
						$('#pieBack').off().on("click", function(event){
							e.chart.expandSlice(pie.parentSlice);
							cpie = e.chart.getActivePie();
							autoExpand = false;
                			while(cpie.slices.length==1 && cpie.parentSlice){
                				e.chart.expandSlice(cpie.parentSlice);
                				cpie = e.chart.getActivePie();
                			}
                			autoExpand = true;
						});
						if(autoExpand && depth==1 && e.pie.data.values.length==1 && e.pie.activeSliceId !== null){
							e.chart.expandSlice(e.pie.slices[0]);
							cpie = e.chart.getActivePie();
							while(cpie.slices.length==1 && !isLeaf(cpie.data.values)){
								e.chart.expandSlice(cpie.slices[0]);
								cpie = e.chart.getActivePie();
							}
						}
						
						ga('send', 'pageview', '/livestats');

                        if(pie.parentSlice==null){
                            ga('send', 'event', 'Live Stats', 'view', 'Activity by program chart - Program view');
                        }else{
                            dt = pie.parentSlice.data;
                            if(dt.__category=='program'){
                                ga('send', 'event', 'Live Stats', 'view', 'Activity by program chart - Award Type view',  dt.program);
                            }else if(dt.__category=='award_type'){
                                ga('send', 'event', 'Live Stats', 'view', 'Activity by program chart - Award Level view',  dt.program + " / " + dt.award_type);
                            }else if(dt.__category=='award_level'){
                                ga('send', 'event', 'Live Stats', 'view', 'Activity by program chart - Corporate Values view',  dt.program + " / " + dt.award_type + " / " + dt.award_level);
                            }
                        }
                    },
                    onHoverChange : function(e){
                    	                    	
                    	var dif = e.timeStamp - lastTimeStamp;
                    	lastTimeStamp = e.timeStamp;
                    	
                    	if(e.hoverSlice !== null){  
		            		e.chart.selection([]);
		            		if(e.hoverSlice){
		            			e.chart.selection([e.hoverSlice.id]);
		            		}
		            	}else{
		            		e.chart.selection([]);
		            	}
                    	
                    }
                }
            };
            
            function isLeaf(dt){
            	if(!dt) return true;
            	while(dt.length==1 && dt[0].name=='N/A'){
            		if(dt[0].hasOwnProperty('subvalues')){
            			dt = dt[0].subvalues;
					}else{
						return true;
					}
            	}
            	return false;
            }
            
            function removedUsedColors(array){
            	var index = -1;
                for(var key in usedColorsObj){
                	if (usedColorsObj.hasOwnProperty(key)){
                		index = array.indexOf(usedColorsObj[key]);
                		if (index > -1){
                        	array.splice(index, 1);
                		}
                	}
                }
                return array;
            };

            function updateBackFunctionality(e){
            	e.chart.expandSlice = function(slice, origin){
        		    var id, pie;
        		    var self = e.chart._impl;
        		    if (slice===null){
        		    	return;
        		    }
        		    pie = slice.pie;
        		    origin = origin || "api";
        		    if (pie.id === self.scene.peek().id) {
        		      if (slice === pie.othersSlice) {
        		    	if (self.chart !== undefined){
        		    	  self.chart.setSelection([]);
        		    	}
        		    	self.goOthers(pie, origin);
        		        return true;
        		      } else if (slice === pie.previousSlice) {
        		    	if (self.chart !== undefined){
            		        self.chart.setSelection([]);
        		    	}
        		        self.goPrevious(pie, origin);
        		        return true;
        		      } else {
        		        id = slice.id;
        		        if (slice.expandable && self.scene.data.canExapnd(id)) {
        		    	  if (self.chart !== undefined){
        		    	    self.chart.setSelection([]);
        		    	  }
        		          if (self.drillDown !== undefined){
        		        	  self.drillDown(id, origin);
        		          }
        		          return true;
        		        }
        		      }
        		    } else {
        		      if (self.setSelection !== undefined){
            		      self.setSelection([]);
        		      }
        		      if (!(self.scene.length() > 1)) {
    		            return;
    		          }
    		          self.scene.pop();
    		          self.scene.pendingAction = null;
    		          return self.api._impl.navigator.updateAndNotifyCurrent(origin);
        		    }
        		    return false;

        	};
            }
            function addPathEvents(chart){
                $(".pathLabel").off().on("click",function(e){
                	e.preventDefault();
                	var depth = parseInt($(this).attr('depth'));
                	autoExpand = false;
                	for(var i=2; i<=depth; i++){
                		chart.expandSlice(chart.getActivePie().parentSlice);
                	}
                	cpie = chart.getActivePie();
					while(cpie.slices.length==1 && !isLeaf(cpie.slices[0].data.subvalues)){
						chart.expandSlice(cpie.slices[0])
						cpie = chart.getActivePie();
					}
                	autoExpand = true;
                });
            }

            function createPieDescriptions(pie){
                var pieChart = $("#"+settings.pieChartDescContainer);
                var values = pie.slices;
                var col1 = pieChart.find(".leftDescriptionsContainer");
                var col2= pieChart.find(".rightDescriptionsContainer");
                var colStr = '<div class="row"> <div class="col-xs-12 col-md-1 padding-0"> <div class="coloredSquare" style="background-color: COLOR_SQUARE_DESCRIPTION"></div> </div> <div class="col-xs-12 col-md-11 padding-left-1"> DESCRIPTION_NAME </div> </div>';

                var obj;
                setTimeout(function(){
                    col1.html("");
                    col2.html("");
                    for(var i = 1; i < values.length + 1; i++){
                        obj = values[i - 1];
                        if(i % 2){
                            col1.append(colStr.replace("DESCRIPTION_NAME",(obj.data.name)).replace("COLOR_SQUARE_DESCRIPTION",obj.fillColor));
                        }else{
                            col2.append(colStr.replace("DESCRIPTION_NAME",(obj.data.name)).replace("COLOR_SQUARE_DESCRIPTION",obj.fillColor));
                        }

                    }
                },100);
            }

            function getDepth(pie){
                var flag = true;
                var depth = 1;
                var currentPie = pie;
                while(flag){
                    if(!currentPie.parentSlice){
                        flag = false;
                    }else{
                        depth ++;
                        currentPie = currentPie.parentSlice.pie;
                    }
                }
                return depth;
            }

            function getpath(pie){
                var flag = true;
                var depth = 0;
                var currentPie = pie;
                var str = "";
                var types = [];

                while(flag){
                    if(!currentPie.parentSlice){
                        flag = false;
                    }else{
                        depth ++;
                        if(depth==1){
                        	str = "  >>  " + (currentPie.parentSlice.data.name!='N/A'?currentPie.parentSlice.data.name:'') + str;
                        }else{
                        	str = "  >>  <a class='pathLabel' pie-id='"+currentPie.parentSlice.id+"' depth='"+depth+"' href='#'>"+(currentPie.parentSlice.data.name!='N/A'?currentPie.parentSlice.data.name:'')+"</a>" + str;	
                        }                        
                        currentPie = currentPie.parentSlice.pie;
                    }
                }
                
                depth ++;
                str = "<a class='pathLabel' pie-id='' depth='"+depth+"' href='#'>Programs</a>" + str;

                switch (depth){
                    case 2:
                        str += " Award Types";
                        break;
                    case 3:
                        str += " Award Levels";
                        break;
                    case 4:
                        str += " Corporate Values";
                }

                str ="<p>"+str+"</p>";

                return str;
            }

            angular.extend(settings,baseSettings);
        }

    };

});


app.factory('TimeStackChartService', function($http){
    var charts = {};
    return{

        mergeWithBaseSettings : function(customSettings){

        	function getInitialHours(){
        		var result = "";
        		var hours = moment().hours();
        		if(hours < 17){
        			result = "1 hour";
        		}else if(hours < 21){
        			result = "3 hours";
        		}else{
        			result = "6 hours";
        		}        		        		
        		return result;
        	}
        	
            var baseTimeStackSettings = {
                events : {
                	onClick : function(event){
                		var data = event.chart._impl.renderer.exportData(event.clickStart, event.clickEnd)[0].data;
                		var i, isNoData = true;
                		
                		for (i = 0; i < data.length; i++){
                			if (data[i].values !== null){
                				isNoData = false;
                				break;
                			}
                		}
                		
                		if (isNoData){
                    		event.preventDefault();
                		}
                	}
                },
                area : {
                	initialDisplayAnchor : "now",
                	initialDisplayPeriod : (moment().startOf('day').valueOf() - new Date().getTimezoneOffset() * 60000) +" > " + (moment().valueOf() - new Date().getTimezoneOffset() * 60000),                    
                	initialDisplayUnit : getInitialHours(),
                	displayUnits :      [
						{
						    "unit": "1 s",
						    "name": "second"
						}, 
						{
						    "unit": "30 s",
						    "name": "seconds"
						},
                        {
                            "unit": "1 m",
                            "name": "minute"
                        },
                        {
                            "unit": "5 m",
                            "name": "5 minutes"
                        },
                        {
                            "unit": "1 h",
                            "name": "hour"
                        },
                        {
                            "unit": "3 h",
                            "name": "3 hours"
                        },
                        {
                            "unit": "4 h",
                            "name": "4 hours"
                        },
                        {

                            "unit": "6 h",
                            "name": "6 hours"
                        },
                        {
                            "unit": "12 h",
                            "name": "12 hours"
                        },
                        {
                            "unit": "16 h",
                            "name": "16 hours"
                        },
                        {
                            "unit": "24 h",
                            "name": "24 hours"
                        }
                    ]
                },
                interaction : {
                    scrolling : {
                    	noData : "snapBack",
                    	limitFrom: (moment().startOf('day').valueOf() - new Date().getTimezoneOffset() * 60000) , // timestamp
																													// or
																													// "oldestData"
                        limitTo:  (moment().endOf('day').valueOf() - new Date().getTimezoneOffset() * 60000), // timestamp
																												// or
																												// "now"
																												// or
																												// "newestData"
                        limitMode: "block", // one of null, "scrollBack",
											// "block"
			            overscrollProportion: 0 // fraction of screen that is
												// allowed to scroll past the
												// limit
                    }
                },
                timeAxis: {
                    vgrid : false,
                    style: {
                        dateLighten : {
                            fillColor : "transparent"
                        },
                        majorTimeLabel: {
                            fillColor: "#9D9D9D"
                        },
                        minorTimeLabel: {
                            fillColor: "#9D9D9D"
                        },
                        minorTimeRuler1: {
                            lineColor: "rgba(0,0,0,0)"
                        },
                        minorTimeRuler2: {
                            lineColor: "rgba(0,0,0,0)"
                        }
                    }
                },
                toolbars: {
                    "default" : "toolbarBare",
                    displayUnit : false,
                    "export" : false,
                    logScale : false,
                    periodButtons : false,
                    periodSelection : false
                },
                currentTime:{
                	enabled:false,
                	serverTime : new Date().getTime()
                },
                valueAxis:{
                    "default":{
                        hgrid : false,
                        style: {
                            valueLabel: {"fillColor": "#9D9D9D"},
                            tick : {
                                "lineColor": "transparent"
                            }
                        }
                    }
                },
                localization: {
                    infoDates: {
                        fullTimeFormats: {
                            "ms": "MMM D, h:mm:ssa",
                            "s": "MMM D, h:mm:ssa",
                            "m": "MMM D, h:mma",
                            "h": "MMM D, ha",
                            "d": "MMM D, YYYY",
                            "w": "[Week] W, YYYY",
                            "M": "MMM YYYY",
                            "y": "YYYY"
                        },
                        minorTimeFormats: {
                            "ms": " h:mm:ss a ",
                            "s": " h:mm:ss a ",
                            "m": " h:mm a ",
                            "h": "ha",
                            "d": "MMM D, YYYY",
                            "w": "[Week] W, YYYY",
                            "M": "MMM YYYY",
                            "y": "YYYY"
                        }
                    },
                    timeAxisDates: {
                        majorLabelTimeFormats: {
                            "ms": "h:mm:ss a",
                            "s": "h:mm:ss a",
                            "m": "h:mm a",
                            "h": "ha",
                            "d": "MMM D",
                            "w": "[Week] W, YYYY",
                            "M": "MMM YYYY",
                            "y": "YYYY"
                        },
                        minorLabelTimeFormats :{
                            "ms": "h:mm:ss a",
                            "s": "h:mm:ss a",
                            "m": "h:mm a",
                            "h": "ha",
                            "d": "MMM D",
                            "w": "MMM D",
                            "M": "MMM",
                            "y": "YYYY"
                        }
                    }
                }
            };

            angular.extend(customSettings,baseTimeStackSettings);

        },
        
        refreshAll : function(){
        	for(var chart in charts){        	
        		charts[chart].reloadData();
        	}
        },
        
        setChart : function(timeStackChart,t){
            charts[timeStackChart] = t;
        },                
        
        addData : function(chartId,data){        	        	        	       	    
        	var dataObject = {"unit" : "s","values" : data};
        	
        	function printData(){
				var dates = [];
				for(var i = 0; i < dataObject.values.length; i ++){
					dataObject.values[i][0] = dataObject.values[i][0] - new Date().getTimezoneOffset() * 60000;
					dates.push(new Date(dataObject.values[i][0]));
				}
				// console.log("getting data " , dates);
			}
        	
        	for(var t in charts){
        		for(var c in charts[t]._impl.dataWarehouse.dataSources){        			
        			if(c.toUpperCase() === chartId.toUpperCase()){
        				printData();
        				charts[t].addData(dataObject,chartId);
        				charts[t].paintNow();
        				break;
        			}
        		}        		
        	}                	
        },
        
        overrideInfoPopUp : function(chart){
            chart._impl.infoPopup.buildHeader = function(t0,t1){
                var biggerUnit, count, date, dateHtml, from, t0m, t1m, to, top, unit, unitName;
                unit = this.scene.displayUnit;
                count = Math.ceil(unit.numberOfUnits(t0, t1));
                unitName = count * unit.count === 1 ? this.scene.settings.localization.timeUnitsNames[unit.unit] : this.scene.settings.localization.timeUnitsNamesPlural[unit.unit];

                if (count === 1) {
                    t0m = moment(t0).utc();
                    t1m = moment(t1).utc();
                    from = t0m.format(this.scene.settings.localization.infoDates.minorTimeFormats[unit.unit]);
                    to = t1m.format(this.scene.settings.localization.infoDates.minorTimeFormats[unit.unit]);
                    dateHtml = "" + from + "-" + to;
                } else {
                    if (unit.unit === "d" || unit.unit === "M" || unit.unit === "y" || unit.unit === "ms") {
                        t1 -= 1;
                    }
                    t0m = moment(t0).utc();
                    t1m = moment(t1).utc();
                    biggerUnit = unit.getBigger() || unit;
                    if (unit.unit !== "y" && biggerUnit.roundTimeDown(t0) === biggerUnit.roundTimeDown(t1)) {
                        from = t0m.format(this.scene.settings.localization.infoDates.minorTimeFormats[unit.unit]);
                        to = t1m.format(this.scene.settings.localization.infoDates.minorTimeFormats[unit.unit]);
                        dateHtml = "" + from + " - " + to + "<small>(" + (count * unit.count) + " " + unitName + ")</small>";
                    } else {
                        from = t0m.format(this.scene.settings.localization.infoDates.fullTimeFormats[unit.unit]);
                        to = t1m.format(this.scene.settings.localization.infoDates.fullTimeFormats[unit.unit]);
                        dateHtml = "" + from + " - " + to + "<small>(" + (count * unit.count) + " " + unitName + ")</small>";
                    }
                }
                return "<em></em><div class='customInfoPopupTitle'><strong>" + dateHtml + "</strong></div>";
            };

            chart._impl.infoPopup.buildValues = function(info, selectedSeriesIndex, selectedStack){

                var color, group, hasHovered, hoveredOnly, out, param, scope, selected, series, stackOnly, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2;
                scope = this.scene.settings.info.advanced.showOnlyHoveredSeries ? this.scene.settings.info.advanced.scope : null;
                stackOnly = scope === "stack" || scope === "value" || (scope === "auto" && (selectedSeriesIndex != null));
                hoveredOnly = scope === "value";
                out = "";
                for (_i = 0, _len = info.length; _i < _len; _i++) {
                    group = info[_i];
                    if (stackOnly) {
                        hasHovered = false;
                        _ref = group.data;
                        for (_j = _ref.length - 1; _j >= 0; _j += -1) {
                            series = _ref[_j];
                            if (!series.config.showInLegend || (!series.values && !this.chart.scene.settings.info.showNoData)) {
                                continue;
                            }
                            hasHovered |= (selectedSeriesIndex !== null && series.config === this.scene.settings.computedSeries[selectedSeriesIndex]) || (selectedStack === group.stack);
                        }
                        if (!hasHovered) {
                            continue;
                        }
                    }
                    if (group.name && group.data.length > 1) {
                        out += "<h3>" + group.name + "</h3>";
                    }
                    out += "<table cellspacing=\"0\">";
                    _ref1 = group.data;
                    // for (_k = _ref1.length - 1; _k >= 0; _k += -1) {
                	for (_k = 0; _k <=_ref1.length - 1; _k += 1) {
                        series = _ref1[_k];
                        selected = selectedSeriesIndex !== null && series.config === this.scene.settings.computedSeries[selectedSeriesIndex];
                        if (!series.config.showInLegend || (!series.values && !this.chart.scene.settings.info.showNoData)) {
                            continue;
                        }
                        if (hoveredOnly && !selected) {
                            continue;
                        }

                        out += "<tr>";
                        color = series.config.style.lineColor || series.config.style.fillColor;
                        // if (selected) {
                        out += "<td><div class='DVSL-info-selected' style='	background-color: " + color + "'></div></td>";
                        // }

                        out += "<td>";
                        out += "" + (series.name || group.name);
                        out += "</td><td>";
                        if (!series.values) {
                            out += "No data";
                        } else if (series.values.count > 1 && this.scene.settings.info.aggregations && this.scene.settings.info.aggregations.length > 0) {
                            _ref2 = this.scene.settings.info.aggregations;
                            for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
                                param = _ref2[_l];
                                out += "" + numberFormat(series.values[param]) + ("&nbsp;(" + param + ")",0);
                            }
                        } else {
                            out += numberFormat(series.values.sum,0);
                        }
                        out += "</td></tr>";
                    }
                    out += "</table>";
                }

                return out;

            };

            function numberFormat(n, decPlaces, decSeparator, thouSeparator) {
                var i, j, sign;
                if (decPlaces == null) {
                    decPlaces = 2;
                }
                if (decSeparator == null) {
                    decSeparator = ".";
                }
                if (thouSeparator == null) {
                    thouSeparator = "&nbsp;";
                }
                n = parseFloat(n);
                sign = n < 0 ? "-" : "";
                i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "";
                j = (j = i.length) > 3 ? j % 3 : 0;
                return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
            };
        }
    }
});

app.factory('ZoomHorizontal', function($http){
    var charts = {};
    return{
    	mergeWithBaseSettings : function(customSettings){
    		var defaultSettings = {
    	            interaction: {
    	            	resizing:{
    	            		enabled:false
    	            	}
    	    	    },
    	    	    currentTime: {enabled: false},
                    chartTypes: {
                        columns: {style: {minHeight: 0}}
                    },
    	            info: {
    	                enabled: false,
    	                advanced: {
    	                    scope: "stack",
    	                    showOnlyHoveredSeries: true
    	                }
    	            },
    	            toolbars: {
    	              enabled: false,
    	              logScale: false,
    	              backButton: false,
    	              zoomOutButton: false,
    	              "export": false
    	            },
    	            timeAxis: {
                        enabled: false
                    },
                    toolbars: {
                        "default" : "toolbarBare",
                        displayUnit : false,
                        "export" : false,
                        logScale : false,
                        periodButtons : false,
                        periodSelection : false,
                        zoomOutButton : false,
                        backButton: false
                    },
                    info: {
                        enabled: false,
                        advanced: {
                            scope: "stack",
                            showOnlyHoveredSeries: true
                        }
                    }
    	    	};
    		angular.extend(customSettings,defaultSettings);
    	},
    	createLegend: function(facet_chart, config,preloaded,data){
    		console.log(config,data)
    		var sc = $(config.seriesId);     		
            for (var x=config.series.length-1;x>=0;x--){
                var s = config.series[x];
                var activityObj = _.findWhere(data,{activity:s.name});
                if(config.series[x].hide === undefined || !config.series[x].hide){
                    var sj = $("<a rel=\"" + s.id + "\"><span fillColor="+s.style.fillColor+" style=\"background-color:" + s.style.fillColor + "\"></span> " + s.name + ": " + comma(activityObj.activities) + "</a>");                    
                    sc.append(sj);
                    sj.on("click", function(ev){
                    	
                        var sr = config.series;
                        var enabled;
                        var id = $(this).attr("rel").replace("r_", "");
                        var notEnabledArray = _.where(config.series,{enabled:false});
                        if(    (config.series.length - notEnabledArray.length) === 1 &&  !$(this).hasClass("zoomcharts-series-hidden")  ){
                        }else{
                        	
                        	  if (!$(this).hasClass("zoomcharts-series-hidden")){
                                  enabled = false;
                                  $(this).addClass("zoomcharts-series-hidden");
                                  $(this).children("span").css("border-color", $(this).children("span").attr("fillColor") );
                                  $(this).children("span").css("background-color", "");
                              } else {
                                  enabled = true;
                                  $(this).removeClass("zoomcharts-series-hidden");
                                  $(this).children("span").css("background-color", $(this).children("span").attr("fillColor") );
                                  $(this).children("span").css("border-color", "");
                              }
                              var value = 0;
                              for (var x in sr){
                                  if (sr[x].id.indexOf(id) > -1){
                                      if (enabled && !config.stacks[sr[x].id].enabled){
                                          continue;
                                      }
                                      sr[x].enabled = enabled;
                                  }
                                  if (!enabled || (enabled && sr[x].id.indexOf(id) < 0)){
      	                            if ((sr[x].enabled !== undefined && !sr[x].enabled)
      	                            		|| (config.series[sr[x].data.index-1].enabled !== undefined && !config.series[sr[x].data.index-1].enabled)){	                            		                            	
      	                            	value += preloaded.values[0][sr[x].data.index];
      	                            }
                                  }
                              }
                              var sum = preloaded.values[0].reduce(function(pv, cv) { return pv + cv; }, 0);
                              sum -= value;
                              var tSettings = {
                              		valueAxis: {
                              			"default": {
                              				maxValue: sum
                              			}
                              		}
                              	};
                              facet_chart.updateSettings(tSettings);
                              facet_chart.replaceSeries(sr);
                              
                        }
                        
                      
                    });
                }
            }
            var st = $(config.stackId);
            stacks = config.stacks;
            for (var x in stacks){
                var s = stacks[x].name;
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
    	}
    };
});

app.factory('Services', function ($http, $q) {
    return {
        getServerData: function () {
            var d = $q.defer();
            $http.get('resources/data/systemData.json')
                .then(function (response) {
                    d.resolve(response.data);
                }, function err(reason) {
                    d.reject(reason);
                });
            return d.promise;
        },
        uploadFilteredViewJson: function (fn, obj) {
            var d = $q.defer();
            $http.post('uploadFiltered', obj, {
                headers: {
                    'fileName': fn
                }
            }).then(function (response) {
                    d.resolve(response.data);
                }, function err(reason) {
                    d.reject(reason);
                });
            return d.promise;
        },
        csvProcess: function (formData) {
            var d = $q.defer();
            $http.post('mashup/upload', formData, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: function (data) {
                    return data;
                }
            }).then(function (response) {
                    d.resolve(response.data);
                }, function err(reason) {
                    d.reject(reason);
                });
            return d.promise;
        },
        dynamicSort: function (property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },
        handleDragOver: function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';            
        },
        filterServerArray: function (a1, a2, desk1, ckey1) {
            var result = [],
                key1, key2, desk1, desk2;
            for(i = 0, j = a2.length; i < j; i++) {
                key1 = a2[i][ckey1];
                desk1 = a2[i][desk1];
                for(k = 0, l = a1.length; k < l; k++) {
                    key2 = a1[k]["Key"];
                    desk2 = a1[k]["Business_unit_name"];
                    if(key1 === key2) {
                        result.push(a1[k]);
                    }
                }
            }
            return result;
        },
        getLibraryData: function () {
            var d = $q.defer();
            $http.get('resources/data/library.example.json')
                .then(function (response) {
                    d.resolve(response.data);
                }, function err(reason) {
                    d.reject(reason);
                });
            return d.promise;
        }
    };
});

app.service('ZoomDataSvc', function(){
        function ZoomDataApi(dataSrc, dataSchema){
            var self = this;
            var loaded = false;
            loadCSVObj(dataSrc, null, dataSchema, "\t",function(data){
                bibox.setData(data);
                self.loaded = true;
            });
        }

        ZoomDataApi.prototype.getData = function(id, year, month, week, callback){
            var self = this;
            if (!this.loaded){
                setTimeout(function(){self.getData(id,year,month,week,callback);}, 100);
                return;
            }
            var data = bibox.getSub({manager_id: id}, null, "obj");
            if (!data.length){
                data = bibox.getSub({id:id},null, "obj");
                data.style = {expandable: false}
            }
            var r = {
                values: data
            }
            callback(r);
        }
        ZoomDataApi.prototype.getSummaryData = function(manager_id, from, to, unit, callback){
            var self = this;
            if (!this.loaded){
                setTimeout(function(){self.getSummaryData(manager_id,from, to, unit,callback);}, 100);
                return;
            }
            var data = {
                unit: unit,
                "values": [
                    [
                        1357041600000,
                        100
                    ],
                    [
                        1359720000000,
                        200
                    ],
                    [
                        1362139200000,
                        300
                    ],
                    [
                        1364814000000,
                        400
                    ],
                    [
                        1367406000000,
                        500
                    ],
                    [
                        1370084400000,
                        600
                    ],
                    [
                        1372676400000,
                        700
                    ],
                    [
                        1375354800000,
                        800
                    ],
                    [
                        1378033200000,
                        900
                    ],
                    [
                        1380625200000,
                        1000
                    ],
                    [
                        1383307200000,
                        1100
                    ],
                    [
                        1385899200000,
                        1200
                    ],
                    [
                        1388577600000,
                        1300
                    ],
                    [
                        1391256000000,
                        1400
                    ],
                    [
                        1393675200000,
                        1500
                    ],
                    [
                        1396350000000,
                        1600
                    ],
                    [
                        1398942000000,
                        1700
                    ],
                    [
                        1401620400000,
                        1800
                    ],
                    [
                        1404212400000,
                        1900
                    ],
                    [
                        1406890800000,
                        2000
                    ],
                    [
                        1409569200000,
                        2100
                    ],
                    [
                        1412161200000,
                        2200
                    ],
                    [
                        1414843200000,
                        2300
                    ],
                    [
                        1417435200000,
                        2400
                    ]
                ]};
            callback(data);
    }
    ZoomDataApi.prototype.hasData = function(id){
        var data = bibox.getSub({manager_id: id});
        return data.length;
    }


    this.getZoomDataApi = function(dataSrc, dataSchema){
        return (new ZoomDataApi(dataSrc, dataSchema));
    } 
})
.service('SeacrhService', function(){
    function SearchAPI(){
        this.levels = [];
        this.data = {};
    }

    SearchAPI.prototype.setData = function(data){
        this.data = data;
    }

    SearchAPI.prototype.getSub = function(conditions, fields, format){
        var r = [];
        
        for (var x in this.data.values){
            var good = true;
            var vv = this.data.values[x];
            for (var y in conditions){
                var value = conditions[y];
                if (!this.data.values[x][y] && value){
                    good = false;
                    break;
                }
                if (this.data.values[x][y] != value){
                    good = false;
                    break;
                }
            }
            if (good){
                if (format == "obj"){
                    var row = {}
                    if (fields){
                        for (var y in fields){
                            row.push(this.data.values[x][fields[y]]);
                        }
                    } else {
                        for (var y in this.data.values[x]){
                            row[y] = this.data.values[x][y];
                        }
                    }
                } else {
                    var row = [];
                    for (var y in fields){
                        row.push(this.data.values[x][fields[y]]);
                    }
                }
                r.push(row);
            }
        }
        return r;
    }

    SearchAPI.prototype.addLevel = function(options){
        this.levels.push(options);
    }
    SearchAPI.prototype.fetch = function(id,limit,offset,success,error){
        var ids = [];
        var level = 0;
        if (id){
            ids = id.split(" ");
            level = ids.length;
        }
        var options = this.levels[level];
        var r = [];
        var response = {
            values: []
        }
        var expandable = (level >= this.levels.length-1)?false:true;
        if (options.group){
            for (var x in this.data.values){
               var row = this.data.values[x];
               if (!this.isValid(ids, row)){
                    continue;
               }
               var key = row[options.group];
               if (typeof(options.value) === "function"){
                    value = options.value(row);
               } else {
                    value = row[options.value];
               }
               if (typeof(r[key]) == "undefined"){
                    r[key] = value;
               } else {
                    r[key] += value;
               }
            }
            for (var k in r){
                response.values.push({value: r[k], style: {label: k, expandable: expandable}, id: (id?id+" ":"") + escape(k)});
            }
        } else if (options.facet){
            for (var x in this.data.values){
                var row = this.data.values[x];
                if (!this.isValid(ids, row)){
                    continue;
                }
                /* facet aggregates by predefined fields, values are arbitrary */
                for (var f in options.facet){
                    if (typeof(options.value[f]) === "function"){
                        value = options.value[f](row);
                    } else {
                        value = row[options.value[f]];
                    }
                    if (typeof(r[f]) == "undefined"){
                        r[f] = value;
                    } else {
                        r[f] += value;
                    }
                }
            }
            for (var k in r){
                response.values.push({value: r[k], style: {label: options.facet[k], expandable: expandable}, id: (id?id+" ":"") + escape(k)});
            }
        }
        if (!response.values.length){
            response.error = "No Matching data";
        }
        success(response);
    }
    SearchAPI.prototype.isValid = function(id, row){
        var level;
        for (var x in id){
            var m = unescape(id[x]);
            if (level=this.levels[x]){
                if (level.group){
                    if (row[level.group] != m){
                        return false;
                    }
                } else if (level.facet){
                    /* nothing to filter here */
                }
            }
        }
        return true;
    }

    this.getSearchInstance = function(){
        return new SearchAPI();
    };
})
.service('HighChartsService', function(){
	
	this.getBaseLineSettings =function(container){
		var baseSettings = {
		        chart: {
		            zoomType: 'x',
		            events: {
		            	// load:loadChartData
		            },
		            renderTo:container,
		            type:'area'
		        },
		        title:{
		        	text:''
		        },
		        exporting: { enabled: false },
		        legend:{
		        	enabled:false
		        },
		        plotOptions: {
		            area: {
		                stacking: 'normal'
		            },
		            series:{
		            	lineWidth:0,
		            	connectNulls:true
		            }
		        },
		        yAxis:{
		        	min:1,
		        	allowDecimals: false
		        },
		        xAxis: {
		            type: 'datetime',
		            tickInterval: 3*3600 * 1000,
		            min: moment().startOf("day").valueOf(),
		            max: moment().endOf("day").valueOf(),
		            dateTimeLabelFormats : {
		                hour: '%I %p',
		                minute: '%I:%M %p'
		            }
		        },
		        tooltip: {
		            shared: true,
		            useHTML: true,
		            headerFormat: '<small>{point.key}</small><table>',
		            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
		                '<td style="text-align: right"><b>{point.y}</b></td></tr>',
		            footerFormat: '</table>'
		        }
		}
		
		return baseSettings;
	};
	
	this.getBasePieSettings = function(container){
	
		var baseSettings = { 
			
			chart: {
	            plotBackgroundColor: null,
	            plotShadow: false,
	            renderTo:container,
	            type:'pie'
	        },
	        exporting: { enabled: false },
	        title: {
	            text: ''
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	            	allowPointSelect: true,
	 	            cursor: 'pointer',
	 	            dataLabels:{
	 	            	enabled:false
	 	            },
	 	            showInLegend:true
	            }
	        }
	        
	    }
		
		return baseSettings;
	}
	
	
	this.getStackedBaseSettings = function(container){
		
		var baseSettings = {
			chart: {
                type: 'column',
                renderTo:container,
                spacingBottom: 100
            },
            title: {
                text: ''
            },
            yAxis: {
                min: 0
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 70,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
                useHtml:true
            },
            tooltip: {
            	shared:true,
            	pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            }
		}
		
		return baseSettings;
	}
	
	this.getSemiDonutBaseSettings = function(container,func){
		
		var baseSettings = {
			chart: {
	            type: 'bar',
	            renderTo:container,
	            backgroundColor:'rgba(255, 255, 255, 0.1)',
	            height:150,
	            events:{
	            	click:func
	            }
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: [''],
	            lineWidth:0
	        },
	        yAxis: {
	            min: 0,
	            labels:{
	            	enabled:false
	            },
	            title: {
	                text: ''
	            },
	            minorGridLineWidth: 0,
	            gridLineWidth: 0
	        },
	        legend: {
	            reversed: true,
	            labelFormatter: function () {
	                return this.name + ": " + this.yData[0].format();
	            }
	        },
	        tooltip:{
	        	useHTML:true,
	        	enabled:true,
	        	headerFormat:'',
	        	pointFormat:'<span style="color:{series.color}">{series.name}</span>:<b>{point.y}</b>'
	        },
	        exporting:{
	        	enabled:false
	        },
	        plotOptions: {
	            series: {
	                stacking: 'normal'
	            },
	            bar: {
	                dataLabels: {
	                    enabled: true,
	                    distance : -50,
	                    formatter: function() {
	                      return ""
	                     },
	                    style: {
	                        color: 'white'
	                    }
	                }
	            }
	        }
 	    }
		
		return baseSettings;
	}
	
	this.getBaseReachUtilDonuts = function(container,func){
		
		var baseSettings = {
		        chart: {
		            type: 'pie',
		            renderTo:container,
		            width:350,
		            height:350,
		            events:{
		            	click:func
		            }
		        },
		        title: {
		            text: ''
		        },
		        yAxis: {
		            title: {
		                text: ''
		            }
		        },
		        tooltip:{
		        	useHTML:true,
		        	enabled:true,
		        	headerFormat:'',
		        	pointFormat:'<b>{point.y}</b>'
		        },
		        exporting:{
		        	enabled:false
		        },
		        plotOptions: {
		            pie: {
		                shadow: false,
		                center: ['50%', '50%'],
				        dataLabels:{
		 	            	enabled:false
		 	            },
		        		showInLegend:false
		            }
		        }
		    }
		
		return baseSettings;
		 
	}
	this.createLevels = function(donutData){
		
		var levels = 4;
		var data = {};
		$.each(donutData, function(key,obj){
			for(var i=0;i<levels;i++){
				createLevel(data,i,obj);
			}

		});
		
		return data;
	}
	
	this.getLevel = function(pillNames,level,data){
		
		var displayData = [];
		if(level === 0){
			
			var propValue;
			for(var propName in data) {
				var pieObj = {}
				propValue = data[propName]
				pieObj.name = propValue.name;
				pieObj.y = propValue.total;
				pieObj.level = propValue.level;
				displayData.push(pieObj)
			}			
		}
		
		if(level === 1){
			
			var propValue;
			var firstLevel = pillNames[0];
			
			for(var propName in data[firstLevel]) {
				var pieObj = {}
				if( typeof data[firstLevel][propName] === "object"){
					propValue = data[firstLevel][propName]
					pieObj.name = propValue.name;
					pieObj.y = propValue.total;
					pieObj.level = propValue.level;
					displayData.push(pieObj)
				}
			}	
		}
		
		if(level === 2){
			
			var propValue;
			
			var firstLevel = pillNames[0];
			var secondLevel = pillNames[1];
			
			for(var propName in data[firstLevel][secondLevel]) {
				var pieObj = {}
				if( typeof data[firstLevel][secondLevel][propName] === "object"){
					propValue = data[firstLevel][secondLevel][propName]
					pieObj.name = propValue.name;
					pieObj.y = propValue.total;
					pieObj.level = propValue.level;
					displayData.push(pieObj)
				}
			}	
		}
		
		if(level === 3){
			
			var propValue;
			
			var firstLevel = pillNames[0];
			var secondLevel = pillNames[1];
			var thirdLevel = pillNames[2];
			
			for(var propName in data[firstLevel][secondLevel][thirdLevel]) {
				var pieObj = {}
				if( typeof data[firstLevel][secondLevel][thirdLevel][propName] === "object"){
					propValue = data[firstLevel][secondLevel][thirdLevel][propName]
					pieObj.name = propValue.name;
					pieObj.y = propValue.total;
					pieObj.level = propValue.level;
					displayData.push(pieObj)
				}
			}	
		}
		return displayData;
	}
	
	function createLevel(data,i,obj){
		
		var levelNames = ["program","award_type","award_level","name"];
		var rootNode = obj[ levelNames[0] ];
		var node = "";
		
		if(i === 0){
			
			if(!data[ rootNode ]){
				data[ rootNode ] = {};
				data[ rootNode ].total = 0;
				data[ rootNode ].level = i;
				data[ rootNode ].name = rootNode;
			}
			data[ rootNode ].total += obj.value 
		}
		
		if(i === 1){	
			
			node = obj[ levelNames[1] ];
			
			if(!data[ rootNode ][ node ]){
				data[ rootNode ][ node ] = {};
				data[ rootNode ][ node ].total = 0;
				data[ rootNode ][ node ].level = i;
				data[ rootNode ][ node ].name = node;
			}
			data[ rootNode ][ node ].total += obj.value 
			
		}
		
		if(i === 2){
			
			var firstNode = obj[ levelNames[1] ];
			
			node = obj[ levelNames[2] ];
			
			if(!data[ rootNode ][ firstNode ][ node ]){
				data[ rootNode ][ firstNode ][ node ] = {};
				data[ rootNode ][ firstNode ][ node ].total = 0;
				data[ rootNode ][ firstNode ][ node ].level = i;
				data[ rootNode ][ firstNode ][ node ].name = node;
			}
			data[ rootNode ][ firstNode ][ node ].total += obj.value 
			
		}
		
		if(i === 3){
			
			var firstNode = obj[ levelNames[1] ];
			var secondNode = obj[ levelNames[2] ];
			var node = obj[ levelNames[3] ];
			
			if(!data[ rootNode ][ firstNode ] [ secondNode ][ node ]){
				data[ rootNode ][ firstNode ] [ secondNode ][ node ] = {};
				data[ rootNode ][ firstNode ] [ secondNode ][ node ].total = 0;
				data[ rootNode ][ firstNode ] [ secondNode ][ node ].level = i;
				data[ rootNode ][ firstNode ] [ secondNode ][ node ].name = node;
			}
			data[ rootNode ][ firstNode ] [ secondNode ][ node ].total += obj.value 
			
		}
	}
	
});

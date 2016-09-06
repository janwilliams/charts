angular.module('FiltersCtrl', []).controller('FiltersController',function($scope, $http,InitialSiteService) {
	
	InitialSiteService.hideInitialLoader();
	
                    var dataUrl;
					/* next/prev button for sliding data */
                        var total=0;
                        var totalTrackGraphClick=0;
                         $('#next-column').click(function(event) {
                                event.preventDefault();
                                total++;
                                	$('.table-container').animate({scrollLeft:'+=302'}, 'slow');   
                              
                                     
                            });
                            $('#previous-column').click(function(event) {
                                event.preventDefault();
                                total= total--;
                                	$('.table-container').animate({scrollLeft:'-=302'}, 'slow');  
                                  
                            });

					/* modal initialiazation */
					$('#myModal').modal({
						keyboard : false,
						show : false
					});
					$("a[data-target=#myModal]").click(function(ev) {
						 ev.preventDefault();
						 initDiv();

						    //console.log('CLICKED ME');
						      var go=302*total + 915;
						      var manageslide= false;
						      for(var i=1;i<=total;i++){
						    	  $('#previous-column').click();
						    	  manageslide= true;
						    	 
						      }
					    	  // $('.table-container').animate({scrollLeft:'-='+go});
					    	  if(true){
					    		  $('#typeheadinput').val('');
					    		  $("#myModal").modal("show"); 
					    	  }
						      total = 0;
						  
						});
					/*initialize the div */
					function initDiv(){
						resetDivValues(2);
						$("#div1collapse1result").empty();
					    $('#div1collapse3').show();
					}
					$("#myModal").on('hidden.bs.modal', function () {
						dataUrl = 'resources/resources/data/kobegamelog2.csv';
						//$("#browsefiltergraph").empty();
				    	//render(dataUrl);
					
					});
					/*/
					$("#myModal").on('hidden.bs.modal', function () {
						console.log('Modal Has been closed!!');
						//$("#myModal").removeClass('fade').modal('hide');
						//$("#myModal").data('modal', null);
						// $("#myModal").data('bs.modal', null);
						//$("#myModal").removeClass('fade').modal('hide');
					    //$(this).data('bs.modal', null);
						$("#myModal").removeData();
					});
					*/
					/*
					$("a[data-target=#myModal]").click(function(ev) {
					 ev.preventDefault();
					    var target = $(this).attr("href");
					       $("#myModal").modal("show"); 
					  
					});
					*/
					/*/
					$('body').on('hidden.bs.modal', '.modal', function (e) {
						 //$(e.target).removeData('bs.modal');
						  console.log('here is the thing');
						 // $(this).removeData('toggle');
						  // $('#myModal').removeData();
						 // $('#myModal').removeData('modal');
						  //$('#myModal').data('bs.modal', null);
						  //$(this).data('modal', null);
						  //$('#myModal').removeData('bs.modal')
						  //$(this).data('bs.modal', null);
						 // $('#myModal').data('bs.modal',null);
						});
			*/
					/* createing json for typehead suggestion */
					/*all the manager level(0-5) */
					var level0Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level0manager.json'
					});

					var level1Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level1manager.json'
					});
					var level2Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level2manager.json'
					});
					var level3Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level3manager.json'
					});
					/* 
					var level4Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level4manager.json'
					});
					var level5Manager = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level5manager.json'
					});*/
					/* business unit*/
					
					var level1BusinessUnit = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level1businessunit.json'
					});
					var level2BusinessUnit = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level2businessunit.json'
					});
					var level3BusinessUnit = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level3businessunit.json'
					});
					var level4BusinessUnit = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level4businessunit.json'
					});
					var level5BusinessUnit = new Bloodhound({
						datumTokenizer : Bloodhound.tokenizers.obj
								.whitespace('team'),
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						prefetch : 'resources/data/level5businessunit.json'
					});
					/*init manager typehead */
					level0Manager.initialize();
					level1Manager.initialize();
					level2Manager.initialize();
					level3Manager.initialize();
					//level4Manager.initialize();
					//level5Manager.initialize();
					
					/*init businessunit manager */
					level1BusinessUnit.initialize();
					level2BusinessUnit.initialize();
					level3BusinessUnit.initialize();
					level4BusinessUnit.initialize();
					level5BusinessUnit.initialize();
					
					$('#multiple-datasets .typeahead')
							.typeahead(
									{
										highlight : true
									},
									{
										name : 'manager',
										displayKey : 'team',
										source : level0Manager.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 0-Manager</h3>'
										}
									},
									{
										name : 'manager',
										displayKey : 'team',
										source : level1Manager.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 1-Manager</h3>'
										}
									},
									{
										name : 'manager',
										displayKey : 'team',
										source : level2Manager.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 2-Manager</h3>'
										}
									},	
										{
											name : 'manager',
											displayKey : 'team',
											source : level3Manager.ttAdapter(),
											templates : {
												header : '<h3 class="league-name">Level 3-Manager</h3>'
											}
										},
										
										/*{
											name : 'manager',
											displayKey : 'team',
											source : level4Manager.ttAdapter(),
											templates : {
												header : '<h3 class="league-name">Level 4-Manager</h3>'
											}
										},
										{
											name : 'manager',
											displayKey : 'team',
											source : level5Manager.ttAdapter(),
											templates : {
												header : '<h3 class="league-name">Level 5-Manager</h3>'
											}
										},*/
										{
											name : 'manager',
											displayKey : 'team',
											source : level1BusinessUnit.ttAdapter(),
											templates : {
												header : '<h3 class="league-name">Level 1-Line of Business</h3>'
											}
										},
										{
											name : 'manager',
											displayKey : 'team',
											source : level2BusinessUnit.ttAdapter(),
											templates : {
												header : '<h3 class="league-name">Level 2-Line of Business</h3>'
											}
										},	
											{
												name : 'manager',
												displayKey : 'team',
												source : level3BusinessUnit.ttAdapter(),
												templates : {
													header : '<h3 class="league-name">Level 3-Line of Business</h3>'
												}
											},
											{
												name : 'manager',
												displayKey : 'team',
												source : level4BusinessUnit.ttAdapter(),
												templates : {
													header : '<h3 class="league-name">Level 4-Line of Business</h3>'
												}
											},
											{
												name : 'manager',
												displayKey : 'team',
												source : level5BusinessUnit.ttAdapter(),
												templates : {
													header : '<h3 class="league-name">Level 5-Line of Business</h3>'
												}
									});
					
					/* binding click event to expand */
					$("#modalcontainer").on(
							"click",
							".btnClass",
							function() {
								var jqob = $(this);
								var elemParentId = jqob.parent().parent()
										.parent().attr('id');
								var attributeText = $(this).text();
								var attributeId = $(this).attr("id");
								var attributeName = $(this).attr("name");
								//console.log('Attribute Name: ' + attributeName);

								var divValue = parseInt(elemParentId.replace(
										/\D/g, ""));
								$("#" + elemParentId).find(".selectedChild")
										.removeClass("selectedChild");
								$('#' + attributeId).addClass("selectedChild");
								if (divValue >= 1) {
									divValue++;
									resetDivValues(divValue);
									generateDynamicDiv(divValue, attributeId,
											attributeText,attributeName);
								}

								return false;
							});
					
					/*generate suggestion dynamically */
                    function generateSuggestionDynamically(){
                    	var cateGoryJson = {};
                    	var uniqueNames = [];
                    	$.ajax({	
                    	dataType : "json",
                    	url : 'resources/data/convertcsv.json',
                    	success : function(result) {
                    		var json = $.parseJSON(JSON.stringify(result));
                    		var objects = [];
                    		var typeHeadArray=[];
                    		var levelName=[];
                    		var allId =[];
                    		
                    		objects = getObjects(json,'LEVEL','');
                    	    /*get all the level from the josn */
                    		$.each(objects,function() {
								allId.push(this.LEVEL);
								
							});
                    	
                    		  /*create unique array with level */
                    			$.each(allId, function(i, el){
                    			    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                    			});
                    			
                    		    /*insert every object level wise */
                    			$.each(uniqueNames,function(index,value) {
                    				
                    				var levelWiseObject = [];
                    				levelWiseObject = getObjects(json,'LEVEL',value);
                    				var dynamicKey =[];
                    				var dynamicKeyval = 'LEVEL'+value;
                    				dynamicKey.push(levelWiseObject);
                    				cateGoryJson[dynamicKeyval]= dynamicKey;
                    				levelName.push(dynamicKeyval);
                    		    });	
                    			
                    			/*push into the typheadarray */
                    			$.each(cateGoryJson,function(index,value) {
                    				typeHeadArray.push(JSON.stringify(cateGoryJson));
                    				
    
                    		    });
                    			/* testing level index value with the typehead array*/
                    			$.each(typeHeadArray,function(index,value) {
                    			      console.log('After array iteration: ' + value );
                    		    });
                    			
                    		    var bloodHoundArray=[];
                    		    
                    		    $.each(typeHeadArray,function(index,value) {
                    		    	
                    		    	bloodHoundArray.push( new Bloodhound({
                  						                datumTokenizer : Bloodhound.tokenizers.obj.whitespace('MANAGER_FIRST_NAME'),
          						                        queryTokenizer : Bloodhound.tokenizers.whitespace,
          						                        local : value }));
                    				
    
                    		    });
                    		    $.each(bloodHoundArray,function(index,value) {
                    		    	bloodHoundArray[index].initialize();
                    		    	console.log(value);
                    		    });
/*
            					$('#multiple-datasets .typeahead')
            							.typeahead(
            									{
            										highlight : true
            									},
            									{
            										name : 'nba-teams',
            										displayKey : 'team',
            										source : nbaTeams.ttAdapter(),
            										templates : {
            											header : '<h3 class="league-name">Manager Name</h3>'
            										}
            									},
            									{
            										
            			                    		    	
            												name : 'manager-list',
                    										displayKey : 'MANAGER_FIRST_NAME',
                    										source :bloodHo undArray[0].ttAdapter(),
                    										templates : {
                    											header : '<h3 class="league-name">Level 0</h3>'
                    										}
      
            								
            									});*/
            					
                    	
                    			
                    		}
                    	});
       
                    	
                    }
					/* dynamic div generation */
					function generateDynamicDiv(divValue, id, headingValue,attributeName) {
						var divResult = '#div' + divValue + 'collapse1result';
						var divHeading = '#div' + divValue + "collapse1heading";
						var currentDivCollapse = '#div' + divValue
								+ 'collapseOne';
						 $('#blockuiid').block({
				                message: '<h1 style="font-size: 1em;font-weight: bold;"><img style="width:30px;height:30px;vertical-align:middle" src="images/ajax-loader.gif" /> Loading list</h1>',
				                css: {
				                    border: '1px solid #81BFD5'
				                }
				            });
						 
						    var dataUrl = 'resources/data/usbankmanager.json';
							var managerData = true;
							//console.log('ID: ' + idToSearch + 'Category: ' + cateGoryName);
							if (attributeName.trim() != "manager"){
								dataUrl = 'resources/data/usbbusinessunithierarchy.json';
								managerData = false;
							}
						 
						 
						$.ajax({
									dataType : "json",
									url : dataUrl,
									success : function(result) {
										var json = $.parseJSON(JSON
												.stringify(result));
										var objects = [];
								
										if(managerData){
										    objects = getObjects(json,'SYSTEM_USERS_MANAGERS_ID',parseInt(id));
										  }
										else{
											 objects = getObjects(json,'PARENT_BUSINESS_UNIT_ID',parseInt(id));
										}	
										var divCount = 1;
										$(divResult).empty();
										$(divHeading).empty();
										// $(divHeading).val(headingValue);
										$(divHeading).append(
												'<a href="javascript: void(0)"><h4 class="panel-title" data-toggle="collapse" data-target="#div'
														+ divValue
														+ 'collapseOne">'
														+ headingValue
														+ '</h4></a>');
										
										if(managerData){
										$.each(objects,
														function() {
															// console.log('Iterating
															// the result ID: '+
															// this.SYSTEM_USER_ID);
															$(divResult)
																	.append(
																			'<a href="javascript: void(0)'
																					+ this.SYSTEM_USER_ID
																					+ '" id="'
																					+ this.SYSTEM_USER_ID
																					+ '" name="manager" class="list-group-item btnClass"> '
																					+ this.USER_FIRST_NAME
																					+ ','
																					+ this.USER_LAST_NAME
																					+ '</a>');
														});
										
										
										} else{
											$.each(objects,
													function() {
														// console.log('Iterating
														// the result ID: '+
														// this.SYSTEM_USER_ID);
														$(divResult)
																.append(
																		'<a href="javascript: void(0)'
																				+ this.CHILD_BUSINESS_UNIT_ID
																				+ '" id="'
																				+ this.CHILD_BUSINESS_UNIT_ID
																				+ '" name="manager"  class="list-group-item btnClass"> '
																				+ this.CHILD_BUSINESS_UNIT_CD
																				+ ','
																				+ this.CHILD_BUSINESS_UNIT_NAME
																				+ '</a>');
													});
										}
										
										$(currentDivCollapse).collapse('show');
										 $('#blockuiid').unblock();
										if (divValue > 3 && divValue < 11) {
											$('#next-column').click();
										}
									}
								});

					}
					/* resetting previous div values */
					function resetDivValues(initPosition) {
						//console.log('Remove the position: ' + initPosition);
						for (var i = initPosition; i < 12; i++) {
							$("#div" + i + "collapse1result").empty();
							$("#div" + i + "collapse1heading").empty();
						}
					}

					/* binding click even to search button */
					$(".searchfilterbutton")
							.click(function() {
										var idToSearch = parseInt($("#typeheadinputhidden").val().replace(/\D/g, ""));
										var cateGoryName = $("#typeheadinputhidden").val().replace(/\d+/g,'');
										var dataUrl = 'resources/data/usbankmanager.json';
										var managerData = true;
										//console.log('ID: ' + idToSearch + 'Category: ' + cateGoryName);
										if (cateGoryName.trim() != ",Manager"){
											dataUrl = 'resources/data/usbbusinessunithierarchy.json';
											managerData = false;
										}
										 $('#blockuiid').block({
								                message: '<h1 style="font-size: 1em;font-weight: bold;"><img style="width:30px;height:30px;vertical-align:middle" src="images/ajax-loader.gif" /> Loading list</h1>',
								                css: {
								                    border: '1px solid #81BFD5'
								                }
								            });
										$.ajax({
													dataType : "json",
													url : dataUrl,
													success : function(result) {
														var json = $.parseJSON(JSON.stringify(result));
														var objects = [];
														if(managerData){
														    objects = getObjects(json,'SYSTEM_USERS_MANAGERS_ID',idToSearch);
														  }
														else{
															 objects = getObjects(json,'PARENT_BUSINESS_UNIT_ID',idToSearch);
														}
														
														var divCount = 1;
														$("#div1collapse1result")
																.empty();
														$("#div1collapse1heading")
																.empty();
														resetDivValues(2);
													
														if(managerData){
															//console.log('Manager Data');
															$("#div1collapse1heading").append(
															'<a href="javascript: void(0)"><h4 class="panel-title" data-toggle="collapse" data-target="#div1collapseOne" disabled>Manager</h4></a>');

														$.each(objects,function() {$("#div1collapse1result").append(
																							'<a href="#'
																									+ this.SYSTEM_USER_ID
																									+ '" id="'
																									+ this.SYSTEM_USER_ID
																									+ '" name="manager" class="list-group-item btnClass"> '
																									+ this.USER_FIRST_NAME
																									+ ','
																									+ this.USER_LAST_NAME
																									+ '</a>');
																		});
														
														}
														else{
															$("#div1collapse1heading").append(
															'<a href="javascript: void(0)"><h4 class="panel-title" data-toggle="collapse" data-target="#div1collapseOne">Line of Business</h4></a>');

															$.each(objects,function() {$("#div1collapse1result").append(
																	'<a href="#'
																			+ this.CHILD_BUSINESS_UNIT_ID
																			+ '" id="'
																			+ this.CHILD_BUSINESS_UNIT_ID
																			+ '" name="business" class="list-group-item btnClass"> '
																			+ this.CHILD_BUSINESS_UNIT_CD
																			+ ','
																			+ this.CHILD_BUSINESS_UNIT_NAME
																			+ '</a>');
												          });
														}
														
														
										//$("#line2").val("");
										                $("#div1collapse3").hide();
														$('#div1collapseOne').collapse('show');
														$('#blockuiid').unblock();

													}
												});

									});
					$('input[name=typeheadinput]').on('typeahead:selected',
							function(evt, item) {
								// console.log(item.category);
								$("#typeheadinputhidden").val(item.category);
							});
					/*tag filter initialization */
					//var arrayofLevels = [];
					
					/*load manager 
					for(var i=0;i<=5;i++){
						var dataload ='resources/data/level'+i+'manager.json';
					    $.getJSON(dataload, function (json) {
						
						for (var key in json) {
						    if (json.hasOwnProperty(key)) {
						        var item = json[key];
						        arrayofLevels.push({
						            name: item.team,
						           
						        });            
						    }
						}
						});
					}*/
					 
					 var arrayofLevels = ['Richard,Davis','Tammy,Barrett','Jennie,Carlson','Andrew,Cecere',
					                      'James,Chosy','Terrance,Dolan','Zachary,Boyers',
					                      'Patricia,Cline','Craig,Gifford','Daniel,Good','Thomas,Lutz',
					                      'Dale,Smith','Linda,Esau','Yiqun,Jia',
					                      'Jonathan,Tholen','Paul,Malik','Ram,Rao','Christopher,Schnurr',
					                      'Alana,Avis','Mary,Jones','Steven,Kehr','Robert,McKay',
					                      '399338,Brown,Andre J','358137,Rea-Jordan,Mary Jo','289114,Berrie,Christalyn','483247,Broz,Logan L A',
					                      '458907,Szewczyk,Patrick Francis','328788,Shafer,Timothy Scott','458175,Johnson,Shannon Lanea',
					                      '183094,Reising,Milda K','179143,Business',
					                      '297665,Jensen,Peggy L','274914,Burkhart,Evelyn Joyce','431727,Ford,Jennifer M',
					                      '293631,Legg,Kathleen Grace','291925,Dassow,John Reid',
					                      '288105,Parker,Kyle K','287666,Sigler,Anthony L','317498,Coss,Tim Joel',
					                      '363234,Paddock,Margaret J','400388,Amador,John R','186614,Campbell,Caroline F','177701,Edwards,Lorren K','397648,James,Thomas Lipscomb','316810,Ryall,Andrew S','223592,Mikos,Richard','199258,Jones,Mary Rita','453735,Johnson,Gailyn Ann','302088,Leach,Timothy John'
					                      ];
					 /*
					 for(var i=0;i<=5;i++){
						 
					 var dataload ='resources/data/level'+i+'manager.json';
                				     $.getJSON(dataload, function( data ) {
                					  $.each( data, function( key, val ) {
                						  arrayofLevels.push({
                					            name: val.team,    
                					        }); 
                					  });
                					  
                					  levelLoadComplete = true;	
                					  /*only for checking the loaded data
                					  $.each(arrayofLevels,function(index,value) {
                	         		    	//console.log('Loaded all the manager: ' + value.name);
                						// console.log('I am doing something!!');
                	         		    });*/
                				// });
					// }
					 
					
					/*load business unit */
					
						var arrofToken=[];
						
						$('#tokenfield-typeahead').on('tokenfield:createtoken', function (e) {
						      
							
							var data = e.attrs.value;
                				if(jQuery.inArray(data,arrayofLevels) != -1){
                						if(jQuery.inArray(data,arrofToken) == -1){
                							//console.log('Unique Value is: ' + data);
                							arrofToken.push(data);
                						}else{
                							//console.log('Duplicate Value is: ' + data);
                							return false;
                						}
                				}else{
                					return false;
                				}
					
						    })
						    .on('tokenfield:createdtoken', function (e) {
						    	totalTrackGraphClick++;
						    if(totalTrackGraphClick==2){
						    	dataUrl = 'resources/data/kobegamelog2.csv';
						    }else{
						    	dataUrl = 'resources/data/kobegamelog.csv';
						    }
						    
						    $("#loadfiltertag").append('<div class="btn-group btn-group1"><button type="button" class="btn btn-default" >['+e.attrs.value+']</button><button type="button" class="btn btn-default filter-a remove"><i class="glyphicon glyphicon-remove"></i></button> </div>');
						
						    	$("#browsefiltergraph").empty();
						    	render(dataUrl);
						    	
						    	
                              }) .on('tokenfield:removedtoken', function (e) {
                            	  dataUrl = 'data/kobegamelog2.csv';
                            	  $("#browsefiltergraph").empty();
  						    	render(dataUrl);
                                    	  arrofToken = jQuery.grep(arrofToken, function(value) {
                                    		  return value != e.attrs.value;
                                    		});
                                    	  $("#loadfiltertag :last-child").remove();

                               })
                              .tokenfield({
						  typeahead: [null,
						              { 
							           displayKey : 'team',
							           source: level0Manager.ttAdapter(),
							           templates : {
							           header : '<h3 class="league-name">Level 0-Manager</h3>'
							           } 
						        },{
								displayKey : 'team',
								source : level1Manager.ttAdapter(),
								templates : {
									header : '<h3 class="league-name">Level 1-Manager</h3>'
								}
							},
							{
								displayKey : 'team',
								source : level2Manager.ttAdapter(),
								templates : {
									header : '<h3 class="league-name">Level 2-Manager</h3>'
								}
							},	{
									displayKey : 'team',
									source : level3Manager.ttAdapter(),
									templates : {
										header : '<h3 class="league-name">Level 3-Manager</h3>'
									}
								},
							/*	{
									displayKey : 'team',
									source : level4Manager.ttAdapter(),
									templates : {
										header : '<h3 class="league-name">Level 4-Manager</h3>'
									}
								},
								{
									displayKey : 'team',
									source : level5Manager.ttAdapter(),
									templates : {
										header : '<h3 class="league-name">Level 5-Manager</h3>'
									}
								},*/
								{
									displayKey : 'team',
									source : level1BusinessUnit.ttAdapter(),
									templates : {
										header : '<h3 class="league-name">Level 1-Line of Business</h3>'
									}
								},
								{
									displayKey : 'team',
									source : level2BusinessUnit.ttAdapter(),
									templates : {
										header : '<h3 class="league-name">Level 2-Line of Business</h3>'
									}
								},	
									{
										displayKey : 'team',
										source : level3BusinessUnit.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 3-Line of Business</h3>'
										}
									},
									{
										displayKey : 'team',
										source : level4BusinessUnit.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 4-Line of Business</h3>'
										}
									},
									{
										displayKey : 'team',
										source : level5BusinessUnit.ttAdapter(),
										templates : {
											header : '<h3 class="league-name">Level 5-Line of Business</h3>'
										}
									}
							
							
							]
						});
						
						//source : level0Manager.ttAdapter()
					/*these are methods for playing with json object */
					function getObjects(obj, key, val) {
						var objects = [];
						for ( var i in obj) {
							if (!obj.hasOwnProperty(i))
								continue;
							if (typeof obj[i] == 'object') {
								objects = objects.concat(getObjects(obj[i],
										key, val));
							} else
							// if key matches and value matches or if key
							// matches and value is not passed (eliminating the
							// case where key matches but passed value does not)
							if (i == key && obj[i] == val || i == key
									&& val == '') { //
								objects.push(obj);
							} else if (obj[i] == val && key == '') {
								// only add if the object is not already in the
								// array
								if (objects.lastIndexOf(obj) == -1) {
									objects.push(obj);
								}
							}
						}
						return objects;
					}

					// return an array of values that match on a certain key
					function getValues(obj, key) {
						var objects = [];
						for ( var i in obj) {
							if (!obj.hasOwnProperty(i))
								continue;
							if (typeof obj[i] == 'object') {
								objects = objects
										.concat(getValues(obj[i], key));
							} else if (i == key) {
								objects.push(obj[i]);
							}
						}
						return objects;
					}

					// return an array of keys that match on a certain value
					function getKeys(obj, val) {
						var objects = [];
						for ( var i in obj) {
							if (!obj.hasOwnProperty(i))
								continue;
							if (typeof obj[i] == 'object') {
								objects = objects.concat(getKeys(obj[i], val));
							} else if (obj[i] == val) {
								objects.push(i);
							}
						}
						return objects;
					}
                    /*tinkering graph code */
					function render(dataUrl){
					var margin = {top: 20, right: 80, bottom: 30, left: 220},
				    width = 900 - margin.left - margin.right,
				    height = 450 - margin.top - margin.bottom;

				var parseDate = d3.time.format("%Y-%m-%d").parse;

				var xScale = d3.time.scale()
				    .range([0, width-30]);

				var yScale = d3.scale.linear()
				    .range([height, 0]);

				var color = d3.scale.category20();

				var xAxis = d3.svg.axis()
				    .scale(xScale)
				    .orient("bottom");

				var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left");

				var line = d3.svg.line()
				    .interpolate("monotone")
				    .x(function(d) { return xScale(d.date); })
				    .y(function(d) { return yScale(d.stat); });

				var maxY;

				var svg = d3.select("#browsefiltergraph").append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				d3.csv(dataUrl, function(error, data) {
				  color.domain(d3.keys(data[0]).filter(function(key) { 
					  var exclude = ["Rk","G","Date","Age","Tm","","Opp","","GS","3P","3PA","FT","FTA",
					                  "ORB","DRB","TRB","AST","STL","BLK","TOV","PF","PTS","GmSc"], // blacklist
				        include = ["Nomination","eCard","eButton","eThanks"]; // whitelist
				    return (include.indexOf(key) >= 0); 
				  }));

				  data.forEach(function(d) {
				    d.Date = parseDate(d.Date);
				  });

				  var categories = color.domain().map(function(name) {
				    return {
				      name: name,
				      values: data.map(function(d) {
				        return {
				          date: d.Date, 
				          stat: parseFloat(d[name]),
				          result: d.Res,
				          opponent: d.Opp
				          };
				      }),
				      visible: (name === "Nomination" ||"eCard" || "eButton" ||"eThanks" ? true : false)
				    };
				  });

				  xScale.domain(d3.extent(data, function(d) { return d.Date; }));

				  yScale.domain([0,
				    d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.stat; }); })
				  ]);

				  // draw line graph
				  svg.append("g")
				      .attr("class", "x axis")
				      .attr("transform", "translate(0," + height + ")")
				      .call(xAxis);

				  svg.append("g")
				      .attr("class", "y axis")
				      .call(yAxis)
				    .append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text("Stat");

				  var statistic = svg.selectAll(".statistic")
				      .data(categories)
				    .enter().append("g")
				      .attr("class", "statistic");

				  statistic.append("path")
				      .attr("class", "line")
				      .attr("id", function(d) {
				        return "line-" + d.name.replace("%", "P");
				      })
				      .attr("d", function(d) { 
				        return d.visible ? line(d.values) : null; 
				      })
				      .style("stroke", function(d) { return color(d.name); });

				  // draw legend
				  statistic.append("rect")
				      .attr("height",10)
				      .attr("width", 25)
				      .attr("x",width-20)
				      .attr("y",function(d,i) {return i * 20 - 8;})
				      .attr("stroke", function(d) { return color(d.name); })
				      .attr("fill",function(d) {
				        return d.visible ? color(d.name) : "white";
				      })
				      .attr("class", "legend-box")

				      .on("click", function(d){
				        d.visible = !d.visible;

				        maxY = findMaxY(categories);
				        yScale.domain([0,maxY]);
				        svg.select(".y.axis")
				          .transition()
				          .call(yAxis);   

				        statistic.select("path").transition()
				          .attr("d", function(d){
				            return d.visible ? line(d.values) : null;
				          })

				        statistic.select("rect")
				          .transition()
				          .attr("fill", function(d) {
				          return d.visible ? color(d.name) : "white";
				        });
				      })

				      .on("mouseover", function(d){
				        d3.select("#line-" + d.name.replace("%", "P"))
				          .transition()
				          .style("stroke-width", 3);
				      })

				      .on("mouseout", function(d){
				        d3.select("#line-" + d.name.replace("%", "P"))
				          .transition()
				          .style("stroke-width", 1.5);
				      })
				      

				  statistic.append("text")
				      .attr("x", function (d) {
				        return width + 8
				      })
				      .attr("y", function(d,i) { 
				        return i * 20; 
				      })
				      .text(function(d) { return d.name; })

				  });
					}	  
				  function findMaxY(data){
				    var maxValues = data.map(function(d) {
				      if (d.visible){
				        return d3.max(d.values, function(value) { 
				          return value.stat; })
				      }
				    });
				    return d3.max(maxValues);
				  }
});
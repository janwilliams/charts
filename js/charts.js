

/*Formatting */

var comma = d3.format(',');
var prct = d3.format('%');
var timeparse = d3.time.format("%Y-%m-%d").parse;
var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
var dollar= d3.format('$,r');
var month = d3.time.format('%b');

var pct = function  (current, total) {
  return current/total;  
}


/* Dashboard Functions*/

var singleBar = function(container, data){

				me = this;

				var pW = $(container).parent().width();
				var pH =  $(container).parent().height();

				

				var parent = d3.select(container);

				var dimensions = {'width': pW, 'height': pH};
				var margin =  {'left': 50, 'top': (dimensions.height)/4, 'right':50, 'bottom': (dimensions.height)/4};

				var w = dimensions.width - (margin.left + margin.right);
				var h = dimensions.height - (margin.top + margin.bottom);

				var barheight = 30//40;
				//(dimensions.height)/4 +5;

				var budgTooltip = parent.append('div')
									.attr('class', 'budgTooltip')
									.attr('width', '100px')
									.attr('height', '60px')
									.style('opacity', 0)

									



				var svg = 			parent.append('svg')
									.attr('width', dimensions.width)
									.attr('height', dimensions.height)



				var gradient = svg.append("defs")
								  .append("linearGradient")
								    .attr("id", "budg-grd")
								    //.attr('fy', '100%')
								    //.attr('fx', '50%')
								   // .attr('cx', '50%')
								   // .attr('cy', '50%')

								    .attr("x1", "100%")
								    .attr("y1", "0%")
								    .attr("x2", "0%")
								    .attr("y2", "0%")
								    .attr("spreadMethod", "pad");

								gradient.append("stop")
								    .attr("offset", "10%")
								    .attr("stop-color", "#fff")
								    .attr("stop-opacity", 0);

								gradient.append("stop")
								    .attr("offset", "50%")
								    .attr("stop-color", "#22B38C")
								    .attr("stop-opacity", .7);    

								gradient.append("stop")
								    .attr("offset", "90%")
								    .attr("stop-color", "#fff")
								    .attr("stop-opacity", 0);					

									


				var x = 			d3.scale.linear()
									 .domain([150000, data.total])
									 .range([margin.left, w]);

				var projShift = 	(x(data.current));


				var backBar = 		svg.append('rect')
									.attr('class', 'backBar')
									//range round or fixed?
									.attr('height', barheight)
									.attr('width', x(data.total))
									//.attr('transform', "translate("+ 0 +", "+ (dimensions.height/2 - barheight/2)+ " )")
									.attr('transform', "translate("+ margin.left +", "+ (dimensions.height/2 - barheight/2)+ " )")

				var frontBar = 		svg.append('rect')
									//how to apply class?
									.attr('class', 'frontBar')
									//.attr('class', 'backBar')
									//range round or fixed?
									.attr('height', barheight)
									.attr('width', projShift)
									//.attr('transform', "translate("+ 0 +", "+ (dimensions.height/2 - barheight/2)+ " )")
									.attr('transform', "translate("+ margin.left +", "+ (dimensions.height/2 - barheight/2)+ " )")

				var grdRect =       svg.append('rect')
									.attr("width", 100)
								    .attr("height", barheight)
								    //.style('fill', '#f0f0f0')
								   .style("fill", "url(home#budg-grd)")
								   // .attr('transform', "translate("+ (0  + projShift+ 10)+", "+ (dimensions.height/2 - barheight/2)+ " )")
								  .attr('transform', "translate("+ (margin.left  + projShift+ 10)+", "+ (dimensions.height/2 - barheight/2)+ " )")
								   
								   .on('mouseover', function(d){
								   		budgTooltip
								   		
								   		.style('opacity', .8)
								   		.html('Projected: $18Million')
								   })
								   .on('mouseout', function(d){

								   		budgTooltip
								   		.style('opacity', 0)

								   })

								   budgTooltip
									.style('left', function(){
										return (margin.left  + projShift -9) + 'px';
									})
									.style('top', function(){
										return (dimensions.height/2 - barheight - 14) +'px';
									})


				var topLabel = 		svg.append('text')
									.attr('class', 'singleBar-top-label')
									.style('font-family', 'sans-serif')
									.style("font-size", "16px")
									//.style('fill', '#ea8300')
									//.style('fill', '#ffffff')
									.attr('x', (x(data.total)+margin.left)-120)
									.attr('y', margin.top)
									.html('Total: $' +comma(data.total));	

				var bottomLabel = 	svg.append('text')
									.attr('class', 'singleBar-bottom-label')
									.style('font-family', 'sans-serif')
									.style("font-size", "23px")
									.style('fill', '#22B38C')
									//.style('fill', '#ffffff')
									.attr('x', (x(data.current)+margin.left -120))
									.attr('y', (dimensions.height/2 + barheight+10))
									.html('Spent: $' +comma(data.current));	


				me.update = function (data){


									/*

									bottomLabel
				
									.transition()
									.duration(700)
									.attr('x', (x(data.current)+margin.left))
									.attr('y', (dimensions.height/2 + barheight+10))

									bottomLabel
									.html(comma(data.current));
								

									frontBar
									.transition()
									.duration(800)
									.attr('width', x(data.current))

									*/


							}

				//resize function ?
				//if you add resize you need to update range	


				me.resize = function (){

					console.log('resize called')

											pW = $(container).parent().width();
											pH =  $(container).parent().height();

											parent = d3.select(container);

											dimensions = {'width': pW, 'height': pH};

											margin =  {'left': 50, 'top': (dimensions.height)/4, 'right':50, 'bottom': (dimensions.height)/4};

											w = dimensions.width - (margin.left + margin.right);
											h = dimensions.height - (margin.top + margin.bottom);

											barheight = 40;
											//(dimensions.height)/4 +5;

											svg
											.attr('width', dimensions.width)
											.attr('height', dimensions.height)

											x.range([margin.left, w]);	

											projShift = (x(data.current));

											backBar 
											.attr('height', barheight)
											.attr('width', x(data.total))
											.attr('transform', "translate("+ margin.left +", "+ (dimensions.height/2 - barheight/2)+ " )")

											frontBar
											.attr('height', barheight)
											.attr('width', projShift)
											.attr('transform', "translate("+ margin.left +", "+ (dimensions.height/2 - barheight/2)+ " )")

											grdRect 
											//.attr("width", 100)
										   .attr("height", barheight)
										   .attr('transform', "translate("+ (margin.left  + projShift+ 10)+", "+ (dimensions.height/2 - barheight/2)+ " )")

										   	budgTooltip
											.style('left', function(){
												return (margin.left  + projShift -9) + 'px';
											})
											.style('top', function(){
												return (dimensions.height/2 - barheight - 14) +'px';
											})

											topLabel
											.style("font-size", "1.5rem")
											.attr('x', (x(data.total)+margin.left)-120)
											.attr('y', margin.top)
									

											bottomLabel 
											.style("font-size", "2rem")
											.attr('x', (x(data.current)+margin.left -120))
											.attr('y', (dimensions.height/2 + barheight+10))



				}		




				//var win = $(window);

				


				


				return me;

}



var hrzBars = function(parent, dimensions, data){


				me = this;

				var margin =  {'left': 50, 'top': 20, 'right':50, 'bottom': 20};

				var w = dimensions.width - (margin.left + margin.right);
				var h = dimensions.height - (margin.top + margin.bottom);

				var clr = d3.scale.ordinal()
							.domain(['Given', 'Received'])
							.range(['#2ec0c9', '#e93570'])

				//var barheight = (dimensions.height)/4;

				var labels	= 	parent.selectAll('.hrz-label')	
								.data(data)
								.enter()
								.append('div')
								.attr('class', 'hrz-label')


								labels
								.append('h3')
								.style('font-size', '24px')
								.style('color', function(d){return clr(d.name);})
								.html(function(d){return comma(d.amount) + "<br><span style='color:#333; font-size:18px'> "+d.name+'</span>'} )
								

								//labels
								//.append('p')
								//.style('color', function(d){return clr(d.name);})
								//.html(function(d){return d.name} )


				var svg = 	parent.append('svg')
								.attr('width', dimensions.width)
								.attr('height', dimensions.height)

								


				var x =     d3.scale.linear()
								
								.domain([250000, d3.max(data, function(d){return d.amount})])
								.range([margin.left, w]);

				var Ydomain = [];

							data.forEach(function(d){
								Ydomain.push(d.name);

							})								
												

				var y =		d3.scale.ordinal()
								.domain(Ydomain)
								.rangeRoundBands([0, dimensions.height], 0.1);


				var Xscale = d3.svg.axis().scale(x).orient('bottom');
				var Yscale = d3.svg.axis().scale(y).orient('left');	

				labels
				.style('left', function(d){return margin.left +20 + "px"})
				.style('top', function(d){return y(d.name)-15 + "px"})	
/*
				var xAxis = 	svg.append('g')
								.attr('class', 'x axis')
								.attr('transform', "translate(0, " +(h+ margin.top)+"  )")

								.call(Xscale);	

								*/

								//can be added later if design changes
/*
				var yAxis = 	svg.append('g')
								.attr('class', 'y axis')
								.attr('transform', "translate("+ margin.left + ", " + margin.top+"  )")
								.call(Yscale);				

*/

				var bars = 		svg.selectAll('.bar')
								.data(data)
								.enter()
								.append("rect")
								.attr('class', function(d){return 'bar '+ d.name} )
								.style('fill', function(d){ return clr(d.name)})
								.attr('x', margin.left)	
								.attr('width', function(d){return x(d.amount) - margin.left } )
								.attr('y', function(d){return y(d.name) + margin.top} )
								.attr('height', 20)
								.attr('transform', "translate(0, "+ margin.top*2+")")

				
								//.attr('transform', "translate(0, "+ 50+")")
								//.attr('transform', function(d){ return 'translate('+ margin.left + 5+ ','+ y(d.name) + margin.top*2 -20+')';})

								/*
								.attr('x', function(d){return margin.left + 5} )
								//.attr('x', function(d){return x(d.amount) +5} )
								//.attr('y', function(d){return y(d.name) + margin.top*2 +12} )
								.attr('y', function(d){return y(d.name) + margin.top*2 -20 } )
								*/

								

				me.update = function(data){

/*
									x.domain([250000, d3.max(data, function(d){return d.amount})]);

									Xscale.scale(x);

									xAxis
									.transition()
									.duration(800)
									.call(Xscale);
									*/
/*
									bars
									.data(data)
									.transition()
									.duration(800)
									.attr('width', function(d){ 
									var amt = 	x(d.amount) - margin.left;
									return amt;

									 } )


									labels
									.data(data)
									.transition()
									.duration(800)
									.attr('x', function(d){return x(d.amount) +5} )



		*/							


									}


				me.resize = function (parent, dimensions){

					

				}					







				return me;


}


var vertBars = function (parent, data){

				

				me = this;

				var pW = $(parent).width();
				var pH = $(parent).height()-30;

				var dimensions = {'width': pW, 'height': pH};

				var parent = d3.select(parent);

				var margin =  {'left': 50, 'top': 20, 'right':50, 'bottom': 20};

				var wd = dimensions.width/10;

				

							parent.append('div')
								.attr('class', 'title-block')
								.html('Budget by Year')

				var w = dimensions.width - (margin.left + margin.right);
				var h = dimensions.height - (margin.top + margin.bottom);

				var svg = 	parent.append('svg')
							.attr('width', dimensions.width)
							.attr('height', dimensions.height)



				var Xdomain = [];

							data.forEach(function(d){
								Xdomain.push(d.year || d.team);

							})				


				var x = d3.scale.ordinal()
								.domain(Xdomain)
								.rangeRoundBands([0, w], .4)
								//.rangeRoundBands([0, w], .6);

				var y = d3.scale.linear()
								.domain([d3.max(data, function(d){ return d.budget;}), 9000])
								//.domain([35000000, 9000])
								.range([margin.top, h]);

				var Xscale = d3.svg.axis().scale(x).ticks(4).orient('bottom');
				var Yscale = d3.svg.axis().scale(y).tickSize(w).orient('right');		

				var xAxis = 	svg.append('g')
								.attr('class', 'x axis')

								.attr('transform', "translate("+0+", " +(h+ margin.top)+"  )")
								//.attr('transform', "translate("+margin.left+", " +(h+ margin.top)+"  )")
								.call(Xscale);	

								//xAxis.selectAll('text').style('display', 'none')

								xAxis.selectAll('path').style('display', 'none')
							
								xAxis.selectAll('line').style('display', 'none')



								//can be added later if design changes

				var yAxis = 	svg.append('g')
								.attr('class', 'y axis')
								.attr('transform', "translate("+ 0 + ", " + margin.top+"  )")
								.call(Yscale);	

								yAxis.selectAll('text').style('display', 'none')
							
								yAxis.selectAll('line').style('display', 'none')
								yAxis.selectAll('path').style('display', 'none')	



/*

				var girvals = yAxis.scale().ticks();

								for(val in girvals){

								var gridline =  d3.svg.line()
												//.data(data)
										        .x(function(d) { return x(d.year); })
										        .y(function(d) { return y(girvals[val]); })

									 svg
									 	//.selectAll('.gridline')
									     .append("path")
									      .attr("class", "gridline")
									      //.style('stroke', '#84e5cb')
									      .style('stroke', '#b6e4fc')
									      .style('storke-width', '1px')
									      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
									      .attr("d", gridline);		        

								}

*/

				var bars = 		svg.selectAll('.bar')
								.data(data)
								.enter()
								.append("rect")
								.attr('class', 'bar')
								.attr('id', function(d){return d.year })
								.attr('x', function(d){return x(d.team || d.year) })	
								.attr('width', wd )
								.attr('y', function(d){return y(d.budget)})
								.attr('height', function(d){return h - y(d.budget);})
								//.attr('transform', "translate("+ margin.left+ ", "+ margin.top+")")
								.attr('transform', "translate("+ 0+ ", "+ margin.top+")")



				var labels	= 	svg.selectAll('.vert-label')	
								.data(data)
								.enter()
								.append('text')
								.attr('class', 'vert-label')
								.attr('x', function(d){return x(d.year || d.team) } )
								.attr('y', function(d){return y(d.budget);})
								//.attr('transform', "translate("+ margin.left+ ", "+ 0+")")
								
								.html(function(d){return dollar(d.budget)} );








				me.update = function (data){

/*								y.domain([d3.max(data, function(d){ return d.budget;}), 9000]);

								Yscale.scale(y)

								bars
								.data(data)
								.transition()
								.duration(800)
								.attr('y', function(d){return y(d.budget);})
								.attr('height', function(d){return h - y(d.budget);})


								labels
								.data(data)
								.transition()
								.duration(800)
								.attr('y', function(d){return y(d.budget);})

								labels
								.html(function(d){return dollar(d.budget)} );


*/

								}


				me.resize = function (parent){


									pW = $(parent).width();
									pH = $(parent).height()-30;

									dimensions = {'width': pW, 'height': pH};

									parent = d3.select(parent);

									margin =  {'left': 50, 'top': 20, 'right':50, 'bottom': 20};

									wd = dimensions.width/10;

									w = dimensions.width - (margin.left + margin.right);
									h = dimensions.height - (margin.top + margin.bottom);

									svg
									.attr('width', dimensions.width)
									.attr('height', dimensions.height)

									
									x.rangeRoundBands([0, w], .4)
									y.range([margin.top, h]);

									xAxis 
									.attr('transform', "translate("+0+", " +(h+ margin.top)+"  )")
									.call(Xscale);	

									yAxis.attr('transform', "translate("+ 0 + ", " + margin.top+"  )")
									.call(Yscale)

									bars 
									.attr('x', function(d){return x(d.team || d.year) })	
									.attr('width', wd )
									.attr('y', function(d){return y(d.budget)})
									.attr('height', function(d){return h - y(d.budget);})
									.attr('transform', "translate("+ 0+ ", "+ margin.top+")")


									labels
									.attr('x', function(d){return x(d.year || d.team) } )
									.attr('y', function(d){return y(d.budget);})
									


					

				}





				return me;
}



/*Chart Legend*/

var donutChart = function(ele, data, title, color1, color2,color3,$http,attrs,settings){
	
	var me = this;
	var element = $(ele);
	
	var valueLabel = element.find(".value-label");
	valueLabel.html((data) ? comma(data.current) : 0)
	valueLabel.css('color', (color1) ? color1 : settings.color1);
	
	var centerLabel = element.find(".center-label");
	centerLabel.html((data) ? prct(pct(data.current, data.total)) : 0);
	centerLabel.css('color', (color1) ? color1 : settings.color1);
	
	var donutcontainer = $(document.createElement("div"));
	donutcontainer.addClass('donutchart');
	element.append(donutcontainer);
	
	donut = new PieChart({
        theme: PieChart.themes.flat,
        container: donutcontainer[0],
        data:{
        	dataFunction : loadDataFunction
        },
        labels: {enabled:false},
        info: {enabled:true},
        interaction: {resizing:{enabled:false}},        
        pie: {
        	innerRadius: 0.6,
        	style: {
	        	"fillColor": "transparent",
	            "sliceColors": [(color1) ? color1 : settings.color1, (color2) ? color2 : settings.color2, (color3) ? color3 : settings.color3],
	            "colorDistribution": "list",
	            "brightness": 1
        	}
        }        
    });
	
	function loadLabels(data){		
		centerLabel.html(prct(pct(data.donutModel.currentActivity, data.donutModel.total)));
		valueLabel.html(comma(data.donutModel.currentActivity));
	};

	function loadDataFunction(pieId, limit, offset, successCallback,errorCallback) {		
		if(settings){
			$http.post(settings.wsUrl,{stp : settings.clientId,  queryName : settings.queryName}).success(function(data) { 
				var ndata = 	[{value:data.donutModel.currentActivity, name:attrs.text},{value:data.donutModel.total-data.donutModel.currentActivity, name:attrs.ntext}];
				if(data.donutModel.anotherActivity > 0){
					ndata.push({value:data.donutModel.anotherActivity, name:attrs.antext})
				}
				successCallback({values :ndata});
				
	    		loadLabels(data);
	    	});
		}else{
			successCallback({values : [{value:data.current, name:attrs.text},{value:data.total-data.current, name:attrs.ntext}]});
		}		
	};
	
	me.resize = function(){
		
	};
	
	me.update = function(data){
			
	};
	
	return me;		
};


var donutChart3d = function(parent, data){

				var me = this;

				var twoPi = 2* Math.PI;

				var pW = $(parent).width();
				var pH =  $(parent).height()-35;

				var dimensions = {'width': pW, 'height': pH};

				var parent = d3.select(parent);

				var val = pct(data.current, data.total)

				var margin =  {'left': 20, 'top': 10, 'right':20, 'bottom': 10};

				var w = pW - (margin.left + margin.right);
				
				var h = pH - (50 + margin.top + margin.bottom);
				
				var radius = Math.min(w, h) / 2;

				var arc = d3.svg.arc()
						    .startAngle(0)
						    .outerRadius(radius - Math.min(pW, pH)/16)
						    .innerRadius(radius - Math.min(pW, pH)/8)
						    //.outerRadius(radius - Math.min(pW, pH)/14)
						    //.innerRadius(radius - Math.min(pW, pH)/6);

				var pie = d3.layout.pie()
							    .sort(null)
							    .value();

				var topLabel = //parent.append('h4')
									//class
									parent.select('h4')
									.style('left', dimensions.width/4 + 'px')
									//.html('Place holder');

				var centerLabel = parent.append('p')
									.attr('class', 'center-label')
									//.style('min-width', 50+'px')
									.style('width', pW+'px')
									//.style('background', '#fff')
									//.style('left', dimensions.width/3 + 'px')
									//.style('left', (pW/2 -margin.left)+ 'px')
									//.style('top', (pH/2-margin.top+9) + 'px')
									.style('top', (h/2-margin.top+40) + 'px')
									//.style('top', (pH/2) + 'px')
									.html(prct(val));	

				var bottomLabel = 	parent.append('p')
									.attr('class', 'bottom-label')
									.style('width', w+'px')
									.style('left', margin.left + 'px')
									.style('top', (pH-30) + 'px')
									//.style('top', (pH-(margin.bottom)*4) + 'px')

									bottomLabel
									.append('span')
									.attr('id', 'cur')
									.style('font-weight', 'bold')
									//.style('font-size', '25px')
									.html(comma(data.current))

									bottomLabel
									.append('span')
									.attr('id', 'slash')
									.style('font-weight', 'bold')
									//.style('font-size', '28px')
									.html("/")


									bottomLabel
									.append('span')
									.attr('id', 'ttl')
									.style('font-weight', 'bold')
									//.style('font-size', '16px')
									.html(comma(data.total));							


				var svg = 	parent.append('svg')
								.attr('width', w)
								.attr('height', h)
								.append('g')
								
				                //.attr('class', 'reach-donut')
				                .attr("transform", "translate(" + w / 2 + "," + h/2 + ")");

				var bakCir = svg
								//.append('rect')
								.append('path')
						        .attr('class', 'nut-background')
						        .attr('d', arc.endAngle(twoPi))
						        .style('stroke', '#fff') 

				var frontCir = svg
								.append('path')
								.attr('class', 'nut-front')
								.attr('d', arc.endAngle(twoPi*val))
								.style('stroke', '#fff')	


				me.resize = function(parent){


									pW = $(parent).width();
									pH =  $(parent).height();

									dimensions = {'width': pW, 'height': pH};

									parent = d3.select(parent);

									val = pct(data.current, data.total)

									margin =  {'left': 20, 'top': 10, 'right':20, 'bottom': 10};

									w = pW - (margin.left + margin.right);
									h = pH - (50 + margin.top + margin.bottom);
									
									radius = Math.min(w, h) / 2;

									arc 
									.outerRadius(radius - Math.min(pW, pH)/16)
						    		.innerRadius(radius - Math.min(pW, pH)/8)

									

									topLabel.style('left', dimensions.width/4 + 'px')
														

									centerLabel
												.style('width', pW+'px')
												.style('top', (h/2-margin.top+40) + 'px')
														

									bottomLabel
														
														.style('width', w+'px')
														.style('left', margin.left + 'px')
														.style('top', (pH-30) + 'px')
														//.style('top', (pH-(margin.bottom)*4) + 'px')



/*
														bottomLabel
														.append('span')
														.attr('id', 'cur')
														.style('font-weight', 'bold')
														.style('font-size', '25px')
														.html(comma(data.current))

														bottomLabel
														.append('span')
														.attr('class', 'ttl')
														.style('font-weight', 'bold')
														.style('font-size', '28px')
														.html("/")


														bottomLabel
														.append('span')
														.attr('class', 'ttl')
														.style('font-weight', 'bold')
														.style('font-size', '16px')
														.html(comma(data.total));							
*/

													parent.select('svg')
													.attr('width', w)
													.attr('height', h)

													svg
									                .attr("transform", "translate(" + w / 2 + "," + h/2 + ")");

									bakCir 
											        .attr('d', arc.endAngle(twoPi))
											        

									frontCir 
													.attr('d', arc.endAngle(twoPi*val))
													

				}	


				


				me.update = function(){

				}	



				return me;		



}

var projectionChart = function(parent, data){



				

				me = this;

				var pW = $(parent).width();
				var pH =  $(parent).height();

				var dimensions = {'width': pW, 'height': pH};

				var parent = d3.select(parent);


							parent.append('div')
								.attr('class', 'title-block')
								.html('Budget Projection')



				var margin =  {'left': 50, 'top': 20, 'right':50, 'bottom': 20};

				var w = dimensions.width -margin.right //- (margin.left + margin.right);
				var h = dimensions.height -(margin.top + margin.bottom);

				var svg = 	parent.append('svg')
								.attr('width', dimensions.width)
								.attr('height', dimensions.height)

				var x = d3.time.scale()
				    		.range([margin.left, w]);

				var y = d3.scale.linear()
				    		.range([h, (margin.top)]);

				var xAxis = d3.svg.axis()
						    .scale(x)
						    .tickFormat(month)
						    .orient("bottom");

				var yAxis = d3.svg.axis()
						    .scale(y)
						    .ticks(10)
      						.tickFormat(d3.format("s"))
						    .orient("left");


				var bdgline = d3.svg.line()
							//.defined(function(d) { return d.nominations.current !=null; })
					        .x(function(d) { return x(d.date); })
							.y(function(d) { return y(22783821);})			    	

				var line = d3.svg.line()
					        .defined(function(d) { return d.nominations.current !=null; })
					        .x(function(d) { return x(d.date); })
					        .y(function(d) { return y(d.nominations.current);})
				        
				var high = d3.svg.line()
					        .defined(function(d) { return d.nominations.projected.high !=null; })
					        .x(function(d) { return x(d.date); })
					        .y(function(d) { return y(d.nominations.projected.high);});  

				var mid = d3.svg.line()
					        .defined(function(d) { return d.nominations.projected.mid !=null; })
					        .x(function(d) { return x(d.date); })
					        .y(function(d) { return y(d.nominations.projected.mid);}); 

				var low = d3.svg.line()
					        .defined(function(d) { return d.nominations.projected.low !=null; })
					        .x(function(d) { return x(d.date); })
					        .y(function(d) { return y(d.nominations.projected.low);});  


				var projArea = d3.svg.area()
		                      .defined(function(d) { return d.nominations.projected.high !=null; })
		                      .x(function(d) { return x(d.date); })
		                      .y1(function(d){return y(d.nominations.projected.high)})	


		            data.forEach(function(d) {
					    d.date = parseDate(d.date);
					    //console.log(d.date)
					    if(d.nominations.current!= null){ 
					      d.nominations.current = +d.nominations.current;
					    }
					    if(d.nominations.projected.high !=null){ 
					      d.nominations.projected.high = +d.nominations.projected.high;}

					     if(d.nominations.projected.mid !=null){  
					      d.nominations.projected.mid = +d.nominations.projected.mid;}

					     if(d.nominations.projected.low !=null){  
					      d.nominations.projected.low = +d.nominations.projected.low;}

					   
					    
					  });

					     x.domain(d3.extent(data, function(d) { return d.date; }));
					    y.domain([0, d3.max(data, function(d){

					    if(d.nominations.projected.high != null){
					        return d.nominations.projected.high;
					    }

					    })

					  ]); 
					  

				svg.datum(data);

	var xSvg =		svg
				      .append("g")
				      .attr("class", "x axis")
				     .attr("transform", "translate("+ 0 +"," + (h + margin.top)  + ")")
				      .call(xAxis);

				      xSvg.selectAll('path').style('display', 'none')
				      xSvg.selectAll('line').style('display', 'none')

	var ySvg	=	svg.append("g")
				      .attr("class", "y axis")
				      .attr("transform", "translate("+ margin.left +","+ (margin.top)+")")
				      .call(yAxis)

				      ySvg.selectAll('path').style('display', 'none')
				      ySvg.selectAll('line').style('display', 'none')
var girvals;


var gridlines;

				      /*
				      .append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
					*/


					girvals = yAxis.scale().ticks();

					for(val in girvals){

					var gridline =  d3.svg.line()
							        .x(function(d) { return x(d.date); })
							        .y(function(d) { return y(girvals[val]); })

					gridlines =	 svg
							//.selectAll('.gridlines')
							//.enter()
						     .append("path")
						      .attr("class", "gridlines")
						      .style('stroke', '#84e5cb')
						      //.style('stroke', '#85d4fd')
						      .style('stroke', '#cef2e8')
						      .style('storke-width', '1px')
						      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
						      .attr("d", gridline);		        

					}		        


var markerline   =	svg
				     .append("path")
				      .attr("class", "markerline")
				      .style('stroke', '#333')
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .style("stroke-dasharray", ("3, 3"))
				      .attr("d", bdgline);


var clip =			svg
				      .append("clipPath")
				      .attr('id', 'clip-nom')
				      .append('path')
				      .attr('d', projArea.y0(h))


var area =			svg
				      .append('path')
				      .attr('class', 'area nom')
				      .attr('clip-path', 'url(#clip-nom)')
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr('d', projArea.y0(function(d){return y(d.nominations.projected.low)}))	

var mainline=		svg
				     .append("path")
				      .attr("class", "line")
				      .style('stroke', '#22B38C')
				      //.style('stroke', '#ffffff')
				      //.style("stroke-dasharray", ("5, 5"))
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", line);
				      

var highLine=		svg
				      .append("path")
				      .attr("class", "line")
				      .style('stroke', '#22B38C')
				      //.style('stroke', '#ffffff')
				      .style("stroke-dasharray", ("5, 5"))
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", high);


var midLine=		svg
				      .append("path")
				      .attr("class", "line")
				      .style('stroke', '#22B38C')
				      //.style('stroke', '#ffffff')
				      .style("stroke-dasharray", ("5, 5"))
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", mid);


var lowLine =		svg
				      .append("path")
				      .attr("class", "line")
				      .style('stroke', '#22B38C')
				      //.style('stroke', '#ffffff')
				      .style("stroke-dasharray", ("5, 5"))
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", low);

				                     	    			

				      //xAxis.selectAll('.line').style('display', 'none')
				       //yAxis.selectAll('path.line').style('display', 'none')
				       //d3.select('g.y').selectAll('path.line').style('display', 'none')

				      me.resize = function (parent){

				      	pW = $(parent).width();
						pH =  $(parent).height();

						dimensions = {'width': pW, 'height': pH};

						parent = d3.select(parent);


						margin =  {'left': 50, 'top': 20, 'right':50, 'bottom': 20};

						w = dimensions.width -margin.right //- (margin.left + margin.right);
						h = dimensions.height -(margin.top + margin.bottom);

					svg
								.attr('width', dimensions.width)
								.attr('height', dimensions.height)

						x .range([margin.left, w]);

						y.range([h, (margin.top)]);

						xAxis.scale(x);

						yAxis.scale(y);

			

					xSvg 
				     .attr("transform", "translate("+ 0 +"," + (h + margin.top)  + ")")
				      .call(xAxis);

				    

					ySvg	
				      .attr("transform", "translate("+ margin.left +","+ (margin.top)+")")
				      .call(yAxis)


			svg.selectAll('.gridlines').remove();
					

					for(val in girvals){

					var gridline =  d3.svg.line()
							        .x(function(d) { return x(d.date); })
							        .y(function(d) { return y(girvals[val]); })

						  svg
							//.selectAll('.gridlines')
							//.enter()
						     .append("path")
						      .attr("class", "gridlines")
						      .style('stroke', '#84e5cb')
						      //.style('stroke', '#85d4fd')
						      .style('stroke', '#cef2e8')
						      .style('storke-width', '1px')
						      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
						      .attr("d", gridline);		        

					}	




					
					


					 markerline
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", bdgline);


				     clip
				      .attr('d', projArea.y0(h))


				      area
				      .attr('clip-path', 'url(#clip-nom)')
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr('d', projArea.y0(function(d){return y(d.nominations.projected.low)}))	

				     mainline
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", line);
				      

				     highLine
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", high);


				     midLine
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", mid);


				      lowLine
				      .attr("transform", "translate("+ 0 +","+ (margin.top)+")")
				      .attr("d", low);

					

				}


				return me;




}






var app = angular.module('demoApp', ['smartTable.table','ngRoute','ngCookies','ngTable','ngAnimate','ui.bootstrap', 'appRoutes', 
'DashboardChartsCtrl', 'DashboardReportsCtrl','DataSmashupCtrl', 'ReportsCtrl','ReportsCreationCtrl','LiveStatsCtrl','ZoomActivityChartCtrl',
'ReachUtilRatioChartCtrl','FiltersCtrl', 'NavCtrl','SubNavCtrl','DependantFiltersCtrl','LiveStatsModalCtrl',
'MashupCtrl','appDirectives','dialogs','ngCsv.directives','lrDragNDrop','smart-table','ngTagsInput','infinite-scroll',
'ngGrid','ui.grid','ui.grid.pinning','ui.grid.moveColumns', 'ui.grid.autoResize','flow','LoginCtrl','ui.grid.cellNav','ngDragDrop',
'CustomHeaderCtrl','ExecutiveSummaryCtrl','ui.grid.selection','BudgetReportController'])
.config(
		[ 'flowFactoryProvider', function(flowFactoryProvider) {
			flowFactoryProvider.factory = fustyFlowFactory;
			var config = {
				permanentErrors : [ 404, 500, 501 ],
				maxChunkRetries : 1,
				chunkRetryInterval : 5000,
				simultaneousUploads : 4,
				testChunks : false
			};

			flowFactoryProvider.defaults = config;
			flowFactoryProvider.opts = config;
		} ]);

app.run(['$rootScope', '$location', 'Auth','$templateCache', function ($rootScope, $location, Auth,$templateCache) {	
	$templateCache.put('ui-grid/uiGridHeaderCellCustom',
			"<div ng-class=\"{ 'sortable': sortable }\"> <!-- <div class=\"ui-grid-vertical-bar\">&nbsp;</div> --> <div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"> <span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible=\"col.sort.direction\"ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span> </div> </div>"
	);	
	$templateCache.put('ui-grid/ui-grid-header-custom',
		    "<div class=\"ui-grid-header\"><div class=\"ui-grid-top-panel\"><div class=\"ui-grid-header-viewport\"><div class=\"ui-grid-header-canvas\"><div class=\"ui-grid-header-cell-wrapper\" ng-style=\"colContainer.headerCellWrapperStyle()\"><div class=\"ui-grid-header-cell-row\"><div class=\"ui-grid-header-cell ui-grid-clearfix\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" ui-grid-header-cell-custom data-col-name-custom=\"{{col.colDef.name}}\" data-drag=\"true\" data-jqyoui-options=\"{revert: 'invalid',helper : getHelper,appendTo: 'body', axis : 'x'}\" jqyoui-draggable=\"{animate:true, onDrag : 'onDragCallback'}\" data-drop=\"true\" jqyoui-droppable=\"{multiple:true,onDrop : 'onDropCallback'}\" col=\"col\" render-index=\"$index\"></div></div></div></div></div><div ui-grid-menu></div></div></div>"
		  );
}]);


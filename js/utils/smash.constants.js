/**
 * 
 */

SAC = {
	CHARTS_TEMP_DATA : "resources/data/prj.json", // temporary JSON data Path for charts on Dashboard
	PERMISSIONS : {
		"DASHBOARD" : [ 
		                "VIEW_DASHBOARD_B",
		                "VIEW_DASHBOARD_M",
		                "VIEW_DASHBOARD",
		                "VIEW_DASHBOARD_G" 
		                ],
		"LIVE_STATS" : [
		                "VIEW_LIVE_STATS",
		                 "VIEW_LIVE_STATS_G",
		                 "VIEW_LIVE_STATS_M",
		                 "VIEW_LIVE_STATS_B" 
		                 ],
		"REPORTS" : [ 
		              "VIEW_REPORTS_2_0_M",
		              "VIEW_REPORTS_2_0_B",
		              "VIEW_REPORTS_2_0_G",
		              "VIEW_REPORTS_2_0" 
		              ],
		"PROXY_CLIENT" : [ 
		                   "ESMARTS_CUSTOMER_SWITCH_G" 
		                   ]
	},
	VIEW_PERMISSIONS : {
		VIEW_DASHBOARD : "VIEW_DASHBOARD",
		VIEW_LIVE_STATS : "VIEW_LIVE_STATS",
		VIEW_REPORTS_2_0 : "VIEW_REPORTS_2_0"
	}
};
SMART_PRELOADS = {
		readCookie : function(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i=0; i<ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
		    }
		    return "";
		},
		updateCookie : function(name, value, days2expire, path) {
			var date = new Date();
		    date.setTime(date.getTime() + (days2expire * 24 * 60 * 60 * 1000));
		    var expires = date.toUTCString();
		    document.cookie = name + '=' + value + ';' +
		                   'expires=' + expires + ';' +
		                   'path=' + path + ';';
	    }
};
SMART_UTILS = {
		getDaySuffix : function (num)
		{
		    var array = ("" + num).split("").reverse(); // E.g. 123 = array("3","2","1")
		
		    if (array[1] != "1") { // Number is in the teens
		        switch (array[0]) {
		            case "1": return "st";
		            case "2": return "nd";
		            case "3": return "rd";
		        }
		    }
		    return "th";
		},
		getCutomerId: function(){
			
			var result = SMART_PRELOADS.readCookie("_userId");
			if (result !== "" && result !== "{}"){
				result = JSON.parse(result);
				if (!result.hasOwnProperty("customerId") && !result.hasOwnProperty("stp")){
					result = JSON.parse(result);
				}
				result = {
						"stp" : result.customerId || result.stp
				};
				
				SMART_PRELOADS.updateCookie ("_userId", JSON.stringify(result), 60, "/");
				
				return result.stp;
			}
			return 24535;
		},
		getTimeStamp : function (date) {
			if (date === undefined || date === null){
				return undefined;
			}
			var dateTime = date.split(" ");
		    var dateParts = dateTime[0].split(/-/);
		    var timpeParts = dateTime[1].split(":");
		    dateParts[1] = $.inArray(dateParts[1].toUpperCase(), ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]);
		    return new Date(dateParts[2], dateParts[1], dateParts[0], timpeParts[0], timpeParts[1], timpeParts[2]);
		}
	};
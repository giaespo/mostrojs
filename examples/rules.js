var ruls = {
	// this rule run two actions that return respectively after 10 and 20 seconds in the main thread
	'wait':{
		left:[{type:"wait",scope:V("scope")}],
        right:[wait10,wait20],
        debug : []
	},
	
	// this rule run two actions that return respectively after 5 and 10 seconds, but run it in a separate threads
	'threadwait':{
		left:[{type:"threadwait",scope:V("scope")}],
        right:[Engine.Thread(wait10),Engine.Thread(wait20)],
        debug : []
	},
	
	"returnwait5": {
		left:[{type:"stopwait10",scope:V("scope")}],
        right:[printData],
        debug : []
	},
	
	"returnwait10": {
		left:[{type:"stopwait20",scope:V("scope")}],
        right:[printData2],
        debug : []
	},
	
	"coordination": {
		left:[{type:"stopwait10",scope:V("scope")},{type:"stopwait20",scope:V("scope")}],
        right:[printDataCoordinate],
        debug : []
	},
	
}
console.log("add rules to engine")
Engine.extendRules(ruls);

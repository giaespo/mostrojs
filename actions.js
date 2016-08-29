
// bad function to wait some seconds;
function wait10(rule,facts,vars){
    var t = new Date().getTime(); 
    while (new Date().getTime() < t + 3000);
       Engine.assertFact({type:'stopwait10',scope:vars.scope});	
}

function wait20(rule,facts,vars){
    var t = new Date().getTime(); 
    while (new Date().getTime() < t + 5000);
       Engine.assertFact({type:'stopwait20',scope:vars.scope});	
}

//calculate seconds
function timeElapsed(){
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    return timeDiff /= 1000;
}

//actions
function printData(rule,facts,vars){
    tm = timeElapsed();
    $("#"+vars.scope).append('<tr><td><h3>stop ' + tm + '</h3></td></tr>');    
    console.log("stop ", facts);
}
function printData2(rule,facts,vars){
    tm = timeElapsed();
    $("#"+vars.scope).append('<tr><td><h3>stop ' + tm + '</h3></td></tr>');    
    console.log("stop ", facts);
}

function printDataCoordinate(rule,facts,vars){
    tm = timeElapsed();
    $("#"+vars.scope).append('<tr><td><h3>stop coordination ' + tm + '  <h3></td></tr>');
    console.log("coordinate running");
}


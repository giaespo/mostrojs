Engine.start();
var startTime;

$( document ).ready(function() {
    $("#mainthread").click(function(){
        $("#result1 tr:gt(0)").remove();
        Engine.reset();
        startTime = new Date();
        Engine.assertFact({type:'wait',scope:"result1"});
        
    });
     $("#multithread").click(function(){
        $("#result2 tr:gt(0)").remove();
        Engine.reset();
        startTime = new Date();
        Engine.assertFact({type:'threadwait',scope:"result2"});
        
    });
});


var defaultRoute = {
		 "route":{
		      left:[{type:"route",url:V("url")},{type:'params',ref:V("url"),data:V("params")},{type:"template",ref:V("url"),path:V("path"),id:V("id")}],
              right:[MostroRoute.defaultAction()],
              debug : []
	      },
	 }

// change default route rule	 
//MostroRoute.changeDefaultRouting(defaultRoute);
//start routing, this register route rules in Engine
MostroRoute.startRouting();
// start Engine
Engine.start();


function eventAssert(e) {
	e.preventDefault();
	page = $(e.target).attr('gotopage');
	if (page){
		Engine.assertFact({type:"default", target:page,scope:page});
		//Engine.assertFact({type:"route",url:page});
	}else{
        Engine.assertFact({type:"event", event:e.type,targetId:e.target.id});
    }
}

$(document).bind("click", eventAssert);

//some fact asserted as example
Engine.assertFact({type:"partial",name:"header",path:"header",scope:"global"});
Engine.assertFact({type:"partial",name:"footer",path:"footer",scope:"global"});

Engine.assertFact({type:'params', ref:"login",params:[],scope:"login"});
Engine.assertFact({type:"template",path:'login',id:'main',ref:"login",scope:"login"});
Engine.assertFact({type:"route",url:'login',scope:"login"});

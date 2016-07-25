var defaultRoute = {
		 "route":{
		      left:[{type:"route",url:V("url")},{type:'users',ref:V("url"),users:V("params")},{type:"template",path:V("path"),id:V("id")}],
              right:[MostroRoute.defaultAction()],
              debug : []
	      }
	 }

// change default route rule	 
MostroRoute.changeDefaultRouting(defaultRoute);
//start routing, this register route rules in Engine
MostroRoute.startRouting();
// start Engine
Engine.start();

//some fact asserted as example
Engine.assertFact({type:"partial",name:"header",path:"header"});
Engine.assertFact({type:"partial",name:"footer",path:"footer"});

Engine.assertFact({type:'users', ref:"users",users:[{name:'gian',surname:'espo'},{name:'pippo',surname:'pino'},{name:'gino',surname:'giorgio'}]})
Engine.assertFact({type:"template",path:'users',id:'users'})
Engine.assertFact({type:"route",url:'users'});

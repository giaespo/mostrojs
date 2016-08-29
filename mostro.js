var V = unify.variable;

var Engine = (function () {
//fact code update automatically by 1 for every fact asserted
  var code = 0	
  var _rulesIndex = {};
  var facts = {};
  var factsIndex = {};
  var DB = {};
  var rules = {};
  var scope = {"active":"global"};
  var threads = {};
  var threadcode = 0;
  
   var _createRuleIndex = function createRuleIndex(){
    for (r in rules){
	    _rulesIndex[r]=[];
	    for (attr in rules[r].left){
		    _rulesIndex[r].push(rules[r].left[attr].type);
		}
	}
}

var _extend = function extend(a, b){
	var c = {}
	for (var k in a){
	    c[k]=a[k];
	}
    for(var key in b){
        c[key] = b[key];
    }
    return c;
}

var _extendRules = function extendRules(ruls){
    for(var key in ruls){
        rules[key] = ruls[key];
    }	
}


var _getThreadCode = function _getThreadCode(){
    var thcode = "thread" + threadcode;
    threadcode += 1;
    return thcode;
}

var _threadWrapper = function _threadWrapper(func){
	
	if(typeof(Worker) !== "undefined"){
	    return function(rule,facts,vars){
	        cod = _getThreadCode();
	        var engineWrapper = "var Engine = (function () {var assertFact = function assertFact(fact){postMessage(JSON.stringify(fact))};return {assertFact:assertFact};})();"
	        var wrapper = "function wrap(event){ var func = " + func.toString() + "; var data = event.data;func(data['rule'],data['facts'],data['vars']);}";
	        console.log(engineWrapper + "self.onmessage = " + wrapper);
	        threads[cod] = new Worker(URL.createObjectURL(new Blob([
                       engineWrapper + "self.onmessage = " + wrapper], {
                       type: 'application/javascript'
                       })));
            threads[cod].postMessage({"rule":rule,"facts":facts,"vars":vars});
            threads[cod].onmessage=function(e){Engine.assertFact(JSON.parse(e.data))}
        
        }
    }else{
        return func;	
	}
}




var _fireRule = function(rule,fats,vars){
	console.log("dentro fire rule");
	ffacts = []
	for (f in fats){;
	    ffacts.push(facts[fats[f]])	
	}
    for (var act in rules[rule].right){
	    action = rules[rule].right[act](rule,ffacts,vars);
	}
}

var _deleteIndex = function _deleteIndex(index,code){
	console.log("delete index");
	console.log(index);
	rule = DB[index];
    for (f=1;f<rule['dim'];f++){
		lenlevel = rule[f].length;
		console.log(lenlevel);
		for(i=0;i<lenlevel-1;i++){
			console.log(rule[f][i]);
			pos = rule[f][i].facts.indexOf(code);
		    if (pos != -1){
			    rule[f].splice(i,1);	
			}	
		}
	}
}


var _retractFacts = function _retractFacts2(code){
	console.log('dentro retract fact');
	console.log("code",code);
	indx = factsIndex[code];
	console.log(indx);
	for (var i=0;i<indx.length;i++){
		_deleteIndex(indx[i],code);
	}
	delete factsIndex[code];
    delete facts[code];
	
}





var _createMerged = function(r,fact){
	console.log("rule",r);
	console.log("fact",fact);
	//var r = rule;
	arrmerg = _rulesIndex[r].slice();
	console.log(arrmerg);
    var index = arrmerg.indexOf(fact.type);
    if (index > -1) {
        arrmerg.splice(index, 1);
    }
    for (var m = 1;m <= DB[r]['dim']; m++){
		for (c in DB[r][m]){
            if ( DB[r][m][c]['types'].indexOf(fact.type) == -1){
				if (DB[r][m][c].facts.indexOf(fact.fact) > -1){
					continue;
				}else{
					success = true;
				    for (v in fact.vars){
					    if 	(DB[r][m][c].vars.hasOwnProperty(v)){
						     if(DB[r][m][c].vars[v] == fact.vars[v]){
							   	 continue;
							 }else{
						      //add unification on objects
							     success = false;
							     break;
							 }
						}
					}
					if (success){
						if (m<DB[r]['dim']){
							vr = _extend(fact.vars,DB[r][m][c].vars);	
							console.log("vr",vr);
						    DB[r][m+1].push({types:[fact.type].concat(DB[r][m][c]['types']),vars:vr,facts:[fact.fact].concat(DB[r][m][c].facts)});
						    pos = DB[el][m+1].length-1;
						    dbfacts = DB[r][m][c].facts;
						    console.log("dbfacts",dbfacts);
						    if (m<DB[r]['dim']-1){
								console.log("aggiungo elemento",fact.fact,r,m+1,pos);
								if (factsIndex[fact.fact].indexOf(r) == -1){
						            factsIndex[fact.fact].push(r);
						        }
						        for (i in dbfacts){
								    console.log(dbfacts[i]);
								    console.log(facts[dbfacts[i]]);
								    console.log("aggiungo elementonuovo",dbfacts[i],r,m+1,pos);
								    if (factsIndex[dbfacts[i]].indexOf(r) == -1){
						                factsIndex[dbfacts[i]].push(r);
						            }
							    }
							} 
						}
					 }
				}
	        }
	    }
    }
    ruleact = DB[r][DB[r]['dim']];
    for (act in ruleact){
	    _fireRule(r,ruleact[act].facts,ruleact[act].vars)	
	}
	DB[r][DB[r]['dim']] = [];
}
  
  var _createCachedDB = function(){
	 for (r in rules){
		DB[r] = {};
		DB[r]['dim'] = rules[r].left.length;
		for (var n=1;n<DB[r]['dim']+1;n++){
			DB[r][n] = [];
		}
  }
}
  
  var getDB = function(){
	  return DB;  
  }
  
  var getFactIndex = function(){
	  return factsIndex;  
  }
  
   var getRules = function(){
	  return rules;  
  }
  
  var _runRule = function runRule(fact){
        newfact = fact.type;
        for (el in _rulesIndex){
            indf = _rulesIndex[el].indexOf(newfact);
	        if (indf !== -1){
				ruleleft = rules[el].left[indf];
				ruleleft.code = fact.code;
				leftunification = unify.box(ruleleft);
				factunification = unify.box(fact);
				result = factunification.unify(leftunification);
				if(result) {
                     results = leftunification.getAll();
                     felem = {'facts':[fact.code],'vars':results,'types':[fact.type]};
                     felem2 = {'fact':fact.code,'vars':results,'type':fact.type};
                     DB[el][1].push(felem);
                     console.log('inserisco il primo elemento',fact.code,el,1,DB[el][1].length-1);
                     factsIndex[fact.code].push(el);
                     _createMerged(el,felem2);
                     
				 }
		    }
	    } 
  }
  
  var assertFact = function assertFact(fact){
	    if (!fact.hasOwnProperty('scope')){
		    fact.scope = 'global';	
		}
		console.log(fact);
	    fact.code = code;
	    facts[code]=fact;
	    factsIndex[code] = [];
	    code += 1;
	    scp = fact.scope;
	    if (scope.hasOwnProperty(scp)){
		    scope[scp].push(fact.code);
		}else{
		    scope[scp]=[fact.code];	
		}
	    _runRule(fact);
	}

  var _start = function start(){
	_createRuleIndex();
	_createCachedDB();
	
	};

  var _resetEngine = function _resetEngine(){
      code = 0	
      _rulesIndex = {};
      facts = {};
      factsIndex = {};
      DB = {};
      scope = {"active":"global"};
      threads = {};
      threadcode = 0;
      _start();
}
	
  var _changeActiveScope = function _changeActiveScope(newscope){
	  if (newscope != "global"){
          older = scope["active"];
          scope["active"] = newscope;
          if (older != "global"){
              console.log(scope[older]);
              for (f in scope[older]){
				  console.log(scope[older][f]);
	              _retractFacts2(scope[older][f]);
	          }
	          scope[older] = [];
	      }
      }
  }
  
  var getScope = function getScope(){
	   return scope;
  }
  
  return {
    start: _start,
    rulesIndex: _rulesIndex,
    facts : facts,
    assertFact: assertFact,
    extendRules: _extendRules,
    DB:getDB,
    FactIndex:getFactIndex,
    getScope:getScope,
    Rules: getRules,
    retractFact: _retractFacts,
    changeScope: _changeActiveScope,
    Thread: _threadWrapper,
    reset: _resetEngine,
  };

})();

var V = unify.variable;

var Engine = (function () {
  var code = 0	
  var _rulesIndex = {};
  var facts = {};
  var factsIndex = {};
  var DB = {};
  var rules = {};
  var scope = {"active":"global"};
  
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

var _fireRule = function(rule,fats,vars){
	ffacts = []
	for (f in fats){;
	    ffacts.push(facts[fats[f]])	
	}
    for (var act in rules[rule].right){
	    action = rules[rule].right[act](rule,ffacts,vars);
	}
}


var _retractFacts = function _retractFacts(code){
	indx = factsIndex[code];
	console.log(indx);
	rul = []
	for (var i=1;i<indx.length;i++){
		//DB[indx[0][0]][indx[0][1]].splice(indx[0][2],1);
		console.log(i);
		//console.log(DB[indx[i][0]][indx[i][1]][indx[i][2]]);
		delete DB[indx[i][0]][indx[i][1]][indx[i][2]];
		rul.push(DB[indx[i][0]][indx[i][1]]);
		
		//DB[indx[i][0]][indx[i][1]].splice(indx[i][2]-,1);
    }
    for(x in rul){
	    rul[x] = rul[x].filter(function( element ) {
            return element !== undefined;
        });	
	}
    delete factsIndex[code];
    delete facts[code];
}


var _createMerged = function(rule,fact){
	r = rule;
	arrmerg = _rulesIndex[rule].slice();
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
						    DB[r][m+1].push({types:[fact.type].concat(DB[r][m][c]['types']),vars:vr,facts:[fact.fact].concat(DB[r][m][c].facts)});
						    pos = DB[el][m+1].length-1;
						    dbfacts = DB[r][m][c].facts;
						    factsIndex[fact.fact].push([r,m+1,pos]);
						    for (i in dbfacts){
								console.log(dbfacts[i]);
								console.log(facts[dbfacts[i]]);
							    factsIndex[dbfacts[i]].push([r,m+1,pos]);
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
                     factsIndex[fact.code].push([r,1,DB[el][1].length-1]);
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
	
  var _changeActiveScope = function _changeActiveScope(newscope){
	  if (newscope != "global"){
          older = scope["active"];
          scope["active"] = newscope;
          if (older != "global"){
              console.log(scope[older]);
              for (f in scope[older]){
				  console.log(scope[older][f]);
	              _retractFacts(scope[older][f]);
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
  };

})();

//Engine.start();
//Engine.assertFact({type:"template",nome:'bel template',div:'primo'});
//Engine.assertFact({type:"felino",denti:[1,2]});
//Engine.assertFact({type:"gatto",nome:[1,2]});
//Engine.assertFact({type:'uomo',nome:{name:'giggino',cognome:'sbirulino'}});
//console.log(Engine.rulesIndex);

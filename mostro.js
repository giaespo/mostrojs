var V = unify.variable;

var Engine = (function () {
  var code = 0	
  var _rulesIndex = {};
  var facts = {};
  var DB = {};
  var rules = {};
  
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
	console.log(vars);
	ffacts = []
	for (f in fats){;
	    ffacts.push(facts[fats[f]])	
	}
    for (var act in rules[rule].right){
	    action = rules[rule].right[act](rule,ffacts,vars);
	    //console.log(vars);
	    //action(rule,ffacts,vars);
	}	
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
				console.log(r,c,m,fact.type);
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
	//DB[r][DB[r]['dim']]=[];
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
                     _createMerged(el,felem2);
                     
				 }
		    }
	    } 
  }
  
  var assertFact = function assertFact(fact){
	    console.log(fact);
	    fact.code = code;
	    facts[code]=fact;
	    code += 1;
	    _runRule(fact);
	}

  var _start = function start(){
	_createRuleIndex();
	_createCachedDB();
	
	};
  
  return {
    start: _start,
    rulesIndex: _rulesIndex,
    facts : facts,
    assertFact: assertFact,
    extendRules: _extendRules,
    DB:getDB,
    Rules: getRules,
  };

})();

//Engine.start();
//Engine.assertFact({type:"template",nome:'bel template',div:'primo'});
//Engine.assertFact({type:"felino",denti:[1,2]});
//Engine.assertFact({type:"gatto",nome:[1,2]});
//Engine.assertFact({type:'uomo',nome:{name:'giggino',cognome:'sbirulino'}});
//console.log(Engine.rulesIndex);

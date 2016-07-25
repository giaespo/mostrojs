var MostroRoute = (function () {
	var templates = {};
	var templatePath = "templates/";
	var partialPath = "partials/";
	
	var _retrieveTemplate = function retrieveTemplate(tmpl,id,data) {
        console.log('retrieve');
        console.log(data);
        if (templates[tmpl] === undefined) {
            console.log("need");
            jQuery.get( templatePath + tmpl + ".html", function(resp) {
            console.log(resp);
            templates[tmpl] = Handlebars.compile(resp);
            console.log(templates[tmpl]);
            var template = templates[tmpl];
            var html    = template(data);
            console.log(html);
            $("#" + id).html(html);
      });
     }
         //var template = templates[tmpl];
         //var html    = template(data);
         //$("#msg").html(html);
     }

	var _goToUrl = function goToUrl(rule,facts,vars){
	               console.log('pushstate');
	               var topic = ""
	               if (vars.topic){
					   topic = vars.topic;
				   }
	               history.pushState(vars, topic, vars.url);
	               _retrieveTemplate(vars.path,vars.id,vars)
    }
    
    var _registerPartial = function _registerPartial(rule,facts,vars){
		console.log(vars);
		jQuery.get( partialPath + vars.path + ".html", function(data) {
            console.log(data);
            Handlebars.registerPartial(vars.name, data);
	    });
	}
	
	 var defaultRoute = {
		 "route":{
		      left:[{type:"route",url:V("url")},{type:'parameters',ref:V("url"),params:V("params")},{type:"template",ref:V("url"),path:V("path"),id:V("id")}],
              right:[_goToUrl],
              debug : []
	      }
	 }
	 
	 var partialRules = {
		 "partial":{
		      left:[{type:"partial",name:V("name"),path:V("path")}],
              right:[_registerPartial],
              debug : []
	      }
	 }
	
	var _changeDefaultRouting = function _changeDefaultRouting(ruls){
        defaultRoute = ruls;	
    }
    
    var _changeDefaultAction = function _changeDefaultAction(act){
        _goToUrl = act;	
    }
    
    var _defaultAction = function _defaultAction(){
        return _goToUrl;	
    }
    
    var registerRouting = function(){
	    Engine.extendRules(defaultRoute);
	    Engine.extendRules(partialRules);	
	}
    
    return {
    changeDefaultRouting: _changeDefaultRouting,
    defaultAction: _defaultAction,
    changeDefaultAction: _changeDefaultAction,
    startRouting : registerRouting,
  };
})();


function QueryStringToJSON(){
        var pairs = location.search.slice(1).split('&');
        var result = {};
        pairs.forEach(function(pair){
            pair = pair.split('=');
            result[pair[0]]=decodeURIComponent(pair[1] || '');
        });
        return JSON.parse(JSON.stringify(result));
    }

/*$(document).ready(function(){
var url = location.href;
  if (url) {
  var urlData = QueryStringToJSON(url);
       Engine.assertFact({type:"route",url:url});
       Engine.assertFact({type:'parameters',ref:url,params:urlData});
      }
     });
*/

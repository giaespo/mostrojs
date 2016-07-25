var ruls = {
	'r100':{
		left:[{type:'uomo',nome:{name:V("nome"),cognome:V("cognome")}},{type:"felino",denti:V("denti")},{type:"gatto",nome:V("denti")}],
        right:[pippo],
        debug : [pippo]
	},
	'r200':{
		left:[{type:'pecora',nome:'pino'},{type:"topo",denti:V("denti")},{type:"nano",nome:V("denti")}],
        right:[pippo],
        debug : [pippo]
	},
	'r300':{
		left:[{type:"template",nome:V("template"),div:V("div")},{type:'info',nome:V("nomepersona"),cognome:V("cognome")}],
        right:[pippo],
        debug : [pippo]
	},
}

Engine.extendRules(ruls);

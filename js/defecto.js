/*!
 * Requiere:
* underscore 1.5.1
* underscore.string 2.2.0rc
* jsmart 2.9
* php2js
*/




/**
 * $d (defecto) contiene métodos útiles que serán llamados individualmente
 */
var $d = {
	
		/** 
	 * Devuelve el tipo de objeto
	 * ej:	$d.tipo('hola') => 'string'
	 * @param mixed n Objeto para ser evaluado
	 * @return string el type del objeto
	 */
	tipo : function(n) {
		var m = ({}).toString.call(n) || false;
		return (m.match(/[\w]+/gi)[1].toLowerCase() || false);
	},
	
	/**
	 * Devuelve el INDICE del primer elemento de un Objeto,
	 * opcionalmente podemos obtener el contenido
	 * ej:	$d.primerIndice({'a':1, 'b':2}) => 'a'
	 *		$d.primerIndice({'a':1, 'b':2}, true) => {'a':1}
	 *	@param object objeto
	 *	@param boolean incluirContenido
	 *	@return string/object
	 */
	// primerIndice
	primero : function(objeto, incluirContenido) {
		incluirContenido = incluirContenido || false; // true/false
		for (var first in objeto) break;
		return incluirContenido ? objeto[first] : first;
	},
	
	/**
	 * Devuelve el INDICE del último elemento de un Objeto,
	 * opcionalmente podemos obtener el contenido
	 * ej:	$d.ultimoIndice({'a':1, 'b':2}) => 'b'
	 *		$d.ultimoIndice({'a':1, 'b':2}, true) => {'b':2}
	 *	@param object objeto
	 *	@param boolean incluirContenido
	 *	@return string/object
	 */
	// ultimoIndice
	ultimo : function(objeto, incluirContenido) {
		incluirContenido = incluirContenido || false; // true/false
		for (var last in objeto);
		return incluirContenido ? objeto[last] : last;
	},
	
	siguiente : function(objeto, llave, incluirContenido) {
		incluirContenido = incluirContenido || false; // true/false
		if (!objeto.hasOwnProperty(llave)) return false;
		var keys = _.keys(objeto);
		var actual = _.indexOf(keys,llave);
		actual = actual == (keys.length - 1) ? 0 : ++actual;
		return incluirContenido ? objeto[keys[actual]] : keys[actual];
	},
	
	anterior : function(objeto, llave, incluirContenido) {
		incluirContenido = incluirContenido || false; // true/false
		if (!objeto.hasOwnProperty(llave)) return false;
		var keys = _.keys(objeto);
		var actual = _.indexOf(keys,llave);
		actual = actual == 0 ? keys.length - 1 : --actual;
		return incluirContenido ? objeto[keys[actual]] : keys[actual];
	},
	
	/**
	 * Para usarse junto con sort. Realiza un sort con orden numérico
	 * en un string. 
	 * ej: ['a1', 'a11', 'a2', 'a3'].sort($d.naturalSort)
	 * devuelve: ['a1', 'a2', 'a3', 'a11']
	 */
	naturalSort : function(a, b) {
		aa = a.split(/(\d+)/);
		bb = b.split(/(\d+)/);

		for(var x = 0; x < Math.max(aa.length, bb.length); x++) {
		  if(aa[x] != bb[x]) {
			var cmp1 = (isNaN(parseInt(aa[x],10)))? aa[x] : parseInt(aa[x],10);
			var cmp2 = (isNaN(parseInt(bb[x],10)))? bb[x] : parseInt(bb[x],10);
			if(cmp1 == undefined || cmp2 == undefined)
			  return aa.length - bb.length;
			else
			  return (cmp1 < cmp2) ? -1 : 1;
		  }
		}
		return 0;
	},
	
	/**
	 * Obtiene una cookie
	 * @param string c_name Nombre de la cookie que se quiere leer
	 * @return string Devuelve el contenido de la cookie
	 */
	getCookie : function(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for(i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if(x == c_name) return unescape(y);
		}
		return false;
	},
	
	setCookie : function(c_name, value, exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays == null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie = c_name + "=" + c_value;
	},
	
	deleteCookie : function(c_name) {
		this.setCookie(c_name, "", -1);
	},
	
	/**
	 * Separa ruta y archivo de una ruta a un archivo
	 * ej:	$.xtractFile('/ruta/al/archivo.jpg') => {file: "archivo.jpg", path: "/ruta/al"}
	 * @param string
	 * @return object ó false
	 */
	xtractFile : function(data){
		var m = data.match(/(.*)[\/\\]([^\/\\]+\.\w+)$/);
		return m && m.length ? {path: m[1], file: m[2]} : false;
	},
	
	/**
	 * Sanea un string conservando solo alfanuméricos y _
	 * ej:	$.sanitize('Víctor Manuel-_jajñ%&') => 'Victor_Manuel_jajn_'
	 * @param string
	 * @return string
	 * @todo Comparar con _.str
	 */
	sanitize : function(esto) {
		var __r = {
			'\u00C1':'A',
			'\u00C9':'E',
			'\u00CD':'I',
			'\u00D3':'O',
			'\u00DA':'U',
			'\u00D1':'N',
			'\u00dc':'U'
		};
		esto = esto.replace(/\.+/g,'.').replace(/\s+/g," ");
		return esto.replace(/[\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00dc\W\.]/gi, function(m){
			var ret = __r.hasOwnProperty(m.toUpperCase()) ? __r[m.toUpperCase()] : false;
			if (ret) return m === m.toLowerCase() ? ret.toLowerCase() : ret;
			return m === '.' ? '.' : '_';
		}).replace(/_+/g,'_');
	},
	
	/**
	 * Devuelve una cantidad dividida por factor. Útil para obtener kb o Mb
	 * ej: $d.round(123456) => 120.6
	 * @param int numb
	 * @param int numb default 1024
	 * @param boolean commas
	 * @return mixed
	 */
	round : function(numb, commas, factor) {
		factor = factor || 1024;
		commas = commas || false;
		var numero = numb/factor;
		numero = numero.toFixed(1);
		return commas ? $d.addCommas(numero) : numero;
	},
	
	/**
	 * Separa miles con commas
	 * ej: $d.addCommas(123456) => 123,456
	 * @param int numb
	 * @return string
	 */
	addCommas : function(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	
	/**
	 * Codifica una cadena en base64
	 * ej:	$d.codificaArregloBase64({'uno':'jaja', 'dos':'jeje'})
			=> "dW5vPWphamEmZG9zPWplamU%3D"
	 * @param string
	 * @return object
	 */
	codificaArregloBase64 : function(arreglo) {
		var i, v, parsedArr = '', salida;
		for (var i in arreglo) {
			if (!arreglo.hasOwnProperty(i)) continue;
			parsedArr += escape(i);
			parsedArr += '='+escape(arreglo[i]);
			parsedArr += '&';
		}
		parsedArr = parsedArr.substr(0, parsedArr.length - 1);
		return escape(base64_encode(parsedArr));
	},
	
	/**
	 * Decodifica un objeto codificado en base64 y devuelve el objeto
	 * ej:	$d.decodificaCadenaBase64("dW5vPWphamEmZG9zPWplamU%3D")
	 *		{'uno':'jaja', 'dos':'jeje'}
	 * @param string
	 * @return object
	 */
	decodificaCadenaBase64 : function(cadenaBase64) {
		var uriObj, i, v, eachUriObj, parsedObj = {}, param;
		if ($.type(cadenaBase64) == 'string') {
			param = unescape(cadenaBase64);
			param = base64_decode(param);
			uriObj = param.split('&');
			$.each(uriObj,function(i,v){
				eachUriObj = v.split('=');
				parsedObj[eachUriObj[0]] = eachUriObj.length > 1 ? eachUriObj[1] : '';
			});
			return parsedObj;
		}
		return false;
	},
	
	// Devuelve en json, todos los inputs de un contenedor
	// listo para ser enviado a un server
	// Se ignorarán campos sin el atribbuto "name"
	obtenerDatos : function(contenedor, excluir) {
		contenedor = contenedor || false;
		excluir = excluir || false;
		if (!contenedor) return false; // contenedor es obligatorio
		
		var salida = {}, inputs = {}, i;
		
		//verificamos que padre sea único
		if ($(contenedor).length != 1) return false; // contenedor debe ser único
		
		//solo aceptamos input, textarea y select
		inputs = $(contenedor).find('input,textarea,select').not('[class*="'+excluir+'"]').serializeArray();
		for (i in inputs) {
			if (!inputs.hasOwnProperty(i)) continue;
			salida[inputs[i].name] = inputs[i].value;
		}
		
		return salida;
	},
	
	// Determina recursivamente la profundidad
	// del método a ejecutarse, y de hecho ejecuta
	// la función con sus parámetros.
	ejecuta : function(hijos, papa, parametros) {
		if ($d.tipo(hijos) == 'function') return hijos(parametros);
		papa = papa || window;
		var hijosArr = hijos.split('/');
		var metodo = hijosArr.shift();
		//if(!papa.hasOwnProperty(metodo)) return 'Error, el m\351todo: "' + metodo + '" no existe';
		if(!metodo in papa) return 'Error, el m\351todo: "' + metodo + '" no existe';
		return !hijosArr.length
			? $d.tipo(papa[metodo]) == 'function'
				? papa[metodo](parametros)
				: $d.ejecuta((hijosArr.push('init'),hijosArr.join('/')), papa[metodo], parametros)
			: $d.ejecuta(hijosArr.join('/'), papa[metodo], parametros);
	},
	
	// Determina recursivamente la profundidad
	// del objeto a obtener, y de hecho obtiene
	// el objeto
	extrae : function(hijos, papa, onlyCheck, separador) {
		papa = papa || window;
		onlyCheck = onlyCheck || false;
		separador = separador || '.';
		
		var hijosArr = hijos.split(separador);
		var obj = hijosArr.shift();
		
		//if(!obj in papa) return false;
		if(!papa.hasOwnProperty(obj)) return false;
		return !hijosArr.length
			? onlyCheck 
				? true
				: papa[obj]
			: $d.extrae(hijosArr.join(separador), papa[obj], onlyCheck, separador);
	},
	
	// Comprueba recursivamente la existencia de todos los elementos indicados en un objeto
	// $d.existe('key1.key2.key3', $objeto)
	existe : function(hijos, papa, separador) {
		return $d.extrae(hijos, papa, true, separador);
	},
	
	// Devuelve todos y solamente todos los URLS localizados en un texto envueltos en etiquetas <a href>
	// Ejemplo: $d.parseURLS('hola http://www.yahoo.com/algo, jeje como la ven eeeeh')
	// Devuelve: "hola <a href='http://www.yahoo.com/algo' target='_blank'>http://www.yahoo.com/algo</a>, jeje como la ven eeeeh?"
	parseURLS : function(s) {
		var myRegEx = /((http:\/\/|https:\/\/|ftp:\/\/|www\.)([\w\.]+\.)?[\w-]+(\.[a-zA-Z]{2,4})?[^\s\r\n\(\)"\'<>\,\!]+)/gi;
		if (s && $d.tipo(s) == 'string') {
			var matches = s.replace(myRegEx,"<a href='$1' target='_blank'>$1</a>");
			if (s !== matches && matches.search(/http[s]*:/gi) < 0) {
				matches = matches.replace(/href='/gi,"href='http://");
			}
			return matches;
		}
		else {return s;}
	},
	
	// Extrae cada parte de un url y devuelve un objeto con cada parte
	// "source","protocol","authority","userInfo","user","password",
	// "host","port","relative","path","directory","file","query","anchor"
	parseUri : function(str) {
		var	o   = this._parseUri_options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	},
	
	_parseUri_options : {
		strictMode: false,
		key: [	
			"source","protocol","authority","userInfo",
			"user","password","host","port","relative",
			"path","directory","file","query","anchor"
		],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	},
	
	/**
	 * Mecanismos para escuchar eventos,
	 * asociados a clases en el HTML.
	 */
	escuchar : {
		
		/**
		* Escuchador universal. Selecciona todos los objetos que
		* contengan la clase "escuchar_" y se le asigna un evento
		* 'click' al elemento. Se le enviará como parámetro el
		* objeto $(this).
		* El método receptor puede o no recibir un parámetro.
		*/
		click : function(delai, porEventos) {
			delai = delai || 1000;
			porEventos = porEventos || false;
			$(document).on('click','.escuchar_',function(e){
				var esto = $(this);
				esto.data('clickOffset',{'x':e.clientX,'y':e.clientY});
				//Verificamos la bandera de bloqueo
				if (esto.data('escuchar_')) return;
				//Ponemos una bandera para bloquear este elemento
				esto.data('escuchar_',true);
				var clases = esto.attr('class').split(' ');
				for(key in clases) {
					var clase = clases[key];
					var penultimo = clase.length - 1;
					if(clase != 'escuchar_' && clase.substr(penultimo, 1) == '_') {
						var longitud = clase.length - 1;
						// Para reemplazar TODAS las OCURRENCIAS, se debe hacer con
						// expresiones regulares, de lo contrario sólo reemplazará la 1er ocurrencia.
						var rutaMetodo = clase.substr(0, longitud).replace(/_/g, '/');
						var funcion;
						if (!porEventos)
							funcion = $d.ejecuta(rutaMetodo, false, esto)
						else
							$('body').trigger(clase, esto);
						break;
					}
				}
				//Eliminamos la bandera de bloqueo con un timeout de 1 seg
				if (esto.hasClass('sinTimeOut_')) {
					esto.removeData('escuchar_');
				} else {
					setTimeout(function(){esto.removeData('escuchar_')},delai);
				}
				
			});
		},
		
		mouseover : function(delai) {
			delai = delai || 1000;
			$(document).on('mouseover','.escucharMouseOver_',function(e){
				var esto = $(this);
				esto.data('clickOffset',{'x':e.clientX,'y':e.clientY});
				//Verificamos la bandera de bloqueo
				if (esto.data('escucharMouseOver_')) return;
				//Ponemos una bandera para bloquear este elemento
				esto.data('escucharMouseOver_',true);
				var clases = esto.attr('class').split(' ');
				for(key in clases) {
					var clase = clases[key];
					var penultimo = clase.length - 1;
					if(clase != 'escucharMouseOver_' && clase.substr(penultimo, 1) == '_') {
						var longitud = clase.length - 1;
						// Para reemplazar TODAS las OCURRENCIAS, se debe hacer con
						// expresiones regulares, de lo contrario sólo reemplazará la 1er ocurrencia.
						var rutaMetodo = clase.substr(0, longitud).replace(/_/g, '/');
						var funcion = $d.ejecuta(rutaMetodo, false, esto);
						break;
					}
				}
				//Eliminamos la bandera de bloqueo con un timeout de 1 seg
				if (esto.hasClass('sinTimeOut_')) {
					esto.removeData('escucharMouseOver_');
				} else {
					setTimeout(function(){esto.removeData('escucharMouseOver_')},delai);
				}
				
			});
		},
		
		/**
		* Escuchador universal. Selecciona todos los objetos que
		* contengan la clase "enter_" y se le asigna un evento
		* 'keyup' al elemento. Se le enviará como parámetro el
		* objeto $(this).
		* Se valida que el keyCode de la tecla presionada corresponda a 
		* un enter (13) y que el contenido del imput sea diferente de "".
		* El método receptor puede o no recibir un parámetro.
		*/	
		enter : function() {
			$(document).on('keypress','.enter_',function(evento){
				var esto = $(this);
				var clases = esto.attr('class').split(' ');
				if(evento.which == 13 && !evento.ctrlKey && !evento.shiftKey){
					if($.trim($(this).val()) == "") return;
					for(key in clases) {
						var clase = clases[key];
						var penultimo = clase.length - 1;
						if(clase != 'enter_' && clase.substr(penultimo, 1) == '_') {
							var longitud = clase.length - 1;
							// Para reemplazar TODAS las OCURRENCIAS, se debe hacer con
							// expresiones regulares, de lo contrario sólo reemplazará la 1er ocurrencia.
							var rutaMetodo = clase.substr(0, longitud).replace(/_/g, '.');
							var funcion = new Function('parametro', 'return ' + rutaMetodo + '(parametro);');
							try {
								if(typeof(funcion) == 'function') funcion(esto);
							} catch(e) { /**/ }
							//este return false es para que no escriba el "enter""
							return false;
						}
					}
				}
			});
		}
		
	},
	
	nada : function(p){}
};


/* Despliegue v2 Implementación de smarty*/
var despliegue = {
	dibujar : function(args) {
		var plantillas = $('body').data('plantillas').datos || false;
		var miPlantilla, jqDestino, tpl;

		var arg = {
			'plantilla' : 'blank',
			'datos' : {},
			'destino' : false,
			'posicion' : 'append',
			'efectos' : false
		};

		_.extend(arg, args);
		if (!plantillas.hasOwnProperty(arg.plantilla)) return false;

		miPlantilla = plantillas[arg.plantilla];

		if (arg.destino && !$(arg.destino).is('*'))
			return false;

		jqDestino = arg.destino ? $(arg.destino) : false;
		tpl = new jSmart(miPlantilla).fetch(arg.datos);

		if (arg.destino) {
			if (arg.efectos) return $(tpl).hide().appendTo(arg.destino).fadeIn();
			return jqDestino[arg.posicion](tpl);
		} else {
			return tpl;
		}
	}
};


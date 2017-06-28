/* 
 * Ax
 *
 * @Author  : YiJun
 * @Date    : 2017.4.1 - now
 *
 * require Utils Lib [ struct ]
 */

(function(root,ax,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define('ax',['struct'],function(_){ return factory(ax,_); });
	else if(typeof exports !== "undefined"){
		// support CommonJS exports
		// * fuck the npm package rubbish
		var _ = require('struct');
		factory(exports,_);
	}else
		// build on browser global object
		root.ax = factory(ax,root._);

})(this, {}, function(ax,struct){
	"use strict";

	ax.VERSION = struct.VERSION;

	// Define DOM frame
	var z,Z,aM,aV,aR,aT,aS,vA,
	// Define Setting
		VIEW_DEFAULT  = { },
		ATOM_DEFAULT  = { use:[] },
		MODEL_DEFAULT = { data:{}, validate:{} },
		ROUTE_DEFAULT = { char:"@", routes:{}, actions:{} },

	// resetful list 
	// use for ax ajax-api
	RESTFUL = {
		get    : "GET",
		put    : "POST",
		send   : "GET",
		sync   : "POST",
		post   : "POST",
		fetch  : "GET",
		update : "POST"
	},

	// *use struct utils list
		root      = struct.root,
		v8        = struct.v8(),
		_lock     = struct.lock(),
		_keys     = struct.keys(),
		_noop     = struct.noop(),
		_define   = struct.define(),
		_slice    = struct.slice(),
		_clone    = struct.clone(),
		_extend   = struct.extend(),
		_eq       = struct.eq(),
		_toString = struct.convert('string'),
		_type     = struct.type(),
		_isObj    = struct.type('object'),
		_isFn     = struct.type('function'),
		_isNum    = struct.type('num'),
		_isBool   = struct.type("bool"),
		_isStr    = struct.type("str"),
		_isInt    = struct.type('int'),
		_isAry    = struct.type('array'),
		_isAryL   = struct.type('arraylike'),
		_isPrim   = struct.type('primitive'),
		_isFloat  = struct.type('float'),
		_isDOM    = struct.type('dom'),
		_isElm    = struct.type('elm'),
		_isNode   = struct.type('node'),
		_loop     = struct.op(),
		_fol      = struct.op('object'),
		_fal      = struct.op('array'),
		_map      = struct.map(),
		_cat      = struct.cat(),
		_ey       = struct.every(),
		_on       = struct.event('on'),
		_unbind   = struct.event('unbind'),
		_emit     = struct.event('emit'),
		_prop     = struct.prop('get'),
		_set      = struct.prop('set'),
		_rmProp   = struct.prop('not'),
		_param    = struct.param(),
		_paramStr = struct.param("string"),
		_trim     = struct.string('trim'),
		_has      = struct.has(),
		_ajax     = struct.ajax(),
		_size     = struct.size(),
		_first    = struct.first(),
		_last     = struct.last(),
		_link     = struct.link(),
		_utob     = struct.assembly("u2b"),
		_btou     = struct.assembly("b2u"),
		_doom     = struct.doom(),
		_merge    = struct.merge(),
		_index    = struct.index(),
		_one      = struct.index("one"),
		cool      = struct.cool();

	// ax genertor function
	function genertor_(api){
		var apiName, apiUse, apiSelect;
		if(_isAry(api)){
			apiUse = api[1]; 
			apiName = api[0];
			apiSelect = api[2]; }
		else{
			apiUse = api; 
			apiName = api;
			apiSelect = void 0; }

		aM.prototype[apiName] = function(){
			var tmp = this.data,
					args = [tmp].concat(_slice(arguments));
			if(!_eq(tmp = struct[apiUse](apiSelect).apply(tmp,args),this.data))
				this.emit((this.data = tmp,api),args);
			return this;
		};

		aT.prototype[apiName] = function(){
			return struct[apiUse](apiSelect).apply(this,
			[this.toData()].concat(_slice(arguments)));
		};
	}

	// not change rebase data
	function genertor_$(api){
		var apiName, apiUse, apiSelect;
		if(_isAry(api)){
			apiUse = api[1]; 
			apiName = api[0];
			apiSelect = api[2]; }
		else{
			apiUse = api; 
			apiName = api;
			apiSelect = void 0; }

		aM.prototype[apiName] = function(){
			var args = [this.data].concat(_slice(arguments));
			return struct[apiUse](apiSelect).apply(this,args);
		};

		aT.prototype[apiName] = function(){
			return struct[apiUse](apiSelect).apply(this,
			[this.toData()].concat(_slice(arguments)));
		};
	}

	function createAx(use){
		return function(o){ 
			return new use(_isObj(o) ? o : {}); 
		};
	}

	function createExtend(use){
		return function(opt){
			var malloc = opt; 
			return function(o){ 
				return new use(_merge(malloc,_isObj(o)?o:{})); 
			}; 
		};
	}

	// get childNodes and filter by selector
	// cant use Global matcher
	//var isId    = /^#[^\s\=\+\.\#\[\]]+/i,												// "#idname"
	//	isClass = /^\.[^\s\=\+\.\#\[\]]+$/i,											// ".className"
	//	isTag   = /^[^\[\]\+\-\.#\s\=]+$/i,												// "p" "div" "DIV"
	//	isAttr  = /([^\s]+)?\[([^\s]+)=["']?([^\s'"]+)["']?\]$/i,		// div[id="nami"]
	//	mreSl   = /^[^\s]+,[^\s]+/gi,
	//	cidSl   = /[\s|\r]+/im,
	//	pitSl   = /[>|\+|\~]+/im,
	//	isHTML  = /<[a-zA-Z][\s\S]*>/;

	// Performance JavaScript selector
	// Just Optimzer this function for sl pref
	// @ much more need its better
	Z = function(elm){
		this.el = _isAryL(elm) ? 
							_slice(elm) : 
							(elm instanceof Element ? [elm] : []);
	};

	z = function(x){ return z.init.call(root,x); };

	var _zid = 1,
		handlers = {},
		focusinSupported = 'onfocusin' in struct.root,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
		check = { check: 'change' },
		change = { change: 'input', input: 'input' },
		prevent = ["compositionstart","compositionupdate"],
		ininput = ["input","keypress","keydown","keyup"],
		notdata = prevent.concat(["compositionend"]);
	
	var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
		eventMethods = {
			preventDefault: 'isDefaultPrevented',
			stopImmediatePropagation: 'isImmediatePropagationStopped',
			stopPropagation: 'isPropagationStopped'
		};

	function zid(element) {
		return element._zid || (element._zid = _zid++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
	
		if (event.ns) 
			var matcher = matcherFor(event.ns);
	
		return (handlers[zid(element)] || []).filter(function(handler) {
			return handler &&
				(!event.e  || handler.e == event.e) &&
				(!event.ns || matcher.test(handler.ns)) &&
				(!fn       || zid(handler.fn) === zid(fn)) &&
				(!selector || handler.sel == selector);
		});
	}

	function parse(event) {
		var parts = ('' + event).split('.');
		return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) ||
			!!captureSetting;
	}

	function capCursor(elm){
	  var pos = 0;
  	if (elm.selectionStart != null)
    	pos = elm.selectionStart;
  	// IE Support
  	else if (document.selection) {
    	elm.focus();

    	var sel = document.selection.createRange();
    	sel.moveStart('character', -elm.value.length);
    	// The caret position is selection length
    	pos = sel.text.length;
  	}
  	return pos;
	}

	function setCursor(elm,pos){
    if(elm.createTextRange) {
      var range = elm.createTextRange();
      range.move('character', pos);
      range.select();
    } else {
      if(elm.selectionStart)
        elm.setSelectionRange(pos, pos, elm.focus());
      else
        elm.focus();
    }
	}

	function realEvent(type) {
		return hover[type] || 
					 change[type] || 
					 check[type] ||
					 (focusinSupported && focus[type]) || 
					 type;
	}

	function zaddEvent(element, events, fn, data, selector, delegator, capture){
		var id = zid(element), 
			set = (handlers[id] || (handlers[id] = []));
	
		_loop(events.split(/\s/),function(event){
			var handler   = parse(event);
			handler.fn    = fn;
			handler.sel   = selector;

			// emulate mouseenter, mouseleave
			if (handler.e in hover)
				fn = function(e){
					var related = e.relatedTarget;
					if (!related || (related !== this && ! this.contains(related)))
						return handler.fn.apply(this, arguments);
				};

			handler.del = delegator;
			var callback  = delegator || fn;

			handler.proxy = function(e){
				var pos,
						type = e.type,
						tname = e.target.nodeName, 
						editable = e.target.contentEditable === "true",
						isinput = _has(ininput,type) && (tname === "INPUT" || tname === "TEXTAREA" || editable );

				e = compatible(e);

				if (e.isImmediatePropagationStopped() || (isinput && e.target._compositionIn)) 
					return false;

				// # Chrome event handler assign Error with CompositionEvent
				if(!_has(notdata,type))
					e.data = data;

				if(isinput)
					pos = capCursor(e.target);

				var result = callback.apply(element, 
					e._args === void 0 ? [e] : [e].concat(e._args));

				if(result === false)
					e.preventDefault(),e.stopPropagation();

				if(pos)
					setCursor(e.target,pos);

				return result;
			};
	
			handler.i = set.length;
			set.push(handler);

			var tEvent = realEvent(handler.e);

			if(tEvent in change){
				element.addEventListener("compositionstart",function(e){
					e.target._compositionIn = true;
				});
				element.addEventListener("compositionend",function(e){
					e.target._compositionIn = false;
					z(e.target).trigger("input");
				});
			}

			element.addEventListener(
				tEvent, 
				handler.proxy, 
				eventCapture(handler, capture)
			);
		});
	}

	function zremoveEvent(element, events, fn, selector, capture){
		var id = zid(element);
		_loop((events || '').split(/\s/),function(event){
			_loop(findHandlers(element, event, fn, selector),function(handler){
				delete handlers[id][handler.i];

				element.removeEventListener(
					realEvent(handler.e),
					handler.proxy,
					eventCapture(handler, capture)
				);
			});
		});
	}

	function returnTrue(){
		return true;
	}

	function returnFalse(){
		return false;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			source || (source = event);
	
			_loop(eventMethods, function(predicate, name) {
				var sourceMethod = source[name];
	
				event[name] = function(){
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};
	
				event[predicate] = returnFalse;
			});
	
			try {
				event.timeStamp || (event.timeStamp = Date.now());
			} catch (ignored) { }
	
			if (source.defaultPrevented !== void 0 ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault())
				event.isDefaultPrevented = returnTrue;
		}
		return event;
	}

	function createProxy(event) {
		var key, proxy = { originalEvent: event };
		for (key in event)
			if (!ignoreProperties.test(key) && event[key] !== void 0) 
				proxy[key] = event[key];
	
		return compatible(proxy, event);
	}

	var matchzx = Element.prototype.matches ||
								Element.prototype.webkitMatchesSelector ||
								Element.prototype.mozMatchesSelector ||
								Element.prototype.msMatchesSelector ||
								function(selector){
									return (this.parentNode != null && this !== document) &&
											 _has(this.parentNode.querySelectorAll(selector),this);
								};

	z.init = function(x){
		return new Z(x);
	};

	z.matchz = function(elm,selector){
		return !(elm===null||elm===document||typeof selector !== "string") && matchzx.call(elm, selector);
	};

	z.event = { 
		add: zaddEvent, 
		remove: zremoveEvent 
	};
	
	z.proxy = function(fn, context) {
		var args = (2 in arguments) && _slice(arguments, 2);
	
		if (_isFn(fn)) {
			var proxyFn = function(){ 
				return fn.apply(
					context, args ? 
					args.concat(_slice(arguments)) : arguments
				);
			};
	
			proxyFn._zid = zid(fn);
			return proxyFn;
	
		} else if (typeof context === "string") {
			if (args)
				return z.proxy.apply(null,(args.unshift(fn[context],fn),args));
			else
				return z.proxy(fn[context], fn);
		} else {
			throw new TypeError("expected function");
		}
	};

	// z Custom Events
	z.Event = function(type, props) {
		if (typeof type !== "string") 
			props = type, type = props.type;
	
		var event = document.createEvent(
			_has(capTypes['MouseEvent'],type) ? 'MouseEvent' : 'Events'), bubbles = true;
	
		if (props) 
			for (var name in props) 
				(name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
	
		event.initEvent(type, bubbles, true);
		return compatible(event);
	};

	var supportTemplate = "content" in document.createElement("template");
	function createDOM(rootElm,html){
		var r = rootElm.cloneNode(),t;
		if(supportTemplate)
			r.appendChild((t=document.createElement("template"),
				t.innerHTML=html,
				t.content));
		else
			r.innerHTML = html;
		return r;
	}

	var attrList = {
		class : "className",
		style : "style.cssText"
	};

	var patchList = [
		"no",  //0
		"replace", //1
		"append", //2
		"remove", //3
		"modifytext", //4
		"withtext", //5
		"removetext", //6
		"addattr", //7
		"modifyattr", //8
		"removeattr" //9
	];

	var slikReg = new RegExp(
		"</([^><]+?)>|" +
		"<([^><]+?)/>|" +
		"<([^><]+?)>|"  +
		"([^><]+)|$" ,"g");

	var tagList = { 
		input:1, 
		br:1, 
		hr:1, 
		img:1, 
		meta:1,
		area:1,
		base:1,
		col:1,
		command:1,
		embed:1,
		keygen:1,
		link:1,
		head:1,
		param:1,
		source:1,
		track:1,
		wbr:1
	};

	var attrexec = /([^\s]+)=['"]?([^'"]+)['"]?/gi,
			excapetab = /^[\r\n\f\t\s]+|[\r\n\f\t\s]+$/gi;

	var attrName = function(attr){
		return attrList[attr] || attr; 
	};

	var patchHack = [
		function(){},  //0
 		//1 replace
		function(patch,t){
			t = patch.s;
			t.parentNode.insertBefore(patch.n,t);
			t.parentNode.removeChild(t);
		}, 
 		//2 append
		function(patch,t){
			t = patch.s;
			t.appendChild(patch.n);
		},
 		//3 remove
		function(patch,t){
			t = patch.s;
			t.parentNode.removeChild(t);;
		},
 		//4 modifytext
		function(patch,t){
			t = patch.s;
			t.innerText = patch.c; 
		},
 		//5 withtext
		function(patch,t){
			t = patch.s;
			t.innerHTML = "";
			t.innerText = patch.c;
		},
		//6 removetext
		function(patch,t){
			t = patch.s;
			t.innerHTML = patch.n.innerHTML;
		},
		//7 addattr
		function(patch,t){
			t = patch.s;
			_fol(patch.a,function(value,key){
				_set(t,attrName(key),value);
			});
		},
		//8 modifyattr
		function(patch,t){
			t = patch.s;
			_fol(patch.o,function(value,key){
				if(t[key]){
					if(!(delete t[key])) 
						try{ t[key] = null; }catch(e){}
				} else
					t.removeAttribute(key);
			});
			_fol(patch.a,function(value,key){
				_set(t,attrName(key),value);
			});
		},
		//8 removeattr
		function(patch,t){
			t = patch.s;
			_fol(patch.a,function(value,key){
				t.removeAttribute(key); });
		},
	];

	var slik = {

		treeDiff: function(org,tag,patch,orgParent,tagParent){
			if(org === void 0){
				// new node
				patch.unshift( slik.createPatch(orgParent,tag,2));}
			else if(tag === void 0)
				// remove node
				patch.push( slik.createPatch(org,tag,3));
			else if(org.tagName === tag.tagName){
				if(!_eq(org.attributes,tag.attributes)){
					if(org.attributes&&tag.attributes)
						patch.push( slik.createPatch(org,tag,8));
					else if(!org.attributes)
						patch.push( slik.createPatch(org,tag,7));
					else if(!tag.attributes)
						patch.push( slik.createPatch(org,tag,9));
				}

				// some node , maybe modify
				if(org.text !== tag.text){
					if((org.text && tag.text) && org.text !== tag.text)
						// modify text
						patch.push( slik.createPatch(org,tag,4));
					else if(!org.text)
						// fill with text
						patch.push( slik.createPatch(org,tag,5));
					else if(!tag.text)
						// modify to child DOM or empty
						patch.push( slik.createPatch(org,tag,6));
					return patch;
				}
				
				// with child diff
				if(org.child.length || tag.child.length){
					for(var i=Math.max(org.child.length,tag.child.length); i--;)
						slik.treeDiff(org.child[i],tag.child[i],patch,org,tag);
				}
			}else if(org.tagName !== tag.tagName){
				patch.push( slik.createPatch(org,tag,1));
			}

			return patch;
		},

		applyPatch:function(oDOM,patchs,callback){
			_fal(_map(patchs,function(patch){
				patch.s = oDOM.querySelector(patch.s);
				return patch;
			}),function(patch){
				patchHack[patch.t].call(oDOM,patch);});
			return callback ? callback(oDOM) : oDOM;
		},

		createSelector:function(org){
			var selector = org.tagName + ":nth-child("+org.i+")";
			while(org=org.parent)
				if(org.i !== void 0)
					selector = org.tagName + ":nth-child("+org.i+")"+">"+ selector;
			return selector;
		},

		createPatch: function(org,tag,type){
			var node;
			var patch,sl = slik.createSelector(org);

			switch(patchList[type]){
				case "replace":
					node = slik.createDOMElememnt(tag);
					patch = { t:1,s:sl,n:node };
					break;
				case "append":
					sl = slik.createSelector(org);
					node = slik.createDOMElememnt(tag);
					patch = { t:2,s:sl,n:node };
					break;
				case "remove":
					sl = slik.createSelector(org);
					patch = { t:3,s:sl };
					break;
				case "modifytext":
					patch = { t:4,s:sl,c:tag.text };
					break;
				case "withtext":
					patch = { t:5,s:sl,c:tag.text };
					break;
				case "removetext":
					node = slik.createDOMElememnt(tag);
					patch = { t:6,s:sl,n:node };
					break;
				case "addattr":
					patch = { t:7, s:sl ,a:tag.attributes };
					break;
				case "modifyattr":
					patch = { t:8, s:sl ,a:tag.attributes, o:org.attributes };
					break;
				case "removeattr":
					patch = { t:9, s:sl ,a:org.attributes };
					break;
				default:
					break;
			}
			return patch;
		},

		createTreeFromHTML: function(html){
			var root = {
				tagName:"root",
				child:[]
			};

			var p = root , c = root.child;
			html.replace(slikReg,function(match,close,stag,tag,text,offset){
				if(!match || !(match.replace(excapetab,"")))
					return match;

				if(close){
					p = p.parent; c = p.child;
				}else if(stag){
					var node = slik.createObjElement(stag);
					node.i= c.length+1; c.push(node); node.parent = p;
				}else if(tag){
					var node = slik.createObjElement(tag);
					node.i= c.length+1; c.push(node); node.parent = p;
					if(!(node.tagName in tagList))
					p = node; c = node.child;
				}else if(text){
					if(text.trim())
						p.text = text;
				}
				return match;
			});
			return root;
		},

		createObjElement:function(str){
			var arr = str.split(" ");
			var tagName = arr.shift();
			var attrbutes = arr.join(" ").trim();
			var elm =  { tagName: tagName, child:[] };

			if(attrbutes){
				var attrs = {};
				var s, len = attrbutes.length;
				while(s=attrexec.exec(attrbutes))
					attrs[s[1]] = s[2];
				elm.attributes = attrs;
			}
			return elm;
		},

		createDOMElememnt:function(obj){
			var elm = document.createElement(obj.tagName); 

			if(obj.attributes)
				_fol(obj.attributes,function(val,key){ 
					_set(elm,attrName(key),val); 
				});

			if(obj.text)
				elm.innerText = obj.text;
			else if(obj.child.length)
				_fal(obj.child,function(obj){ 
					elm.appendChild(slik.createDOMElememnt(obj)); });
			return elm;
		}
	};

	var capTypes = {
		"UIEvent"       : [
			"focus",
			"blur",
			"focusin",
			"focusout"
		],
		"MouseEvent"    : [
			"click",
			"dbclick",
			"mouseup",
			"mousedown",
			"mouseout",
			"mouseover",
			"mouseenter",
			"mouseleave"
		],
		"KeyboardEvent" : [
			"keydown",
			"keypress",
			"keyup"
		]
	};

	Z.prototype = {
		get : function(index){
			return 0 in arguments ? 
				this.el[( +index + ( index < 0 ? this.length : 0 ) )] : 
				this.el;
		},

		each : function(fn,context){
			return _fal(this.el,fn,context||this),this;
		},

		find : function(sl){
			var res = []; 
			_fal(this.el,function(e){
				res = _slice(e.querySelectorAll(sl)).concat(res);
			});
			return z(res);
		},

		closest : function(selector,element){
			var el = this.el ,tmp=this.get(0) ,find;

			for(var i=0,l=el.length;i<l;i++,tmp=el[i]){
				while(tmp&&!find&&tmp!==element)
					if(z.matchz((tmp=tmp.parentNode),selector)) 
						find = tmp;
				if(find) break;
			}

			return z(find||[]);
		},

		on : function(event, selector, data, callback, one){
			var autoRemove, delegator, $this = this;
	
			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					$this.on(type, selector, data, fn, one);
				});
	
				return $this;
			}
	
			if ((typeof selector !== "string") && 
				!_isFn(callback) && 
				callback !== false)
				callback = data, data = selector, selector = void 0;
			if (callback === void 0 || data === false)
				callback = data, data = void 0;
	
			if (callback === false) 
				callback = returnFalse;
	
			return $this.each(function(element){
				if (one) 
					autoRemove = function(e){
						zremoveEvent(element, e.type, callback);
						return callback.apply(this, arguments);
					};
	
				if (selector) 
					delegator = function(e){
						var evt, match = !z.matchz(e.target,selector) ? 
											z(e.target).closest(selector, element).get(0) :
											e.target;

						if (match && match !== element){
							evt = _extend(createProxy(e), {currentTarget: match, liveFired: element});
							return (autoRemove || callback).apply(match, [evt].concat(_slice(arguments,1)));
						}
					};
	
				zaddEvent(element, event, callback, data, selector, delegator || autoRemove);
			});
		},

		off : function(event, selector, callback){
			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					this.off(type, selector, fn);
				},this);
				return this;
			}
	
			if (typeof selector !== "string" && 
				!_isFn(callback) && 
				callback !== false)
				callback = selector, selector = void 0;
	
			if (callback === false) 
				callback = returnFalse;
	
			return this.each(function(element){
				zremoveEvent(element, event, callback, selector);
			});
		},

		trigger : function(event, args){
			event = typeof event === "string" ? z.Event(event) : compatible(event);
			event._args = args;
	
			return this.each(function(element){
				// handle focus(), blur() by calling them directly
				if (event.type in focus && _isFn(element[event.type])) 
					element[event.type]();
				// items in the collection might not be DOM elements
				else if ('dispatchEvent' in element) 
					element.dispatchEvent(event);
				else 
					z(element).triggerHandler(event, args);
			});
		},
	
		triggerHandler : function(event, args){
			var e, result;
			this.each(function(element){
				e = createProxy( typeof event === "string" ? z.Event(event) : event);
	
				e._args = args;
				e.target = element;
				_loop(findHandlers(element, event.type || event), function(handler){
					result = handler.proxy(e);
					if (e.isImmediatePropagationStopped())
						return false;
				});
			});
	
			return result;
		},
	
		html : function(html){
			return this.each(function(elm){
				elm.innerHTML = html;
			});
		},
		// virtual render
		render : function(newhtml,view){
			return this.each(function(elm){
				if(elm._vid !== view._vid)
					return elm.appendChild(slik.createDOMElememnt(
						view.axml = slik.createTreeFromHTML(newhtml)
					).firstElementChild, elm.innerHTML = null);

				var target = slik.createTreeFromHTML(newhtml);
				return slik.applyPatch(elm, slik.treeDiff(view.axml,target,[]),
					function(){ view.axml = target; });
			});
		}
	};
	// checker template;
	var checker = _doom("[ checker -> ax.va.{{#type}} ]");
	var vahandler = _doom("The value Of *( {{#value}} ) with type [ {{#type}} ] not pass validate! {{#msg}}");

	function checkValidate(olddata,newdata,validate){
		var res = [],s=_size(validate);
		if(!s) return res;
		if(!_eq(olddata,newdata)){
			var key = _keys(validate);
			for(var i=0,isRequired,value; i<s; i++){
				// get validate funtion
				isRequired = validate[key[i]];
				value=_prop(newdata,key[i]);
				if(!isRequired(value)){
					res.push(key[i],value);
					break;
				}
			}
		}
		return res;
	}

	function on(type,fn){
		if(_isFn(fn)) _on(this,type,fn);
		return this;
	}

	function uon(fn,type){
		return this.on(type,fn);
	}

	function unbind(type,fn){
		return _unbind(this,type,fn);
	}

	function emit(type,args){
		return _emit(this,type,args||[]);
	}

	function moc(target,val){
		if(_isAry(target))
			target = target.concat(val);
		else if(_isObj(target))
			target = _merge(target,val);
		else if(_isStr(target))
			target += val;
		else
			target = val;
		return target;
	}

	function parseKey(key){
		return "Ax@"+_utob(key);
	}

	function parseResult(data){
		data = toString(data) ? _btou(data) : "";
		return _size(data) > 1 ? JSON.parse(data) : (data||"");
	}

	function warn(value,msg){
		console.warn(vahandler({
			value : value,
			type : _type(value),
			msg : msg||""
		}));
		return false;
	}

	function makeChecker(checker,type){
		return function(value){
			return checker(value) || warn(value,checker({ type:type }));
		};
	}

	function isAx(compare){
		return function(value){ 
			return value instanceof compare;
		};
	}

	function pipe(type,url,param,fns,fnf,header){
		//param must be object typeof
		var st = {
			url : url,
			type  : RESTFUL[type],
			aysnc : true,
			param : param,
			header : header
		};

		// deal with arguments 
		// set http header param
		st.success = function(){
			// change the data before dispatch event;
			(fns||_noop).apply(this,arguments);
			this.emit(type+":success",arguments);
		}.bind(this);
		st.fail = function(){
			(fnf||_noop).apply(this,arguments);
			this.emit(type+":fail",arguments);
		}.bind(this);
		// trigger ajax events
		return this.emit(type,[_ajax(st),st]);
	}

	function revs(str){
		return str.split("").reverse().join("");
	}

	var RAM = [],
			LS = root.localStorage,
			SN = "Ax@",
			FCD = String.fromCharCode;

	aS = {
		t: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		kAt: function(key,i){
			return key.charCodeAt(~~(i%key.length));
		},

		ecd: function(data) {
    	var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
    	if (!data) { return data; }
    	do {
      	o1 = data[i++];
      	o2 = data[i++];
      	o3 = data[i++];
      	bits = o1 << 16 | o2 << 8 | o3;
      	h1 = bits >> 18 & 0x3f;
      	h2 = bits >> 12 & 0x3f;
      	h3 = bits >> 6 & 0x3f;
      	h4 = bits & 0x3f;
      	enc += this.t.charAt(h1) + this.t.charAt(h2) + this.t.charAt(h3) + this.t.charAt(h4);
    	} while (i < data.length);
    	r = data.length % 3;
    	return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  	},

  	dcd: function(data) {
    	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
    	if (!data) { return data; }
    	data += "";
    	do {
      	h1 = this.t.indexOf(data.charAt(i++));
      	h2 = this.t.indexOf(data.charAt(i++));
      	h3 = this.t.indexOf(data.charAt(i++));
      	h4 = this.t.indexOf(data.charAt(i++));
      	bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      	o1 = bits >> 16 & 0xff;
      	o2 = bits >> 8 & 0xff;
      	o3 = bits & 0xff;
      	result.push(o1);
      	if (h3 !== 64) {
        	result.push(o2);
        	if (h4 !== 64) {
          	result.push(o3);
        	}
      	}
    	} while (i < data.length);
    	return result;
  	},

		incry: function(s,key){
			var res = [];
			for(var i=0,l=s.length; i<l; i++)
				res[i] = s[i].charCodeAt(0)^this.kAt(key,i);
			return this.ecd(res);
		},

		decyt: function(s,key){
			s = this.dcd(s);
			for(var i=0,l=s.length; i<l; i++)
				s[i] = FCD(s[i]^this.kAt(key,i));
			return s.join("");
		},

		set: function(name,data){
			LS.setItem(
				(SN+this.incry(name,revs(name))),
				this.incry(JSON.stringify(data),name)
			);
		},

		get: function(name){
			var str = LS.getItem(SN+this.incry(name,revs(name)));
			return str ? JSON.parse(this.decyt(str,name)) : 0;
		},

		rm: function(name){
			LS.removeItem(SN+this.incry(name,revs(name)));
		}
	};
	
	// Ax Model
	// Ax build -> 2.0
	// model constructor
	aM = function(obj){
		var config = _extend(_clone(MODEL_DEFAULT),obj||{}),
				events = config.events,
				validate = config.validate,
				
				filter = _isFn(config.filter) ? config.filter : cool ,
				existname = _isStr(config.name || 0),
				usestore = config.store && existname,
				usedata = config.data || {},
				data = usestore ? (aS.get(config.name) || usedata) : usedata;

		delete config.data;
		delete config.store;
		delete config.change;
		delete config.events;
		delete config.filter;
		delete config.validate;

		// define data
		_define(this,"data",{
			get : function(){
				return _clone(data);
			},
			set : function(newdata){
				if(_eq(data,newdata = filter(newdata))) 
					return data;

				var args = [_clone(newdata)], error;
				if((this.emit("validate",args),
					_isPrim(newdata) ? (_isFn(validate) ? validate(newdata) : true) :
					(error=checkValidate(data,newdata,validate),!_size(error))))
					return data=newdata,
						this.change=true,
						usestore && aS.set(this.name,newdata),
						this.emit("validate:success,change",args),
						newdata;

				this.emit("validate:fail",args.concat(error));
				if(_isAry(error)&&_size(error)===2)
					this.emit("validate:fail:"+_first(error),[_last(error)]);
				return data;
			},
			enumerable:true,
			configurable:false
		});

		// if userobj has more events
		_fol(events,uon,this);

		// init event
		_extend(this,config)
			.emit("init",[this.data])
			.unbind("init");

		RAM[existname ? this.name : "_"] = this;
	};

	// Extend ax model method 
	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aM.prototype = {
		constructor: aM,

		get: function(key){
			if(!_isBool(key) && ( key || key===0 ))
				return _prop.apply(this,
					[this.data].concat(_slice(arguments)));
			return this.data;
		},

		set: function(key,val){
			this.data = 1 in arguments ?
				_set(this.data,key,val) : 
				key === void 0 ? this.data : key;
			return _isStr(key) ? this.emit(
				"change:" + key, [val]) : this;
		},

		rm: function(prop){
			var tmp = this.data;
			return (this.data = prop ? (_isAry(tmp) ? 
				(tmp.splice(+prop,1),tmp) : 
				_rmProp(tmp,prop)) : null) !== null && 
				this.emit("remove:"+prop);
		},

		moc: function(key,val){
			return this.set(key, 
				moc(_prop(this.data,key),val));
		},

		// API event
		on: on,
		emit: emit,
		unbind: unbind,

		// Ax Restful API design for
		// [Ax Model] data format serialize
		toJSON: function(){
			return _isPrim(this.data) ? 
				this.data : 
				JSON.stringify(this.data);
		},

		// Fetch mean Restful "GET"
		// fetch data form url with param
		send: function(url,header){
			if(_isObj(url)){
				header = url;
				url = null;
			}

			return pipe.apply(this,[
				"send",
				url || this.url,
				this.data,
				_noop,
				_noop,
				header
			]);
		},

		fetch: function(param,byfilter,header){
			if(_isFn(param)){
				header = byfilter;
				byfilter = param;
				param = {};
			}

			return pipe.apply(this,[
				"fetch",
				this.url,
				param,
				_link(
					(_isFn(byfilter) ? byfilter : JSON.parse),
					this.set.bind(this)),
				_noop,
				header
			]);
		},

		sync: function(url,header){
			if(_isObj(url)){
				header = url;
				url = null;
			}

		  return pipe.apply(this,[
		  	"sync",
		  	url || this.url,
		  	this.data,
		  	_noop,
		  	_noop,
		  	header
			]);
		},

		toString: function(){
			return _toString(this.toJSON());
		}
	};

	function packRender(view,render){
		return _link(
			packBefore(view),
			packMain(view,render),
			packComplete(view)
		);
	}

	function packBefore(view){
		return function(){
			var args = _slice(arguments);
			return view.emit("beforeRender",args),args;
		};
	}

	function packMain(view,renderFunc){
		return function(args){
			return renderFunc.apply(view,args),args;
		};
	}

	function packComplete(view){
		return function(args){
			view.root._vid = view._vid;
			view.root.setAttribute("ax-root","");
			return view.emit("completed",args);
		};
	}

	function setRender(view,render){
		var that = packRender(view,render);
		_define(view,"render",{
			get : function(){ return that; },
			set : function(fn){
				if(_isFn(fn)) that = packRender(view,fn);
				return that;
			},
			enumerable:true,
			configurable:false
		});
		return view;
	}

	function checkElm(el){
		if(!(_isElm(el) || _isAryL(el)))
				throw new TypeError("el must be typeof DOMElement or NodeList collections -> not " + el);
		return true;
	}

	// Ax View
	// View container
	var vid = 0;
	aV = function(obj){
		var config = _extend(_clone(VIEW_DEFAULT),obj||{}),
			view = this,
			vroot = config.root,
			render = config.render,
			events = config.events,
			stencil = config.template,
			props = config.props;

		delete config.root;
		delete config.mount;
		delete config.props;
		delete config.events;
		delete config.render;
		delete config.template;

		// parse template
		// building the render function
		if(!_isFn(render)){
			stencil = _isStr(stencil) ? 
				_doom(stencil, _isObj(props) ? props : {}) : 
				(_isFn(stencil) ? stencil : _noop);

			render = function(){ 
				return stencil !== _noop && 
					z(vroot).render(
						stencil.apply(this,_slice(arguments)),
						view);
			};
		}

		// if userobj has more events
		if(vroot&&checkElm(vroot)){
			// bind events
			this.root = vroot;
			_fol(events,uon,setRender(this,render));

			if(config.model)
				if(vA.model(config.model))
					config.model.on("change",
						this.render.bind(this));

		}else{
			this.mount = function(el){
				if(checkElm(el)){
					// bind events
					this.root = vroot = el; 
					_fol(events,uon,setRender(this,render));

					if(config.model)
						if(vA.model(config.model))
							config.model.on("change",
								this.render.bind(this));

					// trigger render 
					if(1 in arguments)
						this.render.apply(this,_slice(arguments,1));

					// delete mount
					return delete this.mount, this;
				}
			};
		}

		// first trigger "init" event
		this._vid = vid++;
		_extend(this,config)
			.emit("init")
			.unbind("init");
	};

	aV.prototype = {
		constructor:aV,

		on: function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).on(param[0],param[1],{self:this},fn);
				else
					_on(this,mk,fn);
			},this),this;
		},

		unbind: function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).off(param[0],param[1],fn);
				else
					_unbind(this,mk,fn);
			},this),this;
		},

		emit: function(type,args){
			var k = (type||"").split(":");

			if(k.length>2){
				return _fal((type||"").split(","),function(mk){
					var mkf = mk.split(":");
					z(this.root).find(mkf[1]).trigger(mkf[0],args);
				},this),this;
			}

			if(k.length>1)
				return z(this.root).find(k[1]).trigger(k[0],args),this;

			return _emit(this,type,args);
		},

		toString: function(){
			return this.root;
		}
	};

	//get Hash param form URL
	function hashGet(url,char){
		var index = url.search("#"),
			charindex = url.search(char);
		return index>0 ? url.slice(index+1,!~charindex?void 0:charindex) : "";
	}

	function hashParam(url,char){
		var charindex = url.search(char);
		return _param(!~charindex ? void 0 : url.slice(charindex+1));
	}

	//if hashChange call
	function hashChange(url,char,event){
		var hash = hashGet(url,char), param = hashParam(url,char); 
		_fol(this.routes,function(fn,key){
			if((new RegExp(key,"i")).test(hash))
				hashChangeReg.call(this,fn,[param,hash,event]);
		},this);
	}

	// detect args callback
	function hashChangeReg(fn,args){
		if(_isFn(fn))
			fn.apply(this,args);
		else // array or string
			_fal(_isStr(fn) ? fn.split(",") : fn,
				function(reg){ this.actions[reg].apply(this,args); },this);
	}

	// Ax Route
	// define route for SPA
	aR = function(obj){
		var _this = this,
			history = { old: "", now: root.location.href },
			config = _extend(_clone(ROUTE_DEFAULT),obj||{}),
			events = config.events;

		delete config.history;
		delete config.events;
		// if userobj has more events
		// addEvent for this route object
		// use dispatch event to trigger
		// cant change regular hash title
		_define(this, "event" ,{
			value : function(event){
				if(root.location.href === history.now)
					return event.preventDefault();
				// change the save hash url
				history.old = history.now; 
				return _this.emit("hashchange",
					[history.now = root.location.href,config.char,event]);
			},
			writable : false,
			enumerable : false,
			configurable: false
		});

		_fol(events,uon,this);

		_extend(this,config)
			.on("hashchange",hashChange)
			.emit("init")
			.unbind("init");
	};

	// Ax-Route for SPA Architecture
	// auto trigger regex event when route change
	aR.prototype = {
		constructor: aR,

		on: on,
		emit: emit,
		unbind: unbind,

		listen: function(hash,param){
			if(!this._listen){
				_define(this,"_listen",{
					value:!root.addEventListener("hashchange",this.event),
					writable : false,
					enumerable : false,
					configurable: true,
				});
				
				return hash ? 
					this.assign(hash,param) : 
					this.emit("hashchange",[root.location.href,this.char]);
			}
			return this;
		},

		stop: function(){
			if(delete this._listen)
				root.removeEventListener("hashchange",this.event);
			return this;
		},

		assign: function(hash,param){
			if(this._listen){
				var url = root.location.href; 
				var hashindex = url.search("#");
				if(hashindex > 0)
					url = url.slice(0,hashindex);

				root.location.href = url + 
					(hash.toString().slice(0,1)==="#"?"":"#") + hash + 
					(_isObj(param) ? ((this.char||"@")+_paramStr(param)) : "");
			}
			return this;
		},

		toString: function(){
			return this;
		}
	};

	var __ = [];

	function aTite(cmd,args){
		return function(model){
			model[cmd].apply(model,args||[]); };
	}

	function assert(LIST){
		return function(tdo,_){ 
			return (_isFn(tdo)&&_===__) ? tdo(LIST) : []; };
	}
	
	function assertModel(model){
		return model.name === this;
	}

	function assertMake(list,callback){
		var LIST = this._assert(cool,__);
		var target = _isStr(list) ? [list] : (_isAry(list) ? list : []);
		return _fal(target,function(name){ 
			callback.call(this,LIST,name);
		},this),this;
	}

	function assertMatch(list,match){
		var use = [];
		switch(_type(match)){
			case "regexp":
				_fal(list,function(m){
					if(match.test(m.name))
						use.push(m.name);
				});
				break;
			case "string":
				use.push(match);
				break;
			case "array":
				use = match;
				break;
			default:
				break;
		}
		return use;
	}

	// Ax atom * stom
	// Useful models manager
	aT = function(obj,isStom){
		var config = _extend(_clone(ATOM_DEFAULT),obj||{}),
				initList = config.use,
				events = config.events,
				LIST = [];

		delete config.use;
		delete config.events;

		// create assert
		this._assert = assert(LIST);
		_extend(this.use(initList),config);

		if(!isStom){
			_fol(events,uon,this);
			this.emit("init")
				.unbind("init");
		}
	};

	var stom = function(atom,list){
		var c = ax.atom({ use:list },true);
		c.back = function(){ return atom; };
		return c;
	};
		
	aT.prototype = {
		constructor: aT,

		all: function(){ return this._assert(_slice,__); },
		// API event
		on: on,
		emit: emit,
		unbind: unbind,

		use: function(list){
			return assertMake.call(this,list,function(LIST,name,M){
				M = RAM[name];
				if(name && M && vA.model(M) && !_has(LIST,M))
					LIST.push(M);
			});
		},

		out: function(list){
			return assertMake.call(this,list,function(LIST,name){
				LIST.splice(_index(LIST,assertModel.bind(name)),1);
			});
		},

		p: function(name){
			return _one(this.all(),assertModel.bind(name));
		},

		of: function(fn,args){
			return _fal(this.all(),
				(_isFn(fn) ? fn : aTite(fn,args))),this;
		},

		select: function(match){
			return stom(this,assertMatch(this.all(),match));
		},

		toData: function(){
			return this.all().map(function(m){ return m.get(); });
		},

		toJSON: function(){
			return JSON.stringify(this.toData());
		}
	};

	// #genertor minmix [ struct ] api
	_fal(["extend","not","cat","find","filter","reject","chunk","compact","pluck","groupBy","countBy","pairs","shuffle","flat","merge","map","sort","unique","concat","pull","drop","pairs",["hook","map","hook"],["mapKey","map","key"],["uniqueFast","unique","fast"],["pullAt","pull","at"],["dropLeft","drop","left"],["dropRight","drop","right"],["dropLeftTo","drop","leftto"],["dropRightTo","drop","rightto"],["unpairs","pairs","un"]],genertor_);
	_fal(["keys","every","some","diff","intsec","first","last","auto","eq","values","size","each","has","type","index",["hasKey","has","key"],["findex","index","first"],["lindex","index","last"],["single","index","one"],["one","index","one"]],genertor_$);

	// Extend method
	// Create Ax Pack extends
	// Prepare for component
	ax.route = createAx(aR);
	ax.model = createAx(aM);
	ax.view  = createAx(aV);
	ax.atom  = createAx(aT);
	ax.route.extend = createExtend(aR);
	ax.model.extend = createExtend(aM);
	ax.view.extend  = createExtend(aV);
	ax.atom.extend  = createExtend(aT);

	// ax validate functional
	ax.va = vA = {
		fn        : makeChecker(_isFn,"function"),
		int       : makeChecker(_isInt,"int"),
		array     : makeChecker(_isAry,"array"),
		float     : makeChecker(_isFloat,"float"),
		string    : makeChecker(_isStr,"string"),
		object    : makeChecker(_isObj,"object"),
		number    : makeChecker(_isNum,"number"),
		arrayLike : makeChecker(_isAryL,"arrayLike"),
		primitive : makeChecker(_isPrim,"primitive"),
		bool      : makeChecker(_isBool,"boolean"),
		dom       : makeChecker(_isDOM,"dom"),
		element   : makeChecker(_isElm,"element"),
		node      : makeChecker(_isNode,"node"),
		model     : makeChecker(isAx(aM),"model"),
		view      : makeChecker(isAx(aV),"view"),
		atom      : makeChecker(isAx(aT),"atom"),
		route     : makeChecker(isAx(aR),"route")
	};

	return _lock(aM,aV,aR,aT,aS,vA,v8(ax));
});

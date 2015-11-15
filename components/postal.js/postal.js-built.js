/**
 * postal - Pub/Sub library providing wildcard subscriptions, complex message handling, etc.  Works server and client-side.
 * Author: Jim Cowart (http://ifandelse.com)
 * Version: v1.0.7
 * Url: http://github.com/postaljs/postal.js
 * License(s): MIT
 */
(function(e,t){"function"==typeof define&&define.amd?define(["lodash"],function(n){return t(n,e)}):"object"==typeof module&&module.exports?module.exports=t(require("lodash"),this):e.postal=t(e._,e)})(this,function(e,t,n){function i(e,t){return function(){if(console.warn||console.log){var n="Warning, the "+e+" method has been deprecated. Please use "+t+" instead.";console.warn?console.warn(n):console.log(n)}return b.prototype[t].apply(this,arguments)}}function r(){for(;E.length;)l.unsubscribe(E.shift())}function c(e,t,n){return function(i,r,c){i===e&&c.splice(r,1),0===c.length&&delete n[t]}}function s(e,t,n,i,r){var c=r&&r.headers||{};return function(r){var s;f.resolver.compare(r.topic,e,c)&&(c.resolverNoCache||(s=t[n]=t[n]||[],s.push(r)),r.cacheKeys.push(n),i&&i(r))}}function o(e,t){return{channel:f.SYSTEM_CHANNEL,topic:"subscription."+e,data:{event:"subscription."+e,channel:t.channel,topic:t.topic}}}function a(t,n){return"function"==typeof t?t:t?function(i){var r=0,c=0;return e.each(t,function(e,s){r+=1,("topic"===s&&n.compare(i.topic,t.topic,{resolverNoCache:!0})||"context"===s&&t.context===i._context||i[s]===t[s])&&(c+=1)}),r===c}:function(){return!0}}var u=t.postal,h={DEFAULT_CHANNEL:"/",SYSTEM_CHANNEL:"postal",enableSystemMessages:!0,cacheKeyDelimiter:"|",autoCompactResolver:!1},l={configuration:e.extend({},h)},f=l.configuration,p=function(e,t){this.bus=t,this.channel=e||f.DEFAULT_CHANNEL};p.prototype.subscribe=function(){return this.bus.subscribe({channel:this.channel,topic:1===arguments.length?arguments[0].topic:arguments[0],callback:1===arguments.length?arguments[0].callback:arguments[1]})},p.prototype.publish=function(){var e,t={};if("string"==typeof arguments[0]?(t.topic=arguments[0],t.data=arguments[1],e=arguments[2]):(t=arguments[0],e=arguments[1]),"object"!=typeof t)throw new Error("The first argument to ChannelDefinition.publish should be either an envelope object or a string topic.");t.channel=this.channel,this.bus.publish(t,e)};var b=function(e,t,i){if(3!==arguments.length)throw new Error("You must provide a channel, topic and callback when creating a SubscriptionDefinition instance.");if(0===t.length)throw new Error("Topics cannot be empty");this.channel=e,this.topic=t,this.callback=i,this.pipeline=[],this.cacheKeys=[],this._context=n},d=function(){var t;return function(n){var i=!1;return"string"==typeof n?(i=n===t,t=n):(i=e.isEqual(n,t),t=e.extend({},n)),!i}},v=function(){var t=[];return function(n){var i=!e.any(t,function(t){return e.isEqual(n,t)});return i&&t.push(n),i}};b.prototype={"catch":function(e){var t=this.callback,n=function(){try{t.apply(this,arguments)}catch(n){e(n,arguments[0])}};return this.callback=n,this},defer:function(){return this.delay(0)},disposeAfter:function(t){if("number"!=typeof t||0>=t)throw new Error("The value provided to disposeAfter (maxCalls) must be a number greater than zero.");var n=this,i=e.after(t,e.bind(function(){n.unsubscribe()}));return n.pipeline.push(function(e,t,n){n(e,t),i()}),n},distinct:function(){return this.constraint(new v)},distinctUntilChanged:function(){return this.constraint(new d)},invokeSubscriber:function(e,t){if(!this.inactive){var n=this,i=n.pipeline,r=i.length,c=n._context,s=-1,o=!1;if(r){i=i.concat([n.callback]);var a=function u(e,t){s+=1,r>s?i[s].call(c,e,t,u):(n.callback.call(c,e,t),o=!0)};a(e,t,0)}else n.callback.call(c,e,t),o=!0;return o}},logError:function(){if(console){var e;e=console.warn?console.warn:console.log,this["catch"](e)}return this},once:function(){return this.disposeAfter(1)},subscribe:function(e){return this.callback=e,this},unsubscribe:function(){this.inactive||l.unsubscribe(this)},constraint:function(e){if("function"!=typeof e)throw new Error("Predicate constraint must be a function");return this.pipeline.push(function(t,n,i){e.call(this,t,n)&&i(t,n)}),this},constraints:function(t){var n=this;return e.each(t,function(e){n.constraint(e)}),n},context:function(e){return this._context=e,this},debounce:function(t,n){if("number"!=typeof t)throw new Error("Milliseconds must be a number");return this.pipeline.push(e.debounce(function(e,t,n){n(e,t)},t,!!n)),this},delay:function(e){if("number"!=typeof e)throw new Error("Milliseconds must be a number");var t=this;return t.pipeline.push(function(t,n,i){setTimeout(function(){i(t,n)},e)}),this},throttle:function(t){if("number"!=typeof t)throw new Error("Milliseconds must be a number");var n=function(e,t,n){n(e,t)};return this.pipeline.push(e.throttle(n,t)),this}};for(var g=["withConstraint","withConstraints","withContext","withDebounce","withDelay","withThrottle"],m=["constraint","constraints","context","debounce","delay","throttle"],y=0;6>y;y++){var w=g[y];b.prototype[w]=i(w,m[y])}var _=(f.resolver={cache:{},regex:{},enableCache:!0,compare:function(t,n,i){var r,c,s,o=n+f.cacheKeyDelimiter+t,a=this.cache[o],u=i||{},h=this.enableCache&&!u.resolverNoCache;return a===!0?a:-1===t.indexOf("#")&&-1===t.indexOf("*")?(a=n===t,h&&(this.cache[o]=a),a):((c=this.regex[t])||(r="^"+e.map(t.split("."),function(e){var t="";return s&&(t="#"!==s?"\\.\\b":"\\b"),t+="#"===e?"[\\s\\S]*":"*"===e?"[^.]+":e,s=e,t}).join("")+"$",c=this.regex[t]=new RegExp(r)),a=c.test(n),h&&(this.cache[o]=a),a)},reset:function(){this.cache={},this.regex={}},purge:function(t){var n=this,i=f.cacheKeyDelimiter,r=function(e,r){var c=r.split(i),s=c[0],o=c[1];"undefined"!=typeof t.topic&&t.topic!==s||"undefined"!=typeof t.binding&&t.binding!==o||delete n.cache[r]},c=function(e,t){var r=t.split(i);0===l.getSubscribersFor({topic:r[0]}).length&&delete n.cache[t]};if("undefined"==typeof t)this.reset();else{var s=t.compact===!0?c:r;e.each(this.cache,s)}}},0),E=[],C=0,x=e.bind(o,this,"created"),k=e.bind(o,this,"removed");if(e.extend(l,{cache:{},subscriptions:{},wireTaps:[],ChannelDefinition:p,SubscriptionDefinition:b,channel:function(e){return new p(e,this)},addWireTap:function(e){var t=this;return t.wireTaps.push(e),function(){var n=t.wireTaps.indexOf(e);-1!==n&&t.wireTaps.splice(n,1)}},noConflict:function(){if("undefined"==typeof window||"undefined"!=typeof window&&"function"==typeof define&&define.amd)throw new Error("noConflict can only be used in browser clients which aren't using AMD modules");return t.postal=u,this},getSubscribersFor:function(t){var n=[],i=this;return e.each(i.subscriptions,function(i){e.each(i,function(i){n=n.concat(e.filter(i,a(t,f.resolver)))})}),n},publish:function(t,n){++_;var i=t.channel=t.channel||f.DEFAULT_CHANNEL,c=t.topic;t.timeStamp=new Date,this.wireTaps.length&&e.each(this.wireTaps,function(e){e(t.data,t,_)});var o=i+f.cacheKeyDelimiter+c,a=this.cache[o],u=0,h=0;if(a)e.each(a,function(e){e.invokeSubscriber(t.data,t)?h++:u++});else{var l=s(c,this.cache,o,function(e){e.invokeSubscriber(t.data,t)?h++:u++},t);e.each(this.subscriptions[i],function(t){e.each(t,l)})}0===--_&&r(),n&&n({activated:h,skipped:u})},reset:function(){this.unsubscribeFor(),f.resolver.reset(),this.subscriptions={},this.cache={}},subscribe:function(t){var n,i=this.subscriptions,r=new b(t.channel||f.DEFAULT_CHANNEL,t.topic,t.callback),c=i[r.channel],o=r.channel.length;return c||(c=i[r.channel]={}),n=i[r.channel][r.topic],n||(n=i[r.channel][r.topic]=[]),n.push(r),e.each(e.keys(this.cache),function(e){e.substr(0,o)===r.channel&&s(e.split(f.cacheKeyDelimiter)[1],this.cache,e)(r)},this),f.enableSystemMessages&&this.publish(x(r)),r},unsubscribe:function(){for(var t,n,i,r,s=arguments.length,o=0;s>o;o++){if(t=arguments[o],t.inactive=!0,_)return void E.push(t);if(n=this.subscriptions[t.channel],i=n&&n[t.topic]){var a=i.length;for(r=0;a>r;){if(i[r]===t){i.splice(r,1);break}r+=1}if(0===i.length&&(delete n[t.topic],e.keys(n).length||delete this.subscriptions[t.channel]),t.cacheKeys&&t.cacheKeys.length)for(var u;u=t.cacheKeys.pop();)e.each(this.cache[u],c(t,u,this.cache));if("function"==typeof f.resolver.purge){var h=f.autoCompactResolver===!0?0:"number"==typeof f.autoCompactResolver?f.autoCompactResolver-1:!1;h>=0&&C===h?(f.resolver.purge({compact:!0}),C=0):h>=0&&h>C&&(C+=1)}}f.enableSystemMessages&&this.publish(k(t))}},unsubscribeFor:function(e){var t=[];this.subscriptions&&(t=this.getSubscribersFor(e),this.unsubscribe.apply(this,t))}}),t&&Object.prototype.hasOwnProperty.call(t,"__postalReady__")&&e.isArray(t.__postalReady__))for(;t.__postalReady__.length;)t.__postalReady__.shift().onReady(l);return l});
/**
 * postal - Pub/Sub library providing wildcard subscriptions, complex message handling, etc.  Works server and client-side.
 * Author: Jim Cowart (http://ifandelse.com)
 * Version: v1.0.7
 * Url: http://github.com/postaljs/postal.js
 * License(s): MIT
 */

( function( root, factory ) {
	
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "lodash" ], function( _ ) {
			return factory( _, root );
		} );
	
	} else if ( typeof module === "object" && module.exports ) {
		// Node, or CommonJS-Like environments
		module.exports = factory( require( "lodash" ), this );
	} else {
		// Browser globals
		root.postal = factory( root._, root );
	}
}( this, function( _, global, undefined ) {
	var prevPostal = global.postal;
	var _defaultConfig = {
		DEFAULT_CHANNEL: "/",
		SYSTEM_CHANNEL: "postal",
		enableSystemMessages: true,
		cacheKeyDelimiter: "|",
		autoCompactResolver: false
	};
	var postal = {
		configuration: _.extend( {}, _defaultConfig )
	};
	var _config = postal.configuration;

	

var ChannelDefinition = function( channelName, bus ) {
	this.bus = bus;
	this.channel = channelName || _config.DEFAULT_CHANNEL;
};

ChannelDefinition.prototype.subscribe = function() {
	return this.bus.subscribe( {
		channel: this.channel,
		topic: ( arguments.length === 1 ? arguments[ 0 ].topic : arguments[ 0 ] ),
		callback: ( arguments.length === 1 ? arguments[ 0 ].callback : arguments[ 1 ] )
	} );
};

/*
    publish( envelope [, callback ] );
    publish( topic, data [, callback ] );
*/
ChannelDefinition.prototype.publish = function() {
	var envelope = {};
	var callback;
	if ( typeof arguments[ 0 ] === "string" ) {
		envelope.topic = arguments[ 0 ];
		envelope.data = arguments[ 1 ];
		callback = arguments[ 2 ];
	} else {
		envelope = arguments[ 0 ];
		callback = arguments[ 1 ];
	}
	if ( typeof envelope !== "object" ) {
		throw new Error( "The first argument to ChannelDefinition.publish should be either an envelope object or a string topic." );
	}
	envelope.channel = this.channel;
	this.bus.publish( envelope, callback );
};

	
var SubscriptionDefinition = function( channel, topic, callback ) {
	if ( arguments.length !== 3 ) {
		throw new Error( "You must provide a channel, topic and callback when creating a SubscriptionDefinition instance." );
	}
	if ( topic.length === 0 ) {
		throw new Error( "Topics cannot be empty" );
	}
	this.channel = channel;
	this.topic = topic;
	this.callback = callback;
	this.pipeline = [];
	this.cacheKeys = [];
	this._context = undefined;
};

var ConsecutiveDistinctPredicate = function() {
	var previous;
	return function( data ) {
		var eq = false;
		if ( typeof data === "string" ) {
			eq = data === previous;
			previous = data;
		} else {
			eq = _.isEqual( data, previous );
			previous = _.extend( {}, data );
		}
		return !eq;
	};
};

var DistinctPredicate = function DistinctPredicateFactory() {
	var previous = [];
	return function DistinctPredicate( data ) {
		var isDistinct = !_.any( previous, function( p ) {
			return _.isEqual( data, p );
		} );
		if ( isDistinct ) {
			previous.push( data );
		}
		return isDistinct;
	};
};

SubscriptionDefinition.prototype = {

	"catch": function( errorHandler ) {
		var original = this.callback;
		var safeCallback = function() {
			try {
				original.apply( this, arguments );
			} catch ( err ) {
				errorHandler( err, arguments[ 0 ] );
			}
		};
		this.callback = safeCallback;
		return this;
	},

	defer: function defer() {
		return this.delay( 0 );
	},

	disposeAfter: function disposeAfter( maxCalls ) {
		if ( typeof maxCalls !== "number" || maxCalls <= 0 ) {
			throw new Error( "The value provided to disposeAfter (maxCalls) must be a number greater than zero." );
		}
		var self = this;
		var dispose = _.after( maxCalls, _.bind( function() {
			self.unsubscribe();
		} ) );
		self.pipeline.push( function( data, env, next ) {
			next( data, env );
			dispose();
		} );
		return self;
	},

	distinct: function distinct() {
		return this.constraint( new DistinctPredicate() );
	},

	distinctUntilChanged: function distinctUntilChanged() {
		return this.constraint( new ConsecutiveDistinctPredicate() );
	},

	invokeSubscriber: function invokeSubscriber( data, env ) {
		if ( !this.inactive ) {
			var self = this;
			var pipeline = self.pipeline;
			var len = pipeline.length;
			var context = self._context;
			var idx = -1;
			var invoked = false;
			if ( !len ) {
				self.callback.call( context, data, env );
				invoked = true;
			} else {
				pipeline = pipeline.concat( [ self.callback ] );
				var step = function step( d, e ) {
					idx += 1;
					if ( idx < len ) {
						pipeline[ idx ].call( context, d, e, step );
					} else {
						self.callback.call( context, d, e );
						invoked = true;
					}
				};
				step( data, env, 0 );
			}
			return invoked;
		}
	},

	logError: function logError() {
		
		if ( console ) {
			var report;
			if ( console.warn ) {
				report = console.warn;
			} else {
				report = console.log;
			}
			this.catch( report );
		}
		return this;
	},

	once: function once() {
		return this.disposeAfter( 1 );
	},

	subscribe: function subscribe( callback ) {
		this.callback = callback;
		return this;
	},

	unsubscribe: function unsubscribe() {
		
		if ( !this.inactive ) {
			postal.unsubscribe( this );
		}
	},

	constraint: function constraint( predicate ) {
		if ( typeof predicate !== "function" ) {
			throw new Error( "Predicate constraint must be a function" );
		}
		this.pipeline.push( function( data, env, next ) {
			if ( predicate.call( this, data, env ) ) {
				next( data, env );
			}
		} );
		return this;
	},

	constraints: function constraints( predicates ) {
		var self = this;
		
		_.each( predicates, function( predicate ) {
			self.constraint( predicate );
		} );
		return self;
	},

	context: function contextSetter( context ) {
		this._context = context;
		return this;
	},

	debounce: function debounce( milliseconds, immediate ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}
		this.pipeline.push(
			_.debounce( function( data, env, next ) {
				next( data, env );
			},
				milliseconds,
				!!immediate
			)
		);
		return this;
	},

	delay: function delay( milliseconds ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}
		var self = this;
		self.pipeline.push( function( data, env, next ) {
			setTimeout( function() {
				next( data, env );
			}, milliseconds );
		} );
		return this;
	},

	throttle: function throttle( milliseconds ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}
		var fn = function( data, env, next ) {
			next( data, env );
		};
		this.pipeline.push( _.throttle( fn, milliseconds ) );
		return this;
	}
};

// Backwards Compatibility
// WARNING: these will be removed by version 0.13

function warnOnDeprecation( oldMethod, newMethod ) {
	return function() {
		if ( console.warn || console.log ) {
			var msg = "Warning, the " + oldMethod + " method has been deprecated. Please use " + newMethod + " instead.";
			if ( console.warn ) {
				console.warn( msg );
			} else {
				console.log( msg );
			}
		}
		return SubscriptionDefinition.prototype[ newMethod ].apply( this, arguments );
	};
}
var oldMethods = [ "withConstraint", "withConstraints", "withContext", "withDebounce", "withDelay", "withThrottle" ];
var newMethods = [ "constraint", "constraints", "context", "debounce", "delay", "throttle" ];
for ( var i = 0; i < 6; i++ ) {
	var oldMethod = oldMethods[ i ];
	SubscriptionDefinition.prototype[ oldMethod ] = warnOnDeprecation( oldMethod, newMethods[ i ] );
}

	


var bindingsResolver = _config.resolver = {
	cache: {},
	regex: {},
	enableCache: true,

	compare: function compare( binding, topic, headerOptions ) {
		var pattern;
		var rgx;
		var prevSegment;
		var cacheKey = topic + _config.cacheKeyDelimiter + binding;
		var result = ( this.cache[ cacheKey ] );
		var opt = headerOptions || {};
		var saveToCache = this.enableCache && !opt.resolverNoCache;
		// result is cached?
		if ( result === true ) {
			return result;
		}
		// plain string matching?
		if ( binding.indexOf( "#" ) === -1 && binding.indexOf( "*" ) === -1 ) {
			result = ( topic === binding );
			if ( saveToCache ) {
				this.cache[ cacheKey ] = result;
			}
			return result;
		}
		// ah, regex matching, then
		if ( !( rgx = this.regex[ binding ] ) ) {
			pattern = "^" + _.map( binding.split( "." ), function mapTopicBinding( segment ) {
					var res = "";
					if ( !!prevSegment ) {
						res = prevSegment !== "#" ? "\\.\\b" : "\\b";
					}
					if ( segment === "#" ) {
						res += "[\\s\\S]*";
					} else if ( segment === "*" ) {
						res += "[^.]+";
					} else {
						res += segment;
					}
					prevSegment = segment;
					return res;
				} ).join( "" ) + "$";
			rgx = this.regex[ binding ] = new RegExp( pattern );
		}
		result = rgx.test( topic );
		if ( saveToCache ) {
			this.cache[ cacheKey ] = result;
		}
		return result;
	},

	reset: function reset() {
		this.cache = {};
		this.regex = {};
	},

	purge: function( options ) {
		var self = this;
		var keyDelimiter = _config.cacheKeyDelimiter;
		var matchPredicate = function( val, key ) {
			var split = key.split( keyDelimiter );
			var topic = split[ 0 ];
			var binding = split[ 1 ];
			if ( ( typeof options.topic === "undefined" || options.topic === topic ) &&
					( typeof options.binding === "undefined" || options.binding === binding ) ) {
				delete self.cache[ key ];
			}
		};

		var compactPredicate = function( val, key ) {
			var split = key.split( keyDelimiter );
			if ( postal.getSubscribersFor( { topic: split[ 0 ] } ).length === 0 ) {
				delete self.cache[ key ];
			}
		};

		if ( typeof options === "undefined" ) {
			this.reset();
		} else {
			var handler = options.compact === true ? compactPredicate : matchPredicate;
			_.each( this.cache, handler );
		}
	}
};

	


var pubInProgress = 0;
var unSubQueue = [];
var autoCompactIndex = 0;

function clearUnSubQueue() {
	while ( unSubQueue.length ) {
		postal.unsubscribe( unSubQueue.shift() );
	}
}

function getCachePurger( subDef, key, cache ) {
	return function( sub, i, list ) {
		if ( sub === subDef ) {
			list.splice( i, 1 );
		}
		if ( list.length === 0 ) {
			delete cache[ key ];
		}
	};
}

function getCacher( topic, pubCache, cacheKey, done, envelope ) {
	var headers = envelope && envelope.headers || {};
	return function( subDef ) {
		var cache;
		if ( _config.resolver.compare( subDef.topic, topic, headers ) ) {
			if ( !headers.resolverNoCache ) {
				cache = pubCache[ cacheKey ] = ( pubCache[ cacheKey ] || [] );
				cache.push( subDef );
			}
			subDef.cacheKeys.push( cacheKey );
			if ( done ) {
				done( subDef );
			}
		}
	};
}

function getSystemMessage( kind, subDef ) {
	return {
		channel: _config.SYSTEM_CHANNEL,
		topic: "subscription." + kind,
		data: {
			event: "subscription." + kind,
			channel: subDef.channel,
			topic: subDef.topic
		}
	};
}

var sysCreatedMessage = _.bind( getSystemMessage, this, "created" );
var sysRemovedMessage = _.bind( getSystemMessage, this, "removed" );

function getPredicate( options, resolver ) {
	if ( typeof options === "function" ) {
		return options;
	} else if ( !options ) {
		return function() {
			return true;
		};
	} else {
		return function( sub ) {
			var compared = 0;
			var matched = 0;
			_.each( options, function( val, prop ) {
				compared += 1;
				if (
				// We use the bindings resolver to compare the options.topic to subDef.topic
				( prop === "topic" && resolver.compare( sub.topic, options.topic, { resolverNoCache: true } ) ) ||
						( prop === "context" && options.context === sub._context ) ||
						// Any other potential prop/value matching outside topic & context...
						( sub[ prop ] === options[ prop ] ) ) {
					matched += 1;
				}
			} );
			return compared === matched;
		};
	}
}

_.extend( postal, {
	cache: {},
	subscriptions: {},
	wireTaps: [],

	ChannelDefinition: ChannelDefinition,
	SubscriptionDefinition: SubscriptionDefinition,

	channel: function channel( channelName ) {
		return new ChannelDefinition( channelName, this );
	},

	addWireTap: function addWireTap( callback ) {
		var self = this;
		self.wireTaps.push( callback );
		return function() {
			var idx = self.wireTaps.indexOf( callback );
			if ( idx !== -1 ) {
				self.wireTaps.splice( idx, 1 );
			}
		};
	},

	noConflict: function noConflict() {
		
		if ( typeof window === "undefined" || ( typeof window !== "undefined" && typeof define === "function" && define.amd ) ) {
			throw new Error( "noConflict can only be used in browser clients which aren't using AMD modules" );
		}
		global.postal = prevPostal;
		return this;
	},

	getSubscribersFor: function getSubscribersFor( options ) {
		var result = [];
		var self = this;
		_.each( self.subscriptions, function( channel ) {
			_.each( channel, function( subList ) {
				result = result.concat( _.filter( subList, getPredicate( options, _config.resolver ) ) );
			} );
		} );
		return result;
	},

	publish: function publish( envelope, cb ) {
		++pubInProgress;
		var channel = envelope.channel = envelope.channel || _config.DEFAULT_CHANNEL;
		var topic = envelope.topic;
		envelope.timeStamp = new Date();
		if ( this.wireTaps.length ) {
			_.each( this.wireTaps, function( tap ) {
				tap( envelope.data, envelope, pubInProgress );
			} );
		}
		var cacheKey = channel + _config.cacheKeyDelimiter + topic;
		var cache = this.cache[ cacheKey ];
		var skipped = 0;
		var activated = 0;
		if ( !cache ) {
			var cacherFn = getCacher(
				topic,
				this.cache,
				cacheKey,
				function( candidate ) {
					if ( candidate.invokeSubscriber( envelope.data, envelope ) ) {
						activated++;
					} else {
						skipped++;
					}
				},
				envelope
			);
			_.each( this.subscriptions[ channel ], function( candidates ) {
				_.each( candidates, cacherFn );
			} );
		} else {
			_.each( cache, function( subDef ) {
				if ( subDef.invokeSubscriber( envelope.data, envelope ) ) {
					activated++;
				} else {
					skipped++;
				}
			} );
		}
		if ( --pubInProgress === 0 ) {
			clearUnSubQueue();
		}
		if ( cb ) {
			cb( {
				activated: activated,
				skipped: skipped
			} );
		}
	},

	reset: function reset() {
		this.unsubscribeFor();
		_config.resolver.reset();
		this.subscriptions = {};
		this.cache = {};
	},

	subscribe: function subscribe( options ) {
		var subscriptions = this.subscriptions;
		var subDef = new SubscriptionDefinition( options.channel || _config.DEFAULT_CHANNEL, options.topic, options.callback );
		var channel = subscriptions[ subDef.channel ];
		var channelLen = subDef.channel.length;
		var subs;
		if ( !channel ) {
			channel = subscriptions[ subDef.channel ] = {};
		}
		subs = subscriptions[ subDef.channel ][ subDef.topic ];
		if ( !subs ) {
			subs = subscriptions[ subDef.channel ][ subDef.topic ] = [];
		}
		// First, add the SubscriptionDefinition to the channel list
		subs.push( subDef );
		// Next, add the SubscriptionDefinition to any relevant existing cache(s)
		_.each( _.keys( this.cache ), function( cacheKey ) {
			if ( cacheKey.substr( 0, channelLen ) === subDef.channel ) {
				getCacher(
					cacheKey.split( _config.cacheKeyDelimiter )[1],
					this.cache,
					cacheKey )( subDef );
			}
		}, this );
		
		if ( _config.enableSystemMessages ) {
			this.publish( sysCreatedMessage( subDef ) );
		}
		return subDef;
	},

	unsubscribe: function unsubscribe() {
		var unSubLen = arguments.length;
		var unSubIdx = 0;
		var subDef;
		var channelSubs;
		var topicSubs;
		var idx;
		for ( ; unSubIdx < unSubLen; unSubIdx++ ) {
			subDef = arguments[ unSubIdx ];
			subDef.inactive = true;
			if ( pubInProgress ) {
				unSubQueue.push( subDef );
				return;
			}
			channelSubs = this.subscriptions[ subDef.channel ];
			topicSubs = channelSubs && channelSubs[ subDef.topic ];
			
			if ( topicSubs ) {
				var len = topicSubs.length;
				idx = 0;
				// remove SubscriptionDefinition from channel list
				while ( idx < len ) {
					
					if ( topicSubs[ idx ] === subDef ) {
						topicSubs.splice( idx, 1 );
						break;
					}
					idx += 1;
				}
				if ( topicSubs.length === 0 ) {
					delete channelSubs[ subDef.topic ];
					if ( !_.keys( channelSubs ).length ) {
						delete this.subscriptions[ subDef.channel ];
					}
				}
				// remove SubscriptionDefinition from postal cache
				if ( subDef.cacheKeys && subDef.cacheKeys.length ) {
					var key;
					while ( key = subDef.cacheKeys.pop() ) {
						_.each( this.cache[ key ], getCachePurger( subDef, key, this.cache ) );
					}
				}
				if ( typeof _config.resolver.purge === "function" ) {
					// check to see if relevant resolver cache entries can be purged
					var autoCompact = _config.autoCompactResolver === true ?
						0 : typeof _config.autoCompactResolver === "number" ?
							( _config.autoCompactResolver - 1 ) : false;
					if ( autoCompact >= 0 && autoCompactIndex === autoCompact ) {
						_config.resolver.purge( { compact: true } );
						autoCompactIndex = 0;
					} else if ( autoCompact >= 0 && autoCompactIndex < autoCompact ) {
						autoCompactIndex += 1;
					}
				}
			}
			if ( _config.enableSystemMessages ) {
				this.publish( sysRemovedMessage( subDef ) );
			}
		}
	},

	unsubscribeFor: function unsubscribeFor( options ) {
		var toDispose = [];
		
		if ( this.subscriptions ) {
			toDispose = this.getSubscribersFor( options );
			this.unsubscribe.apply( this, toDispose );
		}
	}
} );


	
	if ( global && Object.prototype.hasOwnProperty.call( global, "__postalReady__" ) && _.isArray( global.__postalReady__ ) ) {
		while ( global.__postalReady__.length ) {
			global.__postalReady__.shift().onReady( postal );
		}
	}
	

	return postal;
} ) );

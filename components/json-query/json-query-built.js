module.exports = State

function State(options, params, handleQuery){

  options = options || {}

  //this.options = options
  this.handleQuery = handleQuery
  this.options = options
  this.locals = this.options.locals || {}
  this.globals = this.options.globals || {}
  this.rootContext = firstNonNull(options.data, options.rootContext, options.context, options.source)
  this.parent = options.parent
  this.override = options.override
  this.filters = options.filters || {}
  this.params = params || options.params || []
  this.context = firstNonNull(options.currentItem, options.context, options.source)
  this.currentItem = firstNonNull(this.context, options.rootContext)
  this.currentKey = null
  this.currentReferences = []
  this.currentParents = []
}

State.prototype = {
  
  // current manipulation
  setCurrent: function(key, value){
    if (this.currentItem || this.currentKey || this.currentParents.length>0){
      this.currentParents.push({key: this.currentKey, value: this.currentItem})
    }
    this.currentItem = value
    this.currentKey = key
  },

  resetCurrent: function(){
    this.currentItem = null
    this.currentKey = null
    this.currentParents = []
  },
  
  force: function(def){
    var parent = this.currentParents[this.currentParents.length-1]
    if (!this.currentItem && parent && (this.currentKey != null)){
      this.currentItem = def || {}
      parent.value[this.currentKey] = this.currentItem
    }
    return !!this.currentItem
  },

  getLocal: function(localName){
    if (~localName.indexOf('/')){
      var result = null
      var parts = localName.split('/')

      for (var i=0;i<parts.length;i++){
        var part = parts[i]
        if (i == 0){
          result = this.locals[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.locals[localName]
    }
  },

  getGlobal: function(globalName){
    if (~globalName.indexOf('/')){
      var result = null
      var parts = globalName.split('/')

      for (var i=0;i<parts.length;i++){
        var part = parts[i]
        if (i == 0){
          result = this.globals[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.globals[globalName]
    }
  },
  
  getFilter: function(filterName){
    if (~filterName.indexOf('/')){
      var result = null
      var filterParts = filterName.split('/')

      for (var i=0;i<filterParts.length;i++){
        var part = filterParts[i]
        if (i == 0){
          result = this.filters[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.filters[filterName]
    }
  },

  addReferences: function(references){
    if (references){
      references.forEach(this.addReference, this)
    }
  },
  
  addReference: function(ref){
    if (ref instanceof Object && !~this.currentReferences.indexOf(ref)){
      this.currentReferences.push(ref)
    }
  },

  // helper functions
  getValues: function(values, callback){
    return values.map(this.getValue, this)
  },

  getValue: function(value){
    if (value._param != null){
      return this.params[value._param]
    } else if (value._sub){
      
      var options = copy(this.options)
      options.force = null
      options.currentItem = null

      var result = this.handleQuery(value._sub, options, this.params)
      this.addReferences(result.references)
      return result.value

    } else {
      return value
    }
  },

  deepQuery: function(source, tokens, options, callback){
    var keys = Object.keys(source)

    for (var key in source){
      if (key in source){

        var options = copy(this.options)
        options.currentItem = source[key]

        var result = this.handleQuery(tokens, options, this.params)

        if (result.value){
          return result
        }
      }
    }

    return null
  }

}

function firstNonNull(args){
  for (var i=0;i<arguments.length;i++){
    if (arguments[i] != null){
      return arguments[i]
    }
  }
}

function copy(obj){
  var result = {}
  if (obj){
    for (var key in obj){
      if (key in obj){
        result[key] = obj[key]
      }
    }
  }
  return result
}
// todo: syntax checking
// todo: test handle args

module.exports = function(query, shouldAssignParamIds){
  if (!query) return []
    
  var result = []
    , prevChar, char
    , nextChar = query.charAt(0)
    , bStart = 0
    , bEnd = 0
    , partOffset = 0
    , pos = 0
    , depth = 0
    , mode = 'get'
    , deepQuery = null
    
  // if query contains params then number them
  if (shouldAssignParamIds){
    query = assignParamIds(query)
  }

  var tokens = {
    '.': {mode: 'get'},
    ':': {mode: 'filter'},
    '|': {handle: 'or'},
    '[': {open: 'select'},
    ']': {close: 'select'},
    '{': {open: 'meta'},
    '}': {close: 'meta'},
    '(': {open: 'args'},
    ')': {close: 'args'}
  }
  
  function push(item){
    if (deepQuery){
      deepQuery.push(item)
    } else {
      result.push(item)
    }
  }
  
  var handlers = {
    get: function(buffer){
      var trimmed = typeof buffer === 'string' ? buffer.trim() : null
      if (trimmed){
        push({get:trimmed})
      }
    },
    select: function(buffer){
      if (buffer){
        push(tokenizeSelect(buffer))
      } else {
        // deep query override
        var x = {deep: []}
        result.push(x)
        deepQuery = x.deep
      }
    },
    filter: function(buffer){
      if (buffer){
        push({filter:buffer.trim()})
      }
    }, 
    or: function(){
      deepQuery = null
      result.push({or:true})
      partOffset = i + 1
    },
    args: function(buffer){
      var args = tokenizeArgs(buffer)
      result[result.length-1].args = args
    }
  }
  
  function handleBuffer(){
    var buffer = query.slice(bStart, bEnd)
    if (handlers[mode]){
      handlers[mode](buffer)
    }
    mode = 'get'
    bStart = bEnd + 1
  }
  
  for (var i = 0;i < query.length;i++){
    
    
    // update char values
    prevChar = char; char = nextChar; nextChar = query.charAt(i + 1);
    pos = i - partOffset
    
    // root query check
    if (pos === 0 && (char !== ':' && char !== '.')){
      result.push({root:true})
    }
    
    // parent query check
    if (pos === 0 && (char === '.' && nextChar === '.')){
      result.push({parent:true})
    }
    
    var token = tokens[char]
    if (token){
            
      // set mode
      if (depth === 0 && (token.mode || token.open)){
        handleBuffer()
        mode = token.mode || token.open
      }
      
      if (depth === 0 && token.handle){
        handleBuffer()
        handlers[token.handle]()
      }
            
      if (token.open){
        depth += 1
      } else if (token.close){
        depth -= 1
      } 
      
      // reset mode to get
      if (depth === 0 && token.close){
        handleBuffer()
      } 
      
    }
    
    bEnd = i + 1

  }
  
  handleBuffer()
  
  return result
}

function tokenizeArgs(argsQuery){
  return depthSplit(argsQuery, ',').map(function(s){
    return handleSelectPart(s.trim())
  })
}

function tokenizeSelect(selectQuery){
  
  var parts = depthSplit(selectQuery, '=', 2)
  
  if (parts.length === 1){
    return { get: handleSelectPart(parts[0]) }
  } else {
    return { select: [handleSelectPart(parts[0]), handleSelectPart(parts[1])] }
  }

}

function handleSelectPart(part){
  if (part.charAt(0) === '{' && part.charAt(part.length-1) === '}'){
    var innerQuery = part.slice(1, -1)
    return {_sub: module.exports(innerQuery)}
  } else {
    return paramToken(part)
  }
}

function paramToken(text){
  if (text.charAt(0) === '?'){
    var num = parseInt(text.slice(1))
    if (!isNaN(num)){
      return {_param: num}
    } else {
      return text
    }
  } else {
    return text
  }
}

function depthSplit(text, delimiter, max){
  var openers = ['[', '(', '{']
    , closers = [']', ')', '}']
    , depth = 0
    
  if (!text){
    return []
  }
  
  if (max === 1 || text.length === 1){
    return [text]
  }
  var remainder = text
  var result = []
  var lastSlice = 0
  
  for (var i=0;i<text.length;i++){
    var char = text.charAt(i)
    
    if (depth === 0 && char === delimiter){

      result.push(text.slice(lastSlice, i))
      remainder = text.slice(i+1)
      lastSlice = i+1
      
      if (max && result.length >= max-1){
        break;
      }
      
    } else if (~openers.indexOf(char)){
      depth += 1
    } else if (~closers.indexOf(char)){
      depth -= 1
    }
    
  }
  
  result.push(remainder)
  
  return result
}

function assignParamIds(query){
  var index = 0
  return query.replace(/\?/g, function(match){
    return match + (index++)
  })
}

module.exports = forceParent

function forceParent(query, value){
  var last = query.parents[query.parents.length - 1]
  var parentLast = query.parents[query.parents.length - 2]
  if (last){
    if (last.value){
      return last.value
    } else if (parentLast){
      parentLast.value[last.key] = value
      return value
    }
  }
}
var State = require('./lib/state')
var tokenize = require('./lib/tokenize')

var tokenizedCache = {}

module.exports = function jsonQuery(query, options){

  // extract params for ['test[param=?]', 'value'] type queries
  var params = options && options.params || null
  if (Array.isArray(query)){
    params = query.slice(1)
    query = query[0]
  }

  if (!tokenizedCache[query]){
    tokenizedCache[query] = tokenize(query, true)
  }

  return handleQuery(tokenizedCache[query], options, params)
}


module.exports.lastParent = function(query){
  var last = query.parents[query.parents.length - 1]
  if (last){
    return last.value
  } else {
    return null
  }
}


function handleQuery (tokens, options, params){

  var state = new State(options, params, handleQuery)

  for (var i=0;i<tokens.length;i++) {
    if (handleToken(tokens[i], state)){
      break
    }
  }

  // flush
  handleToken(null, state)

  // set databind hooks
  if (state.currentItem instanceof Object){
    state.addReference(state.currentItem)
  } else {
    var parentObject = getLastParentObject(state.currentParents)
    if (parentObject){
      state.addReference(parentObject)
    }
  }

  return {
    value: state.currentItem,
    key: state.currentKey,
    references: state.currentReferences,
    parents: state.currentParents
  } 
}

function handleToken(token, state){
  // state: setCurrent, getValue, getValues, resetCurrent, deepQuery, rootContext, currentItem, currentKey, options, filters
  
  if (token == null){
    // process end of query
    
    if (!state.currentItem && state.options.force){
      state.force(state.options.force)
    }
    
  } else if (token.get){
    
    var key = state.getValue(token.get)
    if (state.override && state.currentItem === state.rootContext && state.override[key] !== undefined){
      state.setCurrent(key, state.override[key])
    } else {
      if (state.currentItem || (state.options.force && state.force({}))){
        state.setCurrent(key, state.currentItem[key])
      } else {
        state.setCurrent(key, null)
      }
    }
    
  } else if (token.select){
    
    if (Array.isArray(state.currentItem) || (state.options.force && state.force([]))){
      var values = state.getValues(token.select)
      var result = selectWithKey(state.currentItem, values[0], values[1])
      state.setCurrent(result[0], result[1])
    } else {
      state.setCurrent(null, null)
    }
    
  } else if (token.root){

    state.resetCurrent()
    if (token.args && token.args.length){
      state.setCurrent(null, state.getValue(token.args[0]))
    } else {
      state.setCurrent(null, state.rootContext)
    }
    
  } else if (token.parent){
    
    state.resetCurrent()
    state.setCurrent(null, state.options.parent)
    
  } else if (token.or){

    if (state.currentItem){
      return true
    } else {
      state.resetCurrent()
      state.setCurrent(null, state.context)
    }

  } else if (token.filter){
    var helper = state.getLocal(token.filter) || state.getGlobal(token.filter)
    if (typeof helper === 'function'){
      // function(input, args...)
      var values = state.getValues(token.args || [])
      var result = helper.apply(state.options, [state.currentItem].concat(values))
      state.setCurrent(null, result)
    } else {
      // fallback to old filters
      var filter = state.getFilter(token.filter)
      if (typeof filter === 'function'){
        var values = state.getValues(token.args || [])
        var result = filter.call(state.options, state.currentItem, {args: values, state: state, data: state.rootContext})
        state.setCurrent(null, result)
      }
    }
  } else if (token.deep){
    if (state.currentItem){
      var result = state.deepQuery(state.currentItem, token.deep, state.options)

      if (result){
        state.setCurrent(result.key, result.value)
        for (var i=0;i<result.parents.length;i++){
          state.currentParents.push(result.parents[i])
        }
      } else {
        state.setCurrent(null, null)
      }      

    } else {
      state.currentItem = null
    }
  }
}

function selectWithKey(source, key, value){
  if (source && source.length){
    for (var i=0;i<source.length;i++){
      if (source[i][key] == value){
        return [i, source[i]]
      }
    }
  }
  return [null, null]
}


function getLastParentObject(parents){
  for (var i=0;i<parents.length;i++){
    if (!(parents[i+1]) || !(parents[i+1].value instanceof Object)){
      return parents[i].value
    }
  }
}

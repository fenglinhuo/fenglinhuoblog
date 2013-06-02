var queryStore = require('./queryStore');
var typeFactory = $Model('types').Factory;

function TypeStore(type,params){
    var object = typeFactory(type);
   if(typeof object.err != 'undefined') {
       console.log("TypeStore error object not defined [TypeStore]");
       return null;
   }
   return new object(params);
}

function TypeRestore(type,filter,callback) {
    var store = new queryStore(type);
    if(typeof filter == 'function') {
        callback = filter;
        filter={};
    }
    return store.restore(filter,callback);
}

exports.TypeStore = TypeStore;
exports.TypeRestore = TypeRestore;


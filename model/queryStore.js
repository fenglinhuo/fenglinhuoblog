var g_functions = require("./functions");
var typeFactory = require("./types").Factory;
var ObjectId = require('mongodb').ObjectID;

function queryStore(type){
    this.type = typeFactory(type);
    console.log(this.type);
    if(typeof type.err != "undefined") {
        console.log(type.err);
    }
}

queryStore.prototype.query = function(filters,options,callback) {
    //this.db_type.find(this.db_name,filter,callback);
    if(typeof filters['_id'] != 'undefined' && typeof filters['_id'] != 'object') {
        filters['_id'] = new ObjectId(filters['_id']);
    }
    if(typeof options == "function") {
        callback = options;
        options={};
        return this.type.query(filters,options,callback);

    }
    if(arguments.length == 1) {
        callback=filters;
        options={};
        filters={};
    }

    this.type.query(filters,options,callback);
}

queryStore.prototype.restore = function(filter,callback) {
    return this.type.restore(filter,callback);
}

queryStore.prototype.count = function(filters,options,callback) {
    this.type.count.apply(this.type,arguments);
}

exports = module.exports = queryStore;


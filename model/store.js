var g_functions = require("./functions");
var db_type =g_functions.GetDB(DB_MONGO);
var ObjectId = require('mongodb').ObjectID;


function Store(Type){
    this.dataType = Type;
}


Store.prototype.dbModify = function(table_name,filter,data,options,callback) {
    if(typeof options == "function") {
        callback = options;
        options = {};
    }
    if(typeof filter["_id"] != "undefined" && typeof filter['_id'] != 'object') {
        filter['_id'] = new ObjectId(filter['_id']);
    }

    db_type.update(table_name,filter,data,options,callback);
}

Store.prototype.update = function(table_name,filter,data,options,callback) {
    this.dbModify(table_name,filter,data,options,callback);
}
Store.prototype.del = function(table_name,filter,options,callback) {
    if(typeof filter["_id"] != "undefined" && typeof filter['_id'] != 'object') {
        filter['_id'] = new ObjectId(filter['_id']);
    }
    db_type.remove(table_name,filter,options,callback);
}

Store.prototype.create = function(table_name,data,callback){
    db_type.insert(table_name,data,callback);

}

Store.prototype.addSkip = function(table_name,filter,key,callback){

    if(arguments.length == 3) {
        db_type.inc(table_name,filter,key);
    } else {
        db_type.inc(table_name,filter,key,callback);
    }
}

Store.prototype.addTable = function(table_name,options,callback) {
    var argu = [].slice.call(arguments,0);
    db_type.createCollect.apply(db_type,argu);
}

Store.prototype.count = function(table_name,filter,option,callback) {
    if(typeof option == "function") {
        callback = option;
        option= {};
    }
    if(typeof filter["_id"] != "undefined" && typeof filter['_id'] != 'object') {
    console.log(filter);
        filter['_id'] = new ObjectId(filter['_id']);
    }
    db_type.count(table_name,filter,option,callback);
}

exports = module.exports = Store;





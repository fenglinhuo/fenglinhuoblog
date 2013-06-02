var g_functions = require("./functions");

function Collection(name){
    this.init(name);
}

Collection.prototype.init = function(name){

    var db_type =g_functions.GetDB(DB_MONGO);

    this.db = db_type;
    this.tabName=name;
}


/*data:{filter:{},data:{},options:{}} */
Collection.prototype.add=function(data,callback){
    this.db.insert(this.tabName,data,callback);
}

Collection.prototype.del=function(filter,callback){
    this.db.remove(this.tabName,filter,callback);
}
/*
 * data {data:{},filter:{},options:{}}
 * */
Collection.prototype.modify = function(search,dst,callback){
    var sqlData = {data:dst,filter:search};
    this.db.update(this.tabName,sqlData,callback);
}
/*date {filter:{},opotions:{} */
Collection.prototype.find = function(data,callback){
    var newopt={};
    if(typeof data.options == "object") {
        typeof data.options.start != "undefined" ? newopt.skip = data.options.start : null;
        typeof data.options.limit != "undefined" ? newopt.limit = data.options.limit : null;
        typeof data.options.sort  != "undefined" ? newopt.sort = data.options.sort : null;
        /*
        newopt.limit = data.options.num;
        newopt.sort = data.options.sort;*/
    }
    var sqlData = {filter:data.filter,options:newopt};

    this.db.find(this.tabName,sqlData,callback);
}
/* data:{key:value}
 *
 * */
Collection.prototype.count = function(data,callback){
    var newOpt = {};
    if(arguments != 0) {
        newOpt.filter=data;
    }
    this.db.count(this.tabName,newOpt,callback);
}

/*date {filter:{},opotions:{} */

Collection.prototype.inc = function(_filter,key,callback) {
    var sql={filter:_filter};
    if(arguments.length == 2) {
        this.db.inc(this.tabName,sql,key);
    }else {
        this.db.inc(this.tabName,sql,key,callback);
    }
}

Collection.prototype.toJson = function(){
}

exports = module.exports = Collection;


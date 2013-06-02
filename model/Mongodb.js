/*var mon_env = process.env.VCAP_SERVICES;
var mongo = JSON.parse(mon_env);
var host = mongo['mongodb-1.8'][0]['credentials']['host'];
var port = mongo['mongodb-1.8'][0]['credentials']['port'];
var user= mongo['mongodb-1.8'][0]['credentials']['username'];
var passwd = mongo['mongodb-1.8'][0]['credentials']['password'];
var dbName = mongo['mongodb-1.8'][0]['credentials']['db'];
*/

var Pools = require("./pools");
var DB = require('mongodb').Db,Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

// var db  = new Db(dbName,new Server(host,port));

var db = new DB("test_db", new Server("127.0.0.1", 27017,{poolSize: 4,auto_reconnect:true}),{w:1, native_parser: false});

//var db = new DB(dbName, new Server(host,port,{poolSize: 4,auto_reconnect:true}),{w:1, native_parser: false});

function Mongodb(){
    this._pools = new Pools();
    var self = this;
    this.switchExec(1);
    db.open(function(err,db){
            if(err!= null || db == null) {
                console.log("db open error");
                self.switchExec(1);
                return ;
            }
            self.switchExec(2);
            self.flushHandleCache();
            });
}

Mongodb.prototype.isCacheEmpty = function(){
    return this._pools.length >0;
}

Mongodb.prototype.count = function(name,filter,options,callback) {

    //var sql = this.parseSQL(data);
    var argu = [].slice.call(arguments,1);

    this.exec(name,filter,function(err,collection,filter) {
        try{/*
            collection.count(filter,options,callback);*/
            collection.count.apply(collection,argu);
        }catch(ex){
            console.log(ex);
        }
    });
}


Mongodb.prototype.insert=function(name,data,options,callback){
    //var sql = this.parseSQL(data);
    
    if(typeof options == "function") {
        callback=options;
        options = {w:1};
    }
    
    this.exec(name,data,function(err,collection,data){
            try{
            collection.insert(data,options,callback);
            }catch(e){
            console.log("Mongodb :"+e);
            }
            });
}

Mongodb.prototype.remove=function(name,filter,options,callback){
    //var sql = this.parseSQL(data);
    if(typeof options == "function") {
        callback = options;
        options={};
    }
    console.log(name);
    this.exec(name,filter,function(err,collection,filter){
        try{
            console.log(err);
            console.log(filter);
            collection.remove(filter,options,callback);
        }catch(e) {
            console.log(e);
        }
    });

}

Mongodb.prototype.removeOne = function(name,filter,callback) {
    //var sql = this.parseSQL(data);

    this.exec(name,filter,function(err,collecion,filter){
            collection.remove(filter,{w:1,sigle:true},callback);
            });
}

Mongodb.prototype.find=function(name,filter,options,callback){
    //var sql = this.parseSQL(data);
    if(typeof options == "function") {
        callback = options;
        options={};
    }
    console.log(callback);
    this.exec(name,null,function(err,collection,data){
            if(err != null) {
                return callback(err,null);
            }
            collection.find(filter,options).toArray(callback);      
            });
}

Mongodb.prototype.parseSQL = function(data){
    /*
     * var sql={"data":data,
      "filter":filter};
        */
    var sql={};
    if(typeof data.data == "undefined" && typeof data.options == "undefined" &&  typeof data.filter == "undefined") {
        sql.data=data;
        sql.options={};
        sql.filter={};
    } else if(typeof data.options == "undefined" &&  typeof data.filter == "undefined"){
        sql = data;
        sql.options={};
        sql.filter={};
    } else if(typeof data.filter == "undefined"){
        sql = data;
        sql.data={};
        sql.filter={};
    } else if(typeof data.options== "undefined"){
        sql=data;
        sql.options={};
    } else {
        sql=data;
    }
    if(typeof sql.filter !=  "undefined" && typeof sql.filter._id != "undefined" && typeof sql.filter._id != "string") {
        console.log("mongodb _id keys value of type must be  string");
    }else if(typeof sql.filter != "undefined" && typeof sql.filter._id == "string"){
        sql.filter._id = new ObjectId(sql.filter._id);
    }




    for(var i in sql) {
    }

    return sql;
}


Mongodb.prototype.handleCache=function(name,data,callback){
    this._pools.addEvent(function(){
            db.collection(name,{strict:true},function(err,collection){
                callback(err,collection,data);
                });
            });
}

Mongodb.prototype.flushHandleCache = function(){
    this._pools.start();
}

/*1,cache
 *2,Normal*/

Mongodb.prototype.switchExec = function(flag){
    if(flag == 1) {
        this.exec = this.handleCache;
    } else {
        this.exec = this.normalExec;
    }
}

Mongodb.prototype.normalExec=function(name,data,callback) {
    try{
        db.collection(name,{strict:true},function(err,collection){
                callback(err,collection,data);
                });
    } catch(e){
        console.log("43"+e);
    }
}

Mongodb.prototype.update = function(name,filter,data,options,callback){
    //var sql = this.parseSQL(data);
    if(typeof options == "function") {
        callback = options;
        options={w:1};
    }
    try{
    this.exec(name,null,function(err,collection,d){
            collection.update(filter,data,options,callback);
            });
    }catch(e){
        console.log(e);
        return;
    }
}

Mongodb.prototype.updateValue = function(name,filter,data,options,callback) {
    //var sql = this.parseSQL(data);
    //var sql = {"filter":filter,"data":data};
    if(typeof options == "function") {
        callback = options;
        options={w:1};
    }

    this.exec(name,null,function(err,collection,d){
        collection.update(filter,data,options,callback);
    });
}

Mongodb.prototype.createCollect = function(name,options,callback) {
    var argu = [].slice.call(arguments,0);
    db.createCollection.apply(db,argu);
}

Mongodb.prototype.save = function(name,data,callback) {
    //var sql = this.parseSQL(data);

    this.exec(name,data,function(err,collection,data) {
        collection.save(data,callback);
    });
}

/*
 *skip{key:skipnum}
 *
 * */
Mongodb.prototype.inc = function(name,filter,key,callback){
    //var sql = this.parseSQL(filter);

    var newKey = key;
    if(typeof key != "Object") {
        eval("var newKey ={"+key+":"+1+"}");
    }
    if(arguments.length == 3) {
        this.exec(name,null,function(err,collection,data){
            collection.update(filter,{"$inc":newKey},function(){
            });
        });
    } else {
        this.exec(name,null,function(err,collection,data){
            collection.update(filter,{"$inc":newKey},callback);
        });
    }
}

//var instance_db = new Mongodb();
exports = module.exports = new Mongodb;


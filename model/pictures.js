var Picture = require("./types").Picture;

function Pictures(collectionName){
    var collectionType = require("./collection");
    this.collect = new collectionType(collectionName);
}

Pictures.prototype.addPicture = function (obj,callback){
    var p = new Picture(obj);
    if(p.isEmpty()) {
        return callback("picture is NULL in Pictures.addPicture",null);
    }
    var self = this;
    this.count({},function(err,result) {
        p.id=result;
        self.collect.add(p.toJson(),callback);
    });
}

Pictures.prototype.count = function(filter,callback) {
    this.collect.count(filter,callback);
}

Pictures.prototype.delByName = function(){
}

Pictures.prototype.del = function(){
}

/*return Array*/
Pictures.prototype.getByName = function(){
}
/* options {start:,num:}*/
Pictures.prototype.getAll = function(opt,callback){
    var data = {fileter:{},options:opt};
    this.collect.find(data,callback);
}

exports = module.exports = Pictures;



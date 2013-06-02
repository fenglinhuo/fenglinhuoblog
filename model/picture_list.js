var PictureListElement = require('./types').PictureListElement;

function PictureList(listName) {
    var collectionType=require("./collection");
    this.collect = new collectionType(listName);
}

PictureList.prototype.add = function (data,callback){
    var p = new PictureListElement(data);
    if(p.isEmpty()) {
        return callback("pictureList is NULL in PicturesList.addPicture",null);
    }
    var self = this;
    this.count({},function(err,result) {
        p.id=result;
        self.collect.add(p.toJson(),callback);
    });
}

/* options {start:,num:}*/
PictureList.prototype.getAll = function(opt,callback){
    opt.sort=[['id',1]];
    var data = {fileter:{},options:opt};
    this.collect.find(data,callback);
}

exports = module.exports = PictureList;

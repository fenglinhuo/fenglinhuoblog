var Article = require("./types").Article;

function Articles(listName) {
    var collectionType = require("./collection");
    this.collect = new collectionType(listName);
}

Articles.prototype.add = function(art,callback){
    var article = new Article(art);
    if(article.isEmpty()) {
        callback("article content not empty in article.js 11",null);
    }
    var self = this;
    this.count({},function(err,result) {
        article.id = result+1;
        self.collect.add(article.toJson(),callback);
    });
}

Articles.prototype.getAll= function(opt,callback){
    var data = {fileter:{},options:opt};
    this.collect.find(data,callback);
}

Articles.prototype.modify=function(search,data,callback) {
    this.collect.modify(search,data,callback);
}

Articles.prototype.addSkip = function(filter,key,callback) {
    if(arguments.length == 2) {
        this.collect.inc(filter,key);
    } else {
        this.collect.inc(filter,key,callback);
    }
}

Articles.prototype.getById = function(aid,callback) {
    var data = {filter:{_id:aid}};
    this.collect.find(data,callback);
}

Articles.prototype.count = function(filter,callback) {
    this.collect.count(filter,callback);
}

exports = module.exports = Articles;

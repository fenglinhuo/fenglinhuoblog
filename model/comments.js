var Comment = require("./types").Comment;

function Comments(aboutName){
    var collectionType = require("./collection");
    this.collect = new collectionType(aboutName+"_comments");
}
Comments.prototype.add = function (obj,callback) {
    var c = new Comment(obj);
    if(c.isEmpty()) {
        return callback("comment is NULL in comments.addcomment",null);
    }

    if(callback == null) {
        callback= function(){
        };
    }

    var self = this;
    //this.count({},function(err,result) {
        c.id=obj.id;
        c.publishTime = new Date();
        c.comment=[];
        var isReply =  c.replyId != -1 ? c.replyId : null;


        if(isReply != null)  {
            self.collect.modify({_id:isReply},{"$addToSet":{"comments":c.toJson()}},function(err,result) {
                if(err != null) {
                    console.log(err);
                }
                callback(err,result);
            });
        } else {

            self.collect.add(c.toJson(),function(err,result) {
                if(err != null) {
                    console.log(err);
                    return callback(err,result);
                }
            });
        }
    //});
}


Comments.prototype.count = function(filter,callback) {
    this.collect.count(filter,callback);
}
/* filter
 *opt *
 *callback *
 * */
Comments.prototype.getAll = function(filter,opt,callback){
    var _filter={};
    var _opt ={};
    if(arguments.length == 1) {
        _filter = filter;
        callback = function(){
        };
    } else if (arguments.length == 2) {
        _filter = filter;
        _opt = {};
        callback = arguments[1];
    }else if(arguments.length ==3)  {
        _filter = filter;
        _opt = opt;
    }

    var data = {filter:_filter,options:_opt};
    console.log(callback);
    this.collect.find(data,callback);
}

exports = module.exports = Comments;

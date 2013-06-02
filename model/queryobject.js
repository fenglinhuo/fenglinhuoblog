
var store = require("./queryStore");
var typeFactory = require("./types").Factory;
var Filters = require("./dbProperty").DbFilters;
var DbOptions = require("./dbProperty").DbOptions;
//var ObjectId = require('mongodb').ObjectID;

module.exports = {
    GetArticles:function(name,start,num,callback){
                    var s = new store("Articles");
                    var p = new Filters();
                    var options = new DbOptions({skip:start,limit:num,sort:[['createTime',-1]]});
                    s.query(p,options,callback);

                },
    GetArticle:function(ArticleId,callback) {
                   var s = new store("Article");
                   //ArticleId =  new ObjectId(ArticleId);
                   var p = new Filters({_id: ArticleId});
                   s.query(p,callback);
               },
GetTwitterauthorizeInfo:function(callback){
                            var s = new store('twitter');
                            s.query(callback);
                        },
    GetComments:function(ArticleId,callback){
                    var s = new store("Comments");
                    var filter = new Filters({aboutId:ArticleId});
                    var options = new DbOptions({sort:[["publishTime",1]]});
                    s.query(filter,options,function(err,result){
                        var obj = {};
                        result.forEach(function(value){
                            if(value.replyId == -1 || value.replyId == null) {
                                obj[value._id] = value;
                                if(typeof value.comments == "undefined" || typeof value.comments != "array") {
                                value.comments=[];
                                }
                            }
                        });

                        result.forEach(function(value) {
                            if(value.replyId != -1 && value.replyId != null) {
                                obj[value.replyId].comments.push(value);
                            }

                        });
                        var arr=[];
                        for(var i in obj) {
                            arr.push(obj[i]);
                        }
                        callback(err,arr);
                    });


                },
GetCommentsNum:function(CollectName,callback) {
                   var s = new store("Articles");
                   s.count(callback);
            },
    GetComment:function(CommentId,callback) {
               },
    GetPictures:function(CollectName,callback) {
                    var s = new store('Pictures');
                    var filter = new Filters({collectName:CollectName});
                    try{
                    s.query(filter,callback);
                    }catch(e){
                        console.log(e);
                    }
                },
    GetPicture:function(CollectName,PictureId,callback) {
               },
GetPictureListName:function(callback) {
                       var s = new store('PictureList');
                       s.query(callback);
                   },
GetRssList:function(callback) {
               var s = new store('Rsses');
               s.query(callback);
           },
GetRssContent:function(name,callback) {
                  var s = new store('Rss');
                  var filters = new Filters({rssName: name})
                  s.query(filters,callback);
              }
};


function article(){
}

article.get = new Object();
article.post=new Object();
var Articles = $Model('articles');
var articles = new Articles('articles');
var gf = $Model('functions');
var typeFactory = $Model("./types").Factory;



///article/:start(\\d+)-:end(\\d+)
article.list = function(req,res,next){

    var s= req.params['start'],e = req.params['end'];
    var queryObj = $Model('queryobject');
    console.log(queryObj);

    queryObj.GetArticles('Article',s,e,function(err,result){
        res.json({"users":result});
    });

}

//"/article/:id(\\d+)
article.content = function(req,res,next) {
    //var users = require('../users');
    

    var item  = req.params['id'];
    var queryObj = $Model('queryobject');
    var articleObject = typeFactory("Article");
    queryObj.GetArticle(item,function(err,data) {
            var art =new articleObject(data);
        res.json(data);
        art.addSkip("lookTimes");
    });
}

///articleContent
article.get.showContent = function(req,res,next) {
    res.render("articleContent.html");
}

article.get.favor = function(req,res,next) {
    var articleId= req.query.articleId;

    var articleObject = typeFactory("Article");
    var art = new articleObject({_id:articleId});

    art.addSkip("favor");
    res.send(200);
}

article.get.oppose = function(req,res,next) {
    var articleId= req.query.articleId;

    var articleObject = typeFactory("Article");

    var art = new articleObject({_id:articleId});

    art.addSkip("oppose");

    res.send(200);

}

article.post.comment = function(req,res,next) {
    //var Comments = $Model("comments");
    var CommentObject = typeFactory("Comment");
    //var comments = new Comments("article");

    var _aboutId = req.body.id;
    var _author = req.body.author;
    var _replyId = typeof req.body.replyId == "undefined" || req.body.replyId == null ? -1 : req.body.replyId;
    var _content = typeof req.body.content == "undefined" ? "" : req.body.content;
    var _title  =  typeof req.body.title == "undefined" ? "" : req.body.title;
    
    console.log(62);
    var com = new CommentObject({author:_author,aboutId:_aboutId,replyId:_replyId,content:_content,title:_title,publishTime:new Date()});
    com.set("collectName","article");

    //com.add({author:_author,aboutId:_aboutId,replyId:_replyId,content:_content,title:_title},null);
    com.save(function(err,data) {
            console.log(arguments);
            });
    console.log(64);
    res.send(200);

}

article.get.comment = function(req,res,next){
    var articleId= req.query.id;
    /*
    var Comments = $Model("comments");
    var comments = new Comments("article");
 
    comments.getAll({aboutId:articleId},{sort:[["publishTime",1]]},function(err,arr) {
        if(err != null) {
            console.log("comment get error: "+err);
            res.send(400);
            return;
        }
        res.json(arr);
    });
    */


    var queryObj = $Model('queryobject');
    queryObj.GetComments(articleId,function(err,arr) {

            console.log("112");
            if(err != null) {
            console.log("comment get error: "+err);
            res.send(400);
            return;
            }
            res.json(arr);


            });


}

article.sum= function(req,res,next) {
        /*var users=require("../users");
        var sum=users.length;*/
    var queryObj = $Model('queryobject');
    queryObj.GetCommentsNum("articles",function(err,result) {
            console.log(err);
            res.json({act:"articleSum","value":result});
            });

}

article.editorArticle = function(req,res,next) {
    if(!gf.IsLogin(req)) {
        return res.send("no login");
    }
    res.render("editorArticle.html");
}

/*
article.saveArticle = function(req,res,next) {
    var title = req.body.title;
    var content = req.body.myEditor;
    content=content.replace(/\r/g,"");
    if(!gf.IsLogin(req)) {
        return res.send("no login");
    }

    var articleObject = typeFactory("Article");

    var art = new articleObject({"title":title,"content":encodeURI(content),lookTimes:0,createTime:new Date(),oppose:0,favor:0});
    art.save(function(err,data){
        res.redirect("/blog");
    });

}*/

article.dispath = function(req,res,next) {
    switch(req.params.method) {
        case "favor":
            return article.get.favor(req,res,next);
        break;
        
        case "oppose":
            return  article.get.oppose(req,res,next);
        break;
        case "sum":
            return article.sum(req,res,next);
        break;
    default:
        next();
    }
}

module.exports = exports = article;


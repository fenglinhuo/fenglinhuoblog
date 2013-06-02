
var fs = require('fs'),xml2js = require('xml2js');
var parser = new xml2js.Parser();

var RssList = $Model("rss");
var rssList = new RssList();
var queryObject = $Model('queryobject');
var typeFactory = $Model("./types").Factory;
function rss(){
}

rss.get = new Object();
rss.post = new Object();

rss.index = function(req,res,next) {
    res.render("rss.html");
}

rss.get.list = function(req,res,next) {
    /*
    rssList.getAll(function(err,result) {
        res.json(result);
    });*/
    
    queryObject.GetRssList(function(err,result) {
        res.json(result);
    });
}


rss.post.save = function(req,res,next) {
    var name=req.body.name;
    var rssUrl=req.body.url;
    var rssType = typeFactory("Rss");
    var rssObj = new rssType({title:name,url:rssUrl});
    try{
    rssObj.save(function(err,result) {
        if(err == null) {
            res.json({status:200});
        }   
    });
    }catch(e){
        res.json({status:500});
        console.log(e);
    }
}

rss.get.del = function(req,res,next) {
    var name=req.query.name;
    var rssUrl = req.query.url;
    var key = req.query.key;

    var rssType = typeFactory("Rss");
    var rssObj = new rssType({_id:key});
    rssObj.del(function(err,result){
        res.send({status:200});
    });
}

rss.get.mod = function(req,res,next) {
    var name=req.query.name;
    var rssUrl = req.query.url;
    var key = req.query.key;

    var rssType = typeFactory("Rss");
    var rssObj = new rssType({_id:key,title:name,url:rssUrl});
    try{
    rssObj.modify(function(err,result) {
        console.log(err);
        console.log(result);
        res.send({status:200});
    });}catch(e){
        res.json({status:500});
        console.log(e);
    }
}

rss.get.listContent=function(req,res,next){
    var rssName = req.query.name;
    /*
    rssList.query(rssName,function(err,result) {
        if(err != null) {
            return res.send(err);
        }
        res.json(result);
    });*/
    queryObject.GetRssContent(rssName,function(err,result) {
        if(err != null) {
            return res.send(err);
        }
        res.json(result);
    });

}

exports = module.exports=rss;

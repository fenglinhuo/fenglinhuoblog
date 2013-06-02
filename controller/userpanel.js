var cloudinary = require('cloudinary')
var fs = require('fs');
var config=cloudinary.config;
var gf = $Model('functions');
var typeFactory = $Model("./types").Factory;
var typeStore = $Model('typeStore');


function userPanel(){

}
userPanel.get = new Object();
userPanel.post = new Object();

userPanel.check = function(req,res,next) {
    if(!gf.IsLogin(req)) {
        return res.send("no login");
    }
    next();
}

userPanel.index = function(req,res,next) {
    res.render("userpanel.html");
}

userPanel.post.uploadPicture = function(req,res,next) {

    var listName = req.body.p_listName;
    var name = req.body.p_name;
    var snippet = req.body.p_snippet;
    var title=req.body.title;
    var p_link = req.body.p_link == "" ? null : req.body.p_link;

    /*var Pictures = $Model('pictures');
    var pictures = new Pictures(listName);*/

    var PictureObject = typeFactory("Picture");
    console.log(PictureObject);

    console.log("p_link-----------------------");
    console.log(typeof p_link);
    console.log("-----------------------------");
    if(p_link != null) {

        /* return pictures.addPicture({src:p_link,"name":name,"snippet":snippet,thumbnail:p_link},function(err,result) {
            res.redirect("/blog#/uploadPicture");
        });*/

    console.log("51");
        try{
        var pict = new PictureObject({src:p_link,"name":name,"snippet":snippet,thumbnail:p_link,collectName:listName});
        console.log(listName);
        }catch(e){
            console.log(e);
        }
    console.log("54");
        try{
        pict.save(function(err,data) {
                console.log(err);
            res.redirect("/blog#/uploadPicture");
                });
        }catch(e){
            console.log(e);
        }
        return;

    }

    //var parm = process.env.CLOUDINARY_URL;
    var parm = "cloudinary://761997216785623:OCYrT5qdZ6rsi-LITXYnqeMBtO0@hyssqapqa";

    //var parm = "cloudinary://761997216785623:OCYrT5qdZ6rsi-LITXYnqeMBtO0@hyssqapqa";
    var reg=/cloudinary:\/\/(.*):(.*)@(.*)/;
    var m=parm.match(reg);
    var cfg = {api_key:m[1],api_secret:m[2],cloud_name:m[3]};
    config(cfg);

    cloudinary.uploader.upload(req.files.p_name.path, function(result) {
        console.log("80");
        console.log(result);
        var dstName = result.public_id+"."+result.format;
        var _thumbnail = cloudinary.url(dstName, {width: 230,crop: "thumb", gravity: "face"});
        console.log(_thumbnail);

        try{

            var pict = new PictureObject({src:result.url,"name":name,"snippet":snippet,thumbnail:_thumbnail,collectName:listName});

            pict.save(function(err,data) {
                console.log(err);
                res.redirect("/blog#/uploadPicture");
            });
        }catch(e){
            console.log(e);
        }
    },{public_id:name});
}

userPanel.get.uploadPicture = function(req,res,next) {
    if(!gf.IsLogin(req)){
        return res.send("no login");
    }
    res.render("uploadPicture.html");
}


userPanel.get.setPictureList = function(req,res,next) {
    res.render("setPictureList.html");
}


userPanel.get.editorArticle = function(req,res,next) {
    if(!gf.IsLogin(req)) {
        return res.send("no login");
    }
    res.render("editorArticle.html");
}


userPanel.post.saveArticle = function(req,res,next) {
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
}

userPanel.post.changeToken = function(req,res,next) {
    var token = req.body.token;
    var token_secret = req.body.token_secret;
    typeStore.TypeRestore('Twitter',function(err,twitter){
            twitter.set("access_token",token);
            twitter.set("access_secret",token_secret);
            twitter.modify(function(){
                res.send({status:200});
                });
            });
}

userPanel.get.getToken = function(req,res,next){
    typeStore.TypeRestore('Twitter',function(err,twitter){
            res.json(twitter.toJson());
            });

}

userPanel.get.setting = function(req,res,next) {
    res.render("setRss.html");
}

userPanel.get.setPasswd = function(req,res,next) {
    res.render("setPasswd.html");
}

userPanel.get.setTwitter=function(req,res,next) {
    res.render('setTwitter.html');
}

exports = module.exports = userPanel;

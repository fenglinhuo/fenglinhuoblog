var cloudinary = require('cloudinary')
var config=cloudinary.config;
var fs = require('fs');
var gf = $Model('functions');
var typeFactory = $Model("./types").Factory;

function picture(){
}

module.exports = picture;
picture.get = new Object();
picture.post = new Object();
picture.index = function(req,res,next){
    var queryObject = $Model('queryobject');
    queryObject.GetPictureListName(function(err,result) {
        res.render("picture.html",{pictureList:result});
    });
}
/*
picture.post.uploadPicture = function(req,res,next) {

    if(!gf.IsLogin(req)){
        return res.send("no login");
    }
    console.log("31");

    var listName = req.body.p_listName;
    var name = req.body.p_name;
    var snippet = req.body.p_snippet;
    var title=req.body.title;
    var p_link = req.body.p_link == "" ? null : req.body.p_link;


    var PictureObject = typeFactory("Picture");
    console.log(PictureObject);

    console.log("p_link-----------------------");
    console.log(typeof p_link);
    console.log("-----------------------------");
    if(p_link != null) {


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
    var parm = "cloudinary://112857912924585:gw7uBAQ7j3pRig6VLF3yzxOdzT0@hyqmjzt46";
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
}*/

/*
picture.get.uploadPicture = function(req,res,next) {
    if(!gf.IsLogin(req)){
        return res.send("no login");
    }
    res.render("uploadPicture.html");
}*/

picture.get.list = function(req,res,next) {
    var queryObject = $Model('queryobject');
    queryObject.GetPictureListName(function(err,result) {
        res.json(result);
    });
}

/*
picture.get.setPictureList = function(req,res,next) {
    res.render("setPictureList.html");
}*/

picture.get.addlist = function(req,res,next) {
    var name = req.query.name;
    var title = req.query.title;

    var listType = typeFactory('PictureListElement');
    var list = new listType({"name":name,"title":title});

    list.save(function(err,result) {
        console.log(result);
        console.log(err);
        res.send({status:200});
    });
}

picture.get.modlist = function(req,res,next) {
    var name = req.query.name;
    var title = req.query.title;
    var key = req.query.key;
    var listType = typeFactory('PictureListElement');
    var list = new listType({_id:key,"name":name,"title":title});

    list.modify(function(err,result) {
            res.send({status:200});
            });
}

picture.get.dellist=function(req,res,next) {
    var name = req.query.name;
    var title = req.query.title;
    var key = req.query.key;
    var listType = typeFactory('PictureListElement');
    var list = new listType({_id:key,"name":name,"title":title});
    list.del(function(err,result) {
        console.log(result);
        res.send({status:200});
    });

}

picture.get.show =function(req,res,next) {
    var collectName = req.query.name;
    /*
    var Pictures = $Model('pictures');
    var t = new Pictures(collectName);
    t.getAll({},function(err,arr) {
        console.log(arr);
        res.json(arr);
    });*/

    var queryObject = $Model("queryobject");
    queryObject.GetPictures(collectName,function(err,arr) {
            console.log(err);
            res.json(arr);
            });

}




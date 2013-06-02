
function blog(){
}
var gf = $Model('functions');

var typeStore =$Model('typeStore');

blog.index = function(req,res,next) {
}
blog.get = new Object();
blog.post = new Object();

blog.blog = function(req,res,next) {

}
blog.get.index = function(req,res,next) {
    /* var users=  require("./users");
     *     var items = require("./picture");
     *         console.log(users); 
     *             res.render('blog1.html',{"users":users,"items":items}); */
    //console.log(req.session);
    //
    /*
     * var webInfo = $Model('WebInfo');
    webInfo.updateState(req.ip);
    */
    
    typeStore.TypeRestore('WebInfo',function(err,webInfo) {
            webInfo.updateState(req);
            });

    if(gf.IsLogin(req)) {
        res.render('blog1.html',{"user":req.session.user.username});
    }else {
        res.render('blog1.html');
    }
}


blog.body = function(req,res,next) {
    var Pictures = $Model('pictures');
    var pictures = new Pictures("cartoon");
   // var items = require("../picture");
   //
    //var webInfo = $Model('WebInfo');

    typeStore.TypeRestore('WebInfo',function(err,webInfo) {
            var info  = webInfo.toJson();
            var t = new Date(info.lastTime);
            info.lastTime = t.getUTCFullYear()+"/"+(t.getUTCMonth()+1)+'/'+t.getUTCDate()+"  "+t.getUTCHours()+":"+t.getUTCMinutes()+":"+t.getUTCSeconds();

            pictures.getAll({},function(err,items) {
                res.render('body1.html',{"items":items,"nums":items.length,webInfo:info});
                });
            });
}


module.exports = blog;



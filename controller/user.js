var typeFactory = $Model("./types").Factory;

function user(){
}

user.post = new Object();
user.get = new Object();

user.post.login = function(req,res,next) {
    var users= $Model('users');
    var name=req.body.user;
    var passwd = req.body.passwd;

    users.isExist({user:name,"passwd":passwd},function(err,result){
        if(err != null || !result) {
            res.redirect("/blog");
        } else {
            req.session.user={username:name,isLogin:true};
            res.redirect("/blog");
        }
    });
}

/*
user.get.setPasswd = function(req,res,next) {
    res.render("setPasswd.html");
}*/

user.post.setPasswd = function(req,res,next) {
    var name=req.body.name;
    var passwd = req.body.passwd;
    var User = typeFactory('User');
    var userObject = new User({"name":name,"password":passwd});
    userObject.save(function(err,data){
            if(err != null) {
                res.send(500);
            } else {
            res.json({status:200});
            }
            });

}

exports = module.exports = user;




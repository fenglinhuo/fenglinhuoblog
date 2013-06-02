var oauth = require("oauth");
var typeFactory =  $Model("types").Factory;
var querystring= require('querystring');
var typeStore =$Model('typeStore');
var gf = $Model('functions');

function twitter(){

}

var request_token_url =  'https://api.twitter.com/oauth/request_token';
var access_token_url = 'https://api.twitter.com/oauth/access_token';
var signUser = "https://api.twitter.com/oauth/authorize";
var consumer_key="ycrV6BI2QCgXWRleYuFow";
var consumer_secret="DnKDYgURKW8geNulAi7qCC9HQlzhitMAHHmfP78vjn0";
var call_back_url = "http://fenglinhuo.ap01.aws.af.cm/twitter/authTwitter";

var ooauth = new oauth.OAuth(request_token_url,access_token_url,consumer_key,consumer_secret,'1.0A',call_back_url,'HMAC-SHA1', null,null);
var reg = /(<form .*action=\")([^>"]+)(\"[^>]*>)/;

twitter.get = new Object();
twitter.post=new Object();

twitter.index = function(req,res,next) {
    var isLogin=false;
    if(gf.IsLogin(req)) {
        isLogin = true;
    }


    res.render("twitter.html",{isLogin:isLogin});

}
twitter.act = function(req,res,next) {
    var act = req.params.method;
    //var Twitter = $Model('twitter');
    typeStore.TypeRestore('twitter',function(err,tw){
            if(act == 'twitterByUser') {
                var name=req.query.userName;
                var maxId = req.query.max_id;

                
                if(maxId != 0 && typeof maxId != 'undefined') {
                    tw.getTwitterByName(name,maxId,function(data) {
                        if(data instanceof Error) {
                            return res.json({status:"error",errnum:604});
                        }
                        res.json({status:"success","data":data});
                    });
                }else {
                    tw.getTwitterByName(name,function(data) {
                        if(data instanceof Error) {
                            return res.json({status:"error",errnum:604});
                        }
                        res.json({status:"success","data":data});
                    });
                }
                    return ;
                //return res.json({status:"error",errnum:604});
            } else if(act == "getHomeInfo") {
            
            try{
            tw.getHomeUserInfo(function(data){
                if(data instanceof Error) {
                                return res.json({status:"error",errnum:603});
                            }
                req.session.twitterName = data.screen_name;
                res.json(data);
                }); 
            }catch(e){
                console.log(e);
                res.json({status:"error",errnum:603});
            }
                return;
            } else if(act == "userInfo") {
                var name=req.query.userName;
                console.log(req.session);
                if(!gf.IsLogin(req) && req.session.twitterName != name) {
                    return res.send({status:501,info:"没有权限，请先登录"});
                }
                tw.getUserInfo(name,function(data) {
                    if(data instanceof Error) {
                        return res.json({status:"error",errnum:603});
                    }
                        res.json(data);
                        });
                return;
            }

            var isLogin=false;
            if(gf.IsLogin(req)) {
                isLogin = true;
            } else {
                res.send({err:"not login"});
                return;
            }
            
            if(act == "Last") {
            /* var tw = require('./twitter3.json');
               res.json(tw);*/
                
            tw.getLast(function(data){
                    if(data instanceof Error) {
                        return res.json({status:"error",errnum:609});
                    }
                res.json({status:"succes",data:data});
                });

            }else if(act == "before") {
            /*var tw = require('./twitter.json');
              res.json(tw);*/

            var id =req.query.max_id;
            tw.getbefore(id,function(data) {

                if(data instanceof Error) {
                    return res.json({status:"error",errnum:609});
                }

                res.json({status:"succes",data:data});
                //res.json(data);
                });
            }else if(act == "mentions") {
                try{
                    tw.getMentions(function(data) {
                        if(data instanceof Error) {
                            return res.json({status:"error",errnum:607});
                        }
                        res.json({status:"succes",data:data});
                        //res.json(data);
                    });
                }catch(e){
                    res.json({status:"error",errnum:607});
                }
            } else if(act == "mentionsBefore") {
                var id = req.query.max_id;
                console.log(id);
                try{
                tw.getMentionsBefore(id,function(data) {
                    if(data instanceof Error) {
                        return res.json({status:"error",errnum:607});
                    }
                        res.json({status:"succes",data:data});
                        //res.json(data);
                        });
                }catch(e){
                    res.json({status:"error",errnum:607});
                }
            } 
            else if(act == "getToken"){
                //res.json({status:"succes",data:data});
                res.json(tw.toJson());
            } 

    });
}

twitter.get.requestToken = function(req,res,next) {
    ooauth.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret,  results ){
            otoken = oauth_token;
            otoken_secret = oauth_token_secret;
            //res.send("oauth_token"+oauth_token+" "+oauth_token_secret+"  "+results);
            console.log("233");
            console.log(err);
            var signURL = ooauth.signUrl(signUser,oauth_token,oauth_token_secret);
            ooauth.get(signURL,oauth_token,oauth_token_secret,function(err,data,response){
                var d1 = data.replace(reg,function(value,v1,v2,v3){
                    return v1+"/twitter/authorize"+v3;
                    });
                res.send(d1);
                });

            });
}

twitter.post.authorize = function(req,res,next) {
    try{
        var j = req.body;
        var post_body={};
        for(var i in j) {

        if(typeof j[i] == "object") {
        for(var k in j[i]) {
        post_body[i+"["+k+"]"]=j[i][k];
        }
        } else {
        post_body[i]=j[i];
        }
        }

        console.log(post_body);
        console.log(querystring.stringify(post_body));

       ooauth.post(signUser,null,null,post_body,null,function(err,data,response){
            res.send(data);
        });
    }catch(e){
        console.log(e);
        res.send({status:500});
    }
}
twitter.get.authTwitter = function(req,res,next) {
    try{
        var auth_token = req.query.oauth_token;
        var auth_verifier = req.query.oauth_verifier;

        ooauth.getOAuthAccessToken(auth_token,null,auth_verifier,function(err,oauth_access_token,oauth_access_token_secret,result) {

            //var twitterType = typeFactory('twitter');
            typeStore.TypeRestore('twitter',function(err,twitter){
                twitter.set("access_token",oauth_access_token);
                twitter.set("access_secret",oauth_access_token_secret);
            console.log("twitter------------------");
            console.log(twitter);
            console.log("------------------------");
                twitter.modify(function(){
                    res.redirect("/blog#/twitter");
                });
            });
/*
            var twitter = new twitterType(function(){
                twitter.set("access_token",oauth_access_token);
                twitter.set("access_secret",oauth_access_token_secret);
                twitter.modify(function(){
                    res.redirect("/blog#/twitter");
                });
            });
            */

        });
    }catch(e) {
        console.log(e);
        res.send({status:500});
    }

}

twitter.post.act = function(req,res,next) {
    var Twitter = $Model('twitter');
    var method = req.params.method;


    var twitter = typeStore.TypeRestore('twitter',function(err,tw){

        //var tw = new Twitter(function(){
        if(method == "postTwitter") {
            var content = req.body.content;
            var content = content.substr(0,140);
            tw.post(content,function(data) {
                res.json(data);
            });
            //res.json({err:"暂时禁止发帖"});
        } else if(method == "changeToken") {
            var token = req.body.token;
            var token_secret = req.body.token_secret;
        tw.set("access_token",token);
        tw.set("access_secret",token_secret);
        tw.modify(function(){
                res.send({status:200});
                }); 
        }
    });
}


exports = module.exports = twitter;

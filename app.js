var express = require("express");
var route = require('mvc_router');
var fs = require('fs');
var app = express();
app.engine("ejs",require('ejs').renderFile);
app.engine("html",require('ejs').renderFile);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 }}));
app.use(function(req,res,next){
        next();
        });
app.use(express.static(__dirname+"/public"));


var router = new route(app);


app.param("range",function(req,res,next,val){
    var reg = /^(\d+)-(\d+)$/;
    req.params['range'] = reg.exec(val);
    next();
});
app.listen(3001);
console.log("listen 3000");




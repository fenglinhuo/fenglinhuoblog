var http = require('http'),
    fs = require('fs'),
    xml2js = require('xml2js');
var parser = new xml2js.Parser();
var cwd =  process.cwd();
var cacheDir = cwd+"/cache";
var timeout = 3600*1000*12;
var typeFactory = $Model('types').Factory;
var queryObject = $Model('queryobject');
var BaseType = typeFactory('BaseType');

function Rss(obj){
    this._init(obj);
}

Rss.prototype = new BaseType();

Rss.prototype.types=['title','key','url','collectName'];
Rss.table_name = "rsses";

Rss.prototype.getData = function(){
    var time = new Date();
    var key = "bjn_"+time.getTime();
    var data = this.toJson();
    data.key = key;
    delete data.collectName;
    delete data.collectKey;
    return data;
}

Rss.prototype.exists = function(callback){
    var filter={};
    var table_name = this.getTableName();
    filter._id = this["_id"];
    this.store.count(table_name,filter,function(err,result) {
        console.log(result);
        callback(result!=0);
    });
}


/*
Rss.prototype.del = function(callback) {
    var table_name = Rss.table_name;
    if(typeof this.collectName != "undefined" && this.collectName != "") {
        table_name = this.collectName;
        delete this.collectName;
    }
    delete this.collectName;
    var data = this.toJson();
    this.store.del(table_name,data,callback);

}*/

Rss.prototype.getAll=function(callback){
    var rss = require("./rsses");
    callback(null,rss);
}

Rss.query = function(filter,options,callback) {
    var name = filter.rssName;
    console.log(name);
    try{
    queryObject.GetRssList(function(err,rsses) {
        var result=null;
        rsses.forEach(function(value) {
            if(value.key == name){
                result = value;
            }
        });

        if(result == null) {
            return callback("rss 没有被订阅",null);
        }
        Rss.queryContent(result,callback);
    });
    }catch(e) {
        console.log(e);
    }
}

Rss.queryContent = function(rssEle,callback) {
    var keyName = rssEle.key;
    var keyUrl = rssEle.url;
    /*var rsses = require("./rsses");
    var result;
    rsses.forEach(function(value) {
        if(value.key == keyName){
            result = value.url;
        }
    });
    if(result == null) {
        return callback("rss 没有被订阅",null);
    }*/

    var cacheFile = cacheDir+"/"+keyName+".js";
    fs.exists(cacheFile,function(exists) {
        if(exists) {
            fs.stat(cacheFile,function(err,stats) {
                var currTime = new Date();
                if((currTime.getTime()-stats.ctime.getTime())>timeout) {
                    fs.rename(cacheFile,cacheDir+"/"+keyName+"_"+currTime.getTime()+".js",function(err) {

                        Rss.queryUrl(keyUrl,function(err,arr) {
                            if(err != null) {
                                callback(err,null);
                            }
                            var currTime = new Date();
                            var data = JSON.stringify(arr);

                            //var data = "exports=module.exports="+data;
                            
                            fs.writeFile(cacheFile,data,function(err){
                                callback(err,arr);
                            });
                        });

                    });
                }else {
                    console.log("return from file");
                    //var rss_result = require(cacheFile);
                    fs.readFile(cacheFile,function(err,result) {
                        var rss_result=JSON.parse(result);
                        callback(err,rss_result);
                    });
                }
            });
        } else {
            Rss.queryUrl(keyUrl,function(err,arr) {
                var currTime = new Date();
                var data = JSON.stringify(arr);
                //var data = "exports=module.exports="+data;
                fs.writeFile(cacheFile,data,function(err){
                    console.log(err);
                    callback(err,arr);
                });
            });

        }
    });

};

exports = module.exports = Rss;



function dataEndCallback(data,callback){ 
    try{
        parser.parseString(data,function(err,result) {
            var jsonstring = JSON.stringify(result);
            var jsonObj = JSON.parse(jsonstring);
            var _items=[];
            console.log(jsonObj);
            jsonObj.rss.channel.forEach(function(value){
                value.item.forEach(function(value) {
                    console.log(value);
                    try{
                    value['description'][0] = value['description'][0].replace(/\n/g,"<br>");
                    }catch(e){
                        return;
                    }
                    _items.push(value);
                });
                //items = value.item;
            });
            var channel = jsonObj.rss.channel;
            console.log(jsonObj.rss.channel);
            var _pubDate = typeof channel[0].lastBuildDate != 'undefined' ? channel[0].lastBuildDate[0] : typeof channel[0].pubDate != 'undefined' ? channel[0].pubDate[0] : null;

            var _info = {title:channel[0].title[0],link:channel[0].link[0],description:channel[0].description[0],pubDate:_pubDate};
            callback(null,{info:_info,items:_items});
        });
    }catch(ex) {
        console.log(ex);
    }
}

Rss.queryUrl = function(url,callback) {
    var reg = /^((\w+)(?:(:\/\/)))?([^\/]*)(.*)/;
    console.log(url);
    var urlInfo = url.match(reg);
    var _schem = urlInfo[2];
    var _host = urlInfo[4];
    var _path =urlInfo[5];
    var options = {
        hostname: _host,
        port: 80,
        path: _path,
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        var content='';
        res.on('error',function(e) {
            console.log('problem with request: ' + e.message);
        });
//        console.log('STATUS: ' + res.statusCode);
  //      console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            content=content+chunk;
        });
        res.on('end',function(){
            dataEndCallback(content,callback);
        });
    });

    req.on('error',function(e) {
        //console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.end();
};


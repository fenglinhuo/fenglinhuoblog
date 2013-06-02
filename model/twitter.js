
var util = require('util'),
    twitter = require('twitter');
var queryObject = $Model('queryobject');
var typeFactory = $Model('types').Factory;


/*
    var twit = new twitter({
consumer_key:'d3JnEQVJjOjqgvrwTMgQQ',
consumer_secret:'8ba9VAiXTDuMaHRqbviGlOTxMkEVnEJSKtnJS3TTk',
access_token_key:'218220783-rx8JhIKJ2kWuFb9jKqzYYAYNt9WA5B3ZDILvNNdh',
access_token_secret:'1uWdR65QnDyBNz0jDvXZc15KX3r3OcYtBU2ubkkI'
});
*/

var BaseType = typeFactory('BaseType');

function MyTwitter(){
    obj = arguments[0];
    this._init(obj);
    this.initTwitter();
}



MyTwitter.prototype = new BaseType();
MyTwitter.prototype.types=["access_token","access_secret"];
MyTwitter.table_name="twitter";
MyTwitter.query=function(filter,option,callback){
    var table_name=MyTwitter.table_name;
    BaseType.dbQuery(table_name,filter,option,callback);
}

MyTwitter.restore = function(filter,callback) {
    try{
        var option={};
        MyTwitter.query(filter,option,function(err,result){
            var data = result[0];
            var obj = new MyTwitter(data);
            callback(null,obj);
        });
    }catch(e){
        console.log(e);
        return;
    }
}


MyTwitter.prototype.initTwitter=function(){
    this.twit = new twitter({
consumer_key:'ycrV6BI2QCgXWRleYuFow',
consumer_secret:'DnKDYgURKW8geNulAi7qCC9HQlzhitMAHHmfP78vjn0',
access_token_key:this.access_token,
access_token_secret:this.access_secret
});

}
MyTwitter.prototype.getbefore = function (id,callback){
    this.twit.get('/statuses/home_timeline.json', {include_entities:true,max_id:id}, function(data) {
        callback(data);
    });
}

MyTwitter.prototype.getLast=function(callback){
    this.twit.get('/statuses/home_timeline.json', {include_entities:true}, function(data) {
        callback(data);
    });
}
MyTwitter.prototype.getMentions = function(callback) {
    this.twit.getMentions({include_entities:true},callback);
}

MyTwitter.prototype.getHomeUserInfo = function(callback){
    var url = "/account/verify_credentials.json";
    this.twit.get(url,callback);

}


MyTwitter.prototype.getMentionsBefore=function(id,callback) {
    this.twit.getMentions({max_id:id,include_entities:true},callback);
}

MyTwitter.prototype.post=function(text,callback) {
    this.twit.updateStatus(text,callback);
}
MyTwitter.prototype.getTwitterByName = function(name,maxId,callback) {
    var params={screen_name:name,include_entities:true};
    if(typeof maxId == 'function') {
        callback = maxId;
    } else {
        params.max_id = maxId;
    }

    this.twit.getUserTimeline(params,callback);
}

MyTwitter.prototype.getUserInfo = function(name,callback) {
    this.twit.showUser(name,callback);
};

MyTwitter.prototype.getTwitterByUserId = function(userId,maxId,callback) {
    var params = {user_id:userId,include_entities:true};
    if(typeof maxId == 'function') {
        callback = maxId;
    } else {
        params.max_id = maxId;
    }
    this.twit.getUserTimeline(prams,callback);
}

exports=module.exports =MyTwitter;



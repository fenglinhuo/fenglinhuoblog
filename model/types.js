var g_functions = require("./functions");
var Store = require("./store");

var db_map = {

};

function Type(){
}

Type.prototype.initAttr = function(classType){
    this.collectName = classType.table_name;
    this.collectKey = typeof classType.collectKey =="undefined" ? "_id" : classType.collectKey;
}

Type.prototype.restore = function(key) {

}

Type.prototype.getTableName = function(){
    if(typeof this.collectName != "undefined") {
        return this.collectName;
    }
    return null;
}

Type.prototype.getData = function(){
    var data = this.toJson();
    delete data.collectName;
    delete data.collectKey;
    return data;
}

Type.prototype.getCollectKey = function(){
    return this.collectKey;
}

Type.prototype._init = function(obj){
    this.initAttr(arguments.callee.caller);
    for(var i in obj) {
        if(!this._in(i)){
            console.log("input type of types error"+i);
        } else {
            console.log(i);
            this[i]=obj[i];
        }
    }
    this.store = new Store();
}

Type.prototype.set = function(key,value){
    this[key] = value;
}

Type.prototype.get = function(key) {
    return this[key];
}

Type.prototype.toJson = function(){
    var self=this;
    var str="{";
    var tmp;
    var reObj={};
    this.types.forEach(function(value) {
        if(typeof self[value] != "undefined") {
            reObj[value] = self[value];
        }
    });

   
    return reObj;
}
Type.prototype.isEmpty = function(){
    for(var i in this.types) {
        if(this[this.types[i]] != "" ||  typeof this[this.types[i]] != "undefined") {
            return false;
        }
    }
    return true;
}

Type.prototype.types = ["_id","id","src","snippet","name","thumbnail"];
Type.prototype.S= String.fromCharCode(2);
Type.prototype._in=function(e)
{
    if(e =="_id") {
        return true;
    }
        var r=new RegExp(this.S+e+this.S);
        return (r.test(this.S+this.types.join(this.S)+this.S));
}


Type.dbQuery = function(table_name,filter,options,callback) {
    var db_type =g_functions.GetDB(DB_MONGO);
    if(typeof options == "function") {
        callback = options;
        options = {};
    }
    db_type.find(table_name,filter,options,callback);
}

Type.dbModify = function(table_name,filter,data,options,callback) {
    if(typeof options == "function") {
        callback = options;
        options = {};
    }
    db_type.update(table_name,filter,data,options,callback);
}

Type.prototype.addSkip = function(key){
    this.store.addSkip(this.collectName,{_id:this._id},key);
}

Type.prototype.update = function(callback) {
    var table_name = this.getTableName();
    if(typeof table_name == null) {
        return callback("Type save faild ,not collectName for save",null);
    }
    /*
    var data = this.toJson();
    delete data.collectName;
    delete data.collectKey;*/

    var data = this.getData();

    var filter = {};
    filter[this.collectKey] = this[this.collectKey];
    this.store.update(table_name,filter,data,callback);
}

Type.prototype.exists = function(callback) {
    callback(true);
}

Type.prototype.modify = function(callback) {
    var self = this;
    this.exists(function(result){
            if(result != true) {
            console.log("data not exists");
            return callback("data not exists");
            }
            return self.update(callback);
            });
}

Type.prototype.del = function(callback) {
    console.log("220");
    var table_name = this.getTableName();

    //var data = this.toJson();

    //var data = this.getData();
    var filter ={};
    filter[this.collectKey]=this[this.collectKey];
    try{
        this.store.del(table_name,filter,callback);
    }catch(e){
        console.log(e);
    }
}

Type.prototype.save = function(callback){
    //var table_name = jsonData.collectName;
    console.log("111--------------");
    console.log(this);
    console.log("--------------");

    var table_name = this.getTableName();
    /*
    var data  = this.toJson();
    delete data.collectName;
    */

    var data = this.getData();
    if(typeof table_name == null) {
        return callback("Type save faild ,not collectName for save",null);
    }
    console.log(table_name);
    this.store.create(table_name,data,callback);

}

/*
Type.prototype.updateAndSave = function(callback) {
    try{
        this.exists(function(result) {
                if(result != 0) {
                return callback("data is exists");
                }
                save.call(self,function(){
                    self.store.addTable(self.name,callback);
                    });
                });
    }catch(e) {
        console.log(e);
    }
}*/






function Picture(obj){
    this._init(obj);
}

Picture.prototype = new Type();
Picture.prototype.types=["id","src","snippet","name","thumbnail","collectName"];

/*
Picture.prototype.save = function(callback){
    if(typeof this.collectName == "undefined") {
        return callback("picture save faild ,not collectName for save",null);
    }
    var table_name = this.collectName;
    var data  = this.toJson();
    delete data.collectName;
    console.log(data);
    this.store.create(table_name,data,callback);
}
*/

Picture.query = function(filter,options,callback) {
    var collectName = filter.collectName;
    delete filter.collectName;
    Type.dbQuery(collectName,filter,options,function(err,data){
        callback(err,data[0]);
    });

}

function Pictures(){
}

Pictures.query = function(filter,options,callback) {
    var collectName=filter.collectName;
    delete filter.collectName;
    console.log(collectName);
    Type.dbQuery(collectName,filter,options,callback);
}

function Article(obj) {
    this._init(obj);
    this.collectName = Article.table_name;
}

Article.prototype = new Type();
Article.prototype.types=['id','title','content','oppose','favor','createTime','lookTimes','collectName'];
/*
Article.prototype.save = function(callback) {
    //var table_name = this.collectName;
    var table_name = Article.table_name;
    var data = this.toJson();
    delete data['collectName'];
    this.store.create(table_name,data,callback);
}*/

Article.table_name="articles";

Article.query = function(filter,options,callback){
    var table_name = Article.table_name;
            console.log(table_name);
    Type.dbQuery(table_name,filter,options,function(err,data){
            console.log(err);
            console.log(data[0]);
        callback(err,data[0]);
    });
}


function Articles(){
}

Articles.query = function(filter,options,callback){
    var table_name = "articles";
    Type.dbQuery(table_name,filter,options,callback);
}
Articles.count = function(filter,options,callback) {
    var table_name = "articles";
    var db_type =g_functions.GetDB(DB_MONGO);
    var argu = [].slice.call(arguments,0);
    argu.unshift(table_name);
    //db_type.count(table_name,filter,options,callback);
    db_type.count.apply(db_type,argu);
}

function PictureList() {
}

function Comment(obj) {
    this._init(obj);
}

Comment.prototype = new Type();
Comment.prototype.types=['author','content','id','replyId','aboutId','publishTime','comment','title','collectName'];

Comment.prototype.getTableName = function(){
    var table_name = this.collectName+"_"+"comments";
    return table_name;
}

/*
Comment.prototype.save = function(callback) {
    var table_name = this.collectName+"_"+"comments";
    var data = this.toJson();
    delete data['collectName'];
    this.store.create(table_name,data,callback);
}*/

function Comments(){
}

Comments.query = function(filter,options,callback){
    var table_name = "article_comments";
    Type.dbQuery(table_name,filter,options,callback);
}

function PictureListElement(obj){
    this._init(obj);
    var save = this.save;
    var self = this;
    this.save = function(callback) {
        try{
            this.exists(function(result) {
                    if(result != false) {
                       return callback("data is exists");
                    }
                    save.call(self,function(){
                        self.store.addTable(self.name,callback);
                        });
                    });
        }catch(e) {
            console.log(e);
        }
    }
}


PictureListElement.table_name = "pictureList"
PictureListElement.prototype = new Type();
PictureListElement.prototype.types=['id','title','name','collectName'];

/*
PictureListElement.prototype.modify = function(callback) {
    this.exists(function(result){
            if(result != false) {
            console.log("data not exists");
            return callback("data not exists");
            }
            return this.update(callback);
            });
}*/


PictureListElement.prototype.exists = function(callback){
    /*var data=null;
    if(arguments.length == 2) {
        data = filter;
    } else {
        data = this.toJson();
        callback = filter;
        data={};
        data[this.collectKey] = this[this.collectKey];
    }*/
    
    if(typeof this[this.collectKey] == "undefined") {
        return callback(false);
    } else {
        var data={};
        data[this.collectKey] = this[this.collectKey];
    }

    var table_name = this.getTableName();
    delete data.collectName;
    this.store.count(table_name,data,function(err,result) {
            console.log("269-------------------------");
            console.log(err);
            console.log("-------------------------");
            callback(result != 0);
            });
}





PictureList.table_name = "pictureList"
PictureList.query = function(filters,options,callback) {
    var table_name = PictureList.table_name;
    Type.dbQuery(table_name,filters.options,callback);
    
}

function User(obj){
    this._init(obj);
}

User.table_name = "userInfo";
User.prototype = new Type();
User.prototype.types=['name','password'];
User.query = function(filters,options,callback) {
    var table_name = User.table_name;
    Type.dbQuery(table_name,filters,options,callback);
}




function Rsses(){
}
Rsses.table_name = "rsses";
Rsses.query = function(filters,options,callback) {
    var table_name = Rsses.table_name;
    Type.dbQuery(table_name,filters,options,callback);
}



function WebInfo(obj){
    if(WebInfo.instance != null) {
        return WebInfo.instance;
    }
   this._init(obj);
}

WebInfo.prototype = new Type();
WebInfo.prototype.types=['_id','pv','lastIp','lastTime'];
WebInfo.table_name = "webInfo";
WebInfo.query = function(filter,options,callback) {
    var table_name = WebInfo.table_name;
    Type.dbQuery(table_name,filter,options,callback);
}

WebInfo.restore = function(filter,callback) {
    if(WebInfo.instance != null) {
        return callback(null,WebInfo.instance);
    }
    try{
        WebInfo.query(filter,{},function(err,result) {
                var web=null;
                if(WebInfo.instance != null) {
                web= WebInfo.instance;
                }else {
                web = new WebInfo(result[0]);
                WebInfo.instance = web;
                }
                return callback(null,web);
                });
    }catch(e) {
        console.log(e);
        return;
    }
}

WebInfo.prototype.updateLastIp = function(str) {
    this.set('lastIp',str);
}

WebInfo.prototype.updatePv = function(){
    this.pv++;
    this.addSkip('pv');
}

WebInfo.prototype.updateLastTime = function(){
    var d = new Date();
    this.set('lastTime',d);
}
WebInfo.prototype.updateState = function(req){
    this.updateLastIp(req.ip);
    this.updatePv();
    this.updateLastTime();
    try{
    this.modify(function(err,result){
            });
    }catch(e){
        console.log(e);
    }
}

/*
WebInfo.prototype.save = function(callback){
    this.db.save(this.table_name,this.toJson(),callback);
}


//考虑value 是对象的情况
WebInfo.prototype.update = function(key,value) {
    var data=eval("({"+key+":'"+value+"'})");
    this[key]=value;

    this.db.updateValue(this.table_name,{_id:this._id},data,function(err,data){
        console.log(err);
    });
}*/

/*
WebInfo.prototype.incPv = function(){
    var self = this;
    this.db.inc(this.table_name,{"_id":this._id},'pv',function(err,data){
            console.log(data);
        self['pv'] = self['pv']+1;
    });
}*/


WebInfo.instance = null;
WebInfo.getInstance  = function(){
    if(WebInfo.instance == null) {
        WebInfo.instance = new WebInfo();
    }
    return WebInfo.instance;
}

exports.Picture = Picture;
exports.Article = Article;
exports.PictureList = PictureList;
 exports.PictureListElement=PictureListElement;
exports.Comment = Comment;
exports.Comments = Comments;
exports.WebInfo = WebInfo;
exports.Articles=Articles;
exports.Pictures = Pictures;
exports.Rsses = Rsses;
exports.BaseType = Type;
exports.Factory=function(type) {
    switch(type) {
        case "WebInfo":
            return exports.WebInfo;
        break;
    case "Articles" :
        return exports.Articles;
        break;
    case "Article":
        return exports.Article;
        break;
    case "Comment":
        return exports.Comment;
        break;
    case "Comments" :
        return exports.Comments;
        break;
    case "PictureList" :
        return exports.PictureList;
        break;
    case "PictureListElement":
        return exports.PictureListElement;
        break;
    case "Pictures" :
        return exports.Pictures;
        break;
    case "Picture" :
        return exports.Picture;
        break;
    case "Rss" :
        return $Model('rss');
        break;
    case "Rsses" :
        return exports.Rsses;
        break;
    case "BaseType":
        return exports.BaseType;
        break;
    case "User":
        return User;
        break;
    case "twitter":
        return $Model('twitter');
        break;
    default:
        return {err:"not object type in type","type":type};
    }
};






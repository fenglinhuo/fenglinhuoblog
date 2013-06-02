
var WebInfo_Type = require('./types').WebInfo;

function webInfo(){
    this.webInfo = WebInfo_Type.getInstance();

}

webInfo.prototype.toJson = function(){
    return this.webInfo.toJson();
}

webInfo.prototype.incPv = function(){
    this.webInfo.incPv(function(err,data){
        if(err != null) {
            console.log("update pv err: "+err);
        }
    });
}
webInfo.prototype.updateTime = function(){
    this.webInfo.update("lastTime",new Date());
}
webInfo.prototype.updateLastIp = function(ip){
    this.webInfo.update('lastIp',ip);
}
webInfo.prototype.updateState = function(ip){
    this.incPv();
    this.updateLastIp(ip);
    this.updateTime();
}


exports = module.exports = new webInfo();

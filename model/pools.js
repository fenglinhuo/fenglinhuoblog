var Events = require('events').EventEmitter;

function Pools(){
    this.pools =[];
    this._isAllowRun=false;
    this.init();
}

Pools.prototype.init = function() {
    var self = this;
    this.registerPoolsEvent("stop",function(){
            self.stop();
            });
    this.registerPoolsEvent("start",function(){
            self.start();
            });
    this.registerPoolsEvent("addEvent",function(callback){
            self.addEvent(callback);
            });
}

Pools.prototype.addEvent = function(callback) {
    this.push(callback);
}

Pools.prototype.registerPoolsEvent = function(EventName,callback){
    this.on(EventName,callback);
}

Pools.prototype.stop = function(){
    this._isAllowRun = false;
}

Pools.prototype.start = function(){
    this._isAllowRun = true;
    this.dispatch();
}

Pools.prototype.isAllowRun=function(){
    console.log("isAllowRun "+this.pools.length);
    if(this.pools.length >0 && this._isAllowRun) {
        return 1;
    } else {
        return 0;
    }
}

/*private*/
Pools.prototype.push = function(callback){
    return this.pools.push(callback);
}

/*private*/
Pools.prototype.pop = function(){
    return this.pools.pop();
}



Pools.prototype.dispatch = function(){
    var handle;
    var self = this;
    process.nextTick(function pump(){
            try{

            if(self.isAllowRun()) {
            handle = self.pop();
            handle();
            process.nextTick(pump);
            }

            }catch(e){
            console.log(e);
            }

            });
}

Pools.prototype.__proto__ = Events.prototype;



exports = module.exports = Pools;

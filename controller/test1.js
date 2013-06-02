test = [];
test.get = new Object();
test.get[1] = function(req,res,next){
    res.write("hellp test1 ");
    res.end();
}
test.get[2] = function(req,res,next){
    res.write("hellp test2 ");
    res.end();
}
test.get['test2'] = function(req,res,next) {
    res.write("hellp test2 ");
    res.end();
}
test.get['test3'] = function(req,res,next) {
    console.log("/////////data");
    console.log("dadad");
    console.log(req.method);
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    console.log("///////////////data");
    res.write("hellp tes32:params id:"+req.params['id']+",user:"+req.params['user']);
    res.end();
}

exports = module.exports = test;

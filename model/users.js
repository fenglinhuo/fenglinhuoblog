var user_arr  = [{'user':'bjn','passwd':'51022222'}];
function users(){
}

users.prototype.isExist = function(user,callback) {
    var exists = false;
    console.log(user);
    user_arr.forEach(function(value) {
        if(user.user == value.user && user.passwd == value.passwd) {
            exists = true;
        }
    });
    callback(null,exists);
}


exports = module.exports = new users();

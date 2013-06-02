
function GetDB(TYPE){
    if(TYPE == DB_MONGO){
        return require("./Mongodb");
    }
}
DB_MONGO=1;

function IsLogin(req) {
    if(typeof req.session.user != "undefined" &&  req.session.user.isLogin == true){
        return true;
    } else {
        return false;
    }
}

function AuthUser(user,passwd) {

}

exports.GetDB = GetDB;
exports.AuthUser = AuthUser;
exports.IsLogin=IsLogin;

var USER_NO_LOGIN="用户没有登录";
var USER_INFO_ERROR="获取用户信息错误";
var USER_HOME_INFO_ERROR="获取登录用户信息失败";
var USER_USER_TWITTER_ERROR="刷新用户twitter 失败";
var USER_USER_MENTIONS_ERROR="刷新用户@ 信息失败";
var default_ERROR="未知错误";


error[601]=USER_NO_LOGIN;
error[602]=USER_INFO_ERROR;
error[603]=USER_HOME_INFO_ERROR;
error[604]=USER_USER_TWITTER_ERROR;
error[607]=USER_USER_MENTIONS_ERROR;
error[699] = default_ERROR;


function error(num){
    if(arguments.length == 0) {
        num=699;
    }
    var err_dom = $('<div class="alert alert-error alert-block navbar-fixed-top">'+'<button type="button" class="close" data-dismiss="alert">&times;</button>'+'<h4>Warning!</h4>'+error[num]+"</div>");
    $(document.body).append(err_dom);
    setTimeout('$(".alert").alert("close")',5000);
}

function handleTwitterStatus(state){
    if(state.status == "error") {
        if(typeof error[state.errnum] != "undefined") {
            error(state.errnum);
            return false;
        } else {
            error();
            return false;
        }
    } else {
        return true;
    }
}




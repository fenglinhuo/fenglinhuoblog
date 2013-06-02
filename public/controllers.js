'use strict';

/* Controllers */

var curr_scope;
function PhoneListCtrl($scope, Phone) {
  $scope.phones = Phone.query();
  $scope.orderProp = 'id';
}

function flushCommits($scope,Comment,_acticleId) {
    var comments = Comment.query({id:_acticleId},function(){
        $scope.comments = comments;
        var comment_sum=0;
        comments.forEach(function(value){
            if(typeof value.comments == 'object') {
            comment_sum+=value.comments.length;
            }
            });

        $scope.replyNum = comments.length+comment_sum;
    });
}

function articleContent($scope,Article,$routeParams,Comment){
    curr_scope = $scope;
    $scope.replyDiv = $("#replyDiv2");
    var _articleId = $routeParams.articleId;
    var item=Article.query({id:$routeParams.articleId},function(){
        $scope.title=item.title;
        $scope.content = markdown.toHTML(decodeURI(item.content));
        $scope.createTime = item.createTime.toString();
        $scope.favor = item.favor;
        $scope.oppose = item.oppose;
        $scope.lookTimes = item.lookTimes;
        $scope.articleId = item._id;
    });

    $scope.setFavor = function(Id){
        Article.setFavor({articleId:Id},function(){
            $scope.favor = $scope.favor+1;
        });
    };

    $scope.setOppose = function(Id) {
        Article.setOppose({articleId:Id},function(){
            $scope.oppose = $scope.oppose+1;
        });
    };

    $scope.converTime=function(time) {
        time = new Date(time);
        var year=time.getFullYear();
        var month=time.getMonth()+1;
        var date=time.getDate();
        var hour=time.getHours();
        var minute=time.getMinutes();
        var second=time.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    };

    $scope.submit_comments =function(Id) {
        var comment = $scope.comment;
        if(typeof comment == "undefined" || comment.match(/^\s*$/)) {
            alert("内容不能为空");
            return ;
        }
        var authorName=$scope.author;
        var replyTitle = $scope.replyTitle;
        var replyTo = $scope.replyTo;
        authorName = authorName == undefined || authorName == "" ? "anyone" : authorName;
        var comments = Comment.put({id:Id,author:authorName,content:comment,aboutId:$scope.articleId,
                title:replyTitle,replyId:replyTo},function(){
                flushCommits($scope,Comment,_articleId);

                $("#tmp").append($scope.replyDiv);

                });
        resetStatus($scope);
    };
    $scope.replyUser="";

    flushCommits($scope,Comment,_articleId);
}

function resetStatus($scope){
    $scope.replyTitle='';
    $scope.replyTo=null;
    $scope.author="";
    $scope.comment="";
}

function reply(ele,replyId,replyUser) {
    var scope = curr_scope;
    var replyDiv = scope.replyDiv;
    $("#"+ele).append(replyDiv);
    scope.replyUser = replyUser;
    scope.replyTitle = "@"+replyUser;
    scope.replyTo = replyId;
    scope.isReply=true;
};


function editorCtrl($scope) {
    $scope.$emit('title',"编辑文章");
}

function articlesCtrl($scope,Article,$location) {

    var r =  Article.query({id:"sum"},function(){
        $scope.sum=r.value;
    });
    $scope.start=0;
    $scope.skip=10;
    $scope.currpage=0;
    $scope.next=$scope.currpage+1;


    $scope.getContent = function(Id) {
        var item = Article.query({id:Id},function(){
            $scope.article = item;
            $("#acticleContent").modal('show');
        });
    }

    $scope.enterContent = function(id) {
        $location.path("/articleContent/"+id);
    }

    $scope.range = function(){
        var skip = $scope.skip;
            var l=[];
            for(var i =0;i<this.sum;i+=skip) {
                l.push(i/skip);
            }
            return l;
    }
    $scope.getList=function(n){
        var s=n*this.skip;
        var e=s+this.skip;
        if( n == -1 || n > ($scope.sum)/($scope.skip)) {
            return null;
        }
        var items = Article.query({id:s+'-'+e},function(){
            items.users.forEach(function(item) {
                item.content = markdown.toHTML(decodeURI(item.content));
            });

            $scope.users=items.users;
            $scope.currpage=n;
            $scope.prev = n-1;
            if($scope.prev == -1) {
                $("#prev").removeClass();
                $("#prev").addClass("disabled");
            } else {
                $("#prev").removeClass();
                $("#prev").addClass("active");

            }
            $scope.next = n+1;
            if($scope.next > ($scope.sum)/($scope.skip)) {
                 $("#next").removeClass();
                $("#next").addClass("disabled");
            }else {
                $("#prev").removeClass();
                $("#prev").addClass("active");
            }
        });
    }

    /*var items = Article.query({id:$scope.start+"-"+$scope.skip},function(){
        $scope.users = items.users;
    });*/
    $scope.getList(0);
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function PhoneDetailCtrl($scope, $routeParams, Phone) {

}

function PictureCtrl($scope,Phone) {
    /*
    var item = Phone.query(function(){
            var rows=[];
            var g=0;
            var cur=0;
            for(var i in item) {
            if(g%4 == 0) {
            cur = g/4;
            rows[cur]=[];
            rows[cur].push(item[i]);
            } else {
            rows[cur].push(item[i]);
            }
            g++;
            }
            $scope.ps = rows;
            $scope.item = item;
            $scope.p_listName="phones";
        $("#mytab li:eq(0) a").tab('show');

            });*/

    $scope.getPicture = function(id){
       /* for(var i in $scope.item) {
            if($scope.item[i].id == id) {
                $scope.pictureInfo = $scope.item[i];
                break
            }
        }*/

        $scope.pictureInfo = $scope.item[id];
        $scope.curId = parseInt(id);
    };
    $scope.getContent = function(name) {
        var item = Phone.query({phoneId:name},function(){
            var rows=[];
            var g=0;
            var cur=0;
            for(var i in item) {
            item[i]['id']=i;
            if(g%4 == 0) {
            cur = g/4;
            rows[cur]=[];
            rows[cur].push(item[i]);
            } else {
            rows[cur].push(item[i]);
            }
            g++;
            }
            $scope.ps = rows;
            $scope.item = item;
            $scope.p_listName = name;
        });

    };

    $scope.Next = function(){
        var curid = parseInt($scope.curId)+1;
        if(curid == $scope.item.length) {
            curid=0;
        }
        $scope.curId = curid;
        $scope.getPicture(curid);
        //$scope.pictureInfo = $scope.item[curid];
    }
    $scope.Prev = function(){
        var curid = parseInt($scope.curId)-1;

        if(curid<0) {
            curid=$scope.item.length-1
        }
        $scope.curId = curid;
        $scope.getPicture(curid);
       // $scope.pictureInfo = $scope.item[curid];
    }
/*    $scope.panes=[
    {title:"phones",name:"phones"},
    {title:"peoples",name:"peoples"}
        ];*/
}

function uploadPictureCtrl($scope,Picture) {
    
   $scope.$emit('title',"上传图片");
    var plist = Picture.queryList(function(){
        $scope.plist = plist;
    });
}


function rssCtrl($scope,Rss,RssList){
    var rssList = RssList.query(function(){
        $scope.rssList = rssList;
    });

    $scope.getRssContent = function(name) {
        var rssinfo = Rss.query({"name":name},function(){
            $scope.rsses = rssinfo.items;
            $scope.info   = rssinfo.info;
            $scope.info.pubDate= new Date(rssinfo.info.pubDate);
        });
    }
}

function handleTwitterData(tws){
    tws.forEach(function(value) {
        value.created_at = new Date(value.created_at);
        var entities = value.entities;
        var pictureUrl=false;
        for(var p in entities.urls) {
        var reg= new RegExp(entities.urls[p].url,"g");
        var regPic = new RegExp(/.*(\.)(jpg|png)\s*$/);
        value.text = value.text.replace(reg,function(match,index){
            if(entities.urls[p].expanded_url.match(regPic)) {
            pictureUrl = entities.urls[p].expanded_url;
            }
            return "<a href='"+entities.urls[p].expanded_url+"' target='_blank'>"+match+"</a>";
            });
        }
        value.pictureUrl=pictureUrl;
        });
    return tws;
}

function twitterInit($scope) {
    if($scope.isLogin) {
        $scope.switchLoadState(true);
        $scope.homeUserInfo(function(){
                var tws = Twitter.query(function(){
                    if(!handleTwitterStatus(tws)) {
                        return;
                    }

                    $scope.lastId= tws.data[tws.data.length-1].id;
                    $scope.tws = tws.data;
                    handleTwitterData($scope.tws);

                    $scope.switchLoadState(false);
                    //$scope.updateUserInfo($scope.home_user);
                    //$scope.currUser = $scope.home_user;
                    });
                });
    } else {
        $scope.getOwnTwitter();
    }
}

function twitterCtrl($scope,Twitter,$rootScope,$controller){
    $scope.switchLoadState = function(bl) {
        $scope.loadding=bl;
    }

    $scope.switchFlushState = function(bf){
        $scope.flushing=bf;

    };


    $scope.updateUserInfo = function(name){
        var userInfo = Twitter.userInfo({userName:name},function(){
            $scope.currUserInfo = userInfo;
        });
    }

    $scope.homeUserInfo = function(callback){
        if(arguments.length == 0) {
            callback = function(){
            }
        }
        Twitter.homeInfo(function(data) {
                handleTwitterStatus(data)
                $scope.currUserInfo = data;
                $scope.currUser = data.screen_name;
                $scope.homeUser = data.screen_name;
                callback();
                });
    }

    $scope.lastId=0;
    //$scope.flushCtrl = "homeLineCtrl";

    $controller(homeLineCtrl,{$scope:$scope});

    $scope.getLast = function(){
        $controller(homeLineCtrl,{$scope:$scope});
        $scope.switchLoadState(true);
        var tws = Twitter.query(function(){
            if(!handleTwitterStatus(tws)) {
                return;
            }
        
            $scope.lastId= tws.data[tws.data.length-1].id;
            $scope.tws = tws.data;
            handleTwitterData($scope.tws);
            $scope.switchLoadState(false);
            //$scope.updateUserInfo($scope.home_user);
            $scope.homeUserInfo();
            //$scope.currUser = $scope.home_user;
        });
    };

    $scope.getTwitterByUser = function(name){
        $scope.currUser=name;
        $controller(userTwitterCtrl,{$scope:$scope});
        $scope.switchLoadState(true);
        var tws = Twitter.twitterByUser({userName:name},function(){
            if(!handleTwitterStatus(tws)) {
                return;
            }

            $scope.methodLastId= tws.data[tws.data.length-1].id;
            $scope.tws = tws.data;
            handleTwitterData($scope.tws);
            /*$scope.tws.forEach(function(value) {
                value.created_at = new Date(value.created_at);
            });*/
            $scope.switchLoadState(false);

        });
       $scope.updateUserInfo($scope.currUser);
    }

    $scope.getOwnTwitter = function(){
        $scope.homeUserInfo(function(){
                $scope.currUser=$scope.homeUser;
                $scope.switchLoadState(true);
                var tws = Twitter.twitterByUser({userName:$scope.homeUser},function(data){
                    if(!handleTwitterStatus(tws)) {
                        return;
                    }
                    $scope.methodLastId= data.data[data.data.length-1].id;
                    $scope.tws = data.data;
                    /*
                    $scope.tws.forEach(function(value) {
                        value.created_at = new Date(value.created_at);
                        });*/

                    handleTwitterData($scope.tws);
                    $scope.switchLoadState(false);
                    });
                $controller(userTwitterCtrl,{$scope:$scope});
                });
    }

    $scope.rtTwitter = function(user,content) {
        $scope.twitterContent = "rt "+"@"+user+" "+content;
        $("#twitterEdit").focus();
    }

    $scope.postTwitter = function(){
        var result = Twitter.postTwitter({content:$scope.twitterContent},function(){
            $scope.twitterContent="";
            if(result.statusCode != "403") {
                alert("success");
            } else {
                alert(result.data);
            }
        });
    }

    $scope.methodLastId=0;
    $scope.getMention = function() {
        $controller(mentionsCtrl,{$scope:$scope});
        $scope.switchLoadState(true);

        var tws=Twitter.query({method:"mentions"},function(){
                $scope.methodLastId = tws.data[tws.data.length-1].id;
                if(!handleTwitterStatus(tws)) {
                    return;
                }

                /*
                tws.forEach(function(value) {
                    value.created_at = new Date(value.created_at);
                    });*/

                handleTwitterData(tws.data);
                $scope.tws = tws.data;

                $scope.switchLoadState(false);
                });
        //$scope.flushCtrl = mentionsCtrl;
    }
    $scope.showUserInfo = function(user) {
        $scope.user = user;
    }
    twitterInit($scope);

    //$('#myModal').modal();

}

function userTwitterCtrl($scope,Twitter) {
    $scope.getBefore=function(){
        $scope.switchFlushState(true);
        var tws = Twitter.twitterByUser({userName:$scope.currUser,max_id:$scope.methodLastId},function(){
            if(!handleTwitterStatus(tws)) {
                return;
            }
            $scope.methodLastId= tws.data[tws.data.length-1].id;

            handleTwitterData(tws.data);

            $scope.tws = $scope.tws.concat(tws.data);
            $scope.switchFlushState(false);
        });
    };
}

function mentionsCtrl($scope,Twitter) {
    $scope.getBefore=function(){
        $scope.switchFlushState(true);
        var tws = Twitter.query({method:"mentionsBefore",max_id:$scope.methodLastId},function(){
            if(!handleTwitterStatus(tws)) {
                return;
            }
            $scope.lastId= tws.data[tws.data.length-1].id;
            /*
            tws.forEach(function(value) {
                value.created_at = new Date(value.created_at);
            });*/
            handleTwitterData(tws.data);

            $scope.tws = $scope.tws.concat(tws.data);
            $scope.switchFlushState(false);

        });
    };
}


function homeLineCtrl($scope,Twitter) {

    $scope.getBefore=function(){
        $scope.switchFlushState(true);
        var tws = Twitter.query({method:"before",max_id:$scope.lastId},function(){
            if(!handleTwitterStatus(tws)) {
                return;
            }
            $scope.lastId= tws.data[tws.data.length-1].id;
            handleTwitterData(tws.data);
            $scope.tws = $scope.tws.concat(tws.data);
            $scope.switchFlushState(false);
        });
    };
}

function userPanelCtrl($scope){
    $scope.getSettingContent = function(url) {
        $scope.setting=url;
    }
    $scope.$on('title',function(event,title){
        $scope.title=title;
    });
    $scope.$on('changeSrc',function(event,src) {
            $scope.setting = src;
            });
}

function userPassCtrl($scope,User) {
    $scope.$emit("title","用户密码设置");
    $scope.submit = function(){
        User.setPasswd({name:$scope.name,passwd:$scope.passwd},function(result){
                });
    }
}

function settingRssCtrl($scope,RssList,Rss) {
    $scope.$emit("title","RSS 设置");
    var rsses = RssList.query(function(){
        $scope.rsses = rsses;
    });
    $scope.addRss=function(){
      //  $scope.rsses.unshift([]);
      $scope.isAdd = true;
    }
    $scope.save = function(name,url){
        Rss.save({"name":name,"url":url},function(){
            $scope.isAdd = false;
            $scope.add_title="";
            $scope.add_url ="";
            var rsses = RssList.query(function(){
                $scope.rsses = rsses;
            });
        });
    }

    $scope.mod = function(key,name,url) {
        Rss.mod({"key":key,"name":name,"url":url},function(){
            var rsses = RssList.query(function(){
                $scope.rsses = rsses;
            });
        });
    }

    $scope.del = function(key) {
        Rss.del({"key":key},function(){
            var rsses = RssList.query(function(){
                $scope.rsses = rsses;
            });
        });
    }
}

function settingPictureListCtrl($scope,Picture){
    $scope.$emit("title","图片列表");
    var plist = Picture.queryList(function(){
        $scope.PictureList = plist;
    });

    $scope.addList = function(){
        //$scope.PictureList.unshift({});
        $scope.isAdd = true;
    };

    $scope.del = function(title,name){
        Picture.del({"title":title,"name":name},function(){
            Picture.queryList(function(res){
                $scope.PictureList = res;
            });
        });
    }

    $scope.mod = function(key,title,name) {
        var data={"key":key,"title":title,"name":name};
        Picture.mod(data,function(){
                Picture.queryList(function(res){
                    $scope.PictureList = res;
                    });

                });
    }

    $scope.save = function(title,name) {
        var data={"title":title,"name":name};
        if(typeof key == 'undefined') {
            delete data['key'];
        }

        Picture.save(data,function(){
            Picture.queryList(function(res){
                $scope.PictureList = res;
            });
            $scope.isAdd=false;
            $scope.add_title="";
            $scope.add_name="";
        });
    }
}

function authTwitterCtrl($scope,Twitter) {
    $scope.authTwitter = function(){
        $scope.$emit('changeSrc','/twitter/requestToken');
    }
    $scope.submitChange = function(authToken,authToken_secret){
        Twitter.changeToken({token:authToken,token_secret:authToken_secret},function(data){
                alert(data);
                });
    }
    Twitter.getToken(function(data){
            handleTwitterStatus(data);
            $scope.oauth_access_token=data.access_token;
            $scope.oauth_access_token_secret = data.access_secret;


            });
}



//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];

'use strict';

/* Services */

angular.module('phonecatServices', ['ngResource']).
    factory('Phone', function($resource){
  return $resource('/picture/show/?name=:phoneId', {}, {
    query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
  });
}).factory("Article",function($resource){
        return $resource('/article/content/:id',{},{
            query:{method:'GET',params:{id:'@id'}},
               getSum:{method:'GET',params:{act:"sum"}},
               setFavor:{method:'GET',params:{id:'favor'}},
               setOppose:{method:'GET',params:{id:'oppose'}}
        });
    }).factory("Comment",function($resource){//查询返回是数组的话必须加上 isArray:true
    return $resource('/article/comment?id=:id',{},{
        query:{method:'GET',params:{id:'@id'},isArray:true},
           put:{method:'POST',params:{id:'@id'}}
    });
}).factory("Rss",function($resource){
        return $resource('/rss/:act',{},{
            query:{method:'GET',params:{act:"listContent",name:'@rssName'}},
               save:{method:'POST',params:{act:"save"}},
               del:{method:'GET',params:{act:'del'}},
               mod:{method:'GET',params:{act:'mod'}}
        });
    }).factory("RssList",function($resource){
    return $resource('/rss/list',{},{
        query:{method:'GET',isArray:true}
    });
}).factory('Twitter',function($resource){
        return $resource('/twitter/act/:method',{},{
            query:{method:'GET',params:{method:'Last'}},
               postTwitter:{method:'POST',params:{method:'postTwitter'}},
               twitterByUser:{method:'GET',params:{method:'twitterByUser'}},
               userInfo:{method:'GET',params:{method:'userInfo'}},
               changeToken:{method:'POST',params:{method:'changeToken'}},
               getToken:{method:'GET',params:{method:'getToken'}},
               homeInfo:{method:'GET',params:{method:'getHomeInfo'}}
        });
        }).factory('Picture',function($resource){
            return $resource('/picture/:act',{},{
queryList:{method:'GET',params:{act:'list'},isArray:true},
save:{method:'GET',params:{act:'addlist'}},
del:{method:'GET',params:{act:'dellist'}},
mod:{method:'GET',params:{act:'modlist'}}
});
            }).factory('User',function($resource) {
                return $resource('/user/:act',{},{
setPasswd:{method:'POST',params:{act:'setPasswd'}}
                    });
                });












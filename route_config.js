exports = module.exports = [
{reg:"/test1/test3/:id/:user"},
{reg:"/blog/body1",method:"get",action:"blog.body"},
{reg:"/picture/index",method:"get",action:"picture.index"},
{reg:"/article/content/:start(\\d+)-:end(\\d+)",method:"get",action:"article.list"},
{reg:"/article/showContent"},
//{reg:"/article/content/sum",method:'get',action:'article.sum'},
{reg:"/article/content/:method(\\w+)",action:"article.dispath"},
{reg:"/article/content/:id",method:"get",action:"article.content"},
{reg:"/saveArticle",method:"post",action:"article.saveArticle"},
{reg:'/editorArticle',method:"get",action:"article.editorArticle"},
{reg:'/rss',method:"get",action:"rss.index"},
{reg:'/twitter',method:'get',action:'twitter.index'},
{reg:'/twitter/act/:method',method:"get",action:"twitter.act"},
{reg:'/twitter/act/:method',method:"post"},
{reg:'/userPanel/*',action:"userpanel.check"},
{reg:"/userPanel/index",action:"userpanel.index"}

]

'use strict';

/* App Module */

angular.module('phonecat', ['phonecatFilters', 'phonecatServices','ngSanitize']).
  config(['$routeProvider','$provide', function($routeProvider,$provider) {
  $routeProvider.when('/body1', {templateUrl: '/blog/body1',controller: articlesCtrl}).
      when('/body1/:id',{templateUrl:'body1',controller:articlesCtrl}).
      when('/picture',{templateUrl:'/picture/index',controller:PictureCtrl}).
      when('/articleContent/:articleId',{templateUrl:'/article/showContent',controller:articleContent}).
      when('/editor',{templateUrl:'/editorArticle',controller:editorCtrl}).
      when('/uploadPicture',{templateUrl:'/picture/uploadPicture',controller:uploadPictureCtrl}).
      when('/rss',{templateUrl:'/rss',controller:rssCtrl}).
      when('/twitter',{templateUrl:'/twitter',controller:twitterCtrl}).
      when('/userpanel',{templateUrl:'/userpanel/index',controller:userPanelCtrl})
      .otherwise({redirectTo: '/body1'});
}]);

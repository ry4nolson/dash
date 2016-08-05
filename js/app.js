var app = angular.module('mobileDash', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar'
]).run(function ($rootScope, $route, $location, $animate, Utility) {

  function getRedirectUrl(){
    if (location.host.indexOf("localhost") > -1)
      return "http://localhost:8000/auth.html";
    return "https://mobiledash.co/auth.html";
  }

  $rootScope.oauth = {
    authenticated: localStorage.getItem("authenticated"),
    domain: localStorage.getItem('domain'),
    authUrl: '/api/oauth',
    app_id: 'dbe3478d-c559-4f93-b686-532bbe2bdffb',
    scope: 'read_people,read_orders,read_catalog,read_marketing,system',
    redirect_uri: encodeURIComponent(getRedirectUrl()),
    refresh_token: localStorage.getItem('refresh_token'),
    access_token: localStorage.getItem('access_token'),
    signature: localStorage.getItem('signature'),
    auth_id: localStorage.getItem('oauth_auth_id'),
    code: localStorage.getItem('oauth_code'),
    client_id: localStorage.getItem('oauth_client_id'),
    secret: localStorage.getItem('oauth_secret')
  }
  $rootScope.location = $location
  var date = new Date();
  var now = new Date();
  var endDay = new Date();
  $rootScope.requestCount = 0;

  $rootScope.oauth.authenticated = false;

  date.setTime(Utility.setDateTime(date, 0, 0, 0, 0));
  endDay.setTime(Utility.setDateTime(endDay, 23, 59, 59, 50));

  var dayOffset = (24 * 60 * 60 * 1000);
  $rootScope.dayOffset = dayOffset;

  var compareDate = new Date();
  compareDate.setTime(date.getTime() - dayOffset);

  $rootScope.date = date;
  $rootScope.endDay = endDay;
  $rootScope.compareDate = compareDate;
  $rootScope.comapreDateNow = new Date(now.getDate() - 1);
  $rootScope.now = now;

  $animate.enabled(true);

  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.requestCount = 0;
    $rootScope.home = false;
  });

  $rootScope.$watch("date", function () {
    var now = new Date();
    var date = new Date($rootScope.date.getTime());

    $rootScope.requestCount = 0;
    $rootScope.compareDate.setTime(date.getTime() - dayOffset);
    // this is hacky in order to get the compare input to update.
    var compareDate = new Date($rootScope.compareDate.getTime());
    $rootScope.compareDate = compareDate;
    $rootScope.now.setTime(date.getTime());
    $rootScope.now.setHours(now.getHours());
    $rootScope.now.setMinutes(now.getMinutes());
    $rootScope.now.setMilliseconds(now.getMilliseconds());
    $rootScope.endDay.setTime(Utility.setDateTime(date, 23, 59, 59, 59));
    $rootScope.now.setHours(now.getHours());
    $rootScope.now.setMinutes(now.getMinutes());
    console.log($rootScope.date, $rootScope.compareDate);
    $route.reload();

    $rootScope.$watch("compareDate", function () {
      var now = new Date();
      $rootScope.compareDateNow = new Date($rootScope.compareDate.getTime());
      $rootScope.compareDateNow.setHours(now.getHours());
      $rootScope.compareDateNow.setMinutes(now.getMinutes());

      $route.reload();

    });
  });

  $rootScope.doLogout = function () {
    localStorage.clear();
    window.location.reload();
  };

  if (!$rootScope.oauth.authenticated) {
    var rdr = $location.path();
    $location.path("/login").search('rdr', rdr);
  }
}).filter("orderObjectBy", function () {
  return function (items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function (item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if (reverse) filtered.reverse();
    return filtered;
  };
}).directive("backLink", function () {
  return {
    template: "<a href=\"javascript:history.go(-1);\">&larr; back</a> | "
  };
});
var app = angular.module('mobileDash', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar'
]);

app.run(function ($rootScope, $route, $location, $animate, Utility) {

  function getRedirectUrl() {
    if (location.host.indexOf("localhost") > -1)
      return "http://localhost:8000/auth.html";
    return "https://mobiledash.co/auth.html";
  }

  $rootScope.storeid = 0;

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

  var comparedate = new Date();
  comparedate.setTime(date.getTime() - dayOffset);

  $rootScope.date = date;
  $rootScope.endDay = endDay;
  $rootScope.comparedate = comparedate;
  $rootScope.comapreDateNow = new Date(now.getDate() - 1);
  $rootScope.now = now;

  $animate.enabled(true);

  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.requestCount = 0;
    $rootScope.home = false;
    $rootScope.login = false;
  });

  $rootScope.$watch("date", function () {
    var now = new Date();
    var date = new Date($rootScope.date.getTime());

    $rootScope.requestCount = 0;
    $rootScope.comparedate.setTime(date.getTime() - dayOffset);
    // this is hacky in order to get the compare input to update.
    var comparedate = new Date($rootScope.comparedate.getTime());
    $rootScope.comparedate = comparedate;
    $rootScope.now.setTime(date.getTime());
    $rootScope.now.setHours(now.getHours());
    $rootScope.now.setMinutes(now.getMinutes());
    $rootScope.now.setMilliseconds(now.getMilliseconds());
    $rootScope.endDay.setTime(Utility.setDateTime(date, 23, 59, 59, 59));
    $rootScope.now.setHours(now.getHours());
    $rootScope.now.setMinutes(now.getMinutes());
    console.log($rootScope.date, $rootScope.comparedate);
    $route.reload();
  });


  $rootScope.$watch("comparedate", function () {
    var now = new Date();
    $rootScope.comparedateNow = new Date($rootScope.comparedate.getTime());
    $rootScope.comparedateNow.setHours(now.getHours());
    $rootScope.comparedateNow.setMinutes(now.getMinutes());
    console.log("compare changed");
    $route.reload();
  });

  $rootScope.$watch("storeid", function(){
    console.log($rootScope.storeid);
    setTimeout(function(){
      $("#storeDD").find("option[value=" + $rootScope.storeid +"]").prop("selected", true);
    }, 500);
    $route.reload();
  });

  $rootScope.doLogout = function () {
    for (var key in localStorage) {
      if (key != "domain") {
        delete localStorage[key];
      }
    }
    window.location.reload();
  };

  $rootScope.doRefresh = function(){
    window.location.reload();
  }

  if (!$rootScope.oauth.authenticated) {
    var rdr = $location.path();
    $location.path("/login").search('rdr', rdr);
  }
});

app.filter("orderObjectBy", function () {
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
});

app.directive("backLink", function () {
  return {
    template: "<a href=\"javascript:history.go(-1);\">&larr; back</a> | "
  };
});

app.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});
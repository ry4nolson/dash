app.factory("ContentFactory", function ContentFactory($rootScope, ApiFactory){
  var exports = {};

  exports.getReviews = function(){
    return ApiFactory.getEndpoint("product_reviews", 
      { 
        "created_at": "gte:" + $rootScope.date.toISOString() + "+AND+lt:" + $rootScope.endDay.toISOString()
      })
  }

  return exports;
})
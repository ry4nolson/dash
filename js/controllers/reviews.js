app.controller("ReviewsController", function ReviewsController($scope, $http, $window, $rootScope, $sce, Utility, ContentFactory, CustomersFactory) {
  ContentFactory.getReviews().then(function(data){
    $scope.reviews = data.product_reviews;

    function getStars(count){
      var ret = "";
      for (var i = 0;i<count;i++)
        ret = ret + "&#9733;";
      return ret;
    }

    for(var review in $scope.reviews){
      var rv = $scope.reviews[review];
      $scope.reviews[review].stars = $sce.trustAsHtml(getStars(rv.overall_rating));
    }
  });
});
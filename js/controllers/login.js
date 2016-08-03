app.controller("LoginController", function LoginController($scope, $rootScope, $location, ApiFactory) {

		function getApiKey() {
		if (localStorage.getItem("apiKey"))
			return localStorage.getItem("apiKey");
		return false;
		}
		function getdomain() {
		if (localStorage.getItem("domain"))
			return localStorage.getItem("domain");
		return false;
		}

	if (getdomain() && getApiKey())
		checkLogin();

	$scope.login = function () {
		console.log("login");
    if (getdomain() && getApiKey()) {
      $rootScope.domain = getdomain();
      $rootScope.apiKey = getApiKey();

			checkLogin();
    }
	}
	function checkLogin() {
		ApiFactory.getEndpoint("/orders?count=1", null, true).then(function () {
			$location.path("/")
		});
	}

})
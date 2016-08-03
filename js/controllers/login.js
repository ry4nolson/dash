app.controller("LoginController", function LoginController($scope, $rootScope, $location, ApiFactory) {

	console.log("login page");


	function checkLogin() {
		console.log("login checking");
		$rootScope.domain = $scope.domain;
		$rootScope.apiKey = $scope.apiKey;
		ApiFactory.getEndpoint("orders", { "count": 1 }, true).then(function () {
			console.log(arguments);
			$rootScope.authed = true;
			localStorage.setItem('domain', $scope.domain);
			localStorage.setItem('apiKey', $scope.apiKey);
			$location.path("/")
		});
	}

	function getApiKey() {
		if ($scope.apiKey) {
			return $scope.apiKey;
		} else if (localStorage.getItem("apiKey")){
			$scope.apiKey = localStorage.getItem("apiKey");
			return localStorage.getItem("apiKey");
		}
		else
			return false;
	}
	function getdomain() {
		if ($scope.domain) {
			return $scope.domain;
		} else if (localStorage.getItem("domain")){
			$scope.domain = localStorage.getItem("domain");
			return localStorage.getItem("domain");
		}
		else
			return false;
	}

	if (getdomain() && getApiKey()) {
		checkLogin();
	}

	$scope.doLogin = function () {
		console.log("login");
		if (getdomain() && getApiKey()) {
			$rootScope.domain = getdomain();
			$rootScope.apiKey = getApiKey();

			checkLogin();
		}
	}

});
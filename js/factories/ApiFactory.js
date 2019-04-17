angular.module("mobileDash")
	.factory("ApiFactory", function ApiFactory($q, $http, $rootScope, $location) {
    'use strict';

    var exports = {};

    exports.data = null;

    exports.domain = $rootScope.oauth.domain;
    exports.apiKey = $rootScope.oauth.access_token;

    exports.buildEndpoint = function (endpoint) {
			return 'https://' + this.domain + "/api/v1/" + endpoint;
    }

    exports.getEndpoint = function (endpoint, params, login) {
			if (!$rootScope.oauth.domain || !$rootScope.oauth.access_token && !login){
				$location.path("/login");
			}
			this.domain = $rootScope.oauth.domain;
			this.apiKey = $rootScope.oauth.access_token;

			var deferred = $q.defer();
			var self = this;

			function query() {
				$http.get(exports.buildEndpoint(endpoint), {
					headers: {
						"Content-Type": "application/json",
						"X-AC-Auth-Token": self.apiKey
					},
					params: params,
					cache: true
				})
					.success(function (data) {
						//console.log(data);
						$rootScope.requestCount++;
						exports.data = data;
						deferred.resolve(data);
					})
					.error(function (data, status, headers, config) {
						var headers = headers();
						//console.log(config);
						//console.log(headers);
						var date = new Date(headers["date"]);
						var retryAfter = new Date(headers["retry-after"]);
						console.log(date, retryAfter);

						if (status == 429)
							setTimeout(query, 1000);
						else if (status == 401){
							if ($rootScope.auth.domain && $rootScope.oauth.refresh_token){
								$rootScope.doRefreshAuth();
							} else {
								$rootScope.doLogout();
								$rootScope.doLogin();
							}
							//$location.path("/login"):
						}
					});
			}

			query();

			return deferred.promise;
    };

    return exports;
  });
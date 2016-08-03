angular.module("mobileDash")
	.factory("ApiFactory", function ApiFactory ($q, $http, $rootScope, $location) {
    'use strict';

    var exports = {};

    exports.data = null;

		function getApiKey(){
			if (localStorage.getItem("apiKey"))
				return localStorage.getItem("apiKey");
			else{
				var apiKey = prompt("Please enter your Spark Pay API key");
				localStorage.setItem("apiKey", apiKey);
				return apiKey;
			}
		}
		function getDomainName(){
			if (localStorage.getItem("domain"))
				return localStorage.getItem("domain");
			else{
				var domain = prompt("Please enter your Spark Pay Secure Domain Name");
				domain = domain.replace(/https*:\/\//, "");
				//force secure
				domain = "https://" + domain;
				localStorage.setItem("domain", domain);
				return domain;
			}
		}

    exports.domain = getDomainName();
    exports.apiKey = getApiKey();

    exports.buildEndpoint = function(endpoint){
    	return this.domain + "/api/v1/" + endpoint;
    }

    exports.getEndpoint = function (endpoint, params){
    	var deferred = $q.defer();
			var self = this;
			
			function query(){
				$http.get(exports.buildEndpoint(endpoint), {
					headers : {
					"Content-Type": "application/json",
					"X-AC-Auth-Token" : self.apiKey
					},
					params: params,
					cache: true
				})
				.success(function(data){
					//console.log(data);
					$rootScope.requestCount++;
					exports.data = data;
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config){
					var headers = headers();
					//console.log(config);
					//console.log(headers);
					var date = new Date(headers["date"]);
					var retryAfter = new Date(headers["retry-after"]);
					console.log(date, retryAfter);

					if (status == 429)
						setTimeout(query, 1000);
				});
			}

			query();

    	return deferred.promise;
    };

    return exports;
  });


// $httpProvider.interceptors.push(function ($q, $injector) {
//     var incrementalTimeout = 1000;

//     function retryRequest (httpConfig) {
//         var $timeout = $injector.get('$timeout');
//         return $timeout(function() {
//             var $http = $injector.get('$http');
//             return $http(httpConfig);
//         }, incrementalTimeout);
//         incrementalTimeout *= 2;
//     };

//     return {
//         responseError: function (response) {
//             if (response.status === 500) {
//                 if (incrementalTimeout < 5000) {
//                     return retryRequest(response.config);
//                 }
//                 else {
//                     alert('The remote server seems to be busy at the moment. Please try again in 5 minutes');
//                 }
//             }
//             else {
//                 incrementalTimeout = 1000;
//             }
//             return $q.reject(response);
//         }
//     };
// });
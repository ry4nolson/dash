angular
	.module("mobileDash")
	.controller('OrderListController', function OrderListController($scope, $http, $window, $rootScope, Utility, OrdersFactory, CustomersFactory) {

		var loadData = function () {
			OrdersFactory.getOrders()
				.then(function (data) {
					console.log(data);
					$scope.orders = {};
					$scope.order_count = data.orders.length;

					var orders = OrdersFactory.parseOrders(data.orders);
					$scope.orders = orders.orders;
					$scope.order_total = orders.total;
					for (var orderid in $scope.orders) {
						$scope.getCustomerData(orderid, $scope.orders[orderid].customer_id);
					}
				});

			// OrdersFactory.getCompareDayOrders().then(function (data) {
			// 	var orders = OrdersFactory.parseOrders(data.orders);
			// 	$scope.yesterday = orders.orders;
			// 	$scope.yesterday_total = orders.total;
			// });

			$rootScope.getTime = function (date) {
				var d = new Date(date);
				var ampm = d.getHours() > 11 ? "pm" : "am";
				var h = d.getHours() > 11 ? d.getHours() - 12 : d.getHours();
				if (h == 0) h = "12";
				var m = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
				return h + ":" + m + ampm;
			};

			$scope.totalItems = OrdersFactory.totalItems;

			$scope.getCustomerData = function (orderid, id) {
				CustomersFactory.getCustomer(id).then(function (data) {
					console.log(data);
					$scope.orders[orderid].customer = data;

					CustomersFactory.getCustomerOrders(id).then(function (data) {
						$scope.orders[orderid].customer.order_count = Utility.getOrdinal(data.orders.length);
					});
				});
			}
		}
		loadData();
		$scope.loadData = loadData;
	});
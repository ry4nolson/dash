app.controller("HomeController", function HomeController($scope, $rootScope, OrdersFactory, OrderItemsFactory, CustomersFactory) {
	$rootScope.currentController = this;
	$rootScope.home = true;
	var exports = {
		loadData: function () {
			OrdersFactory.getOrders().then(function (data) {
				$scope.orders = {};
				$scope.order_count = data.orders.length;

				var orders = OrdersFactory.parseOrders(data.orders);
				$scope.orders = orders.orders;
				$scope.order_total = orders.total;
				for (var orderid in $scope.orders) {
					$scope.getCustomerData($scope.orders[orderid].customer_id);
				}
			});

			OrdersFactory.getCompareDayOrders().then(function (data) {
				var orders = OrdersFactory.parseOrders(data.orders);
				$scope.compare_order_count = orders.length;
				$scope.compare_order_total = orders.total;
				$scope.compare_order_total_tonow = 0;
				$scope.compare_order_count_tonow = 0;

				var compareDate = $rootScope.compareDate;
				var compareDateNow = $rootScope.compareDateNow;

				for(var order in orders.orders){
					var current = orders.orders[order];
					var orderDate = new Date(current.ordered_at);
					//console.log(orderDate, compareDate);
					if (orderDate.getTime() < compareDateNow.getTime()){
						$scope.compare_order_count_tonow++;
						$scope.compare_order_total_tonow += current.grand_total;
					}
				}

			});

			$scope.totalItems = OrdersFactory.totalItems;

			OrderItemsFactory.getOrderItemsForToday().then(function (data) {
				var orders = data.orders;
				var items = {};
				var total = 0;
				for (var order in orders) {
					for (var item in orders[order].items) {
						var oItem = orders[order].items[item];

						if (items[oItem.item_name]) {
							items[oItem.item_name].qty += oItem.quantity;
							items[oItem.item_name].total += (oItem.quantity * oItem.price);
						} else {
							items[oItem.item_name] = {
								id: oItem.product_id,
								name: oItem.item_name,
								qty: oItem.quantity,
								total: (oItem.quantity * oItem.price)
							}
						}
						total += oItem.quantity;
					}
				}
				$scope.total = total;
				$scope.items = items;
			});

			$scope.newCustomers = 0;
			$scope.repeatCustomers = 0;
			$scope.getCustomerData = function (id) {
				CustomersFactory.getCustomerOrders(id).then(function (data) {
					if (data.orders.length == 1) $scope.newCustomers++;
					else $scope.repeatCustomers++;
				});
			}
		}
	}
	exports.loadData();
	return exports;
});
app.controller("HomeController", function HomeController($scope, $rootScope, ApiFactory, OrdersFactory, OrderItemsFactory, CustomersFactory, ContentFactory, $q) {
	$rootScope.currentController = this;
	$rootScope.home = true;
	var exports = {
		loadData: function () {

			window.hours = [];
			window.amounts = undefined;
			window.compareAmounts = undefined;
			for (var i = 0; i <= 23; i++) {
				hours.push(i);
			}


			function buildOrdersChart() {
				var orderCanvas = $(".order-chart")[0].getContext('2d');
				if (!amounts && !compareAmounts)
					return;

				var chart = new Chart(orderCanvas, {
					type: 'line',
					data: {
						labels: hours,
						datasets: [
							{ 
								data: amounts, 
								label: $rootScope.date.toLocaleDateString(), 
								backgroundColor:"rgba(43,42,12,0.1)" 
							},
							{ 
								data: compareAmounts, 
								label: $rootScope.comparedate.toLocaleDateString(),
								backgroundColor:"rgba(234,66,0,0.1)"
							}]
					},
					options: {
						scales: {
							yAxes: [{
                ticks: {
									callback: function (value, index, values) {
										return "$" + value;
									}
                }
							}]
						}
					}
				});
			}

			OrdersFactory.getOrders().then(function (data) {
				$scope.orders = {};
				$scope.order_count = data.orders.length;

				var orders = OrdersFactory.parseOrders(data.orders);
				$scope.orders = orders.orders;
				$scope.order_total = orders.total;
				for (var orderid in $scope.orders) {
					$scope.getCustomerData($scope.orders[orderid].customer_id);
				}

				var runningTotal = 0;
				amounts = new Array(24);
				for (var i in $scope.orders) {
					var d = new Date($scope.orders[i].created_at);
					var h = d.getHours();
					runningTotal += $scope.orders[i].grand_total;
					amounts[h] = runningTotal;
				}
				var limit = (new Date()).getHours();

				for (var i = 1; i <= 23; i++) {
					if (i > limit)
						amounts[i] = null;
					else if (amounts[i] == 0 || !amounts[i])
						amounts[i] = amounts[i - 1];
				}

				//hold teh phone a bit.
				setTimeout(buildOrdersChart, 100);

				$scope.coupons = 0;
				$scope.adcodes = 0;

				for (var order in $scope.orders) {
					if ($scope.orders[order].coupon_code != "")
						$scope.coupons++;
					if ($scope.orders[order].adcode != "")
						$scope.adcodes++;

				}

			});

			OrdersFactory.getCompareDayOrders().then(function (data) {
				var orders = OrdersFactory.parseOrders(data.orders);
				$scope.compare_order_count = orders.length;
				$scope.compare_order_total = orders.total;
				$scope.compare_order_total_tonow = 0;
				$scope.compare_order_count_tonow = 0;

				var comparedate = $rootScope.comparedate;
				var comparedateNow = $rootScope.comparedateNow;

				for (var order in orders.orders) {
					var current = orders.orders[order];
					var orderDate = new Date(current.ordered_at);
					//console.log(orderDate, comparedate);
					if (orderDate.getTime() < comparedateNow.getTime()) {
						$scope.compare_order_count_tonow++;
						$scope.compare_order_total_tonow += current.grand_total;
					}
				}
				var runningTotal = 0;
				compareAmounts = new Array(24);
				for (var i in orders.orders) {
					var d = new Date(orders.orders[i].created_at);
					var h = d.getHours();
					runningTotal += orders.orders[i].grand_total;
					compareAmounts[h] = runningTotal;
				}

				for (var i = 1; i <= 23; i++) {
					if (compareAmounts[i] == 0 || !compareAmounts[i])
						compareAmounts[i] = compareAmounts[i - 1];
				}

				setTimeout(buildOrdersChart, 100);
			});

			$scope.totalItems = OrdersFactory.totalItems;

			OrderItemsFactory.getOrderItemsForToday().then(function (data) {
				var orders = data.orders;
				window.items = {};
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

				var itemCalls = [];
				// var itemNames = [], itemTotals = [], itemQuantities = [];
				for (var i in items) {
					itemCalls.push(ApiFactory.getEndpoint("products/" + items[i].id));
					// itemNames.push(i);
					// itemTotals.push(items[i].total);
					// itemQuantities.push(items[i].qty);
				}

				var categoryCalls = [];
				var categories = {};
				$q.all(itemCalls).then(function(itemData){
					for(var i in itemData){
						categoryCalls.push(ApiFactory.getEndpoint("categories/" + itemData[i].primary_category_id));
					}
					$q.all(categoryCalls).then(function(catData){
						for(var i in catData){
							categories[catData[i].id] = {
								name: catData[i].name,
								total: 0
							}
						
						}

						for(var i in itemData){
							categories[itemData[i].primary_category_id].total += items[itemData[i].item_name].total;
						}
						
						var chartLabels = [], chartData = [];

						for(var i in categories){
							if (categories[i].name != "hidden-category"){
								chartLabels.push(categories[i].name);
								chartData.push(categories[i].total);
							}
						}

						var itemsCanvas = $(".items-chart")[0].getContext('2d');

						var chart = new Chart(itemsCanvas, {
							type: 'bar',
							data: {
								labels: chartLabels,
								datasets: [{
									label: 'Totals',
									data: chartData
								}/*,
								{
									label: 'Item Quantities',
									data: itemQuantities
								}*/]
							}
						});
					});
				});

			});

			$scope.newCustomers = 0;
			$scope.repeatCustomers = 0;

			$scope.getCustomerData = function (id) {
				CustomersFactory.getCustomerOrders(id).then(function (data) {
					
					var customerCanvas = $(".customer-chart")[0].getContext('2d');
					if (data.orders.length == 1) $scope.newCustomers++;
					else $scope.repeatCustomers++;

					if ($scope.newCustomers + $scope.repeatCustomers == $scope.order_count) {
						var chart = new Chart(customerCanvas, {
							type: 'pie',
							data: {
								labels: ['New', 'Repeat'],
								datasets: [{
									data: [$scope.newCustomers, $scope.repeatCustomers],
									backgroundColor: ["#f00", "#00f"]
								}]
							}
						});
					}
				});
			}

			ContentFactory.getReviews().then(function (data) {
				$scope.reviews = data.product_reviews;
			})
		}
	}

	exports.loadData();
	return exports;
});

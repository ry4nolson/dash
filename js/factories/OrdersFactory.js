app.factory("OrdersFactory", function OrderFactory($rootScope, ApiFactory) {
		return {
			getOrders: function (params) {
				if (!params) {
					params = this.getDefaultOrderParams();
				}
				return ApiFactory.getEndpoint("orders", params);
			},
			getCompareDayOrders: function(){
				var params = this.getDefaultOrderParams();

				var topEnd = new Date();
				topEnd.setTime($rootScope.comparedate);
				topEnd.setHours(24);
				topEnd.setMinutes(0);
				topEnd.setSeconds(0);
				topEnd.setMilliseconds(0);

				params.ordered_at = "gte:" + $rootScope.comparedate.toISOString() + "+AND+lt:" + topEnd.toISOString();
				
				return ApiFactory.getEndpoint("orders", params);
			},
			getOrder: function (id) {
				return ApiFactory.getEndpoint("orders/" + id, { "expand": "items" });
			},
			getOrdersByIDs: function (ids) {
				var params = this.getDefaultOrderParams();
				delete params.ordered_at;
				return ApiFactory.getEndpoint("orders?id=" + ids, params);
			},
			parseOrders: function (orders) {
				//console.log(orders);
				var parsedOrders = {
					orders: {}
				};
				var total = 0;
				for (var i = orders.length - 1; i >= 0; i--) {
					var order = orders[i];
					total += order.grand_total;
					parsedOrders.orders[order.id] = order;
				}
				parsedOrders.length = orders.length;
				parsedOrders.total = total;

				return parsedOrders;
			},
			totalItems: function (items) {
				var total = 0;
				if (!items)
					return total;
				for (var i = 0, l = items.length; i < l; i++)
					total += items[i].quantity;

				return total;
			},
			getDefaultOrderParams: function () {
				return {
					"ordered_at": "gte:" + $rootScope.date.toISOString() + "+AND+lt:" + $rootScope.endDay.toISOString(),
					"order_status_id": "not:4+AND+not:5+AND+not:6+AND+not:15+AND+not:16",
					"count": 10000,
					"expand": "items"
				};
			}
		}

	});
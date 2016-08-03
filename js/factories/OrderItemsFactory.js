app.factory("OrderItemsFactory", function OrderItemsFactory(ApiFactory, OrdersFactory) {
	return {
		getOrderItemsForToday: function () {
			return OrdersFactory.getOrders();
		},
		getOrderItemsForProduct: function (id) {
			return ApiFactory.getEndpoint("/order_items?count=100000&product_id=" + id)
		}
	};
})
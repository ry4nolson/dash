app.controller("OrderItemsController", function OrderItemsController($scope, OrderItemsFactory){
	OrderItemsFactory.getOrderItemsForToday().then(function(data){
		var orders = data.orders;
		var items = {};
		var total = 0;
		for (var order in orders){
			for(var item in orders[order].items){
				var oItem = orders[order].items[item];

				if (items[oItem.item_name]){
					items[oItem.item_name].qty += oItem.quantity;
					items[oItem.item_name].total += (oItem.quantity * oItem.price);
				}else {
					items[oItem.item_name] = {
						id : oItem.product_id,
						name : oItem.item_name,
						qty: oItem.quantity,
						total :(oItem.quantity * oItem.price)
					}
				}
				total += oItem.quantity;
			}
		}
		$scope.total = total;
		$scope.items = items;
	})
});
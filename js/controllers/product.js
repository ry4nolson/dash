app.controller("ProductController", function ProductController($routeParams, $scope, ApiFactory, OrderItemsFactory, OrdersFactory){
	ApiFactory.getEndpoint("/products/" + $routeParams.id).then(function(data){
		$scope.product = data;
		console.log(data);

		ApiFactory.getEndpoint("/product_pictures?product_id=" + $routeParams.id).then(function(data){
			var pics = data.pictures;
			var primary;
			console.log(pics);
			for(var pic in pics){
				if (pics[pic].is_primary)
					primary = pics[pic];
			}
			$scope.itemPhoto = ApiFactory.domain + "/resize" + primary.image_file + "?bw=50&lr=t";
		});

		OrderItemsFactory.getOrderItemsForProduct($routeParams.id).then(function(data){
			var items = data.items;

			var orderIds = [];
			var i = 0, ii = 0;
			for(var item in items){
				if (ii == 0 || ii % 100 == 0) {
					i++;
					orderIds[i] = [];
				}
				ii++;
				console.log(i);
				orderIds[i].push(items[item].order_id);
			}
			console.log(orderIds);
			$scope.orders = {};
			for (var id in orderIds){
				OrdersFactory.getOrdersByIDs(orderIds[id].join("+OR+")).then(function(data){
					var orders = data.orders;
					for (var order in orders){
						$scope.orders[orders[order].id] = orders[order];
					}
					console.log($scope.orders);
				});
			}
		});
	})
})
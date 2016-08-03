app.controller("CustomerController", function CustomerController($routeParams, $scope, CustomersFactory, OrdersFactory){
		CustomersFactory.getCustomer($routeParams.id).then(function(data){
			$scope.customer = data;
			console.log(data);
			CustomersFactory.getCustomerOrders($routeParams.id).then(function(data){

				$scope.totalItems = OrdersFactory.totalItems;
				var orders = OrdersFactory.parseOrders(data.orders);
				$scope.orders = orders.orders;
				$scope.total = orders.total;
			});

			$scope.formatDate = function(dateString){
				var d = new Date(dateString);
				return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/');
			}
		});
	});
app.controller("OrderController", function OrderController($routeParams, $scope, OrdersFactory, CustomersFactory, AddressFactory) {
		OrdersFactory.getOrder($routeParams.id).then(function (data) {
			var order = $scope.order = data;
			CustomersFactory.getCustomer(order.customer_id).then(function (data) {
				$scope.customer = data;
			});

			$scope.infolines = [];

			console.log(order);

			var items = ["subtotal","handling_total", "discount_total", "shipping_total", "tax_total", "grand_total"]

			for (var item in items) {
				var key = items[item];
				var value = order[items[item]];
				if (key == "shipping_total" || value != 0) {
					switch (key) {
						case "subtotal":
							$scope.infolines.push({ "key": "subtotal", "value": value });
							break;
						case "handling_total":
							$scope.infolines.push({ "key": "handling", "value": value });
							break;
						case "discount_total":
							$scope.infolines.push({ "key": "discount " + order.coupon_code, "value": -1 * value });
							break;
						case "shipping_total":
							$scope.infolines.push({ "key": order.selected_shipping_method, "value": value });
							break;
						case "tax_total":
							$scope.infolines.push({ "key": "tax", "value": value });
							break;
						case "grand_total":
							$scope.infolines.push({ "key": "total", "value": value });
							break;
					}
				}
			}

			AddressFactory.getAddresses(order.order_billing_address_id + "+OR+" + order.order_shipping_address_id).then(function (data) {
				var billing = undefined;
				var shipping = undefined;
				var addresses = data.addresses;
				console.log(addresses);
				for (var add in addresses) {
					if (addresses[add].id == order.order_billing_address_id)
						billing = addresses[add];
					else
						shipping = addresses[add];
				}
				if (!billing) billing = shipping;
				if (!shipping) shipping = billing;

				if (AddressFactory.stateHash[billing.state])
					billing.state = AddressFactory.stateHash[billing.state];
				if (AddressFactory.stateHash[shipping.state])
					shipping.state = AddressFactory.stateHash[shipping.state];

				$scope.billing = billing;
				$scope.shipping = shipping;
			});
		})
	});
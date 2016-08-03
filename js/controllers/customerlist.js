app.controller("CustomerListController", function CustomerListController($scope, OrdersFactory, CustomersFactory) {
  OrdersFactory.getOrders()
    .then(function (data) {
      //console.log(data);
      $scope.customers = {};

      var orders = OrdersFactory.parseOrders(data.orders).orders;
      for (var orderid in orders) {
        $scope.customers[orders[orderid].customer_id] = {};
        getCustomerData(orders[orderid].customer_id);
      }
    });
    
  var getCustomerData = function (id) {
    var customer_id = id;
    CustomersFactory.getCustomer(id).then(function (data) {
      //console.log(data);
      $scope.customers[id] = data;

      CustomersFactory.getCustomerOrders(id).then(function (data) {
        //console.log(data);
        var orders = OrdersFactory.parseOrders(data.orders);
        $scope.customers[id].order_count = orders.length;
        $scope.customers[id].total_value = orders.total;
        //$scope.orders[orderid].customer.order_count = Utility.getOrdinal(data.orders.length);
      });
    });
		}
});
app.controller("MarketingController", function MarketingController($scope, OrdersFactory, CustomersFactory, AddressFactory) {
  var coupons = { total: 0, coupons : {} };
  var adcodes = { total: 0, adcodes: {} };

  OrdersFactory.getOrders().then(function (data) {
    var orders = OrdersFactory.parseOrders(data.orders).orders;
    for (var order in orders) {
      var order = orders[order];

      if (order.coupon_code != "") {
        var coupon = order.coupon_code.toLowerCase();
        if (coupons.coupons[coupon]) {
          coupons.coupons[coupon].amount += order.discount_total;
          coupons.coupons[coupon].uses++;
        } else {
          coupons.total++
          coupons.coupons[coupon] = {
            name: coupon,
            amount: order.discount_total,
            uses: 1
          }
        }
      }
      if (order.adcode != "") {
        var adcode = order.adcode.toLowerCase();
        if (adcodes.adcodes[adcode]) {
          adcodes.adcodes[adcode].uses++;
        } else {
          adcodes.total++;
          adcodes.adcodes[adcode] = {
            name: adcode,
            uses: 1
          }
        }
      }
    }
    $scope.coupons = coupons;
    $scope.adcodes = adcodes;
  });
});
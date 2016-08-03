app.config(function ( $routeProvider ) {
  
  'use strict';

  $routeProvider
  	.when('/', {
  		templateUrl: 'views/home.html',
      controller: 'HomeController',
      controlerAs: 'home'
  	})
    .when('/orders', {
      templateUrl: 'views/orderlist.html',
      controller: 'OrderListController',
      controllerAs: 'orderlist'
    })
    .when('/orders/:id', {
      templateUrl: 'views/order.html',
      controller: 'OrderController',
      controllerAs: 'order'
    })
    .when('/orderitems', {
    	templateUrl: 'views/orderitems.html',
    	controller: 'OrderItemsController',
    	controllerAs: 'orderitems'
    })
    .when('/product/:id', {
    	templateUrl: 'views/product.html',
    	controller: 'ProductController',
    	controllerAs: 'product'
    })
    .when('/customers', {
      templateUrl:'views/customerlist.html',
      controller: 'CustomerListController'
    })
    .when('/customers/:id', {
    	templateUrl: 'views/customer.html',
    	controller: 'CustomerController',
    	controllerAs: 'customer'
    })
    .otherwise({
      redirectTo: '/'
    });
})
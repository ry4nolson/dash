angular.module("mobileDash")
	.factory("CustomersFactory", function CustomersFactory(ApiFactory){
		return {
			getCustomers : function(params){
				return ApiFactory.getEndpoint("customers", params);
			},
			getCustomer : function(id){
				//console.log(id);
				return ApiFactory.getEndpoint("customers/" + id);
			},
			getCustomerOrders : function(id){
				return ApiFactory.getEndpoint("orders?customer_id=" + id, 
					{
						"order_status_id" : "not:4+AND+not:5+AND+not:6+AND+not:15+AND+not:16",
						"expand" : "items"
					});
			}
		}
	});
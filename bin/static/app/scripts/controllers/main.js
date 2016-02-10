'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('MainCtrl', function ($scope,$http,$uibModal) {
	  var loadStreamData=function(){
			$http.get('../services/stream/all').
		  	success(function(data, status, headers, config) {
		  		$scope.streams=data;
		  	}).
		  	error(function(data, status, headers, config) {

		  	});

	  }
	  loadStreamData();
	  
	  $scope.addStream=function(){
		  var modalInstance = $uibModal.open({
			  templateUrl: 'views/AddStreamModal.html',
			  controller: 'AddStreamModalCtrl',
			  size: 'lg'
		  });
		  modalInstance.result.then(function (data) {
			  loadStreamData();
		  });
	  };
	  
	  $scope.deleteStream=function(stream){
		  $http.delete('../services/stream/'+stream.id)
          .success(function() {
        	  loadStreamData();
          })
          .error(function(data, status, headers, config) {
          });
	  };
	  
	  $scope.testStream=function(stream){
		  var modalInstance = $uibModal.open({
			  templateUrl: 'views/TestStreamModal.html',
			  controller: 'TestStreamModalCtrl',
			  size: 'lg',
	  			resolve: {
	    			items: function () {
						var items = {};
						items.stream = stream;
						return items;
	    	        }
				}
		  });
		  modalInstance.result.then(function (data) {
			  loadStreamData();
		  });
	  };

	  
	  $scope.showStream=function(stream){
		  var modalInstance = $uibModal.open({
			  templateUrl: 'views/StreamDetailsModal.html',
			  controller: 'StreamDetailsModalCtrl',
			  size: 'lg',
  			resolve: {
    			items: function () {
					var items = {};
					items.stream = stream;
					return items;
    	        }
			}
		  });
		  modalInstance.result.then(function (data) {
			  loadStreamData();
		  });
	  }

	  
  }).controller('StreamDetailsModalCtrl', function ($scope,$http,$uibModalInstance,items) {
	  $scope.action={};
	  $scope.stream=items.stream;
	  $scope.deliveryMethods=['HTTP','Websphere MQ','Amazon SQS Queue'];
	  $scope.processStrategies=['Amazon Kinesis','IBM Message Broker','Kafka'];
	  $scope.sub={};
		$scope.processStrategy=$scope.processStrategies[0];
		$scope.deliveryMethod=$scope.deliveryMethods[0];

	  $http.get('../services/stream/subscribers')
	  	.success(function(data) {
	  		$scope.subscribers=data;
	  	}).error(function(data, status, headers, config) {

	  	});
	  
	  var loadStream=function(){
			$http.get('../services/stream/topic/'+items.stream.name)
		  	.success(function(data) {
		  		$scope.stream=data;
		  		console.log($scope.stream)
		  	}).error(function(data, status, headers, config) {

		  	});
	  }

	  $scope.sub={};
		$scope.sub.stream={};
		$scope.sub.stream.id=$scope.stream.id;
		$scope.sub.processStrategy=$scope.processStrategy;
		$scope.addSubscription = function () {
			$http.post('../services/stream/subscription',$scope.sub)
	          .success(function(data) {
	        	  loadStream();
	        	  $scope.action.isListing=true;
	          })
	          .error(function(data, status, headers, config) {
	          });
		};
		$scope.deleteSubscription=function(subscription){
			$http.delete('../services/stream/subscription/'+subscription.id)
	          .success(function(data) {
	        	  loadStream();
	          })
	          .error(function(data, status, headers, config) {
	          });
		}
	  $scope.cancel = function () {
		  $uibModalInstance.dismiss('cancel');
	};

  }).controller('AddStreamModalCtrl', function ($scope,$http,$uibModalInstance) {
	$scope.submit = function () {
		console.log('Adding stream..')
		$scope.req.type="DATA";
		$http.post('../services/stream',$scope.req)
          .success(function(data) {
        	  $uibModalInstance.close(data);
          })
          .error(function(data, status, headers, config) {
          });
	  	};
	  $scope.cancel = function () {
		  $uibModalInstance.dismiss('cancel');
	};
  }).controller('AddSubstriptionModalCtrl', function ($scope,$http,$uibModalInstance) {
	$http.get('../services/stream/subscribers')
	  	.success(function(data) {
	  		$scope.subscribers=data;
	  	}).error(function(data, status, headers, config) {

	  	});
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
  }).controller('SubscriberCtrl', function ($scope,$http,$uibModal) {
	  var loadSubscribers = function(){
		  $http.get('../services/stream/subscribers').
		  	success(function(data) {
		  		$scope.subscribers=data;
		  	}).
		  	error(function(data, status, headers, config) {

		  	});
	  }
	  loadSubscribers();
	  
	  $scope.addSubscriber = function () {
		  var modalInstance = $uibModal.open({
			  templateUrl: 'views/AddSubstriberModal.html',
			  controller: 'AddSubscriberModalCtrl',
			  size: 'lg'
		  });
		  modalInstance.result.then(function (data) {
			  loadSubscribers();
		  });

		};
  }).controller('AddSubscriberModalCtrl', function ($scope,$http,$uibModalInstance) {
	  $scope.submit = function () {
			$http.post('../services/stream/subscriber',$scope.req)
	          .success(function(data) {
	        	  $uibModalInstance.close(data);
	          })
	          .error(function(data, status, headers, config) {
	          });
		  	};
		  	
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

  }).controller('TestStreamModalCtrl', function ($scope,$http,$uibModalInstance,items) {
	  $scope.submit = function () {
			$http.post('../services/stream/publish/'+items.stream.name,$scope.req.message)
	          .success(function(data) {
	        	  $uibModalInstance.close(data);
	          })
	          .error(function(data, status, headers, config) {
	          });
		  	};
		  	
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

  });
var app = angular.module('tracking-app', [ 'ngRoute', 'ui.bootstrap' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'LoginController'
	});
//	$routeProvider.when('/register', {
//		templateUrl : 'views/userReg.html',
//		controller : 'UserRegController'
//	});
	$routeProvider.otherwise({
		redirectTo : '/login'
	});
} ]);

app.controller('LoginController', function($scope, $location, $modal, $log) {
	// $scope.load = function(path){
	// $log.log("Redirect to: " + path);
	// $location.url(path);
	// }

	$scope.register = function() {
		$scope.openModal();
	}
	$scope.openModal = function() {
		var modalInstance = $modal.open({
			// scope : $scope,
			templateUrl : 'views/userReg.html',
			controller : 'UserRegController'
		});
	}
});

app.controller('UserRegController', function($scope, $log, $modalInstance, $http) {

	$scope.userTypes = [ 'Tracker', 'Subject' ];
	
	$scope.userTypeSelected = $scope.userTypes[0];

	$scope.modalOk = function() {
		$log.log('Form Submitted')
		$scope.post();
		$modalInstance.close('ok');
	};

	$scope.modalCancel = function() {
		$log.log('User Pressed Cancel')
		$modalInstance.dismiss('cancel');
	};

	$scope.post = function() {
		$log.log("Entered Post Function");
		var url = '/addNew' + $scope.userTypeSelected;
		var data = $('#add-new-user').serialize();
		$log.log("User data: " + data);
		$http({
			url: url,
			method: 'post',
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data: data
		}).success(function(data,status,headers, config){
			$log.log('Post Success. Data: ' + data);
		}).error(function(data,status,headers, config){
			$log.log('Post Unsuccessful. Error: '+ error);
		})
	}
	
});

app.controller('SubjectRegController', function($scope) {

});
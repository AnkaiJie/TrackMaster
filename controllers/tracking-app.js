var app = angular.module('tracking-app', [ 'ngRoute', 'ui.bootstrap' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'LoginController'
	});
	$routeProvider.when('/homeTracker', {
		templateUrl : 'views/trackerHome.html',
		controller : 'TrackerHomeController'
	});
	$routeProvider.when('/homeSubject', {
		templateUrl : 'views/subjectHome.html',
		controller : 'SubjectHomeController'
	});
	$routeProvider.otherwise({
		redirectTo : '/login'
	});
} ]);

//app.factory('getUserFactory', [ '$http', '$log', function($http, $log) {
//
//	var factory = {};
//	factory.getUser = function(userType) {
//		return $http.get('/get' + userType).then(function(response) {
//			$log.log(response);
//			if (response.data.tracker !== null) {
//				return response.data.tracker;
//			}
//			return response.data.subject;
//		});
//	}
//	return factory;
//} ]);

app.controller('LoginController', function($scope, $location, $modal, $log) {
	// $scope.load = function(path){
	// $log.log("Redirect to: " + path);
	// $location.url(path);
	// }

	$scope.login = function() {
		var user_data = $('user-login').serialize();
		var returned_user = {};
		
	}

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

app.controller('UserRegController', function($scope, $log, $modalInstance,
		$http) {

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
			url : url,
			method : 'post',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data : data
		}).success(function(data, status, headers, config) {
			$log.log('Post Success. Data: ' + data);
		}).error(function(data, status, headers, config) {
			$log.log('Post Unsuccessful. Error: ' + error);
		})
	}

});

app.controller('TrackerHomeController', function($scope) {
	$scope.tracker = {
		username : String,
		subjects : []
	}

	$http.get({

	})
});

app.controller('SubjectHomeController', function($scope) {

});
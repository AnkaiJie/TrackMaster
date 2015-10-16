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

app.service('userDataTransfer', function() {
	var data = {};

	return {
		getData : function() {
			return data;
		},

		setData : function(info) {
			data = info;
		}
	}
});

app.factory('subjectsFactory',  function($http, $log) {

	var factory = {};
	factory.getSubjects = function(trackerName) {
		return $http.get('/getTrackerSubjects?trackerName='+trackerName).then(function(response) {
			$log.log(response);
			return response.data.subjects;
		});
	}
	return factory;
});

app.controller('LoginController', function($scope, $location, $modal, $log,
		$http, userDataTransfer) {
	// $scope.load = function(path){
	// $log.log("Redirect to: " + path);
	// $location.url(path);
	// }
	$scope.userTypes = [ 'Tracker', 'Subject' ];

	$scope.userTypeSelected = $scope.userTypes[0];

	$scope.login = function() {
		var user_data = $('#user-login').serialize();
		var url = 'login' + $scope.userTypeSelected;
		$scope.post(user_data, url);
	}

	$scope.post = function(data, url) {
		$log.log("Entered Post Function");
		$http({
			url : url,
			method : 'post',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data : data
		}).success(function(data, status, headers, config) {
			$log.log('Login Success. Data: ' + data);
			userDataTransfer.setData(data);
			$location.url('/home' + $scope.userTypeSelected);
		}).error(function(data, status, headers, config) {
			$log.log('Login Unsuccessful. Error: ' + error);
		})
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

app.controller('TrackerHomeController', function($scope, userDataTransfer, subjectsFactory) {
	$scope.tracker = userDataTransfer.getData();
	subjectsFactory.getSubjects($scope.tracker.username).then(function(data) {
		$scope.subjects = data;
	})

});

app.controller('SubjectHomeController', function($scope) {

});
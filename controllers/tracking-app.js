var app = angular.module('tracking-app', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/homeTracker', {
        templateUrl: 'views/trackerHome.html',
        controller: 'TrackerHomeController'
    });
    $routeProvider.when('/homeSubject', {
        templateUrl: 'views/subjectHome.html',
        controller: 'SubjectHomeController'
    });
    $routeProvider.otherwise({
        redirectTo: '/login'
    });
}]);

app.service('userDataTransfer', function() {
    var data = {};

    return {
        getData: function() {
            return data;
        },

        setData: function(info) {
            data = info;
        }
    }
});


app.factory('subjectsFactory', function($http, $log) {

    var factory = {};
    factory.getSubjects = function(trackerName) {
        return $http.get('/getTrackerSubjects?trackerName=' + trackerName).then(function(response) {
            $log.log(response);
            return response.data;
        });
    }
    return factory;
});

app.controller('HeaderController', function($scope, $log, $location, $route) {

    $scope.loggedIn = false;

    $scope.reset = function() {
        $location.url('/');
    }
});

app.controller('LoginController', function($scope, $location, $modal, $log, $http, userDataTransfer) {
    // $scope.load = function(path){
    // $log.log("Redirect to: " + path);
    // $location.url(path);
    // }
    $scope.userTypes = ['Tracker', 'Subject'];

    $scope.noUserType = false;
    $scope.badLogin = false;
    $scope.userTypeSelected = 'Select User Type';

    $scope.login = function() {

        if ($scope.userTypeSelected === 'Select User Type') {
            $scope.noUserType = true;
        } else {
            $scope.noUserType = false;
            var user_data = $('#user-login').serialize();
            var url = 'login' + $scope.userTypeSelected;
            $scope.post(user_data, url);
        }

    }

    $scope.post = function(data, url) {
        $log.log("Entered Post Function");
        $http({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).success(function(data, status, headers, config) {
            $scope.badLogin = false;
            $log.log('Login Success. Data: ' + data);
            userDataTransfer.setData(data);
            $location.url('/home' + $scope.userTypeSelected);
        }).error(function(data, status, headers, config) {
            $log.log('Login Unsuccessful. Error: ' + data);
            if (status === 400 || status === 401) {
                $scope.badLogin = true;
            }
        })
    }

    $scope.register = function() {
        $scope.openModal();
    }

    $scope.openModal = function() {
        var modalInstance = $modal.open({
            // scope : $scope,
            templateUrl: 'views/userReg.html',
            controller: 'UserRegController'
        });
    }
});

app.controller('UserRegController', function($scope, $log, $modalInstance, $http) {

    $scope.userTypes = ['Tracker', 'Subject'];

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
        $log.log("Entered Register Post Function");
        $http({
            url: '/addNew' + $scope.userTypeSelected,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $('#add-new-user').serialize()
        }).success(function(data, status, headers, config) {
            $log.log('Register Success. Data: ' + data);
        }).error(function(data, status, headers, config) {
            $log.log('Register Unsuccessful. Error: ' + error);
        })
    }

});

app.controller('TrackerHomeController', function($scope, $log, $modal, $http, $location, $window, userDataTransfer, subjectsFactory) {
    $scope.tracker = userDataTransfer.getData();

    subjectsFactory.getSubjects($scope.tracker.username).then(function(data) {
        $scope.subjects = data;
    });

    $scope.addSubjectDialog = function() {
        var modalInstance = $modal.open({
            scope: $scope,
            templateUrl: 'views/addSubjectDialog.html',
            controller: function($scope, $modalInstance, $log) {

                $scope.newSubjectId;

                $scope.ok = function() {
                    $log.log('form submitted.')
                    $scope.getNewTracker($scope.newSubjectId);
                    $modalInstance.close('ok');
                };

                $scope.pressedCancel = function() {
                    $log.log('closing.')
                    $modalInstance.dismiss('cancel');
                };
            }
        });
    }
    $scope.getNewTracker = function(subjectId) {
        $log.log("Entered getNewTracker Function");
        $http.get('/addSubjectToTracker?trackerName=' + $scope.tracker.username + '&subjectTrackingId=' + subjectId).then(function(response) {
            $log.log(response);
            $scope.tracker = response.data;
            $scope.refreshSubjects();
        });
    }

    $scope.deleteSubject = function(subjectId) {
        $log.log("Entered deleteSubject Function");
        $http.get('/deleteSubjectFromTracker?trackerName=' + $scope.tracker.username + '&subjectTrackingId=' + subjectId).then(function(response) {
            $log.log(response);
            $scope.tracker = response.data;
            $scope.refreshSubjects();
        });
    }

    $scope.refreshSubjects = function() {
        subjectsFactory.getSubjects($scope.tracker.username).then(function(data) {
            $scope.subjects = data;
        });
    }

    $scope.logout = function() {
        $http.get('/logout');
        $location.url('/');
    }

});

app.controller('SubjectHomeController', function($scope, $log, $location, $http, userDataTransfer) {
    $scope.subject = userDataTransfer.getData();

    $scope.updateLocation = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            $log.log(position);
            $scope.lon = position.coords.longitude;
            $scope.lat = position.coords.latitude;
            $scope.updateSubject();
        });
    }

    $scope.updateSubject = function() {
        $http.get('/subjectLocation?subUsername=' + $scope.subject.username + '&longitude=' + $scope.lon + '&latitude=' + $scope.lat).then(function(response) {
            $log.log('update Subject data: ' + response.data);
            $scope.subject = response.data;
        });
    }

    $scope.logout = function() {
        $http.get('/logout');
        $location.url('/');
    }

});

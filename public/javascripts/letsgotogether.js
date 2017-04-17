/*
The first argument is the name of the module. 
This is the same name we used with ng-app above. 
The second argument is an array of dependencies. 
If you provide this argument, the module method will 
define a new module and return a reference to it. 
If you exclude it, it’ll attempt to get a reference 
to an existing module.
*/
var app = angular.module('LetsGoTogether', ['ngResource', 'ngRoute']);


app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-event', {
            templateUrl: 'partials/event-form.html',
            controller: 'AddEventCtrl'
        })
        .when('/event/:id', {
        	templateUrl: 'partials/event-form.html',
        	controller: 'EditEventCtrl'
    	})
    	.when('/event/delete/:id', {
        	templateUrl: 'partials/event-delete.html',
        	controller: 'DeleteEventCtrl'
    	})
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Events = $resource('/api/events');
        Events.query(function(events){
            $scope.events = events;
        });
    }]);

app.controller('AddEventCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Events = $resource('/api/events');
            Events.save($scope.event, function(){
                $location.path('/');
            });
        };
    }]);

app.controller('EditEventCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){	
        var Events = $resource('/api/events/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Events.get({ id: $routeParams.id }, function(event){
            $scope.event = event;
        });

        $scope.save = function(){
            Events.update($scope.event, function(){
                $location.path('/');
            });
        }
    }]);


app.controller('DeleteEventCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Events = $resource('/api/events/:id');

        Events.get({ id: $routeParams.id }, function(event){
            $scope.event = event;
        })

        $scope.delete = function(){
            Events.delete({ id: $routeParams.id }, function(event){
                $location.path('/');
            });
        }
    }]);
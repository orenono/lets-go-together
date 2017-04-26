/*
The first argument is the name of the module. 
This is the same name we used with ng-app above. 
The second argument is an array of dependencies. 
If you provide this argument, the module method will 
define a new module and return a reference to it. 
If you exclude it, it’ll attempt to get a reference 
to an existing module.
Here we depend on two modules: "ngResource", 
for consuming RESTful APIs and "ngRoute" for routing.
*/
var app = angular.module('LetsGoTogether', ['ngResource', 'ngRoute']);

/*
We’re using the config method of the app module to provide 
configuration for our application. This code will be run as 
soon as Angular detects ng-app and tries to start up. 
The config method expects an array:
This array can have zero or more dependencies, 
and a function for implementing configuration. Here, 
we have a dependency on $routeProvider, which is a service 
defined in the ngRoute module. That’s why we changed our app 
module declaration to depend on ngRoute.  Our configuration function 
receives $routeProvider as a parameter.
Inside our configuration function, we use the when method of 
$routeProvider to configure a route. The first argument (‘/’) is 
the relative path. The second argument is an object that specifies 
the path to the view (via templateUrl). We can have multiple calls 
to the when method, each specifying a different route. Finally, 
we use the otherwise method to indicate that if user navigates to 
any other URLs, they should be redirected to the root (‘/’).
*/


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

/*
Here we’re using the controller method of the app module to define 
a new controller.
The first parameter is a string that specifies the name of this 
controller. By convention, we append Ctrl to our Angular controller 
names.
The second argument is an array. This array can include zero or 
more strings, each representing a dependency for this controller. 
Here, we’re specifying a dependency to $scope and $resource. 
Both of these are built-in Angular services, and that’s why 
they are prefixed with a $ sign. We’ll use $scope to pass data to 
the view and $resource to consume a RESTful API. The last object in 
this array of dependencies is a function that represents the body or 
implementation of the controller. In this example, our function gets 
two parameters called $scope and $resource. This is because we 
referenced $scope and $resource before declaring this function.
we call the $resource method to get a resource object for the given API 
endpoint (/api/videos). This object will provide methods to work with our API. 
We use the query method to get all videos. The query method gets a callback 
method that will be executed when the query result is ready. This function 
will receive the videos we retrieved from the server. Finally, we store these 
videos in $scope so that we can access them in the view for rendering. 
Remember, $scope is the glue between views and controllers.
*/

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
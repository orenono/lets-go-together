var rootScope;

function getLoggedInUserId() {
    if (rootScope && rootScope.user && rootScope.user.id) {
        return rootScope.user.id;
    }

    return 'user_does_not_exist';
}

function addUserEvent($resource, eventId) {
    var userId = getLoggedInUserId();
    var UserEvents = $resource('/api/userEvents');
    UserEvents.save({userId: userId, eventId: eventId});
};

function removeUserEvent($resource, eventId, callback) {
    var userId = getLoggedInUserId();
    var UserEventsId = $resource('/api/userEvents/:id');

    UserEventsId.query({userId: userId, eventId: eventId}, function(userEvents) {
        for (var i = 0; i < userEvents.length; i++) {
            UserEventsId.delete({id: userEvents[i]._id});
        }

        if (typeof callback === 'function') {
            callback();
        }
    });
}


var app = angular.module('LetsGoTogether', ['ngResource', 'ngRoute']);


// Initialize user on rootScope (if logged in)
app.run(function ($rootScope, $http) {
    rootScope = $rootScope;

    $http.get('/login/confirm')
        .success(function (user) {
            if (user) {
                $rootScope.user = user;
            }
        });
});




app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/myevents', {
            templateUrl: 'partials/myevents.html',
            controller: 'MyEventsCtrl'
        })
        .when('/add-event', {
            templateUrl: 'partials/event-form.html',
            controller: 'AddEventCtrl'
        })
        .when('/event/:id', {
        	templateUrl: 'partials/event-info.html',
        	controller: 'EventInfoCtrl'
    	})
    	.when('/event/delete/:id', {
        	templateUrl: 'partials/event-delete.html',
        	controller: 'DeleteEventCtrl'
    	})
        .when('/login', {
            templateUrl: 'partials/login/index.html',
            controller: 'LoginCtrl'
        })
        .when('/profile', {
            templateUrl: 'partials/login/profile.html',
            controller: 'ProfileCtrl'
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

        $scope.addUserEvent = function(eventId) {
            addUserEvent($resource, eventId);
        };
    }]);

app.controller('LoginCtrl', ['$scope', '$resource',
    function($scope, $resource) {
    }]);

app.controller('ProfileCtrl', ['$scope', '$location',
    function($scope, $location) {
    }]);

app.controller('MyEventsCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        var Events = $resource('/api/events');
        var UserEvents = $resource('/api/userEvents');
        var userId = getLoggedInUserId();
        var events;

        function runMainQuery() {
            UserEvents.query({userId: userId}, function(userEvents) {
                var eventIds = userEvents.map(function(obj) {
                    return obj.eventId;
                });

                if (eventIds.length) {
                    Events.query({eventIds: eventIds}, function(ev) {
                        events = ev;
                        $scope.myevents = events;
                    });
                } else {
                    $scope.myevents = [];
                }
            });
        }

        $scope.remove = function(eventId) {
            removeUserEvent($resource, eventId);

            // Also refresh HTML by re-assigning $scope.myevents
            if (events) {
                $scope.myevents = events = events.filter(function(event) {
                    return event._id !== eventId;
                });
            }
        }

        runMainQuery();
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

app.controller('EventInfoCtrl', ['$scope', '$resource', '$routeParams',
    function($scope, $resource, $routeParams) {
        var Events = $resource('/api/events/:id');
        var UserEvents = $resource('/api/userEvents');
        var userId = getLoggedInUserId();
        var event;

        Events.get({ id: $routeParams.id }, function(ev) {
            UserEvents.query({eventId: $routeParams.id}, function(userEvents) {
                event = ev;

                // I'm not going unless proven otherwise
                event.going = false;
                for (var i = 0; i < userEvents.length; ++i) {
                    console.log(userEvents[i]);
                    if (userEvents[i].userId === userId) {
                        console.log('yay');
                        event.going = true;
                        break;
                    }
                }

                $scope.event = event;

                var uniqueUsers = {};
                userEvents.forEach(function(userEvent) {
                    uniqueUsers[userEvent.userId] = true;
                });

                $scope.users = Object.keys(uniqueUsers).map(function(userId) { return {id: userId}; });
            });
        })

        $scope.addUserEvent = function(eventId) {
            addUserEvent($resource, eventId);
            if (event) {
                event.going = true;
                $scope.event = event;
                $scope.users = [{id: userId}].concat($scope.users);
            }
        };
        $scope.removeUserEvent = function(eventId) {
            removeUserEvent($resource, eventId);
            if (event) {
                event.going = false;
                $scope.event = event;
                $scope.users = $scope.users.filter(function(user) {
                    return user.id !== userId;
                });
            }
        };

        // TEMP CODE FOR DEBUGGING
        // $scope.event = {
        //     nameOfEvent: 'JojoMatbucha',
        //     dateOfEvent: '11/02/97',
        //     placeOfEvent: 'Robico',
        //     url: 'https://google.com',
        //     imgUrl: 'https://s-media-cache-ak0.pinimg.com/236x/be/6b/fe/be6bfe74c318cafbfa9d15aab1a02ab3.jpg'
        // };
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
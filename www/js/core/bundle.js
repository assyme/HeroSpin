;
(function () {
    "use strict";

    angular.module('starter', ['ionic']);

})();
;
(function () {
    "use strict";

    angular.module("starter")
        .config(
        [
            "$stateProvider",
            "$urlRouterProvider",
            configureRoutes
        ]
    );

    function configureRoutes($stateProvider,
                             $urlRouterProvider) {

        $stateProvider
            .state('spin', {
                url: '/spin',
                abstract: true,
                templateUrl: 'js/core/templates/tabs.html'
            })
            .state('spin.random', {
                url: '/random',
                views: {
                    'tab-random-hero': {
                        templateUrl: 'js/core/templates/random-hero.html',
                        controller : "MovieListingController as movieListingVM"
                    }
                }
            })
            .state('spin.favourite', {
                url: '/favourite',
                views: {
                    'tab-favourite-hero': {
                        templateUrl: 'js/core/templates/favourite-hero.html',
                        controller : 'HeroListController as heroListVM'
                    }
                }
            });

        $urlRouterProvider.otherwise('/spin/random');

    }
})();
;
(function () {
    "use strict";

    angular.module('starter')
        .run(
        [
            "$ionicPlatform",
            runIonic
        ]
    );

    /**
     * @description: Main entry to the ionic app
     * */
    function runIonic($ionicPlatform) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .controller("HeroListController",
        [
            "$q",
            "heroes.repository",
            HeroListController
        ]
    );

    function HeroListController($q,
                                heroesRepository) {

        //this is basically the view model for the controller
        var vm = this;
        vm.heroList = [];

        activate();

        function activate() {

            $q.when(heroesRepository.get())
                .then(function (heroes) {
                    vm.heroList = heroes;
                });
        }

    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .factory("heroes.repository",
        [
            "$q",
            heroesRepository
        ]
    );

    function heroesRepository($q){


        var _cache = [
            {
                id: 0,
                name: "Storm",
                avatar: "http://x.annihil.us/u/prod/marvel/i/mg/c/c0/537bc5db7c77d/standard_xlarge.jpg"
            },
            {
                id: 1,
                name: "Hulk",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg"
            },
            {
                id: 2,
                name: "Spider-man",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7/standard_xlarge.jpg"
            },
            {
                id: 3,
                name: "Fantastic four",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/60/50febc4f55525/standard_xlarge.jpg"
            },
            {
                id: 4,
                name: "Captain America",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/standard_xlarge.jpg"
            }
        ];;

        /**
        * @description: make factory methods exposed
        * */
        var _this = {
            get : get,
            randomHero : randomHero
        };

        /**
        * @description: Gets heroes from the local storage
        * */
        function get(){
            return _cache;
        }

        /**
        * @description: returns a random hero name from the local cache.
         * TODO:// add logic to put weightage on few parameters like
         * 1. Keep count of how many times the user has selected a particular hero.
         * 2. Keep count of how many times he accepted to view a movie of that hero.
        * */
        function randomHero(){
            var randomNumber = _.random(0,_cache.length - 1);
            return _cache[randomNumber].name;
        }

        return _this;
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .factory("movies.api",
        [
            "$q",
            "BaseCommunicator",
            moviesApi
        ]
    );

    function moviesApi($q,
                       BaseCommunicator) {

        var CONSTANTS = {
            URLS: {
                searchUrl: "https://www.omdbapi.com/"
            }
        };

        var _this = {
            search: search
        };

        /**
         * @description: Searches the imdb public api for the movie name
         * */
        function search(heroName) {

            var defer = $q.defer(),
                resolve = function (response) {
                    if (response.data && response.data.Response === "True") {
                        defer.resolve(response.data.Search);
                    } else {
                        defer.reject();
                    }
                };

            if (!heroName) {
                return $q.resolve([]);
            }

            var request = {
                api: CONSTANTS.URLS.searchUrl,
                method: 'GET',
                data: {s: heroName}
            };


            BaseCommunicator.sendRequest(request)
                .then(resolve, defer.reject, defer.notify);

            return defer.promise;

        }

        return _this;
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .controller("MovieListingController",
        [
            "$q",
            "movies.repository",
            MovieListingController
        ]
    );

    function MovieListingController($q,
                                    moviesRepository) {
        var vm = this;
        vm.randomHeroMovie = randomHeroMovie;

        activate();

        /**
         * @description: initializes the controller and setups defaults
         * */
        function activate() {
            vm.moviesList = [];

            $q.when(moviesRepository.get())
                .then(function (movies) {
                    vm.moviesList = movies;
                });
        }

        /**
        * @description: pulls out a random hero and searches movies of that hero.
        * */
        function randomHeroMovie(){
            $q.when(moviesRepository.get())
                .then(function(movies){
                    vm.moviesList = movies;
                });
        }
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .factory("movies.repository",
        [
            "$q",
            "movies.api",
            "heroes.repository",
            moviesRepository
        ]
    );

    function moviesRepository($q,
                              moviesApi,
                              heroesRepository) {

        var _this = {
            get: get
        };

        /**
         * @description: gets movies from the local storage first,
         * Alternately syncs with the omdb api and caches the data locally
         * */
        function get() {

            return $q.when(heroesRepository.randomHero())
                .then(moviesApi.search)
                .then(function (movies) {
                    return $q.resolve(movies);
                }, function () {
                    //TODO : log the error.
                    //TODO : resolve from local cache.
                    return $q.resolve([]);
                });
        }

        return _this;
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .factory("BaseCommunicator",
        [
            "$q",
            "$http",
            "$timeout",
            baseCommunicator
        ]
    );


    function baseCommunicator($q,
                              $http,
                              $timeout) {

        // chrome and safari both support up to 6 connections at a time
        // hence assuming their cordova webviews also share the same number.
        var Constructor = function () {
            this.connectionPointer = 0;
            this.connection1 = new RequestQueue();
            this.connection2 = new RequestQueue();
            this.connection3 = new RequestQueue();
            this.connection4 = new RequestQueue();
            this.connection5 = new RequestQueue();
            this.connection6 = new RequestQueue();


            function RequestQueue() {
                var pendingTasks = [];

                var executeNext = function () {

                    var currentRequest = pendingTasks[0],
                        request = currentRequest.request,
                        defer = currentRequest.defer;

                    function appendDataToUrl(url, data) {
                        url += "?";
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                url += key + "=" + data[key] + "&";
                            }
                        }
                        return url;
                    }

                    var url = request.api;

                    var headers = {
                        "content-type": "text/plain"
                    };

                    //in case the request containers any headers, apply them to the request.
                    if (request.headers) {
                        for (var key in request.headers) {
                            if (request.headers.hasOwnProperty(key)) {
                                //override or add the headers from the request object.
                                headers[key] = request.headers[key];
                            }
                        }
                    }

                    // if its a get method and the request had data, embed it into the url.
                    if (request.method === "GET" && request.data && !_.isEmpty(request.data)) {
                        url = appendDataToUrl(url, request.data);
                    }
                    console.log("sending request to " + url);
                    $http({
                        url: url,
                        method: request.method,
                        headers: headers,
                        data: request.data ? angular.toJson(request.data) : undefined
                    }).then(function (response) {
                        //check if this api has pagination
                        pendingTasks.shift();
                        if (response.data.per_page) {
                            defer.cumulate_data = defer.cumulate_data || {};
                            defer.notify(response.data);
                            for (var key in response.data.data) {
                                defer.cumulate_data[key] = response.data.data[key];
                            }

                            if (response.data.page === 1) {
                                var count = 1;
                                while (count * response.data.per_page < response.data.count) {
                                    //schedule request for as many pages.
                                    count++;
                                    var newRequest = _.cloneDeep(request);
                                    newRequest.data.page = count;
                                    pendingTasks.unshift({request: newRequest, defer: defer}); // add to the beginning of the queue
                                }
                                defer.pending_request = count - 1; // since this request has already been processed.
                            } else {
                                defer.pending_request--;
                            }

                            if (defer.pending_request === 0) {
                                // all records have been fetched. Hence resolve.
                                defer.resolve(defer.cumulate_data);
                            }
                        } else {
                            //just expose the data and not the complete http response object.
                            defer.resolve(response);
                        }

                        if (pendingTasks.length > 0) {
                            executeNext();
                        }
                    }, function (response) {
                        var executingTask = pendingTasks[0];

                        //TODO: maybe if any authentication is required to access any api
                        //add 401 and 403 handlers here.

                        if (response.status === 503 && executingTask.retryCount < 3) {
                            //do not remove the task from this pool and just execute again.
                            executingTask.retryCount++;
                            if (pendingTasks.length > 0) {
                                executeNext();
                            }
                        }
                        else {
                            pendingTasks.shift();
                            defer.reject(response);
                            if (pendingTasks.length > 0) {
                                executeNext();
                            }
                        }
                    });
                };

                this.sendRequest = function (request, first) {
                    var defer = $q.defer();
                    first = first || false;

                    if (first) {
                        pendingTasks.unshift({request: request, defer: defer, retryCount: 0});
                    } else {
                        pendingTasks.push({request: request, defer: defer, retryCount: 0});
                    }

                    if (pendingTasks.length === 1) {
                        $timeout(executeNext);
                    }
                    return defer.promise;
                };

                this.start = function () {
                    if (pendingTasks.length > 0) {
                        executeNext();
                    }
                };
            }

        };

        Constructor.prototype.sendRequest = function (request, first, isImage) {

            //Intention is to keep a connection open for image cacher
            if (isImage && !first) {
                return this.connection6.sendRequest(request);
            } else {
                if (this.connectionPointer === 0) {
                    this.connectionPointer++;
                    return this.connection1.sendRequest(request, first);
                }

                else if (this.connectionPointer === 1) {
                    this.connectionPointer++;
                    return this.connection2.sendRequest(request, first);
                }

                else if (this.connectionPointer === 2) {
                    this.connectionPointer++;
                    return this.connection3.sendRequest(request, first);
                }

                else if (this.connectionPointer === 3) {
                    this.connectionPointer++;
                    return this.connection4.sendRequest(request, first);
                }

                else if (this.connectionPointer === 4) {
                    this.connectionPointer = 0; // so that it goes back to connection1
                    return this.connection5.sendRequest(request, first);
                }
            }
        };

        return new Constructor();
    }
})();


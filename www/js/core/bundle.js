;
(function () {
    "use strict";

    angular.module('starter', ['ionic','ngCordova']);

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
                resolve: { // putting this at the root of the route so that this has to be resolved before application start.
                    AppState: [
                        'DataStore',
                        'DbUpgrade',
                        'movies.repository',
                        function (DataStore, DbUpgrade, moviesRepository) {
                            return DataStore.init()
                                .then(DbUpgrade.upgrade)
                                .then(function () {
                                    return moviesRepository.load();
                                });
                        }
                    ]
                },
                templateUrl: 'js/core/templates/tabs.html',
                controller: 'TabsController as TabsVM'
            })
            .state('spin.random', {
                url: '/random/:name',
                views: {
                    'tab-random-hero': {
                        templateUrl: 'js/core/templates/random-hero.html',
                        controller: "MovieListingController as movieListingVM"
                    }
                }
            })
            .state('spin.favourite', {
                url: '/favourite',
                views: {
                    'tab-favourite-hero': {
                        templateUrl: 'js/core/templates/favourite-hero.html',
                        controller: 'HeroListController as heroListVM'
                    }
                }
            });

        $urlRouterProvider.otherwise('/spin/random/');

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


;
(function () {
    'use strict';

    angular.module('starter')
        .factory('DataStore',
        [
            '$q',
            '$cordovaSQLite',
            '$ionicPlatform',
            'webSqlLite',
            DataStore
        ]
    );

    function DataStore($q,
                       $cordovaSQLite,
                       $ionicPlatform,
                       webSqlLite) {

        //region private variable
        var dbProvider, db, ready;
        //endregion

        return {
            ExecuteQuery: function (query, params) {

                return dbProvider.execute(db, query, params).then(function (sqlResults) {
                    return sqlResults;
                }, function (sqlError) {
                    //TODO: Log every db actions.
                    return $q.reject(sqlError);
                });

            },
            init: function () {
                if (ready) {
                    return ready.promise;
                }
                ready = $q.defer();
                $ionicPlatform.ready(function () {
                    if (window.cordova) {
                        dbProvider = $cordovaSQLite;
                    } else {
                        dbProvider = webSqlLite;
                    }
                    try {
                        $q.when(dbProvider.openDB({name: 'herospin.db', location: 2})).then(function (database) {
                            db = database;
                            ready.resolve();
                        });
                    }
                    catch (error) {
                        ready.reject({
                            message: "Could not open database",
                            error: error
                        });
                    }
                });
                return ready.promise;
            },
            insertCollection: function (query, params) {
                console.log("Executing " + query + ". recordcount: " + params.length);
                return dbProvider.insertCollection(db, query, params);
            },
            ready: function (func) {

                if (typeof func != "function") {
                    throw new Error("Please pass a func that needs to be bound to data ready event");
                }

                if (!ready) {
                    this.init();
                }
                return ready.promise.then(func);
            }
        };
    }
})();


/*
 * @description: This is just a polyfil for cordovaSqlite plugin
 * */
(function () {
    'use strict';

    angular.module('starter')
        .factory('webSqlLite', ['$q', webSqlLite]);

    function webSqlLite($q) {

        return {
            openDB: function (options) {
                return window.openDatabase(options.name, "", options.name, 2000 * 1024 * 1024);
            },
            execute: function (db, query, params) {
                var defer = $q.defer();
                db.transaction(function (tx) {
                    tx.executeSql(query, params,
                        function (tx, results) {
                            var Payload = function (results) {
                                var that = this;
                                this.rowsAffected = results.rowsAffected;
                                try {
                                    this.insertId = results.insertId;
                                } catch (e) {
                                    this.insertId = undefined;
                                }

                                this.raw_rows = results.rows;
                                this.rows = {
                                    length: results.rows.length,
                                    item: function (i) {
                                        return that.raw_rows.item(i);
                                    }
                                };
                            };
                            defer.resolve(new Payload(results));
                        }, function (sqlTransaction, sqlError) {
                            defer.reject(sqlError);
                        });
                });
                return defer.promise;
            },
            insertCollection: function (db, query, bindings) {
                var defer = $q.defer();
                var coll = bindings.slice(0); // clone collection

                db.transaction(function (tx) {
                    (function insertOne() {
                        var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
                        try {
                            tx.executeSql(query, record, function (tx, result) {
                                if (coll.length === 0) {
                                    defer.resolve(result);
                                } else {
                                    insertOne();
                                }
                            }, function (transaction, error) {
                                defer.reject(error);
                                return;
                            });
                        } catch (exception) {
                            defer.reject(exception);
                        }
                    })();
                });
                return defer.promise;
            }
        };
    }
})();

(function () {
    "use strict";

    angular.module('starter')
        .factory('DbUpgrade',
        [
            '$q',
            'DataStore',
            'TableNames',
            DbUpgrade
        ]
    );

    /**
     * @description: upgrades databases and keeps track of its version in the localStorage.
     * */
    function DbUpgrade($q,
                       DataStore,
                       TableNames) {

        var CURRENT_VERSION_KEY = "_dbVersion";

        var _this = {
            upgrade: upgrade
        };


        function upgrade() {

            var currentVersion = window.localStorage.getItem(CURRENT_VERSION_KEY);
            var upgrade_status = []; // to store promises of upgrades
            if (currentVersion === null) {
                // upgrade to first version.
                upgrade_status.push(_upgrade1().then(function () {
                    _set_version(1);
                    return $q.resolve();
                }));
            }

            return $q.all(upgrade_status);
            //future code for upgrade 2 should check for the upgrade one or currentVersion.
        }


        //region private members

        /**
         * @description: Saves the version.
         * @inputs: [ver: integer], saves the version in the localStorage
         * */
        function _set_version(ver) {
            window.localStorage.setItem(CURRENT_VERSION_KEY, ver);
        }

        function _upgrade1() {

            var promises = [];

            var promise;

            //tables
            promise = DataStore.ExecuteQuery(createTable(TableNames.Heroes.Name,
                [
                    TableNames.Heroes.Column.ID + ' integer primary key autoincrement',
                    TableNames.Heroes.Column.NAME + ' text',
                    TableNames.Heroes.Column.AVATAR + ' text'
                ]
            ));
            promises.push(promise);

            debugger;
            promise = DataStore.ExecuteQuery(createTable(TableNames.Movies.Name,
                    [
                        TableNames.Movies.Column.key + ' text',
                        TableNames.Movies.Column.value + ' text'
                    ]
                )
            );
            promises.push(promise);

            promise = DataStore.ExecuteQuery(createTable(TableNames.Images.Name,
                    [
                        TableNames.Images.Column.key + " text primary key",
                        TableNames.Images.Column.value + " text"

                    ]
                )
            );
            promises.push(promise);

            return $q.all(promises);
        }

        //endregion

        return _this;
    }

    function createTable(tableName, columns) {

        var query = "CREATE TABLE IF NOT EXISTS " + tableName + "(";

        _.forEach(columns, function (item, index) {
            if (index !== 0) {
                query += ",";
            }
            query += item;

        });

        query += ");";
        return query;

    }
})();
(function () {
    "use strict";

    /**
     * @description: Constants for table informations.
     * */
    var TableNames = {
        Heroes: {
            Name : "Heroes",
            Column : {
                ID : 'id',
                NAME : 'name',
                AVATAR : 'avatar'
            }
        },
        Images: {
            Name: "Images",
            Column: {
                key: "key",
                value: "value"
            }
        },
        Movies: {
            Name: "Movies",
            Column: {
                key: 'key',
                value : 'value'
            }
        }
    };

    angular.module("starter")
        .constant("TableNames", TableNames);

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
                        defer.resolve({
                            hero : heroName,
                            movies : response.data.Search
                        });
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
            "$scope",
            "$stateParams",
            "movies.repository",
            MovieListingController
        ]
    );

    function MovieListingController($q,
                                    $scope,
                                    $stateParams,
                                    moviesRepository) {
        var vm = this;
        vm.randomHeroMovie = randomHeroMovie;


        $scope.$on('$ionicView.enter', onViewEnter);

        activate();

        /**
         * @description: initializes the controller and setups defaults
         * */
        function activate() {
            vm.moviesList = [];


        }

        function onViewEnter(){
            vm.selectedHero = $stateParams.name;
            $q.when(moviesRepository.get(vm.selectedHero))
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
            "DataStore",
            "TableNames",
            moviesRepository
        ]
    );

    function moviesRepository($q,
                              moviesApi,
                              heroesRepository,
                              DataStore,
                              TableNames) {

        var TABLE_NAME = TableNames.Movies.Name,
            COLUMN = TableNames.Movies.Column,
            _cache = {};

        var _this = {
            load: load,
            get: get
        };


        /**
         * @description: Loads movies from the database to the cache.
         * */
        function load() {
            var selectQuery = squel.select()
                .from(TABLE_NAME)
                .field(COLUMN.key)
                .field(COLUMN.value);

            return DataStore.ExecuteQuery(selectQuery.toString()).then(function (results) {
                processResults(results);
                return $q.resolve();
            },$q.reject);
        }

        /**
         * @description: gets movies from the local storage first,
         * Alternately syncs with the omdb api and caches the data locally
         * @[inputs] - "string" name of selected hero.
         * */
        function get(selectedHero) {

            return $q.when(
                function(){
                    if (selectedHero){
                        return $q.resolve(selectedHero);
                    }else{
                        return heroesRepository.randomHero();
                    }
                }()
            )
                .then(function (hero) {
                    if (_cache[hero]) {
                        return $q.resolve(_cache[hero]);
                    } else {
                        return moviesApi.search(hero)
                            .then(function (response) {
                                //save it in local cache
                                applyChanges(response.hero, response.movies);

                                return $q.resolve(response.movies);
                            }, function () {
                                //TODO : log the error.
                                //TODO : resolve from local cache.
                                return $q.resolve([]);
                            });
                    }
                })
        }


        /**
         * @descriptions: processes movies retrieved from database.
         *  creates movies objects from sql results.
         * */
        function processResults(results) {

            if (results.rows.length > 0) {
                for (var count = 0; count < results.rows.length; count++) {
                    var rowValue = results.rows.item(count);
                    var hero = rowValue.key;
                    var movies = angular.fromJson(rowValue.value);
                    _cache[hero] = movies;
                }
            }
        }

        function applyChanges(hero, movies) {

            if (!movies || !movies.length) {
                return;
            }

            var insert_query = squel.insert()
                .into(TABLE_NAME)
                .set(COLUMN.key)
                .set(COLUMN.value)
                .toParam();

            //insert
            return DataStore.ExecuteQuery(insert_query.text, [hero, angular.toJson(movies)]).then(function (sucess) {
                // add to cache
                _cache[hero] = movies;
                return $q.resolve();

            }, function (error) {
                //TODO : Log error
            });
        }

        return _this;
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .controller("TabsController",
        [
            TabsController
        ]
    );

    function TabsController(){
        var vm = this;

        activate();

        function activate(){

        }
    }
})();
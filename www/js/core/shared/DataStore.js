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
                console.log("Executing query: " + query);
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

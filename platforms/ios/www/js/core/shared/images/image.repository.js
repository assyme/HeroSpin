(function () {
    "use strict";

    angular.module("starter")
        .factory("image.repository",
        [
            '$q',
            'DataStore',
            'GlobalSettings',
            'TableNames',
            imageRepository
        ]
    );

    /*
     * Stores images in sqlite databases and exposes api to interact with it.
     * */
    function imageRepository($q,
                             DataStore,
                             GlobalSettings,
                             TableNames) {

        var TABLE_NAME = TableNames.Images.Name,
            COLUMNS = TableNames.Images.Column,
            TEMP_LOCAL_STORAGE_KEY = "temp_images";

        var _this = {
            init: init,
            setItem: setItem,
            getItem: getItem,
            hasItem: hasItem,
            persist : persist,
            keyCache: {}
        };


        function init() {
            var defer = $q.defer();

            _this.keyCache = {};

            //load key/value into memory.
            //MAKE SURE YOU DON'T LOAD BASE64 images on mobile
            var queryBuilder = squel.select()
                .from(TABLE_NAME)
                .field(COLUMNS.key)
                .field(COLUMNS.value);

            _this.persist().then(function () {
                DataStore.ExecuteQuery(queryBuilder.toString()).then(function (sqlResultSet) {
                    for (var rowCount = 0; rowCount < sqlResultSet.rows.length; rowCount++) {
                        var row = sqlResultSet.rows.item(rowCount);

                        _this.keyCache[row[COLUMNS.key]] = GlobalSettings.APP_DATA_PATH + row[COLUMNS.value];
                    }

                    defer.resolve();
                });
            });

            return defer.promise;
        }

        function setItem(key, value, isDelayed) {
            var defer = $q.defer();

            if (isDelayed) {
                /*
                 * save it in the local storage for now. And persist in database during app load.
                 * or when persist is called.
                 * */
                var oldValues = window.localStorage.getItem(TEMP_LOCAL_STORAGE_KEY);
                if (oldValues) {
                    oldValues = angular.fromJson(oldValues);
                } else {
                    oldValues = {};
                }
                oldValues[key] = value;
                window.localStorage.setItem(TEMP_LOCAL_STORAGE_KEY, angular.toJson(oldValues));
            }

            var insertQueryBuilder = squel.insert()
                .into(TABLE_NAME)
                .set(COLUMNS.key, key)
                .set(COLUMNS.value, value)
                .toParam(); //returns {text:sqlQuery,values:[array of values]

            DataStore.ExecuteQuery(insertQueryBuilder.text, insertQueryBuilder.values)
                .then(defer.resolve, defer.reject);

            defer.promise.then(function () {
                //once item is in db save the key
                _this.keyCache[key] = GlobalSettings.APP_DATA_PATH + value;
            });

            return defer.promise;
        }

        function persist() {
            var temp_images = window.localStorage.getItem(TEMP_LOCAL_STORAGE_KEY),
                bindings = [];

            if (!temp_images) {
                return $q.resolve();
            }

            temp_images = angular.fromJson(temp_images);

            _.each(temp_images, function (value, key) {
                bindings.push([key, value]);
            });

            if (bindings.length < 1){
                return $q.resolve();
            }

            var insertQueryBuilder = squel.insert()
                .into(TABLE_NAME)
                .set(COLUMNS.key, "")
                .set(COLUMNS.value, "")
                .toParam();

            return DataStore.insertCollection(insertQueryBuilder.text, bindings).then(function () {
                //clear the localstorage
                window.localStorage.setItem(TEMP_LOCAL_STORAGE_KEY,angular.toJson({}));
                return $q.resolve();
            }, function (error) {
                return $q.reject(error);
            });
        }

        function getItem(key) {
            var defer = $q.defer();
            if (_this.hasItem(key)) {
                defer.resolve(_this.keyCache[key]);
            } else {
                defer.resolve(null);
            }

            return defer.promise;
        }

        function hasItem(key) {
            return typeof _this.keyCache[key] != "undefined";
        }

        return _this;
    }


})();

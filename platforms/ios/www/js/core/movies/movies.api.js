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
            search: search,
            detail: detail
        };

        /**
         * @description: Searches the imdb public api for the movie name
         * */
        function search(heroName) {

            var defer = $q.defer(),
                resolve = function (response) {
                    if (response.length) {
                        defer.resolve({
                            hero: heroName,
                            movies: response
                        });
                    } else {
                        defer.reject();
                    }
                },
                notify = function (response) {
                    if (response.length){
                        defer.notify({
                            hero : heroName,
                            movies : response
                        });
                    }
                };

            if (!heroName) {
                return $q.resolve([]);
            }

            var request = {
                api: CONSTANTS.URLS.searchUrl,
                method: 'GET',
                data: {
                    s: heroName,
                    page: 1
                }
            };


            BaseCommunicator.sendRequest(request)
                .then(resolve, defer.reject, notify);

            return defer.promise;

        }

        /**
         * @description: gets the detail of the movie
         * */
        function detail(movie_id) {

            var request = {
                api: CONSTANTS.URLS.searchUrl,
                method: 'GET',
                data: {
                    i: movie_id
                }
            };

            return BaseCommunicator.sendRequest(request)
                .then(function (response) {
                    return $q.resolve(response.data);
                });
        }

        return _this;
    }
})();
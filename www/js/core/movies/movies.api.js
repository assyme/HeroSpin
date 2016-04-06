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
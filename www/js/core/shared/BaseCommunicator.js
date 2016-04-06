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


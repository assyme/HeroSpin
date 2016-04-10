(function () {
    "use strict";

    angular.module("starter")
        .directive("imageCache",
        [
            'image.api',
            'image.repository',
            'GlobalSettings',
            imageCache
        ]
    );

    function imageCache(imageCommunicator, imageRepository, GlobalSettings) {
        return {
            restrict: 'A',
            bindToController: {
                imageCache: "@",
            },
            controller: ['$scope', '$element', '$attrs', Controller],
            controllerAs: "imageCacheVM",
            scope: {}
        };

        function Controller($scope, $element, $attrs) {
            var imageCacheVM = this;

            $attrs.$observe("imageCache", onImageCacheKeyChange);

            function onImageCacheKeyChange() {
                // get the image hash;
                var imageSrc = getImageSrc($attrs);

                if (!imageSrc) {
                    return;
                }
                debugger;
                if (imageSrc === "N/A"){
                    $element.attr('src', GlobalSettings.NO_IMAGE_URL);
                    return;
                }

                imageRepository.getItem(imageSrc)
                    .then(function (value) {
                        if (value) {
                            $element.attr('src', value);
                        } else {
                            imageCommunicator.downloadImage(imageSrc).then(function (response) {
                                $element.attr('src', GlobalSettings.APP_DATA_PATH + response);
                                imageRepository.setItem(imageSrc, response);
                            }, function (error) {
                                $element.attr('src', GlobalSettings.NO_IMAGE_URL);
                            });
                        }
                    });
            }
        }

        function getImageSrc(elementAttrs) {
            if (elementAttrs.imageCache.length > 0) {
                return elementAttrs.imageCache;
            } else if (elementAttrs.ngSrc) {
                return elementAttrs.ngSrc;
            } else if (elementAttrs.src) {
                return elementAttrs.src;
            } else {
                return null;
            }
        }
    }
})();
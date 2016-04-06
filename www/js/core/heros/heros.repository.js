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


        /**
        * @description: make factory methods exposed
        * */
        var _this = {
            get : get
        };

        /**
        * @description: Gets heroes from the local storage
        * */
        function get(){
            var heroes = [
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
            ];

            return heroes;
        }

        return _this;
    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .controller("HeroListController",
        [
            "$q",
            "$location",
            "heroes.repository",
            HeroListController
        ]
    );

    function HeroListController($q,
                                $location,
                                heroesRepository) {

        //this is basically the view model for the controller
        var vm = this;
        vm.heroList = [];
        vm.selectHero = heroSelected;
        vm.deleteHero = deleteHero;

        activate();

        function activate() {

            $q.when(heroesRepository.get())
                .then(function (heroes) {
                    vm.heroList = heroes;
                });
        }

        function heroSelected(selectedHero) {
            selectedHero.views += 1;
            heroesRepository.update(selectedHero);
            $location.path("/spin/random/" + selectedHero.name);
        }


        /**
         * @description: Deletes a hero from the app.
         * @inputs: [object] - hero to delete
         * */
        function deleteHero(hero) {

            if (!hero){
                return;
            }

            heroesRepository.delete(hero).then(function(){
                activate();
            });
        }

    }
})();
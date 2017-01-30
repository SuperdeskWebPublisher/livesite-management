containerControls.$inject = ['api'];
function containerControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'app/components/containerControls/containerControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.modalActive = false;

            scope.toggleModal = function () {
                scope.modalActive = !scope.modalActive;
            };

            scope.save = function () {
                // todo: save data
                scope.toggleModal();
            };

            scope.cancel = function () {
                //  todo: clear form or whatever is there to clear
                scope.toggleModal();
            };

        }
    };
}

angular.module('livesite-management.components.containerControls', [])
        .directive('swpContainer', containerControls);

controller.$inject = [];
function controller() {
    return {
        restrict: 'C',
        link: function (scope, elem, attr, ctrl) {

        }
    };
}

angular.module('livesite-management.components.contoller', [])
        .directive('swcContainer', controller);

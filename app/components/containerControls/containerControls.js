containerControls.$inject = [];
function containerControls() {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'components/containerControls/containerControls.html',
        link: function (scope, elem, attr, ctrl) {

        }
    };
}

angular.module('livesite-management.components.containerControls', [])
        .directive('swpContainer', containerControls);

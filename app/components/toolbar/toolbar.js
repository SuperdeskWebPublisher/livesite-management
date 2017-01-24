toolbar.$inject = [];
function toolbar() {
    return {
        templateUrl: 'components/toolbar/toolbar.html',
        link: function (scope, elem, attr, ctrl) {
            // temp
            scope.toolbarActive = false;
            scope.toggleToolbar = function() {
                scope.toolbarActive = !scope.toolbarActive;
            }
            //
        }
    };
}

angular.module('livesite-management.components.toolbar', [])
        .directive('toolbar', toolbar);

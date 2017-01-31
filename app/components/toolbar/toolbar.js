toolbar.$inject = [];
function toolbar() {
    return {
        templateUrl: 'app/components/toolbar/toolbar.html',
        link: function (scope, elem, attr, ctrl) {
            scope.toolbarActive = false;
            scope.toggleToolbar = function () {
                scope.toolbarActive = !scope.toolbarActive;
                document.body.classList.toggle('leActive');
            };
        }
    };
}

angular.module('livesite-management.components.toolbar', [])
        .directive('toolbar', toolbar);

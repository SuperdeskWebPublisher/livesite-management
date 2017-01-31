widgetControls.$inject = [];
function widgetControls() {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'app/components/widgetControls/widgetControls.html',
        link: function (scope, elem, attr, ctrl) {
            var controls = elem.find('.leBlockControls');
            elem.on('mouseover', function () {
                controls.show();
            });
            elem.on('mouseleave', function () {
                controls.hide();
            });
        }
    };
}

angular.module('livesite-management.components.widgetControls', [])
        .directive('swpWidget', widgetControls);

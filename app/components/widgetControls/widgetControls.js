widgetControls.$inject = ['api'];
function widgetControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'app/components/widgetControls/widgetControls.html',
        link: function (scope, elem, attr, ctrl) {
            var controls = elem.find('.leBlockControls');
            scope.widgetID = elem[0].id.replace(/^\D+/g, '');

            api.get('templates/widgets', scope.widgetID).then(function (widget) {
                scope.widget = widget;
            });

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


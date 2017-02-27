widgetControls.$inject = ['api'];
function widgetControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'app/components/widgetControls/widgetControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.widgetID = elem[0].id.replace(/^\D+/g, '');

            api.get('templates/widgets', scope.widgetID).then((widget) => {
                scope.widget = widget;
            });

            scope.edit = (widget) => {
                scope.$parent.toggleModal();
                scope.$parent.editWidget(widget);
            };

        }
    };
}

angular.module('livesite-management.components.widgetControls', [])
        .directive('swpWidget', widgetControls);




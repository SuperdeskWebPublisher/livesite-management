widgetControls.$inject = ['api', '$rootScope'];
function widgetControls(api, $rootScope) {
    return {
        restrict: 'C',
        scope: {
            type: '@widgetType',
            listType: '@listType',
            listId: '@listId',
            containerId: '@container'
        },
        transclude: true,
        templateUrl: 'app/components/widgetControls/widgetControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.widgetID = elem[0].id.replace(/^\D+/g, '');

            api.get('templates/widgets', scope.widgetID).then((widget) => {
                scope.widget = widget;
            });

            scope.edit = (widget) => {
                $rootScope.$broadcast('editWidget', {widget: widget, container: scope.containerId});
            };

            scope.editList = (type, id, container) => {
                $rootScope.$broadcast('editContentList', {
                    type: type,
                    id: id,
                    container: container
                });
            };
        }
    };
}

angular.module('livesite-management.components.widgetControls', [])
        .directive('swpWidget', widgetControls);




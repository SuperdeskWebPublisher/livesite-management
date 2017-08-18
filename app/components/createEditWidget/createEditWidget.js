createEditWidget.$inject = ['api'];
function createEditWidget(api) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'app/components/createEditWidget/createEditWidget.html',
        link: function(scope, elem, attr, ctrl) {

            scope.action = scope.$parent.subroute.action;
            scope.type = scope.$parent.subroute.type.toLowerCase();

            if (scope.$parent.subroute.hasOwnProperty('widget')) {
                // had to create new object bcs api rejects extra fields
                scope.widget = {
                    'id' : angular.copy(scope.$parent.subroute.widget.id),
                    'name' : angular.copy(scope.$parent.subroute.widget.name),
                    'type' : angular.copy(scope.$parent.subroute.widget.type),
                    'visible' : 'true',
                    'parameters' : angular.copy(scope.$parent.subroute.widget.parameters)
                };
            } else {
                scope.widget = {
                    'name' : '',
                    'visible' : 'true',
                    'type' : scope.type,
                    'parameters' : {}
                };
            }

            scope.availableMenus = [];
            scope.availableContentLists = [];

            scope.getMenus = () => {
                scope.busyPromise = api.get('menus').then((response) => {
                    scope.availableMenus = response._embedded._items;
                });
            };

            scope.getContentLists = () => {
                scope.busyPromise = api.get('content/lists').then((response) => {
                    scope.availableContentLists = response._embedded._items;
                });
            };

            scope.getTemplates = () => {
                scope.busyPromise = api.get('templates/widgets/templates').then((response) => {
                    scope.availableTemplates = response;
                });
            };

            scope.setRoute = (route) => {
                scope.widget = {};
                scope.$parent.setRoute(route);
            };

            scope.toggleModal = () => {
                scope.widget = {};
                scope.$parent.toggleModal();
            };

            scope.save = () => {
                let id = scope.widget.id ? scope.widget.id : '';
                // api throws error when extra params are included. Temp hack
                delete scope.widget.id;
                scope.busyPromise = api.save('templates/widgets', {widget: scope.widget}, id).then((response) => {
                    if (id) {
                        scope.setRoute('main');
                    } else {
                        scope.setRoute('linkWidget');
                    }
                });
            };

            scope.cancel = () => {
                scope.setRoute('main');
            };

            // temp hack until they standardize type in api widget object
            if (/menu/.test(scope.type)) {
                scope.type = "menu";
                scope.readableType = "Menu";
                scope.widget.type = 3;
                scope.getMenus();
            } else if (/html/.test(scope.type)) {
                scope.type = "html";
                scope.readableType = "HTML Block";
                scope.widget.type = 1;
                scope.getTemplates();
            } else if (/adsense/.test(scope.type)) {
                scope.type = "adsense";
                scope.readableType = "AdSense";
                scope.widget.type = 2;
            } else if (/contentlist/.test(scope.type)) {
                scope.type = "contentList";
                scope.readableType = "Content List";
                scope.widget.type = 4;
                scope.getContentLists();
                scope.getTemplates();
            }
        }
    };
}

function capitalize() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
}

angular.module('livesite-management.components.createEditWidget', [])
.directive('swpCreateEditWidget', createEditWidget)
.filter('capitalize', capitalize);

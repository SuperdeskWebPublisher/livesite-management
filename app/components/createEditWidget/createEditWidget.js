createEditWidget.$inject = ['api'];
function createEditWidget(api) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'app/components/createEditWidget/createEditWidget.html',
        link: function(scope, elem, attr, ctrl) {

            scope.type = scope.$parent.subroute.type;
            scope.action = scope.$parent.subroute.action;
            scope.widget = {};
            scope.widget.visible = 1;

            scope.availableMenus = [];
            scope.availableContentLists = [];

            scope.getMenus = () => {
                api.get('menus').then((response) => {
                    scope.availableMenus = response._embedded._items;
                });
            };

            scope.getContentLists = () => {
                api.get('content/lists').then((response) => {
                    scope.availableContentLists = response._embedded._items;
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
                api.save('templates/widgets', {widget: scope.widget}).then(function(response) {
                    scope.widget = {};
                    scope.$parent.setRoute('linkWidget');
                });
            };

            scope.cancel = () => {
                scope.widget = {};
                scope.$parent.setRoute('main');
            };

            switch (scope.type) {
               case "menu":
                  scope.readableType = "Menu";
                  scope.widget.type = 3;
                  scope.getMenus();
                  break;
               case "adsense":
                  scope.readableType = "AdSense";
                  scope.widget.type = 2;
                  break;
               case "contentList":
                  scope.readableType = "Content List";
                  scope.widget.type = 4;
                  scope.getContentLists();
                  break;
               case "html":
                  scope.readableType = "HTML Block";
                  scope.widget.type = 1;
                  break;
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

containerControls.$inject = ['api'];
function containerControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        scope: {},
        templateUrl: 'app/components/containerControls/containerControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.modalActive = false;
            scope.containerID = elem[0].id.split('_').pop();
            scope.route = 'main';

            scope.getContainer = (containerId) => {
                api.get('templates/containers', containerId).then((container) => {
                    scope.container = container;
                    scope.assignedWidgets = [];
                    container.widgets.forEach(function (el, i) {
                        scope.assignedWidgets.push(el.widget.id);
                    });
                });
            };

            scope.getAvailableWidgets = () => {
                api.query('templates/widgets', {'limit':1000}).then((availableWidgets) => {
                    scope.availableWidgets = availableWidgets;
                });
            };

            scope.setRoute = (route, subroute) => {
                if (route == 'linkWidget') {
                    scope.getAvailableWidgets();
                } else  if (route == 'main') {
                    scope.getContainer(scope.container.id);
                }

                scope.route = route;
                scope.subroute = subroute;
            };

            scope.toggleModal = () => {
                scope.route = 'main';
                scope.modalActive = !scope.modalActive;
            };

            scope.createWidget = (type) => {
                let subroute = {'action' : 'create', 'type' : type};
                scope.setRoute('createEditWidget', subroute);
            };

            scope.editWidget = (widget) => {
                let subroute = {'action' : 'edit', 'type' : widget.type, 'widget' : widget};
                scope.setRoute('createEditWidget', subroute);
            };

            scope.linkWidget = (widget) => {
                var header = '</api/v1/templates/widgets/' + widget.id + '; rel="widget">';
                api.link('templates/containers', scope.container.uuid, header).then(() => {
                    scope.getContainer(scope.container.uuid);
                });
            };

            scope.unlinkWidget = (widget) => {
                var header = '</api/v1/templates/widgets/' + widget.id + '; rel="widget">';
                api.unlink('templates/containers', scope.container.uuid, header).then(() => {
                    scope.getContainer(scope.container.uuid);
                });
            };

            scope.reorderWidget = (widget, position) => {
                if (position > widget.position) {
                    position--;
                }

                if (widget.position != position) {
                    var header = '</api/v1/templates/widgets/' + widget.widget.id + '; rel="widget">,<' + position + '; rel="widget-position">';
                    api.link('templates/containers', scope.container.uuid, header).then((response) => {
                        scope.getContainer(scope.container.uuid);
                    });
                }
            };

            scope.save = () => {
                // reload container content
                api.get('templates/containers/'+scope.container.uuid+'/render').then((response) => {
                    elem.find('ng-transclude').html(response.content);
                });
                scope.toggleModal();
            };

            scope.cancel = () => {
                scope.setRoute('main');
                scope.toggleModal();
            };

            scope.getContainer(scope.containerID);
        }
    };
}

angular.module('livesite-management.components.containerControls', [])
        .directive('swpContainer', containerControls);

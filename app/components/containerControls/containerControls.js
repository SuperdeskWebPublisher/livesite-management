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
                });
            };

            scope.getAvailableWidgets = () => {
                api.query('templates/widgets').then((availableWidgets) => {
                    scope.availableWidgets = availableWidgets;
                });
            };

            scope.setRoute = (route, subroute) => {
                if (route == 'linkWidget') {
                    scope.getAvailableWidgets();
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
                // todo: reload page or container content
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

containerControls.$inject = ['api'];
function containerControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'app/components/containerControls/containerControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.modalActive = false;
            scope.containerID = elem[0].id.replace(/^\D+/g, '');
            scope.route = 'main';

            api.query('templates/widgets').then(function (availableWidgets) {
                scope.availableWidgets = availableWidgets;
            });

            api.get('templates/containers', scope.containerID).then(function (container) {
                scope.container = container;
                scope.containerWidgets = container.widgets;
            });

            scope.setRoute = function(route){
                scope.route = route;
            };

            scope.toggleModal = function () {
                scope.modalActive = !scope.modalActive;
                scope.addingWidgets = false;
                scope.widgets = scope.containerWidgets;
                scope.containerID = elem[0].id.replace(/^\D+/g, '');
                api.get('templates/containers', scope.containerID).then(function (container) {
                    scope.container = container;
                    scope.containerWidgets = container.widgets;
                });
            };

            scope.addWidgets = function () {
                scope.setRoute('linkWidget');
                scope.widgets = scope.availableWidgets;
            };

            scope.createWidget = function () {
                scope.setRoute('createWidget');
            };

            scope.pickWidget = function (widget) {
                if (!widget.widget) {
                    var header = '</api/v1/templates/widgets/' + widget.id + '; rel="widget">';
                    api.link('templates/containers', scope.container.id, header).then(function (response) {
                        console.log('linking widget', response);
                    });
                }
            };

            scope.save = function () {
                // todo: save data
                scope.toggleModal();
            };

            scope.cancel = function () {
                //  todo: clear form or whatever is there to clear
                scope.setRoute('main');
                scope.toggleModal();
            };

        }
    };
}

containerControlsModal.$inject = [];
function containerControlsModal() {
    return {
        templateUrl: 'app/components/containerControls/containerControlsModal.html'
    };
}

widgetsList.$inject = [];
function widgetsList() {
    return {
        templateUrl: 'app/components/containerControls/views/widgetsList.html'
    };
}

linkWidget.$inject = [];
function linkWidget() {
    return {
        templateUrl: 'app/components/containerControls/views/linkWidget.html'
    };
}

createWidget.$inject = [];
function createWidget() {
    return {
        templateUrl: 'app/components/containerControls/views/createWidget.html'
    };
}

angular.module('livesite-management.components.containerControls', [])
        .directive('swpContainerControlsModal', containerControlsModal)
        .directive('swpContainer', containerControls)
        .directive('swpContainerWidgetsList', widgetsList)
        .directive('swpContainerLinkWidget', linkWidget)
        .directive('swpContainerCreateWidget', createWidget);

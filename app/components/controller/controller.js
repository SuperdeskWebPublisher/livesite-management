import './controller.scss';

controller.$inject = [];
function controller() {
    return {
        restrict: 'C',
        transclude: true,
        templateUrl: 'components/controller/controller.html',
        link: function (scope, elem, attr, ctrl) {
            var floatingPanel = elem.find('.floating-controller');

            floatingPanel.appendTo(document.body);

            elem.on('mouseover', function () {
                floatingPanel.css({
                    position: 'absolute',
                    left: elem.offset().left + elem.outerWidth() - floatingPanel.outerWidth() + 10,
                    top: elem.offset().top - floatingPanel.outerHeight() - 10
                }).show();
            });

            elem.on('mouseleave', function () {
                floatingPanel.hide();
            });
        }
    };
}

angular.module('livesite-management.components.contoller', [])
        .directive('swcContainer', controller);

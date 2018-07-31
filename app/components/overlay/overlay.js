function overlay() {
    return {
        templateUrl: 'app/components/overlay/overlay.html',
    };
}

angular.module('livesite-management.components.overlay', [])
        .directive('overlay', overlay);

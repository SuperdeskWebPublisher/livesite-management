import 'components/toolbar/toolbar';
import 'components/containerControls/containerControls';
import 'components/widgetControls/widgetControls';

let components = angular.module('livesite-management.components', [
    'livesite-management.components.toolbar',
    'livesite-management.components.containerControls',
    'livesite-management.components.widgetControls'
]);

export default components;

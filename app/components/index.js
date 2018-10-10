import 'components/toolbar/toolbar';
import 'components/containerControls/containerControls';
import 'components/widgetControls/widgetControls';
import 'components/contentListEditor/contentListEditor';
import 'components/createEditWidget/createEditWidget';


let components = angular.module('livesite-management.components', [
    'livesite-management.components.toolbar',
    'livesite-management.components.containerControls',
    'livesite-management.components.widgetControls',
    'livesite-management.components.contentListEditor',
    'livesite-management.components.createEditWidget'
]);

export default components;

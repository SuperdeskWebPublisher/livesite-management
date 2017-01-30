import 'core/api/api';

// This module gets overwritten when building for production to create template
// cache. For more information, see the `grunt ngtemplates:core` task.
angular.module('livesite-management.templates-cache', []);

let core = angular.module('livesite-management.core', [
    'livesite-management.core.api',
    'livesite-management.templates-cache'
]);

export default core;

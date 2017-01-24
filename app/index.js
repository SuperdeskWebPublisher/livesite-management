import angular from 'angular';

import 'components';
import 'core';

angular.module('livesite-management', [
    'livesite-management.core',
    'livesite-management.components'
]);

export default 'livesite-management';

import angular from 'angular';

import 'components';
import 'core';
import 'style';
import 'vendor';

angular.module('livesite-management', [
    'superdesk-ui',
    'livesite-management.core',
    'livesite-management.components'
]);

export default 'livesite-management';

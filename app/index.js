/* global __BASE_CONFIG__ */

import angular from 'angular';
import 'vendor';
import 'core';
import 'components';
import 'style';

import 'templates-cache.generated';

angular.module('livesite-management', [
    'superdesk-ui',
    'dndLists',
    'livesite-management.core',
    'livesite-management.components'

]).run(function ($document) {
    $document[0].body.prepend(document.createElement('toolbar'));
}).constant('config', __BASE_CONFIG__);

export default 'livesite-management';

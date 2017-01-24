import angular from 'angular';

import 'vendor';

import 'components';
import 'core';
import 'style';

angular.module('livesite-management', [
    'superdesk-ui',
    'livesite-management.core',
    'livesite-management.components'

]).run(function ($document) {
    $document[0].body.prepend(document.createElement('toolbar'));
    $document[0].body.className += 'livesite-editing';
});

export default 'livesite-management';

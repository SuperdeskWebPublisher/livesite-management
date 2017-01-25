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

});

export default 'livesite-management';

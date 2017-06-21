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
    'livesite-management.components',
    'cgBusy'

])
.run(function ($document) {
    $document[0].body.prepend(document.createElement('toolbar'));
})
.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])
.constant('config', __BASE_CONFIG__)
.value('cgBusyDefaults',{
  message:'',
  delay: 200,
  backdrop: false
});


export default 'livesite-management';

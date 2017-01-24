import 'components/toolbar/toolbar';
import 'components/controller/controller';

let components = angular.module('livesite-management.components', [
    'livesite-management.components.toolbar',
    'livesite-management.components.contoller'

]).run(function ($document) {
    $document[0].body.prepend(document.createElement('toolbar'));
});

export default components;

toolbar.$inject = ['api', '$cookies'];
function toolbar(api, $cookies) {
    return {
        templateUrl: 'app/components/toolbar/toolbar.html',
        link: function (scope, elem, attr, ctrl) {
            let authCookie = $cookies.get('activate_livesite_editor');
            
            if (authCookie) {
                sessionStorage.setItem('activate_livesite_editor', authCookie);
                $cookies.remove('activate_livesite_editor');
            }

            let authSession = sessionStorage.getItem('activate_livesite_editor');

            if (authSession) {
                api.setToken(authSession);
                scope.livesiteActivated = true;
            }

            scope.workStage = localStorage.getItem('workStage');
            scope.toolbarActive = false;

            scope.toggleToolbar = () => {
                scope.toolbarActive = !scope.toolbarActive;
                document.body.classList.toggle('leOpen');

                if (scope.workStage === 'revision') {
                    document.body.classList.toggle('leActive');
                }

                if (scope.toolbarActive) {
                    if (!scope.workStage) {
                        scope.setStage('revision');
                    }
                } else {
                    scope.workStage = undefined;
                    localStorage.removeItem('workStage');
                }
            };

            scope.setStage = (stage) => {
                if (scope.workStage !== stage) {
                    localStorage.setItem('workStage', stage);
                    scope.busyPromise = api.save(stage === 'revision' ? 'templates/revision/lock/working' : 'templates/revision/unlock/working')
                        .then(() => {
                            location.reload();
                        });
                }
            };

            scope.publishChanges = (stage) => {
                scope.busyPromise = api.save('templates/revision/publish')
                    .then(() => {
                        localStorage.removeItem('workStage');
                        location.reload();
                    });
            };

            if (api.getToken()) {
                scope.toggleToolbar();
            }
        }
    };
}

angular.module('livesite-management.components.toolbar', [])
        .directive('toolbar', toolbar);

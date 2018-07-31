contentListEditor.$inject = ['api', '$rootScope', '$compile', '$timeout'];
function contentListEditor(api, $rootScope, $compile, $timeout) {
    return {
        templateUrl: 'app/components/contentListEditor/contentListEditor.html',
        scope: {},
        link: function (scope, elem, attr, ctrl) {
            scope.active = false;
            scope.allArticlesPaneActive = false;
            scope.tenantArticles = {
                page: 0,
                params: {}
            };

            scope.toggle = (open) => {
                scope.allArticlesPaneActive = false;
                scope.active = open ? true : !scope.active;
                if (open) {
                    document.body.classList.add('leContentListEditorOpen');
                } else {
                    document.body.classList.toggle('leContentListEditorOpen');
                }
            };

            scope.pinArticle = (article) => {
                scope.busyPromise = api.save('content/lists/' + scope.list.id + '/items', {content_list_item: {sticky: !article.sticky}}, article.id)
                    .then((item) => {
                        this._rerenderContainer(scope);
                        return this._queryItems(scope);
                    });
            };

            scope.$on('editContentList', (event, data) => {
                scope.toggle(true);
                scope.list = {};
                scope.containerId = data.container;
                scope.busyPromise = api.get('content/lists', data.id)
                    .then((response) => {
                        scope.list = response;
                        return this._queryItems(scope);
                    });
            });

            // manual list

            scope.onDrop = (list, item, index) => {
                scope.listChangeFlag = true;

                if (!list.updatedItems) {
                    list.updatedItems = [];
                }

                let selectedItemId = item.content ? item.content.id : item.id;
                let itemAction = _.find(list.items,
                    item => (item.id === selectedItemId && !item.content) || (item.content && item.content.id === selectedItemId)) ? 'move' : 'add';

                list.updatedItems.push({content_id: selectedItemId, action: itemAction, position: index});

                if (itemAction === 'add') {
                    $timeout(() => {
                        scope.updatePositions(list);
                    }, 500);
                }
                return item;
            };

            scope.onMoved = (list, index) => {
                list.items.splice(index, 1);
                scope.updatePositions(list);
            };

            scope.removeFromList = (index) => {
                let deletedItem;
                let selectedItemId;
                let updatedItem;

                if (!scope.list.updatedItems) {
                    scope.list.updatedItems = [];
                }

                deletedItem = scope.list.items.splice(index, 1);
                selectedItemId = deletedItem[0].content ? deletedItem[0].content.id : deletedItem[0].id;
                updatedItem = _.find(scope.list.updatedItems, {content_id: selectedItemId});
                if (!updatedItem) {
                    scope.list.updatedItems.push({content_id: selectedItemId, action: 'delete'});
                } else if (updatedItem.action === 'move') {
                    // removes old one and adds delete action
                    scope.list.updatedItems.splice(scope.list.updatedItems.indexOf(updatedItem), 1);
                    scope.list.updatedItems.push({content_id: selectedItemId, action: 'delete'});
                } else {
                    scope.list.updatedItems.splice(scope.list.updatedItems.indexOf(updatedItem), 1);
                }

                scope.markDuplicates(scope.list.items);
                scope.listChangeFlag = true;
            };

            scope.updatePositions = (list) => {
                if (!list.updatedItems) {
                    list.updatedItems = [];
                }
                for (let i = 0; i < list.updatedItems.length; i++) {
                    let itemInList = _.find(list.items, {content: {id: list.updatedItems[i].content_id}}) ||
                            _.find(list.items, {id: list.updatedItems[i].content_id});

                    list.updatedItems[i].position = list.items.indexOf(itemInList);
                }
            };

            scope.markDuplicates = (array) => {
                $timeout(() => {
                    array.forEach(el => {
                        let elId =  el.content ? el.content.id : el.id;
                        let result = array.filter(element => {
                            let elementId = element.content ? element.content.id : element.id;
                            return elId === elementId;
                        });
                        el.duplicate = result.length > 1 ? true : false;
                    })
                }, 500);
            };

            scope.saveManualList = () => {
                api.patch('content/lists/' + scope.list.id + '/items', {content_list: {items: scope.list.updatedItems, updated_at: scope.list.updatedAt}})
                    .then((savedList) => {
                        scope.list.updatedAt = savedList.updatedAt;
                        scope.list.updatedItems = [];
                        this._rerenderContainer(scope);
                        scope.listChangeFlag = false;
                    });
            };

            scope.allArticlesPaneToggle = () => {
                scope.allArticlesPaneActive = !scope.allArticlesPaneActive;
                if (scope.allArticlesPaneActive) {
                    this._queryArticles(scope);
                } else {
                    scope.tenantArticles = {
                        page: 0,
                        params: {}
                    };
                }
            };

            scope.loadMoreTenantArticles = () => {
                if (scope.tenantArticles.loading || scope.tenantArticles.page >= scope.tenantArticles.totalPages) {
                    return;
                }

                scope.tenantArticles.params.page = scope.tenantArticles.page + 1;
                this._queryArticles(scope);
            };

            scope.filterTenantArticles = () => {
                scope.tenantArticles.params.page = 1;
                this._queryArticles(scope);
            };

        },
        _queryArticles: (scope) => {
            scope.tenantArticles.loading = true;
            scope.tenantArticles.params.limit = 20;
            scope.tenantArticles.params['sorting[updatedAt]'] = 'desc';
            scope.tenantArticles.params.status = 'published';

            api.queryWithDetails('content/articles', scope.tenantArticles.params).then((response) => {
                response._embedded._items.forEach(el => {
                    el.type = 'tenant';
                });
                scope.tenantArticles.loading = false;
                scope.tenantArticles.page = response.page;
                scope.tenantArticles.totalPages = response.pages;
                scope.tenantArticles.items = response.page > 1 ?
                    scope.tenantArticles.items.concat(response._embedded._items) :
                    response._embedded._items;
            });
        },
        _queryItems: (scope) => {
            return api.query('content/lists/' + scope.list.id + '/items', {limit: 9999})
                .then((response) => {
                    scope.list.items = response;
                    scope.list.items.forEach(el => {
                        el.type = 'list';
                    });
                });
        },
        _rerenderContainer: (scope) => {
            // reload container content
            api.get('templates/containers/' + scope.containerId + '/render?onlyWidgets=true').then((response) => {
                let container = angular.element('#swp_container_' + scope.containerId);
                container.find('ng-transclude').html(response.content);
                $compile(container.find('ng-transclude').contents())(scope);
            });
        }
    };
}

angular.module('livesite-management.components.contentListEditor', [])
        .directive('contentListEditor', contentListEditor);

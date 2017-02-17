APIFactory.$inject = ['$http', '$q', 'config'];
export function APIFactory($http, $q, config) {
    class API {
        constructor() {
            this._base = config.base || '';
            this._protocol = config.protocol || 'http';
            this._domain = config.domain || '';
            this.setTenant(config.tenant || 'default');
        }

        /**
         * @ngdoc method
         * @name api#setTenant
         * @param {String} tenant
         * @description Change the tenant we are using the api for
         */
        setTenant(tenant) {
            this._tenant = tenant;
            this._server = this.buildServerURL();
        }

        /**
         * @ngdoc method
         * @name api#buildServerURL
         * @returns {String}
         * @description Builds base server URL of the site.
         */
        buildServerURL() {
            let subdomain = this._tenant === 'default' ? '' : `${this._tenant}.`;

            return `${this._protocol}://${subdomain}${this._domain}`;
        }

        /**
         * @ngdoc method
         * @name api#query
         * @param {String} resource
         * @param {Object} params
         * @returns {Promise}
         * @description Query resource
         */
        query(resource, params) {
            return this.req({
                url: this.resourceURL(resource),
                method: 'GET',
                params: params
            }).then((response) => response._embedded._items);
        }

        /**
         * @ngdoc method
         * @name api#get
         * @param {String} resource
         * @param {Number} id
         * @returns {Promise}
         * @description GET a given resource by id.
         */
        get(resource, id) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'GET'
            });
        }

        /**
         * @ngdoc method
         * @name api#save
         * @param {String} resource
         * @param {Object} item - item which is saved
         * @param {String} id - id of item which is saved
         * @returns {Promise}
         * @description Save an item
         */
        save(resource, item, id) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: id ? 'PATCH' : 'POST',
                data: item
            }).then((response) => {
                angular.extend(item, response);
                return response;
            });
        }

        /**
         * @ngdoc method
         * @name api#link
         * @param {String} resource
         * @param {String} id - id of item which is saved
         * @param {Object} header - header which need to be sent
         * @returns {Promise}
         * @description Link an item
         */
        link(resource, id, header) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'LINK',
                headers: {link: header, Authorization: 'dGVzdF90b2tlbjo='}
            }).then((response) => {
                return response;
            });
        }

        /**
         * @ngdoc method
         * @name api#unlink
         * @param {String} resource
         * @param {String} id - id of item which is saved
         * @param {Object} header - header which need to be sent
         * @returns {Promise}
         * @description Unlink an item
         */
        unlink(resource, id, header) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'UNLINK',
                headers: {link: header, Authorization: 'dGVzdF90b2tlbjo='}
            }).then((response) => {
                return response;
            });
        }

        /**
         * @ngdoc method
         * @name api#remove
         * @param {String} resource
         * @param {String} id - id of item which is deleted
         * @returns {Promise}
         * @description Remove an item
         */
        remove(resource, id) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'DELETE'
            });
        }

        /**
         * @ngdoc method
         * @name api#resourceURL
         * @param {String} resource
         * @param {String} id
         * @returns {String}
         * @description Get resource url
         */
        resourceURL(resource, id = '') {
            return `${this._server}/${this._base}/${resource}/${id}`;
        }

        /**
         * @ngdoc method
         * @name api#req
         * @param {Object} config
         * @returns {Promise}
         * @description API Request - Adds basic error reporting, eventually authentication
         */
        req(config) {
            return $http(config).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.data;
                }

                console.error(' api error', response);
                return $q.reject(response);
            });
        }
    }

    return new API();
}

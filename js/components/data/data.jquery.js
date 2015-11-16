/**
 * jQuery based data extension for mosaic, implements the mosaic 'data' api and message envelope:
 *
 *  mosaic.data.action(model, id, action [, data])
 *  =>  {
 *          topic: 'action.<model>.<id>.<action>',
 *          data: <model key-value pairs>,
 *          {
 *              status: 'ok',
 *              fields: {
 *                 ID: { <meta-data> },
 *                 Field1: { <meta-data> },
 *                 Field2: { <meta-data> }
 *              },
 *              filters: {
 *                  ID: <id>
 *              }
 *      }
 *
 *
 *  mosaic.data.model.load(model, id)
 *  =>   {
 *          topic: 'model.<model>.<id>.loaded',
 *          data: <model field-value pairs>,
 *          {
 *             status: 'ok',
 *             action: 'get',
 *             fields: {
 *                 ID: { <meta-data> },
 *                 Field1: { <meta-data> },
 *                 Field2: { <meta-data> }
 *             },
 *             filters: {
 *                  ID: <id>
 *             }
 *          }
 *      }
 *
 *  mosaic.data.model.add(model, data)
 *  =>    {
 *          topic: 'model.<model>.<id>.added',
 *          data: <model field-value pairs>,
 *          {
 *             status: 'ok',
 *             action: 'add',
 *             fields: {
 *                 ID: { <meta-data> },
 *                 Field1: { <meta-data> },
 *                 Field2: { <meta-data> }
 *             }
 *          }
 *      }
 *
 *  mosaic.data.model.update(model, id [, data])
 *  =>    {
 *          topic: 'model.<model>.<id>.updated',
 *          data: <model field-value pairs>,
 *          {
 *             status: 'ok',
 *             action: 'update',
 *             fields: {
 *                 ID: { <meta-data> },
 *                 Field1: { <meta-data> },
 *                 Field2: { <meta-data> }
 *             },
 *             filters: {
 *                 ID: <id>
 *             }
 *          }
 *      }
 *
 *  mosaic.data.model.remove(model, id [, data])
 *  =>    {
 *          topic: 'model.<model>.<id>.removed',
 *          data: null,
 *          {
 *              status: 'ok',
 *              action: 'remove'
 *
 *          }
 *      }
 *
 *  mosaic.data.list.load(model [, sort] [, filters] [, fields])
 *  =>    {
 *          topic: 'list.<model>.loaded',
 *          data: {
 *              <id>: {
 *                  ID: <id>,
 *                  Field1: <value>,
 *                  Field2: <value>
 *              },
 *              <id>: {
 *                  ID: <id>,
 *                  Field1: <value>,
 *                  Field2: <value>
 *              }
 *          },
 *          {
 *              status: 'ok',
 *              count: <count of models returned>,
 *              filters: <filters object>,
 *              fields: <returned fields meta-data>
 *              ids: [<list of all ids returned>],
 *              added: [<array of record ids added since last list for this model and filters> ],
 *              removed: [<array of record ids not returned since last list for this model and filters>]
 *              requestID: <uniqueID>
 *          }
 *      }
 * @param options object implementation specific options
 * @param mosaic Mosaic instance being extended
 */
Mosaic.prototype.data = function (options, mosaic) {
    var defaults = {
            actions: {
                // map internal action to an action to use when building urls
                get: '',
                list: 'list',
                post: '',
                remove: ''
            },
            methods: {
                get: 'GET',
                list: 'GET',
                post: 'POST',
                remove: 'DELETE'
            },
            accept: {
                get: 'application/json',
                list: 'application/json'
            },
            contentType: {
                post: 'application/x-www-form-urlencoded',
                remove: 'application/x-www-form-urlencoded'
            }
        },
        dispatched = {};


    function start(type, model, id, requestInfo, jqxhr) {
        var topic = topic(type, model, id, requestInfo.action);

        dispatched[request.uniqueID] = _.assign(
            requestInfo,
            {
                topic: topic,
                xhr: jqxhr
            }
        );

        mosaic.pub.data(
            topic,
            {},
            _.assign(
                {
                    status: 'start'
                },
                requestInfo
            )
        );
    }

    function end(model, requestInfo) {
        var topic = topic(model, requestInfo.modelID, requestInfo.action);

        delete dispatched[requestInfo.uniqueID];

        mosaic.pub.data(
            topic,
            {},
            _.assign(
                {
                    status: 'end'
                },
                requestInfo
            )
        );
    }

    function actioned(model, id, action, requestInfo) {
        return function (response) {
            mosaic.actions.data(
                topic('action', model, id, action),
                response,
                _.assign(
                    {
                        status: 'ok'
                    },
                    requestInfo
                )
            );
        }
    }

    // callback factory for get action
    function got(model, id, requestInfo) {
        return function (response) {
            mosaic.pub.data(
                topic('model', model, id),
                response,
                _.assign(
                    {
                        status: 'ok',
                    },
                    requestInfo
                )
            );
        }
    }

    // callback factory for list action, returns a function which publishes a message for each item returned on the
    // data channel, and a generic 'list' message with all items.
    function listed(model, requestInfo) {
        return function (response) {
            mosaic.pub.ui(
                topic(model, 'listed'),
                response,
                _.assign(
                    {
                        status: 'ok',
                        count: _.size(response)
                    },
                    requestInfo
                )
            );
            _.forEach(response, function (item) {
                mosaic.pub.data(
                    topic(model, item.ID),
                    item,
                    _.assign(
                        {
                            status: 'ok'
                        },
                        requestInfo
                    )
                );
            });
        };
    }

    function added(model, requestInfo) {
        return function (response) {
            var id = fields(response)('ID');

            mosaic.pub.data(
                topic(model, id, 'created'),
                response,
                _.assign(
                    {
                        status: 'ok'
                    },
                    requestInfo
                )
            );
            mosaic.pub.ui(
                topic(model, id, 'created'),
                response,
                _.assign(
                    {
                        status: 'ok'
                    },
                    requestInfo
                )
            );
        }
    }

    function updated(model, id, requestInfo) {
        return function (response) {
            var topic = topic('model', model, id, 'updated');

            mosaic.pub.ui(
                topic,
                response,
                _.assign(
                    requestInfo || {},
                    {
                        status: 'ok'
                    }
                )
            );
            _.forEach(data, function (item) {
                mosaic.pub.data(
                    topic,
                    item,
                    _.assign(
                        requestInfo || {},
                        {
                            status: 'ok',
                        }
                    )
                );
            });
        }
    }

    function removed(model, id, requestInfo) {
        return function (response) {
            var topic = topic('model', 'removed', model, id);

            mosaic.pub.ui(
                topic,
                response,
                _.assign(
                    requestInfo,
                    {
                        status: 'ok'
                    }
                )
            );
            mosaic.pub.data(
                topic,
                response,
                _.assign(
                    {
                        status: 'ok'
                    },
                    requestInfo
                )
            );
        }
    }

    /**
     * Publish a fail message on data channel for model and requestInfo with error information.
     * @param model
     * @param requestInfo
     * @returns {Function}
     */
    function fail(model, requestInfo) {
        return function (jqXHR, textStatus, errorThrown) {
            mosaic.pub.data(
                model,
                {},
                {
                    status: 'error',
                    message: textStatus,
                    error: errorThrown,
                    jqxhr: jqxhr,
                    request: requestInfo
                }
            );
        }
    }

    /**
     * Make ajax get request to url with params.
     *
     * @param url
     * @param query
     * @param requestInfo
     * @param successCallback
     */
    function get(url, query, requestInfo, successCallback) {
        $.get(
            url,
            query,
            successCallback,
            mosaic.config.data.accept.get
        ).fail(
            fail(model, requestInfo)
        ).always(
            end(model, requestInfo)
        );
    }

    function post(url, data, requestInfo, successCallback) {
        $.post(
            url,
            data,
            successCallback,
            mosaic.config.data.contentType.post
        ).fail(
            fail(model, requestInfo)
        ).always(
            end(model, requestInfo)
        );
    }

    function remove(url, requestInfo, successCallback) {
        $.ajax({
            url: url,
            contentType: mosaic.config.data.contentType.remove,
            method: mosaic.config.data.method.remove,
            success: successCallback
        }).fail(
            fail(model, requestInfo)
        ).always(
            end(model, requestInfo)
        );
    }

    /**
     * Return standard information about the request.
     * @param type string 'model' or 'list'
     * @param action string e.g. 'loaded' or 'join' or 'unjoin'
     * @param model string
     * @param id if known
     * @param query map of query information sent, e.g. fields, filters
     * @returns {*}
     */
    function requestInfo(type, action, model, id, query) {
        var params = _.assign(
                {
                    type: type,
                    model: model,
                    action: action
                },
                id ? {id: id} : {},
                query || {}
            ),
            tsms = Date.now();         // may need higher resolution?

        // add some metadata/tags
        return _.assign(
            {
                hash: hash.md5(params),
                tsms: tsms,
                uniqueID: this.uniqueID(tsms)
            },
            params
        );
    }

    /**
     * Map a model to an endpoint, e.g 'Member' => 'member', 'OrganisationModel' => notification
     * @param model
     * @returns {*}
     */
    function endpoint(model) {
        return model;
    }

    /**
     * Build a url for get/post
     * @param model
     * @param id
     * @param action
     * @returns {string}
     */
    function url(model, id, action) {
        var endpoint = endpoint(model);

        return endpoint + '/' + mosaic.util.padRightWith(mosaic.config.actions[action], '/', 1, false) + (id || '');
    }

    /**
     * Build a topic
     *
     * @param type string currently 'model' or 'list', used to build topic
     * @param model string route-centric name of model, e.g. 'member' or 'notification'
     * @param id int
     * @param action
     * @returns {string}
     */
    function topic(type, model, id, action) {
        var endpoint = endpoint(model);

        return type + '.' + endpoint + '.' + id + mosaic.util.padLeftWith(action, '.');
    }

    /**
     * Given a response from the server return a map of fields to values as object.
     * @param response
     */
    function fields(response) {
        return function(fieldName) {
            return response[fieldName];
        }
    }


    // if no data extension create it
    if (_.isUndefined(mosaic.data)) {
        mosaic.data = {};
    }

    mosaic.config.data = _.assign(true, {}, defaults, options);

    /**
     * Post to model/id/action optionally with data
     * @param model
     * @param id
     * @param action
     * @param data
     */
    this.data.action = function (model, id, action, data) {
        var requestInfo = requestInfo('action', action, model, id),
            url = url(model, id, action);

        start(
            model,
            requestInfo,
            post(
                url,
                data,
                requestInfo,
                actioned(model, requestInfo)
            )
        );
    };

    /**
     *
     * @param model
     * @param id
     * @param fields
     * @api
     */
    this.data.model = new function () {
        this.load = function (model, id, fields) {
            var query = {
                    fields: fields,
                    filters: {ID: id}
                },
                requestInfo = requestInfo('model', 'loaded', model, id, query),
                url = url(model, id);

            start(
                model,
                requestInfo,
                get(
                    url,
                    query,
                    requestInfo,
                    got(model, id, requestInfo)
                )
            );
        };
        this.add = function (model, data) {
            var requestInfo = requestInfo('model', 'added', model),
                url = url('add', model);

            start(
                model,
                requestInfo,
                post(
                    url,
                    data,
                    requestInfo,
                    added(model, fields(data).ID, request)
                )
            );
        };
        this.update = function (model, id, data) {
            var requestInfo = requestInfo('model', 'updated', model, id),
                url = url('update', model, id);

            start(
                model,
                requestInfo,
                post(
                    url,
                    data,
                    requestInfo,
                    updated(model, id, requestInfo)
                )
            );
        };
        this.remove = function (model, id) {
            var requestInfo = requestInfo('model', 'removed', model, id),
                url = url('remove', model, id);

            start(
                model,
                requestInfo,
                remove(
                    url,
                    {},
                    removed(model, id, requestInfo)
                )
            );
        };
    };

    /**
     *
     * @param model
     * @param filters
     * @param fields
     * @api
     */
    this.data.list = new function () {
        this.load = function (model, sort, filters, fields) {
            var query = {
                    sort: sort || {},
                    filters: filters || {},
                    fields: fields || []
                },
                requestInfo = requestInfo('list', model, null, query),
                url = url('list', model);

            start(
                model,
                requestInfo,
                get(
                    url,
                    query,
                    requestInfo,
                    listed(model, requestInfo)
                )
            );
        }
    };
};

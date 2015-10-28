Mosaic.prototype.badger = new function (options, mosaic) {
    var badges = {
        /* example badge declarations
             messages: {
                period: 120,
                url: '/url-to-poll',
                channel: 'ui',
                topic: 'messages.count',
                dataType: 'application/json',
                path: 'items[Status=U]',         // if accept = application/json then lodash _.get
                pathType: 'json-query',          // unless another (supported) method is provided, in this case not so yet
                element: '#messageIcon',
                css: 'badge',
                title: 'you have {count} messages',
                link: '/some-url-to-click-to
             },
             notifications: {
                period: 30,
                url: '/notifications?Status=U',
                method: 'GET',
                accept: 'application/xml',
                path: '//summary/@count',           // if accept application/xml then xpath is used
                element: '#messages',
                css: 'badger-badged top-left round white',      // NB badger-badged
                title: 'you have {count} unread {name}',
                link: '/notifications?Status=U
             }
         */
        },
        intervals = {},
        defaults = {
            badges: {},
            defaults: {
                period: 60,         // period between polls in seconds
                method: 'GET',
                accept: 'application/json',
                css: '.badger-badged {name}',
                path: 'count',
                pathType: 'lodash',     // not used as lodash only method supported atm
                channel: 'ui',
                topic: 'badger.{name}',
                title: 'you have {count} {name}',
                element: '.badger-badged',     // other attributes can be read from data-badger-abc attributes
                html: '<div class="badger-badge">{count}</div>'
            }
        };

    function detokenise(template, tokens) {
        _.forEach(
            tokens,
            function(value, token) {
                template = template.replace(new RegExp('{' + token + '}', 'gi'), value);
            }
        );
        return template;
    }

    this.badges = new function() {
        this.add = function (name, config) {
            var badges = this,
                options = $.extend({}, mosaic.config.badger.defaults, config),
                $element = $(options.element),
                tokens = {
                    name: name
                },
                topic = detokenise(options.topic, tokens),
                containerCSS = detokenise(options.css, tokens),
                url = detokenise(options.url, tokens),
                badgeHTML =

            this.remove(name);
            $(detokenise(options.html, tokens)).appendTo($element);

            intervals[name] = setInterval(
                function (name, options) {
                    $.get(
                        url,
                        {},
                        function (data) {
                            var count = _.get(data, options.path, 0);

                            // publish count on channel
                            mosaic.pub[options.channel]({
                                topic: topic,
                                data: {
                                    count: count,
                                    name: name
                                }
                            });
                        },
                        options.dataType
                    )
                },
                options.period * 1000,
                name,
                options
            );

            mosaic.sub.ui(
                function(data) {
                    if (data && data.count) {
                        badges.remove(data.name);
                        badges.add()
                    }
                },
                topic
            )
        };
        this.remove = function(name) {
            var options = $.extend({}, mosaic.config.badger.defaults, config),
                $element = $(options.element),
                tokens = {
                    name: name
                },
                containerCSS = detokenise(options.css, tokens),
                badgeHTML = detokenise(options.html, tokens);

            if (intervals[name]) {
                clearInterval(intervals[name]);
            }
            $element.removeClass(containerCSS);
            $element.remove('.badger-badge');
        }
    };

    if (!mosaic.config.badger) {
        mosaic.config.badger = $.extend(true, {}, defaults, options);

        _.forEach(
            this.config.badger.badges,
            function (config, name) {
                this.badges.add(name, config);
            },
            this
        )
    }
}
var Mosaic = function (options) {
    var defaults = {
        debug: 7           // 0 = none, 1 = minimum, 2 = more, 4 = debug messaging
    };

    /* LOGGING */

    this.log = function(message  /*, details, ... */) {
        if (this.config.debug && console && console.log) {
            console.log(message);
            if (this.config.debug & 2) {
                // we want to show extra details as well as the message
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length) {
                    console.dir ? console.dir(args) : console.log(args);
                }
            }
        }
    }

    this.init = function(extensions) {
        if (!window.mosaic) {
            window.mosaic = this;

            mosaic.config = jQuery.extend(true, {}, mosaic.config || {}, defaults, options);

            mosaic.log("Initialising mosaic extensions: ", extensions);

            // initialise extensions passed in init method options parameter
            _.forEach(
                extensions,
                function(options, extensionName) {
                    console.log('init ' + extensionName)
                    if (this[extensionName]) {
                        this[extensionName](options, mosaic);
                    }
                },
                mosaic
            );
            // if no messaging was registered by extensions then we need to create some stubs
            mosaic.pub = mosaic.pub || {};
            mosaic.sub = mosaic.sub || {};


            mosaic.log('before messaging', mosaic);
            /* DEFAULT MESSAGING */
            // use presence of addChannel to indicate if messaging has been
            // registered elsewhere (e.g. mosaic/js/components/postal.js)
            if (!mosaic.addChannel) {
                mosaic.channels = {};

                mosaic.addChannel = function (channelName) {
                    mosaic.log("No messaging registered, load postal component or alternative");
                }.bind(mosaic);

                _.forEach(
                    this.config.channels,
                    function (channelName) {
                        this.log('Adding default channel handler ' + channelName);

                        this.pub[channelName] = function (message) {
                            mosaic.log('Default Channel!');
                            mosaic.log.apply(mosaic, arguments);
                        }.bind(this);

                        this.sub[channelName] = function (fn, filters) {
                            mosaic.log('Default Channel!');
                            mosaic.log.apply(mosaic, arguments);
                        }.bind(this);

                    },
                    this
                );
            }
            mosaic.log('after messaging init', mosaic);
            /* DEBUG MESSAGING */
            if (mosaic.config.debug) {
                mosaic.sub.debug(mosaic.log, '*.*');
                mosaic.pub.debug('debugging channel initialised');

                if (mosaic.config.debug & 4) {
                    mosaic.log('debug listener setup');
                    _.forEach(
                        mosaic.channels,
                        function (channel) {
                            var channelName = channel.channel;

                            if (channelName != 'debug') {
                                mosaic.log('attaching to channel ' + channelName);

                                mosaic.sub[channelName](
                                    function(envelope) {
                                        mosaic.pub.debug(envelope);
                                    },
                                    '*.*'
                                );
                            }
                        },
                        this
                    )
                }
            }
        }
        return this;
    };
};

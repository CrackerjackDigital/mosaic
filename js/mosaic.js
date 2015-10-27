var Mosaic = function (options) {
    var defaults = {
        debug: 1,
        listView: 'ul.list-view'
    };

    /* LOGGING */

    this.log = function(message  /*, details, ... */) {
        if (this.config.debug && console && console.log) {
            console.log(message);
            var args = Array.prototype.slice.call(arguments, 1);
            if (args.length) {
                console.dir ? console.dir(args) : console.log(args);
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
                    console.log('Initialising ' + extensionName + ' extension');
                    if (this[extensionName]) {
                        this[extensionName].call(this, options);
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
                mosaic.addChannel = function (channelName) {
                    mosaic.log("No messaging registered, load postal component or alternative");
                }.bind(mosaic);

                _.forEach(
                    mosaic.config.channels,
                    function (channelName) {
                        this.log('Adding default channel handler ' + channelName);

                        this.pub[channelName] = function (message) {
                            mosaic.log("No publisher registered, load postal component or alternative");
                        }.bind(this);

                        this.sub[channelName] = function (fn, filters) {
                            mosaic.log("No subscriber registered, load postal component or alternative");
                        }.bind(this);

                    },
                    mosaic
                );
            }
            mosaic.log('after messaging init', mosaic);
            /* DEBUG MESSAGING */
            if (mosaic.config.debug) {
                mosaic.sub.debug(mosaic.log, '*.*');
                mosaic.pub.debug('debugging channel initialised');
            }
        }
        return this;
    };
};

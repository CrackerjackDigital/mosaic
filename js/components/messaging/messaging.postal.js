/**
 * Postal.js based pub/sub extension for mosaic
 *
 * @require postal.js, lodash.js, mosaic.js
 * @package mosaic Mosaic instance being extended
 * @subpackage messaging
 *
 *
 * @param options object implementation specific options, e.g postal options for postal.js
 * @param mosaic instance being extended
 */
Mosaic.prototype.messaging = function(options, mosaic) {
    var defaults = {
            channels: [
                'actions',
                'ui',
                'data',
                'debug'
            ]
        };

    // only bind if postal is loaded
    if (postal) {

        // update mosaic config with the messaging settings
        this.config.messaging = jQuery.extend(true, {}, this.config.messaging || {}, defaults, options);

	    // create channels, pub and sub objects if not already there
	    if (!mosaic.channels) {
		    mosaic.channels = {};
	    }

	    this.log('Initialising Mosaic.postal messaging extension', this);

        /** Add each channelName in mosaic.channels so may be referenced directly */
        _.forEach(
            this.config.messaging.channels,
            function (channelName) {
                console.log('Adding channel ' + channelName + ' to mosaic map');
                mosaic.channels[channelName] = postal.channel(channelName);
            },
            this
        );


        // postaljs based subscription functionality
        var PostalSubscriber = function () {
            // Add a method per channel which can be called to subscribe to that channel,
            // e.g. mosaic.subscribe.ui(fn, filters) will subscribe to messages on the ui channel.

            this.add = function (channelName) {
                mosaic.log('Adding channel method ' + channelName + ' to subscriber');
                this[channelName] = function (fn, topics) {
                    mosaic.channels[channelName].subscribe(
                        topics || '*.*',
                        fn
                    );
                };
            };
            _.forEach(
                mosaic.config.messaging.channels,
                function (channelName) {
                    // bind a function to this[channelName] so can be called e.g. by subscribe.ui(callback, filters)
                    this.add(channelName);
                },
                this
            );
        };

        // postaljs based publishing functionality
        var PostalPublisher = function () {
            // Add a method per channel which can be called to publish on that channel,
            // e.g. mosaic.publish.ui(message) will publish message on the ui channel.

            this.add = function (channelName) {
                mosaic.log('Adding channel method ' + channelName + ' to publisher');

                this[channelName] = function (topic, data, info) {
                    mosaic.channels[channelName].publish({
                        'topic': topic,
                        'data': data,
                        'info': info
                    });
                };
            };

            _.forEach(
                mosaic.config.messaging.channels,
                function (channelName) {
                    // bind a function to this[channelName] so can be called e.g. by subscribe.ui(callback, filters)
                    this.add(channelName);
                },
                this
            );
        };
        // set mosaic.sub to be a postal Subscriber
        this.sub = new PostalSubscriber();

        // set mosaic.pub to be a postal Publisher
        this.pub = new PostalPublisher();

        // Add a new channel and make it available via publish and subscribe interface
        Mosaic.prototype.addChannel = function (channelName) {
            mosaic.log('addChannel: ' + channelName);
            if (!mosaic.channels.hasOwnProperty(channelName)) {
                mosaic.channels[channelName] = postal.channel(channelName);
                mosaic.pub.add(channelName);
                mosaic.sub.add(channelName);
            }
            return mosaic.channels[channelName];
        }

        mosaic.log('DONE', this);
    } else {
        mosaic.log("No postal.js library loaded, can't bind messaging using postal");
    }
};
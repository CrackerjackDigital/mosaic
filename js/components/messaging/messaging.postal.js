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

        if (_.isUndefined(mosaic.msg.channels)) {
            // NB messaging extends mosaic directly with the 'channels' collection
            mosaic.msg.channels = {};
        }

        this.log('Initialising Mosaic.postal messaging extension', this);

        /** Add each channelName in mosaic.msg.channels so may be referenced directly */
        _.forEach(
            this.config.messaging.channels,
            function (channelName) {
                console.log('Adding channel ' + channelName + ' to mosaic map');
                mosaic.msg.channels[channelName] = postal.channel(channelName);
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
                    mosaic.msg.channels[channelName].subscribe(
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

                mosaic.msg[channelName] = function (topic, data, info) {
                    mosaic.msg.channels[channelName].publish({
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
        this.msg.sub = new PostalSubscriber();

        // set mosaic.pub to be a postal Publisher
        this.msg.pub = new PostalPublisher();

        // Add a new channel and make it available via publish and subscribe interface
        Mosaic.prototype.addChannel = function (channelName) {
            mosaic.log('addChannel: ' + channelName);
            if (!mosaic.msg.channels.hasOwnProperty(channelName)) {
                mosaic.msg.channels[channelName] = postal.channel(channelName);
                mosaic.msg.pub.add(channelName);
                mosaic.msg.sub.add(channelName);
            }
            return mosaic.msg.channels[channelName];
        }

        mosaic.log('DONE', this);
    } else {
        mosaic.log("No postal.js library loaded, can't bind messaging using postal");
    }
};
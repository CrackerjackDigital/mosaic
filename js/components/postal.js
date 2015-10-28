Mosaic.prototype.messaging = function(options) {
    var defaults = {
            channels: [
                'actions',
                'ui',
                'data',
                'debug'
            ]
        },
        mosaic = this;

    if (postal && !this.channels) {

        // update mosaic config with the messaging settings
        this.config.messaging = jQuery.extend(true, {}, this.config.messaging || {}, defaults, options);

        // NB messaging extends mosaic directly with the 'channels' collection
        this.channels = {};

        this.log('Initialising Mosaic.postal messaging extension', this);

        /** Add each channelName in mosaic.channels so may be referenced directly */
        _.forEach(
            this.config.messaging.channels,
            function (channelName) {
                console.log('Adding channel ' + channelName + ' to mosaic map');
                this.channels[channelName] = postal.channel(channelName);
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

                this[channelName] = function (topic) {
                    mosaic.channels[channelName].publish({
                        'topic': topic,
                        'data': Array.prototype.slice.call(arguments, 1)
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
            if (!this.channels.hasOwnProperty(channelName)) {
                this.channels[channelName] = postal.channel(channelName);
                this.pub.add(channelName);
                this.sub.add(channelName);
            }
            return this.channels[channelName];
        }

        mosaic.log('DONE', this);
    }
};
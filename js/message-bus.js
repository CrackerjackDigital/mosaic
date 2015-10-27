$.messageBus = (function() {
	// setup the message bus channels
	return {
		actions: postal.channel('actions'),
		ui: postal.channel('ui'),
		data: postal.channel('data')
	};
})();
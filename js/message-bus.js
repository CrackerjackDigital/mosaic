$.messageBus = (function() {
	// setup the message bus channels
	var messageBus = {
		actions: postal.channel('actions'),
		ui: postal.channel('ui'),
		data: postal.channel('data')
	};
	// attach a debug listener to each channel
	for (name in messageBus) {
		console.log('attaching debug listener to channel ' + name);

		(function(name) {
			var x = name;
			messageBus[name].subscribe(
				'*.*',
				function(message) {
					console.log(x + ':');
					console.log(message);
				}
			)
		})(name);

	}
	return messageBus;
})();
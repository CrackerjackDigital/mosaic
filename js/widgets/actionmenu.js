(function() {
	console.log('Hooking action-links');

	var channel = $.messageBus.actions;
	// subscribe to messages and kick it all off.
	(function (channel) {
		console.log('action-menu initialising');

		channel.subscribe('action-menu.bind', bind);
		channel.subscribe('action-menu.clicked', clicked);
		channel.subscribe('action-menu.busy', busy);
		channel.subscribe('action-menu.success', success);
		channel.subscribe('action-menu.error', error);
		channel.subscribe('action-menu.done', done);
		channel.subscribe('action-menu.inplace', inplace);
		channel.subscribe('action-menu.modal', modal);

		channel.publish(
			'action-menu.bind',
			{}
		);
	})(channel);

	function bind(message) {
		console.log('bind');

		// register action link click handler on action-links
		$('menu.action-menu').on('click', 'li a', function(ev) {
			console.log('clicked');

			channel.publish('action-menu.clicked', {
				event: ev,
				listItem: $(this).closest('li')
			});
		});
	}
	function clicked(message) {
		var listItem = message.listItem,
			data = listItem.data();

		channel.publish(
			'action-menu.busy',
			message    // forward message
		);
		channel.publish(
			'action-menu.' + message.listItem.data('link-type'),
			message // forward message to handler
		)
	}
	function busy(message) {
		// rebind with a 'false' click handler so other actions aren't allowed
		$('menu.action-menu')
			.off('click', 'li a')
			.on('click', 'li a', false);

		// make all items busy until we've completed
		$('menu.action-menu li').addClass('busy');

		// make the clicked action active
		message.listItem.addClass('busy active');
	}
	function success(message) {
		console.log('success ' + message.statusText);

		var listItem = message.listItem,
			data = $.extend({}, listItem.data());

		// update item.data to be the reverse of what we just did
		listItem.data('action', data.reverse);
		listItem.data('reverse', data.action);
		listItem.data('reverseTitle', data.title);
		listItem.data('title', data.reverseTitle);
		listItem.data('doit', data.undoit);
		listItem.data('undoit', data.doit);

		// send the new data on to subscribers to 'actions' channel
		channel.publish(
			'action-menu.' + data.action,
			{
				oldData: data,
				newData: listItem.data()
			}
		);

		// now set the anchor title from the updated listitem data
		$('a', listItem).attr('title', listItem.data('title'));

		// set child span to new action if we are an action button
		$('span', listItem).html(listItem.data('title'));

		$('menu.action-menu li').removeClass('busy active');

		// switch the action class and remove the .busy.active
		listItem.removeClass(data.action + ' ' + data.reverse)
			.addClass(listItem.data('action'));
	}
	function error(message) {
		var listItem = message.listItem;

		$('menu.action-menu li').removeClass('busy active');

		// remove the .busy.active and add an error
		listItem.addClass('error');
	}
	function done(message) {
		var data = message.listItem.data();

		// unbind false handler from click
		$('menu.action-menu').off('click', 'li a');

		channel.publish(
			'action-menu.bind',     // rebind
			message     // forward message
		);
	}

	function modal(message) {
		var listItem = message.listItem,
			event = message.event;

		event.preventDefault();

		$.when(
			$.ajax(listItem.data('doit') + '/modal')
		).then(
			// success
			function (result, statusText) {
				$.messageBus.ui.publish(
					'modal.show',
					$.extend(
						message,
						{
							result: result,
							statusText: statusText
						}
					)
				);
			},
			// fail
			function (result, statusText) {
				channel.publish(
					'action-menu.error',
					$.extend(
						message,
						{
							result: result,
							statusText: statusText
						}
					)
				);
			}
		)
	}

	// handle inplace linkType via ajax call to server
	// returns the promise so post-event processing can happen
	function inplace(message) {
		var listItem = message.listItem,
			event = message.event;

		event.preventDefault();

		$.when(
			$.ajax(listItem.data('doit'))
		).then(
			// success
			function (result, statusText) {
				channel.publish(
					'action-menu.success',
					$.extend(
						message,
						{
							result: result,
							statusText: statusText
						}
					)
				);
			},
			// fail
			function (result, statusText) {
				channel.publish(
					'action-menu.error',
					$.extend(
						message,
						{
							result: result,
							statusText: statusText
						}
					)
				);
			}
		).done(
			function () {
				channel.publish(
					'action-menu.done',
					{
						listItem: listItem
					}
				);
			}
		);
	}
	// handle popping up a modal with data from server
	function modal(message) {
		var event = message.event,
			listItem = message.listItem;

		event.preventDefault();

		return false;
	}
	function nav() {
		return true;
	}

})();
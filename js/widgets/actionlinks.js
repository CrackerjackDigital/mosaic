(function() {
	console.log('Hooking action-links');
	var handlers = {
		inplace: inplace,
		modal: modal,
		nav: nav
	};

	function bindItems() {
		// register action link click handler on action-links
		$('menu.action-links').on('click', 'li a', function(ev) {
			var $listItem = $(this).closest('li'),
				data = $.extend({}, $listItem.data());  // get a copy of the data

			console.log(ev);
			console.log(data);

			return handlers[data.linkType || 'inplace']($listItem, data);
		});
	}
	// handle inplace linkType via ajax call to server
	// returns the promise so post-event processing can happen
	function inplace($item, data) {
		console.log('inplace');

		// kill all nav action links while processing by replacing with a 'false' click handler
		console.log('unbinding');
		$('menu.action-links')
			.off('click', 'li[data-link-type="nav"] a')
			.on('click', 'li[data-link-type="nav"] a', false);

		$item.addClass('busy');

		$.when(
				$.ajax(data.doit)
			).then(
				// success
				function (result, statusText, jqXHR) {
					console.log('success ' + statusText);

					$item.data('action', data.reverse);
					$item.data('reverse', data.action);
					$item.data('doit', data.undoit);
					$item.data('undoit', data.doit);

					$item.removeClass(data.action + ' ' + data.reverse);
					// this has been changed above
					$item.addClass($item.data('action'));

					$item.removeClass('busy');

				},
				// fail
				function (result, statusText, jqXHR) {
					console.log('fail ' + statusText);

				}
			).done( function() {
				console.log('rebinding');
				$('menu.action-links').off('click', 'li a');
				bindItems();
			});

		return false;
	}
	// handle popping up a modal with data from server
	function modal($item, data) {
		return false;
	}
	function nav() {
		return true;
	}

	bindItems();
})();
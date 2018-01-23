(function() {
	// subscribe to ui channel to receive show messages
	// console.log('subscribing to ui channel for modal.show messages');
	$.messageBus.ui.subscribe('modal.show', show);
	$.messageBus.ui.subscribe('modal.hide', hide);

	var container = $('#modalContainer'),
		body = $('#modalBody'),
		content = $('#modalContent'),
		nav = $('header nav.primary'),
		navHeight = nav.height(),
		listItem = null;

	// delegate close to container so
	container.on('click', 'a.close', function(ev) {
		ev.preventDefault();

		hide();
		// pass the saved list item back incase cancel needs it
		$.messageBus.ui.publish('modal.cancel', {
			listItem: listItem
		});
	});
	// hook sumbit events for forms which get put in content
	container.on('submit', 'form', function(ev) {
		ev.preventDefault();

		// tag inputs as busy/active
		$('input[type=submit],input[type=button]', $(this)).addClass('busy');

		$.when(
			$.post(
				$(this).attr('action'),
				$(this).serialize()
			)
		).then(
			// success
			function (result, statusText) {
				// pass the saved list item back as success will need it
				$.messageBus.ui.publish('modal.ok', {
					listItem: listItem,
					result: result,
					statusText: statusText
				})
			},
			// fail
			function (result, statusText) {
				$.messageBus.ui.publish('modal.error', {
					listItem: listItem,
					result: result,
					statusText: statusText
				});
			}
		).done(
			hide
		);
	});

	function show(message) {
		// we need to feed this back when modal is closed
		listItem = message.listItem;

		$(document).on('scroll', positionModal);

		// console.log('showing modal');



		content.html(message.result);

		// bind select2 fields
		$.fn.select2ify(
			content
		);

		positionModal();

		container.removeClass('closed').addClass('open');

	}

	function hide() {
		listItem = null;

		container.removeClass('open').addClass('closed');
		$.fn.unselect2ify(
			content
		);

	}


	function positionModal() {
		var off = nav.offset(),
			top;

		// console.log(off);

		var scroll = window.pageYOffset || document.documentElement.scrollTop;

		// console.log(scroll);

		if (scroll < 200) {
			body.removeClass('fixed-top');
			top = off.top + navHeight;
		} else {
			body.addClass('fixed-top');
			top = navHeight;
		}
		// console.log('top ' + top);
		body.css({
			top: top + 'px'
		});

	}
})();
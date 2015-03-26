/**
 * Functionality for sidebar with contacts, favourites etc
 */
(function() {
	var sidebar = $('.sidebar');

	// subscribe to unfollow event to remove items when they are unfollowed
	$.messageBus.actions.subscribe(
		'unfollow',
		unfollow
	);
	$.messageBus.actions.subscribe(
		'follow',
		follow
	);
	// add a new list item to favourites when an item is followed.
	function follow(message) {
		var data = message.newData;

		// if nt already in list (and it shouldn't be) then add a new list item
		if ($('.has-favourites ul.list li', sidebar).filter(
			function () {
				return ($(this).data('id') === data.id) && ($(this).data('class') === data.class);
			}
		).length === 0) {
			console.log('adding new item');
			data.index = $('.has-favourites ul.list li').length + 1;

			$('.has-favourites ul.list')
				.append('<li><a href=""><span>' + data.title + '</span></a></li>')
				.data(data)
				.attr('href', data.rel);
		}
	}
	// remove list item from favourites when item is unfollowed
	function unfollow(message) {
		var newData = message.newData;

		console.log('sidebar unfollowing:');
		console.log(newData);

		$('.has-favourites li', sidebar).filter(
			function () {
				return ($(this).data('id') === newData.id) && ($(this).data('class') === newData.class);
			}
		).addClass('removed');
	}
})();
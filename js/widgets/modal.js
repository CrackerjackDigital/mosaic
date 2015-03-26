(function() {
	// subscribe to ui channel to receive show messages
	$.messageBus.ui.subscribe('modal.show', showModal);

	function showModal(message) {
		console.log('showing modal');
		console.log(message);
		$('#modalBody').html(message.result);
	}
})();
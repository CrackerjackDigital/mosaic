(function() {
	// if we have tab-bar handle hiding/showing tab-body with ID
	if ($('.tab-bar').length) {
		if (getCookie('TabHistory') == null) {
			console.log('no past tab clicked ');
			var first = $('.tab-bar > ul li:first-child a'),
				rel = first.attr('rel');

			// select the tab
			first.closest('li').addClass('current');

			// show the first tab body
			$(rel).addClass('current');
		}else{
			var recentTabId = getCookie('TabHistory');
			console.log('recent tab: ' + recentTabId);
			var recentTab = $("#" + recentTabId +' a'),
				rel = recentTab.attr('rel');
				$("#" + recentTabId).addClass('current');
				$(rel).addClass('current');
		}

		$('.tab-bar > ul li').on('click', function() {
			//clicked tab id
			var tabId = $(this).attr('id');
			// remove current from list item
			$('.tab-bar > ul li').removeClass('current');

			// add current to this list item
			$(this).addClass('current');

			// remove current from all tab bodies
			$('.tab-body').removeClass('current');

			// show the tab-body for clicked item
			$($('a', $(this)).attr('rel')).addClass('current');

			//set cookie on clicked tab
			setCookie('TabHistory', tabId);
		});
	}

//Cookies
function setCookie(key, value) {
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

})();



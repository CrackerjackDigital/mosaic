(function() {
    // if we have tab-bar handle hiding/showing tab-body with ID
    if ($('.tab-bar').length) {
        //get tab id from hash
        var selectedTab = window.location.hash.substr(1);
        if (selectedTab !='' && selectedTab.substring(0, 4) == 'tab_') {

            var recentTabId = selectedTab;
            var recentTab = $("#" + recentTabId + ' a'),
                rel = recentTab.attr('rel');
            $("#" + recentTabId).addClass('current');
            $(rel).addClass('current');
        } else {
            var first = $('.tab-bar > ul li:first-child a'),
                rel = first.attr('rel');

            // select the tab
            first.closest('li').addClass('current');

            // show the first tab body
            $(rel).addClass('current');
        }

        $('.tab-bar > ul li').on('click', function(e) {
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
            e.preventDefault();
            window.location.hash = tabId;
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

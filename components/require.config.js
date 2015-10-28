var components = {
    "packages": [
        {
            "name": "fotorama",
            "main": "fotorama-built.js"
        },
        {
            "name": "jquery",
            "main": "jquery-built.js"
        },
        {
            "name": "masonry",
            "main": "masonry-built.js"
        },
        {
            "name": "modernizr",
            "main": "modernizr-built.js"
        },
        {
            "name": "select2",
            "main": "select2-built.js"
        },
        {
            "name": "lodash",
            "main": "lodash-built.js"
        },
        {
            "name": "postal.js",
            "main": "postal.js-built.js"
        },
        {
            "name": "infinite-ajax-scroll",
            "main": "infinite-ajax-scroll-built.js"
        }
    ],
    "shim": {
        "masonry": {
            "exports": "Masonry"
        },
        "modernizr": {
            "exports": "window.Modernizr"
        }
    },
    "baseUrl": "components"
};
if (typeof require !== "undefined" && require.config) {
    require.config(components);
} else {
    var require = components;
}
if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = components;
}
Mosaic.prototype.strings = function(options, mosaic) {
    if (!mosaic.util) {
        mosaic.util = {};
    }
    /**
     *
     * @param str
     * @param padWithChars character(s) to pad with
     * @param count int number of paddWithChars to ensure are added optional default 1
     * @param padEmpty return padding even if empty string provided, default false
     * @returns {string}
     */
    mosaic.util.padLeftWith = function(str, padWithChars, count, padEmpty) {
        if ((str.length === 0) && !padEmpty) {
            return '';
        }
        return _.repeat(padWithChars, count || 1)
            + _.trimLeft(str || '', padWithChars);
    };
    /**
     * Pad right a string so there are count padWithChars's.
     *
     * @param str
     * @param padWithChars character(s) to pad with
     * @param count int number of paddWithChars to ensure are added optional default 1
     * @param padEmpty return padding even if empty string provided, default false
     * @returns string
     */
    mosaic.util.padRightWith = function(str, padWithChars, count, padEmpty) {
        if ((str.length === 0) && !padEmpty) {
            return '';
        }
        return _.trimRight(str || '', padWithChars)
            + _.repeat(padWithChars, _.isUndefined(count) ? 1 : count);
    };

    mosaic.util.uniqueID = function(prefix) {
        return _.uniqueId((mosaic.util.padRightWith(prefix, '-') + Date.now()));
    };
};
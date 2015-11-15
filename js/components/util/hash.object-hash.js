/**
 * hash, md5 and sha1 implementation using puleos/object-hash {@link https://github.com/puleos/object-hash}
 * @param options object as per puleos/object-hash library
 * @param mosaic Mosaic instance being extended
 */
Mosaic.prototype.hash = function(options, mosaic) {
    var defaults = {
        algorithm: 'sha1',
        excludeValues: false,
        encoding: 'hex',
        respectFunctionProperties: true,
        respectTypes: true
    };
    mosaic.config.hash = $.extend({}, defaults, options);

    this.md5 = new function(object, options) {
        return hash.hash(object, $.extend({}, mosaic.config.hash, options || {}, { algorithm: 'md5' }));
    };
    this.sha1 = new function(object, options) {
        return hash.hash(object, $.extend({}, mosaic.config.hash, options || {}, { algorithm: 'sha1' }));
    };

}
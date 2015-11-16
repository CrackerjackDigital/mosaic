/**
 * Mosaic extension to handle submission, validation etc of forms.
 *
 * Usage:
 *
 * mosaic.ui.form('form.mosaic');
 */

Mosaic.prototype.form = function(options, mosaic) {
    var defaults = {
        auto: []                // bind these selectors when extension is initialiased
    };
    mosaic.ui.form = function(form, options) {
        return new function() {
            var options = _.defaults(options || {}, { form: form }),
                config = _.merge(defaults, options),
                $form = $(form).closest('form');

            $form.mosaic = mosaic;

            function bind() {
                $form.on('submit', function() {
                    mosaic.ui.pub(
                        'form.submit',
                        data($form),
                        {
                            form: $form
                        }
                    );
                });
            }

            this.data = function() {

            };

            this.submit = function() {


            };
            this.ok = function(response) {

            };
            this.error = function(response) {

            };

        };
    };
    function init() {
        var options = _.merge(options, defaults);

        _.forEach(
            options.auto,

        )
    }
};
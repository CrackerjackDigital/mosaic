<?php
/**
 * Field which implements Select2 functionality (http://http://ivaynberg.github.io/select2/)
 *
 * By default expects select2 to be installed via composer to component/select2/
 */

class Select2Field extends DropdownField {
    // this is default library install path with composer
    private static $library_path = 'components/select2/';

    public function Field($properties = array()) {
        Requirements::javascript(self::$library_path . "select2.js");
        Requirements::javascript('app/js/components/select2field.js');
        Requirements::css(self::$library_path . "select2.css");

        Requirements::css('app/css/components.css');

        $this->addExtraClass('select2field');

        return parent::Field($properties);
    }
    public function setOptions(array $options) {
        parent::setSource($options);
        return $this;
    }
}
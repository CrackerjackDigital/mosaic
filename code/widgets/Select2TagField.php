<?php

/**
 * Field which implements Select2 tag functionality (http://http://ivaynberg.github.io/select2/)
 *
 * By default expects select2 to be installed via composer to component/select2/
 */
class Select2TagField extends TextField {
    // this is default library install path with composer
    private static $library_path = 'components/select2/';

    private static $tag_seperator = ',';

    public function Field($properties = array()) {
        $this->addExtraClass('select2field');
        $this->setAttribute('tagseperator', static::tag_seperator());
        return parent::Field($properties);
    }

    /**
     * implode value if it is an array.
     *
     * @param mixed $value
     * @return $this|FormField
     */
    public function setValue($value) {
        parent::setValue(is_array($value) ? implode(self::tag_seperator(), $value) : $value);
        return $this;
    }

    /**
     * Set the available options.
     *
     * @param array $options
     * @return $this
     */
    public function setOptions(array $options) {
        $this->setAttribute('tags', implode(static::tag_seperator(), $options));
        return $this;
    }

    public static function tag_seperator() {
        return static::config()->tag_seperator;
    }

}
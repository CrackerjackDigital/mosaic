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
/*
    public function __construct($name, $title = null, $source = null, $value = null, $form = null, $emptyString = null) {
        if (is_null($source)) {
            $controller = Controller::curr();
            if ($controller instanceof PublicModelControllerInterface) {
                $mode = $controller->getMode();

                if ($model = $controller->getModelInstance($mode)) {
                    $config = $model->config();

                    if ($relatedClass = $model->getRelationClass($name)) {
                        $title = singleton($relatedClass)->singular_name();

                        if (DataObject::get($relatedClass)->count()) {
                            $source = DataObject::get($relatedClass)->map()->toArray();
                        }
                        if (in_array($name, $config->get('has_many') ?: [])) {
                            // field name is on remote class pointing to this class ID
                            $fieldName = $model->class . 'ID';
                            $value = implode(
                                self::tag_seperator(),
                                DataObject::get($relatedClass)->filter([
                                    $fieldName => $model->ID
                                ])->map()->toArray()
                            );
                        }

                    } else if ($dbObject = $model->dbObject($name)) {
                        $source = $dbObject->enumValues();
                    }
                }
            }
        }
        parent::__construct($name, $title, $source, $value, $form);
        $this->addExtraClass('select2field');
    }
*/
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
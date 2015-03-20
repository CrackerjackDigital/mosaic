<?php
/**
 * Field which implements Select2 functionality (http://http://ivaynberg.github.io/select2/)
 *
 * By default expects select2 to be installed via composer to component/select2/
 */

class Select2Field extends DropdownField {
    // this is default library install path with composer
    private static $library_path = 'components/select2/';

    /**
     * Auto-populate from current controller's model
     * @param string $name
     * @param null $title
     * @param null $source
     * @param null $value
     * @param null $form
     * @param null $emptyString
     */
    public function __construct($name, $title = null, $source = null, $value = null, $form = null, $emptyString = null) {
        if (is_null($source)) {
            $controller = Controller::curr();
            if ($controller instanceof PublicModelControllerInterface) {
                $mode = $controller->getMode();

                /** @var DataObject $model */
                if (!$model = $controller->getModelInstance($mode)) {
                    $model = singleton($controller->getModelClass());
                }
                $config = $model->config();

                $nameNoID = substr($name, -2, 2) === 'ID' ? substr($name, 0, -2) : $name;

                if ($relatedClass = $model->getRelationClass($nameNoID)) {
                    $title = singleton($relatedClass)->singular_name();

                    if (DataObject::get($relatedClass)->count()) {
                        $source = DataObject::get($relatedClass)->map()->toArray();
                    }
                    if (in_array($nameNoID, $config->get('has_one') ?: [])) {
                        $value = $model->$name;
                    }

                } else if ($dbObject = $model->dbObject($name)) {
                    if ($dbObject->hasMethod('enumValues')) {
                        $source = $dbObject->enumValues();
                    }
                }
            }
        }
        parent::__construct($name, $title, $source, $value, $form);
        $this->addExtraClass('select2field');
    }
}
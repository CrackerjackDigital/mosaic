<?php

/**
 * Adds a has_many from extended class to Images.
 */
class ExtraImagesExtension extends ModelExtension {
    private static $many_many = [
        'Images' => 'Image'
    ];

    public function updateCMSFields(FieldList $fields) {

        $fields->addFieldToTab('Root.Images', GalleryUploadField::create(
            'Images',
            '',
            $this->owner->OrderedImages()
        ));
    }

    public function OrderedImages() {

        list($parentClass, $componentClass, $parentField, $componentField, $table) = $this->owner->many_many('Images');

        return $this->owner->getManyManyComponents(
            'Images'
//            '',
//            "\"{$table}\".\"SortOrder\" ASC"
        );
    }
}
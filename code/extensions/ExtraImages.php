<?php

/**
 * Adds a has_many from extended class to Images.
 *
 * NB: this gets added to both Model and Controller so derives from ModelExtension to capture both sets of functionality.
 *
 */
class ExtraImagesExtension extends ModelExtension {
    const RelationshipName = 'Images';

    private static $many_many = [
        self::RelationshipName => 'Image'
    ];

    /**
     * Adds a GalleryUploadField to the Root.Images tab.
     * @param FieldList $fields
     */
    public function updateCMSFields(FieldList $fields) {
        $fields->addFieldToTab('Root.Images', GalleryUploadField::create(
            self::RelationshipName,
            '',
            $this()->OrderedImages()
        ));
    }

    /**
     * Returns images related to the extended object.
     * @return SS_List
     */
    public function OrderedImages() {
        // NB we could add sorting here if we've installed Sortable e.g. GridFieldSortableRows or such.
        return $this()->getManyManyComponents(
            self::RelationshipName
        );
    }

    /**
     * Handles ID's passed in by the ExtraImages extension and adds each ID posted to the passed in models Images
     * relationship.
     *
     * NB: this should be somewhere else to do with ExtraImages
     *
     * @param SS_HTTPRequest $request
     * @param DataObject $attachToModel
     */
    public function handleExtraImagesUpload(SS_HTTPRequest $request, DataObject $attachToModel) {
        $postVars = $request->postVars();
        if (isset($postVars['Images']['Files'])) {
            foreach($postVars['Images']['Files'] as $fileID) {
                if ($fileID) {
                    if ($file = Image::get()->byID($fileID)) {
                        $attachToModel->Images()->add($file);
                    }
                }
            }
        }
    }

}
<?php

/**
 * Add reverse relationships from Image to Groups, Organisations, Posts.
 */
class ImageExtension extends ModelExtension {
    private static $belongs_many_many = [
        'Group' => 'GroupModel',
        'Organisation' => 'OrganisationModel',
        'Post' => 'PostModel'
    ];

    public function getUploadFields() {

        $fields = $this()->getCMSFields();

        $fileAttributes = $fields->fieldByName('Root.Main.FilePreview')->fieldByName('FilePreviewData');
        $fileAttributes->push(TextareaField::create('Caption', 'Caption:')->setRows(4));

        $fields->removeFieldsFromTab('Root.Main', array(
            'Title',
            'Name',
            'OwnerID',
            'ParentID',
            'Created',
            'LastEdited',
            'BackLinkCount',
            'Dimensions'
        ));
        return $fields;
    }

    public function Caption() {

        //TODO: Refactor so doesn't query database each time
        $controller = Controller::curr();
        $page = $controller->data();
        list($parentClass, $componentClass, $parentField, $componentField, $table) = $page->many_many('Images');

        // check if page return many_many Images when not $table is not a object
        if(is_object($table)) {
            $joinObj = $table::get()
                ->where("\"{$parentField}\" = '{$page->ID}' AND \"ImageID\" = '{$this()->ID}'")
                ->first();

            return $joinObj->Caption;
        }

        return false;
    }
}
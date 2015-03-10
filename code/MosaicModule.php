<?php
/**
 * Mosaic Module settings and convenience methods.
 */
class MosaicModule extends Object {
    public static function get_module_path() {
        $path = substr(realpath(__DIR__ . '/../'), strlen(Director::baseFolder())) . '/';
        return $path;
    }
}
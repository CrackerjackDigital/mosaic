<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicContentControllerExtension extends Extension {
    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onBeforeInit() {
        MosaicModule::add_requirements(MosaicModule::BeforeInit);
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
        MosaicModule::add_requirements(MosaicModule::AfterInit);
    }


}
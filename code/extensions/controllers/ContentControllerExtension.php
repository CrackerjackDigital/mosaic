<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicContentControllerExtension extends ModularContentControllerExtension {
    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onBeforeInit() {
        MosaicModule::requirements($this(), MosaicModule::BeforeInit);
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
        MosaicModule::requirements($this(), MosaicModule::AfterInit);
    }


}
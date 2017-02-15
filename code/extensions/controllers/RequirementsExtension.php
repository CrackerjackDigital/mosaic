<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicRequirementsExtension extends Modular\ContentControllerExtension {
    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onBeforeInit() {
        Application::factory()->requirements(Application::BeforeInit);
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
	    Application::factory()->requirements(Application::AfterInit);
    }


}
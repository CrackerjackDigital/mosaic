<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicRequirementsExtension extends Extension {

    /**
     *  Loads requirements for before main controller init has been called.
     */
    public function onBeforeInit() {
    	/** @var \Modular\Application $app */
    	$app = Injector::inst()->get('Application');
	    $app->requirements(Application::BeforeInit);
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
	    Injector::inst()->get('Application')
		    ->requirements(Application::AfterInit);
    }
}
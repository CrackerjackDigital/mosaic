<?php

/**
 * Mosaic Module settings and convenience methods.
 */
class MosaicApplication extends Object {
	private static $module_path = '/mosaic';

	const BeforeInit = 'before';            // include in onBeforeInit
	const AfterInit  = 'after';             // include in onAfterInit
	const BothInit   = 'both';              // include in both before and after
	const Block      = 'block';             // block these


	public static function class_name() {
		return get_called_class();
	}

	/**
	 * Includes requirements from static.config.requirements from the called classes ancestors to the actual class called, e.g if 'Application' is
	 * the class configured to be the application class and it inherits from 'MosaicApplication' then requirements defined on MosaicApplication will
	 * be loaded before 'Application' itself when Application.requirements() is called (where Application is configured to be the application
	 * class probably via Injector).
	 *
	 * If a requirement starts with '/' then it is included relative to site root, otherwise it is included relative to module root.
	 * Requirements can be defined as 'before' and 'after' in which case they will be included as per $beforeOrAfterInit
	 * parameter otherwise all requirements will be included when called.
	 *
	 * e.g.
	 *
	 * private static $requirements = array(
	 *  '/framework/thirdpary/jquery/jquery.min.js', // will come relative to site root
	 *  'js/modulescript.js' // will load from module_path/js/
	 *  'css/modulecss.js'
	 * )
	 *
	 * or
	 *
	 * private static $requirements = array(
	 *  'before' => array( ... )',
	 *  'after' => array( ... )'
	 * )
	 *
	 * @param string $beforeOrAfterInit wether to include before or after requirements
	 * @param string $basePath          base path to include relative requirements from, e.g module path or current theme if null config.module_path is used
	 */
	public function requirements($beforeOrAfterInit = self::BothInit, $basePath = null) {
		$ancestry = ClassInfo::ancestry(get_class($this));
		foreach ($ancestry as $className) {
			$config = Config::inst()->forClass($className);

			if ($requirements = $config->get('requirements', Config::UNINHERITED)) {
				// we choose the configured module path, the provided base path or the current theme path
				$basePath = $config->get('module_path', Config::UNINHERITED) ?: SSViewer::get_theme_folder();

				if (isset($requirements[ $beforeOrAfterInit ])) {
					$requirements = $requirements[ $beforeOrAfterInit ];
				}
				$requirements = array_keys(array_filter($requirements ?: []));

				foreach ($requirements as $requirement) {
					if (substr($requirement, 0, 1) == DIRECTORY_SEPARATOR) {
						$requirement = trim($requirement, DIRECTORY_SEPARATOR);
					} else {
						$requirement = trim(\Controller::join_links($basePath, $requirement), DIRECTORY_SEPARATOR);
					}

					if (substr($requirement, -3) == '.js') {
						Requirements::javascript($requirement);
					} else {
						Requirements::css($requirement);
					}
				}
			}
		}
	}
}
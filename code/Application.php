<?php
/**
 * Mosaic Module settings and convenience methods.
 */
class MosaicApplication extends Object {
	private static $module_path = '/mosaic';

	const BeforeInit = 'before';
	const AfterInto = 'after';
	const BothInit = 'both';

	/**
	 * Includes requirements from static.config.requirements. If a requirement starts with '/' then
	 * it is included relative to site root, otherwise it is included relative to module root. Requirements
	 * can be defined as 'before' and 'after' in which case they will be included as per $beforeOrAfterInit
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
	 * @param               $modulePath
	 * @param string        $beforeOrAfterInit wether to include before or after requirements
	 */
	public static function requirements($modulePath, $beforeOrAfterInit = self::BothInit) {
		$requirements = static::config()->get('requirements');

		if (isset($requirements[ $beforeOrAfterInit ])) {
			$requirements = $requirements[ $beforeOrAfterInit ];
		}

		foreach ($requirements as $requirement) {
			if (substr($requirement, -3) == '.js') {
				if (substr($requirement, 0, 1) == '/') {
					Requirements::javascript(substr($requirement, 1));
				} else {
					Requirements::javascript(\Controller::join_links($modulePath, $requirement));
				}
			} else {
				if (substr($requirement, 0, 1) == '/') {
					Requirements::css(substr($requirement, 1));
				} else {
					Requirements::css(\Controller::join_links($modulePath, $requirement));
				}
			}
		}
	}
}
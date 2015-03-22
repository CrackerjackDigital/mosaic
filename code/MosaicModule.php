<?php
/**
 * Mosaic Module settings and convenience methods.
 */
class MosaicModule extends Object {
    const BeforeInit = 'before';
    const AfterInit = 'after';

    // path mosaic module is installed in relative to site root, no leading '/', trailing OK.
    private static $install_dir;

    // what we load and when to load, from requirements.yml
    private static $requirements = [
        self::BeforeInit => [
        ],
        self::AfterInit => [
        ]
    ];

    /**
     * Adds javascript files to requirements based on them ending in '.js' using config.install_dir as base path.
     * @param string $when - look at before or after components.
     */
    public static function add_requirements($when) {
        $installDir = self::get_module_path();

        $requirements = self::get_config_setting('requirements', $when);
        foreach ($requirements as $path) {
            if (substr($path, 0, 1) !== '/') {
                $path = Controller::join_links(
                    $installDir,
                    $path
                );
            }
            $path = substr($path, 1);

            if (substr($path, -3, 3) === '.js') {
                Requirements::javascript($path);
            }
            if (substr($path, -4, 4) === '.css') {
                Requirements::css($path);
            }
        }

    }

    /**
     * Return a setting from config.MosaicControllerInstance optionally returning the key if the setting is an array.
     *
     * NB: Extension doesn't inherit from Object so 'normal' config behaviour available hence Config.inst().
     *
     * @param $varName
     * @param null $key
     * @return array|scalar
     */
    public static function get_config_setting($varName, $key = null) {
        $setting = Config::inst()->get(get_called_class(), $varName);
        if ($key && is_array($setting)) {
            return $setting[$key] ?: [];
        }
        return $setting;
    }
    public static function get_module_path() {
        $path = substr(realpath(__DIR__ . '/../'), strlen(Director::baseFolder())) . '/';
        return $path;
    }
}
<?php

class UserConfig
{
	private static $CONFIG = NULL;

	private static function load()
	{
		if (self::$CONFIG === null) self::$CONFIG = require __DIR__ . '/../config.php';
	}

	public static function get($key)
	{
		self::load();

		return self::$CONFIG[$key];
	}

}
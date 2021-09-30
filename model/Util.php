<?php

class Util
{
	public static function getClientIP()
	{
		if (getenv('HTTP_CLIENT_IP')) return getenv('HTTP_CLIENT_IP');
		else if(getenv('HTTP_X_FORWARDED_FOR')) return getenv('HTTP_X_FORWARDED_FOR');
		else if(getenv('HTTP_X_FORWARDED')) return getenv('HTTP_X_FORWARDED');
		else if(getenv('HTTP_FORWARDED_FOR')) return getenv('HTTP_FORWARDED_FOR');
		else if(getenv('HTTP_FORWARDED')) return getenv('HTTP_FORWARDED');
		else if(getenv('REMOTE_ADDR')) return getenv('REMOTE_ADDR');
		else if (isset($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
		else if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_X_FORWARDED'])) return $_SERVER['HTTP_X_FORWARDED'];
		else if(isset($_SERVER['HTTP_FORWARDED_FOR'])) return $_SERVER['HTTP_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_FORWARDED'])) return $_SERVER['HTTP_FORWARDED'];
		else if(isset($_SERVER['REMOTE_ADDR'])) return $_SERVER['REMOTE_ADDR'];
		else return 'UNKNOWN';
	}

	public static function appendLog(string $type, string $path)
	{
		$line =
			'[' . (new DateTime())->format('Y-m-d H:i:s') . '] ' .
			str_pad($type, 6, ' ', STR_PAD_RIGHT) .
			str_pad($path, 16, ' ', STR_PAD_RIGHT) .
			str_pad(self::getClientIP(), 24, ' ', STR_PAD_RIGHT) .
			(isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '');

		file_put_contents(UserConfig::get('requestlog_path'), $line . PHP_EOL , FILE_APPEND | LOCK_EX);
	}

	public static function getCommitID()
	{
		$f_head = __DIR__ . '/../.git/HEAD';
		$c_head = trim(file_get_contents($f_head));

		$p_ref = str_replace("ref: ", "", $c_head);

		$f_head = __DIR__ . '/../.git/' . $p_ref;
		$c_head = trim(file_get_contents($f_head));

		return $c_head;
	}
}
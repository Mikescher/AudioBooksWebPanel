<?php

class Cache
{
	public static function serve(string $ident): bool
	{
		$cachefile = self::getCacheFile($ident);

		if (file_exists($cachefile))
		{
			header("X-ABWP-CacheFile: " . $cachefile);
			header('Content-Encoding: gzip');
			readfile($cachefile);
			return true;
		}
		else
		{
			header("X-ABWP-CacheFile: NULL");
			return false;
		}
	}

	public static function put(string $ident, string $response)
	{
		$cachefile = self::getCacheFile($ident);

		@mkdir(UserConfig::get("datacache"));

		$gzip = gzencode($response);

		// delete files older than 21 days
		foreach (new DirectoryIterator(UserConfig::get("datacache")) as $fileInfo) {
			if ($fileInfo->isDot()) continue;
			if ($fileInfo->isFile() && time() - $fileInfo->getCTime() >= 21*24*60*60) {
				unlink($fileInfo->getRealPath());
			}
		}

		file_put_contents($cachefile, $gzip);
	}

	private static function getCacheFile(string $ident): string
	{
		return UserConfig::get("datacache") . self::getAPIHash($ident) . '.json.gz';
	}

	private static function getAPIHash(string $rtype): string
	{
		$hash = Util::getCommitID();

		$stat = stat(UserConfig::get("sqlite_path"));

		$dat = $rtype           . "\n" .
			   $hash            . "\n" .
			   $stat['dev']     . "\n" .
			   $stat['ino']     . "\n" .
			   $stat['uid']     . "\n" .
			   $stat['gid']     . "\n" .
			   $stat['mtime']   . "\n" .
			   $stat['ctime']   . "\n" .
			   $stat['blksize'] . "\n" .
			   $stat['size']    . "\n" .
			   $stat['blocks']  . "\n";

		return hash("sha256", $dat);
	}
}
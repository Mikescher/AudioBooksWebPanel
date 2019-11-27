<?php

require_once (__DIR__ . '/../model/Base.php');

$db = Database::connect();

$data = $db->sql_query_assoc(file_get_contents('../data/info.sql'));

$json = [];

foreach ($data as $dat) $json[$dat["id"]] = $dat["val"];

$json['dbfilesize'] = filesize(UserConfig::get("sqlite_path"));

$json['commitid'] = strtoupper(substr(trim(exec("git rev-parse HEAD")), 0, 8));

echo json_encode($json, JSON_PRETTY_PRINT);
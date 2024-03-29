<?php

require_once (__DIR__ . '/../model/Base.php');

Util::appendLog('AJAX', 'get_cover');

header('Content-Type: application/json');

if (Cache::serve(__FILE__)) return;

$db = Database::connect();

$authors = $db->sql_query_assoc(file_get_contents('../sql/authors.sql'));
$series  = $db->sql_query_assoc(file_get_contents('../sql/series.sql'));
$books   = $db->sql_query_assoc(file_get_contents('../sql/books.sql'));

$json =
[
	'authors' => $authors,
	'series' => $series,
	'books' => $books,
];

$jsonstr = json_encode($json, JSON_PRETTY_PRINT);

Cache::put(__FILE__, $jsonstr);

echo $jsonstr;
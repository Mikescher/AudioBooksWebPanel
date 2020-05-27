<?php

require_once (__DIR__ . '/../model/Base.php');

Util::appendLog('AJAX', 'get_cover');

header('Content-Type: application/json');

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

echo json_encode($json, JSON_PRETTY_PRINT);
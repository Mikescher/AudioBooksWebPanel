SELECT
	series.id AS [id],
	series.title AS [title],
	series.author_id AS [author_id],
    series.relative_path AS [relative_path]
FROM
	series
ORDER BY
	series.title

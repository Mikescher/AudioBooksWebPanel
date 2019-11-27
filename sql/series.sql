SELECT
	series.id AS [id],
	series.title AS [title],
	series.author_id AS [author_id]
FROM
	series
ORDER BY
	series.title

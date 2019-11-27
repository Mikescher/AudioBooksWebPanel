SELECT
	authors.id AS [id],
	authors.name AS [name],
	authors.relative_path AS [relative_path]
FROM
	authors
ORDER BY
	authors.name

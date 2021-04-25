SELECT
   books.id AS [book_id],
   books.title AS [title],
   books.series_id AS [series_id],
   books.series_index AS [series_index],
   books.author_id AS [author_id],
   books.relative_path AS [relative_path],
   SUM(meta.length) AS [audiolength],
   SUM(meta.filesize) AS [filesize],
   COUNT(files.id) AS [filecount]
FROM files
	LEFT JOIN books ON files.book_id = books.id
	LEFT JOIN meta ON files.checksum = meta.checksum
GROUP BY
	books.id, books.title, series_index, books.relative_path
ORDER BY
	books.series_index, books.title
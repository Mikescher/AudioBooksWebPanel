SELECT 'book_count' AS id, COUNT(*) AS val FROM books
UNION
SELECT 'file_count' AS id, COUNT(*) AS val FROM files
UNION
SELECT 'author_count' AS id, COUNT(*) AS val FROM authors
UNION
SELECT 'total_size' AS id, SUM(files.filesize) AS val FROM files
UNION
SELECT 'total_length' AS id, SUM(files.length) AS val FROM files
SELECT 'book_count' AS id, COUNT(*) AS val FROM books
UNION
SELECT 'file_count' AS id, COUNT(*) AS val FROM files
UNION
SELECT 'author_count' AS id, COUNT(*) AS val FROM authors
UNION
SELECT 'total_size' AS id, SUM(meta.filesize) AS val FROM files LEFT JOIN meta ON files.checksum = meta.checksum
UNION
SELECT 'total_length' AS id, SUM(meta.length) AS val FROM files LEFT JOIN meta ON files.checksum = meta.checksum
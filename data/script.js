



$(window).on('load', function()
{


	$.ajax({
		url: "/ajax/get_info.php",
		success: function(data)
		{
			let json = JSON.parse(data);

			$("#pagefooter").css('display', "block");

			$("#InfoSize").text(formatSize(json['dbfilesize'])).attr("title", json['dbfilesize'] + " bytes");
			$("#InfoCommit").text(json['commitid']);
			$("#InfoDatasize").text(formatSize(json['total_size'])).attr("title", json['total_size'] + " bytes");
			$("#InfoDataLength").text(formatLength(json['total_length'])).attr("title", json['total_length'] + " seconds");
			$("#InfoDataAuthorCount").text(json['author_count']);
			$("#InfoDataBookCount").text(json['book_count']);
			$("#InfoDataFileCount").text(json['file_count']);

			return data;
		}
	});

	$.ajax({
		url: "/ajax/get_data.php",
		success: function(data)
		{
			let db = processData(JSON.parse(data));

			$("#maintab").html(getTableHTML(db));

			return data;
		}
	});


});

function processData(data)
{
	let db = [];

	let author_map = {};
	let series_map = {};

	for (const author of data['authors'])
	{
		let aobj =
		{
			'id': Number(author['id']),
			'name': author['name'],
			'all_books': [],
			'direct_books': [],
			'series': [],
			'audiolength': 0,
			'filesize': 0,
			'filecount': 0
		};

		db.push(aobj);
		author_map[aobj.id] = aobj;
	}

	for (const series of data['series'])
	{
		let sobj =
		{
			'id': Number(series['id']),
			'title': series['title'],
			'books': {},
			'audiolength': 0,
			'filesize': 0,
			'filecount': 0
		};
		const author = author_map[Number(series['author_id'])];

		author.series.push(sobj);
		series_map[sobj.id] = sobj;
	}

	for (const book of data['books'])
	{
		let bobj =
		{
			'id': Number(book['id']),
			'title': book['title'],
			'audiolength': Number(book['audiolength']),
			'filesize': Number(book['filesize']),
			'filecount': Number(book['filecount']),
		};

		const author = author_map[Number(book['author_id'])];
		author.all_books.push(bobj);

		if (book['series_id'] !== null)
		{
			const series = series_map[Number(book['series_id'])];

			series.books[Number(book['series_index'])] = book;

			series.audiolength += bobj.audiolength;
			series.filesize    += bobj.filesize;
			series.filecount   += bobj.filecount;
		}
		else
		{
			author.direct_books.push(bobj);
		}

		author.audiolength += bobj.audiolength;
		author.filesize    += bobj.filesize;
		author.filecount   += bobj.filecount;
	}

	return db;
}

function getTableHTML(db)
{
	let str = "";

	str += '<thead>';
	str += '<tr>';
	str += '<th style="width: 600px">Name</th>';
	str += '<th style="width: 100px">Book count</th>';
	str += '<th style="width: 200px">Length</th>';
	str += '<th style="width: 80px">Size</th>';
	str += '<th style="width: 100px">File count</th>';
	str += '</tr>';
	str += '</thead>';

	str += '<tbody>';

	let rowid = 100000;
	for (const author of db)
	{
		str += '<tr class="row_entry row_author row_id_'+rowid+'" data-epath="['+rowid+']" data-rowid="'+rowid+'" data-eparent="" data-authorid="'+author.id+'">';
		str += '<td>' + author.name + '</td>';
		str += '<td>' + author.all_books.length + '</td>';
		str += '<td title="'+author.audiolength+' seconds">' + formatLength(author.audiolength) + '</td>';
		str += '<td title="'+author.filesize+' bytes">' + formatSize(author.filesize) + '</td>';
		str += '<td>' + author.filecount + '</td>';
		str += '</tr>';

		rowid++;
	}
	str += '</tbody>';


	return str;
}

function formatLength(secs) {
	let res = ""; //$NON-NLS-1$

	let mins = Math.floor(secs/60);

	let fullmins = mins % 60;
	mins -= fullmins;
	mins /= 60;
	mins = Math.floor(mins);
	let fullhours = mins % 24;
	mins -= fullhours;
	mins /= 24;
	mins = Math.floor(mins);
	let fulldays = mins % 365;
	mins -= fulldays;
	mins /= 365;
	mins = Math.floor(mins);
	let fullyears = mins;

	let render = false;
	if (fullyears !== 0 || render) {
		if (fullyears !== 1) {
			res += fullyears + " Years, "; //$NON-NLS-1$ //$NON-NLS-2$
		} else {
			res += fullyears + " Year, "; //$NON-NLS-1$ //$NON-NLS-2$
		}
		render = true;
	}

	if (fulldays !== 0 || render) {
		if (fulldays !== 1) {
			res += fulldays + " Days, "; //$NON-NLS-1$ //$NON-NLS-2$
		} else {
			res += fulldays + " Day, "; //$NON-NLS-1$ //$NON-NLS-2$
		}
		render = true;
	}

	if (fullhours !== 0 || render) {
		res += fullhours + " h, "; //$NON-NLS-1$ //$NON-NLS-2$
		render = true;
	}

	if (fullmins !== 0 || render) {
		res += fullmins + " min"; //$NON-NLS-1$
		render = true;
	}

	return res;
}

function formatSize(bytes) {
	let UNITS = ["B", "KB","MB","GB","TB","PB","EB"];

	let digitGroups = Math.floor((Math.log10(bytes) / Math.log10(1024)));

	return (bytes / Math.pow(1024, digitGroups)).toFixed(1) + " " + UNITS[digitGroups];
}

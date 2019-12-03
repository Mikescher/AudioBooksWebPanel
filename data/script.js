
$(window).on('load', function()
{
	const spin =  showSpinner();

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

			spin.stop();

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
			'bookcount': 0,
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
			series.bookcount++;
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

function rowclick(rowid)
{
	let src = $(".row_id_"+rowid);
	let isOpen = $(src).hasClass('row_open');
	if(isOpen)
	{
		//CLOSE

		src.removeClass('row_open');

		for (let row of $(".row_entry"))
		{
			let subrow_id   = parseInt($(row).attr('data-rowid'));
			let subrow_epath = JSON.parse($(row).attr('data-epath'));

			if (subrow_id === rowid)
			{
				$(row).removeClass('row_hidden');
			}
			else if (subrow_epath.includes(rowid))
			{
				$(row).removeClass('row_open');
				$(row).addClass('row_hidden');
			}
		}
	}
	else
	{
		//OPEN

		$(src).addClass('row_open');

		for (let row of $(".row_entry"))
		{
			let row_eprnt = $(row).attr('data-eparent') === '' ? -1 : parseInt($(row).attr('data-eparent'));

			if (row_eprnt === rowid) $(row).removeClass('row_hidden');
		}
	}
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
		rowid++;
		const rid_author = rowid;
		str += '<tr class="row_entry row_expandable row_author row_id_'+rowid+'" onclick="rowclick('+rowid+');" data-epath="['+rowid+']" data-rowid="'+rowid+'" data-eparent="" data-authorid="'+author.id+'">';
		str += '<td class="td_name"><i class="fas fa-user"></i>' + author.name + '</td>';
		str += '<td>' + author.all_books.length + '</td>';
		str += '<td title="'+author.audiolength+' seconds">' + formatLength(author.audiolength) + '</td>';
		str += '<td title="'+author.filesize+' bytes">' + formatSize(author.filesize) + '</td>';
		str += '<td>' + author.filecount + '</td>';
		str += '</tr>';

		for (const book of author.direct_books)
		{
			rowid++;
			str += '<tr class="row_entry row_nonexpandable row_book row_directbook row_id_'+rowid+' row_hidden" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_author+'" data-bookid="'+book.id+'">';
			str += '<td class="td_name"><i class="fas fa-book"></i>' + book.title + '</td>';
			str += '<td></td>';
			str += '<td title="'+book.audiolength+' seconds">' + formatLength(book.audiolength) + '</td>';
			str += '<td title="'+book.filesize+' bytes">' + formatSize(book.filesize) + '</td>';
			str += '<td>' + book.filecount + '</td>';
			str += '</tr>';
		}

		for (const series of author.series)
		{
			rowid++;
			const rid_series = rowid;
			str += '<tr class="row_entry row_expandable row_series row_id_'+rowid+' row_hidden" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_author+'" data-seriesid="'+series.id+'">';
			str += '<td class="td_name"><i class="fas fa-list-alt"></i>' + series.title + '</td>';
			str += '<td>' + series.bookcount + '</td>';
			str += '<td title="'+series.audiolength+' seconds">' + formatLength(series.audiolength) + '</td>';
			str += '<td title="'+series.filesize+' bytes">' + formatSize(series.filesize) + '</td>';
			str += '<td>' + series.filecount + '</td>';
			str += '</tr>';

			for (const [booknum, sbook] of Object.entries(series.books))
			{
				rowid++;
				str += '<tr class="row_entry row_nonexpandable row_book row_seriesbook row_id_'+rowid+' row_hidden" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rid_series+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_series+'" data-bookid="'+sbook.id+'">';
				str += '<td class="td_name"><div><i class="fas fa-book"></i><span class="book_num"><span>' + booknum + '</span></span><span class="book_tit">' + sbook.title + '</span></div></td>';
				str += '<td></td>';
				str += '<td title="'+sbook.audiolength+' seconds">' + formatLength(sbook.audiolength) + '</td>';
				str += '<td title="'+sbook.filesize+' bytes">' + formatSize(sbook.filesize) + '</td>';
				str += '<td>' + sbook.filecount + '</td>';
				str += '</tr>';
			}
		}

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

function showSpinner()
{
	const opts = {
		lines: 12, // The number of lines to draw
		length: 0, // The length of each line
		width: 26, // The line thickness
		radius: 84, // The radius of the inner circle
		scale: 1, // Scales overall size of the spinner
		corners: 0.2, // Corner roundness (0..1)
		color: '#444', // CSS color or array of colors
		fadeColor: 'transparent', // CSS color or array of colors
		speed: 1, // Rounds per second
		rotate: 0, // The rotation offset
		animation: 'spinner-line-fade-default', // The CSS animation name for the lines
		direction: 1, // 1: clockwise, -1: counterclockwise
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		className: 'spinner', // The CSS class to assign to the spinner
		top: '50%', // Top position relative to parent
		left: '50%', // Left position relative to parent
		shadow: '0 0 1px transparent', // Box-shadow for the lines
		position: 'absolute' // Element positioning
	};

	const target = document.getElementById('content');
	return new Spinner(opts).spin(target);
}
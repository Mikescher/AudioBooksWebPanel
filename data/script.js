
const BASE_PATH = 'file:////Melkor/Klotho';

let DATA_INFO  = null;
let DATA_BOOKS = null;

let ORDER = "";

$(window).on('load', function()
{
	const spin =  showSpinner();

	$.ajax({
		url: "/ajax/get_info.php",
		success: function(json)
		{
			$("#pagefooter").css('display', "block");

			$("#InfoSize").text(formatSize(json['dbfilesize'])).attr("title", json['dbfilesize'] + " bytes");
			$("#InfoCommit").text(json['commitid']);
			$("#InfoDatasize").text(formatSize(json['total_size'])).attr("title", json['total_size'] + " bytes");
			$("#InfoDataLength").text(formatLength(json['total_length'])).attr("title", json['total_length'] + " seconds");
			$("#InfoDataAuthorCount").text(json['author_count']);
			$("#InfoDataBookCount").text(json['book_count']);
			$("#InfoDataFileCount").text(json['file_count']);

			DATA_INFO = json;

			return json;
		}
	});

	$.ajax({
		url: "/ajax/get_data.php",
		success: function(json)
		{
			let db = processData(json);

			$("#maintab").html(getTableHTML(db));

			spin.stop();

			DATA_BOOKS = db;

			return json;
		}
	});

	$("#filter").on('input', function () {
		if (DATA_BOOKS === null) return;
		$("#maintab").html(getTableHTML(DATA_BOOKS));
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
			'otype': 'author',
			'id': Number(author['id']),
			'title': author['name'],
			'all_books': [],
			'direct_books': [],
			'children': [],
			'bookcount': 0,
			'series': [],
			'audiolength': 0,
			'filesize': 0,
			'filecount': 0,
			'path': BASE_PATH+author['relative_path'],
		};

		db.push(aobj);
		author_map[aobj.id] = aobj;
	}

	for (const series of data['series'])
	{
		let sobj =
		{
			'otype': 'series',
			'id': Number(series['id']),
			'title': series['title'],
			'books': [],
			'bookcount': 0,
			'audiolength': 0,
			'filesize': 0,
			'filecount': 0,
			'path': BASE_PATH+series['relative_path'],
		};
		const author = author_map[Number(series['author_id'])];

		author.series.push(sobj);
		author.children.push(sobj);
		series_map[sobj.id] = sobj;
	}

	for (const book of data['books'])
	{
		let bobj =
		{
			'otype': 'book',
			'id': Number(book['id']),
			'title': book['title'],
			'audiolength': Number(book['audiolength']),
			'filesize': Number(book['filesize']),
			'filecount': Number(book['filecount']),
			'bookcount': 1,
			'seriesindex': null,
		};

		const author = author_map[Number(book['author_id'])];
		author.all_books.push(bobj);

		if (book['series_id'] !== null)
		{
			const series = series_map[Number(book['series_id'])];

			book.seriesindex = Number(book['series_index']);

			series.books.push(book);

			series.audiolength += bobj.audiolength;
			series.filesize    += bobj.filesize;
			series.filecount   += bobj.filecount;
			series.bookcount++;
		}
		else
		{
			author.direct_books.push(bobj);
			author.children.push(bobj);
		}

		author.audiolength += bobj.audiolength;
		author.filesize    += bobj.filesize;
		author.filecount   += bobj.filecount;
		author.bookcount++;
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
	db = JSON.parse(JSON.stringify(db));

	const search = $("#filter").val();
	db = datafilter(db, search);

	db = datasort(db, ORDER);

	const expand = (search.trim() !== "");

	let str = "";

	const ofas_order = ORDER[0]==="+" ? "fa-caret-up" : "fa-caret-down";

	const ofas1 = (ORDER.substr(1) === "title") ? '<i class="fas '+ofas_order+'"></i>' : '';
	const ofas2 = (ORDER.substr(1) === "bookcount") ? '<i class="fas '+ofas_order+'"></i>' : '';
	const ofas3 = (ORDER.substr(1) === "audiolength") ? '<i class="fas '+ofas_order+'"></i>' : '';
	const ofas4 = (ORDER.substr(1) === "filesize") ? '<i class="fas '+ofas_order+'"></i>' : '';
	const ofas5 = (ORDER.substr(1) === "filecount") ? '<i class="fas '+ofas_order+'"></i>' : '';

	str += '<thead>';
	str += '<tr>';
	str += '<th class="th_name"  ><a href="#" onclick="rotateOrder(\'title\')">Name'+ofas1+'</a></th>';
	str += '<th class="th_bcount"><a href="#" onclick="rotateOrder(\'bookcount\')">Book count'+ofas2+'</a></th>';
	str += '<th class="th_length"><a href="#" onclick="rotateOrder(\'audiolength\')">Length'+ofas3+'</a></th>';
	str += '<th class="th_size"  ><a href="#" onclick="rotateOrder(\'filesize\')">Size'+ofas4+'</a></th>';
	str += '<th class="th_fcount"><a href="#" onclick="rotateOrder(\'filecount\')">File count'+ofas5+'</a></th>';
	str += '</tr>';
	str += '</thead>';

	str += '<tbody>';

	let rowid = 100000;
	for (const author of db)
	{
		rowid++;
		const rid_author = rowid;
		str += '<tr class="row_entry row_expandable '+(expand?'row_open':'')+' row_author row_id_'+rowid+'" onclick="rowclick('+rowid+');" data-epath="['+rowid+']" data-rowid="'+rowid+'" data-eparent="" data-authorid="'+author.id+'">';
		str += '<td class="td_name"><i class="fas fa-user"></i>' + author.title + '</td>';
		str += '<td class="td_bcount">' + author.bookcount + '</td>';
		str += '<td class="td_length" title="'+author.audiolength+' seconds">' + formatLength(author.audiolength) + '</td>';
		str += '<td class="td_size"   title="'+author.filesize+' bytes">' + formatSize(author.filesize) + '</td>';
		str += '<td class="td_fcount">' + author.filecount + '</td>';
		str += '</tr>';

		for (const child of author.children)
		{
			if (child.otype === 'book')
			{
				const book = child;
				rowid++;
				str += '<tr class="row_entry row_nonexpandable row_book row_directbook row_id_'+rowid+' '+(expand?'':'row_hidden')+'" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_author+'" data-bookid="'+book.id+'">';
				str += '<td class="td_name"><i class="fas fa-book"></i>' + book.title + '</td>';
				str += '<td class="td_bcount"></td>';
				str += '<td class="td_length" title="'+book.audiolength+' seconds">' + formatLength(book.audiolength) + '</td>';
				str += '<td class="td_size"   title="'+book.filesize+' bytes">' + formatSize(book.filesize) + '</td>';
				str += '<td class="td_fcount">' + book.filecount + '</td>';
				str += '</tr>';
			}
			else if (child.otype === 'series')
			{
				const series = child;
				rowid++;
				const rid_series = rowid;
				str += '<tr class="row_entry '+(expand?'row_open':'')+' row_expandable row_series row_id_'+rowid+' '+(expand?'':'row_hidden')+'" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_author+'" data-seriesid="'+series.id+'">';
				str += '<td class="td_name"><i class="fas fa-list-alt"></i>' + series.title + '</td>';
				str += '<td class="td_bcount">' + series.bookcount + '</td>';
				str += '<td class="td_length" title="'+series.audiolength+' seconds">' + formatLength(series.audiolength) + '</td>';
				str += '<td class="td_size"   title="'+series.filesize+' bytes">' + formatSize(series.filesize) + '</td>';
				str += '<td class="td_fcount">' + series.filecount + '</td>';
				str += '</tr>';

				for (const sbook of series.books)
				{
					rowid++;
					str += '<tr class="row_entry row_nonexpandable row_book row_seriesbook row_id_'+rowid+' '+(expand?'':'row_hidden')+'" onclick="rowclick('+rowid+');" data-epath="['+rid_author+','+rid_series+','+rowid+']" data-rowid="'+rowid+'" data-eparent="'+rid_series+'" data-bookid="'+sbook.id+'">';
					str += '<td class="td_name"  ><div><i class="fas fa-book"></i><span class="book_num"><span>' + sbook.seriesindex + '</span></span><span class="book_tit">' + sbook.title + '</span></div></td>';
					str += '<td class="td_bcount"></td>';
					str += '<td class="td_length" title="'+sbook.audiolength+' seconds">' + formatLength(sbook.audiolength) + '</td>';
					str += '<td class="td_size"   title="'+sbook.filesize+' bytes">' + formatSize(sbook.filesize) + '</td>';
					str += '<td class="td_fcount">' + sbook.filecount + '</td>';
					str += '</tr>';
				}
			}
			else throw "what?";
		}
	}
	str += '</tbody>';


	return str;
}

function rotateOrder(col)
{
	if (DATA_BOOKS == null) return;

	     if (ORDER === "+"+col) ORDER = "-"+col;
	else if (ORDER === "-"+col) ORDER = "";
	else                        ORDER = "+"+col;

	const tab = getTableHTML(DATA_BOOKS);

	$("#maintab").html(tab);
}

function datafilter(db, search)
{
	if (search.trim() === "") return db;

	let result = [];

	for (const author of db)
	{
		let author_in = false;
		let author_direct_in = false;
		if(isinfilter(author.title, search)) author_in = author_direct_in = true;

		let a_all_books = [];
		let a_direct_books = [];
		let a_series = [];

		for(const directbook of author.direct_books)
		{
			let dbook_in = false;
			if (author_direct_in) dbook_in = true;
			if (isinfilter(directbook.title, search)) dbook_in = author_in = true;

			if (dbook_in) a_all_books.push(directbook);
			if (dbook_in) a_direct_books.push(directbook);
		}

		for (const series of author.series)
		{
			let series_in = false;
			let series_direct_in = false;
			if (author_direct_in) series_direct_in = series_in = true;
			if(isinfilter(series.title, search)) series_in = series_direct_in = author_in = true;

			let s_books = [];

			for(const seriesbook of series.books)
			{
				let sbook_in = false;
				if (author_direct_in) sbook_in = true;
				if (series_direct_in) sbook_in = true;
				if(isinfilter(seriesbook.title, search)) sbook_in = series_in = author_in = true;

				if (sbook_in) a_all_books.push(seriesbook);
				if (sbook_in) s_books.push(seriesbook);
			}

			series.books = s_books;

			if (series_in) a_series.push(series);
		}

		author.all_books = a_all_books;
		author.direct_books = a_direct_books;
		author.series = a_series;

		if (author_in) result.push(author);
	}

	return result;
}

function datacomp(o)
{
	const dir = (o[0]==="+") ? +1 : -1;
	const order = o.substr(1);

	return function(a, b)
	{
		if ((typeof a[order]) === "string") return dir * Math.sign(a[order].toLowerCase().localeCompare(b[order].toLowerCase()));
		else return dir * Math.sign(a[order] - b[order]);
	};
}

function datasort(db, order)
{
	if (order === "")
	{
		db = db.sort(datacomp("+title"));

		for (const author of db)
		{
			author.all_books = author.all_books.sort(datacomp("+title"));
			author.direct_books = author.direct_books.sort(datacomp("+title"));
			author.series = author.series.sort(datacomp("+title"));
			author.children = author.children.sort(datacomp("+title"));

			for (const series of author.series)
			{
				series.books = series.books.sort(datacomp("+seriesindex"));
			}
		}

		return db;
	}

	db = db.sort(datacomp(ORDER));

	for (const author of db)
	{
		author.all_books = author.all_books.sort(datacomp(ORDER));
		author.direct_books = author.direct_books.sort(datacomp(ORDER));
		author.series = author.series.sort(datacomp(ORDER));
		author.children = author.children.sort(datacomp(ORDER));

		for (const series of author.series)
		{
			series.books = series.books.sort(datacomp(ORDER));
		}
	}

	return db;
}

function isinfilter(value, search)
{
	return value.toLowerCase().includes(search.toLowerCase().trim());
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




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


});

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

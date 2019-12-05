<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
    <meta name="robots" content="noindex">
	<title>AudioBooks - Webview</title>
	<link rel="icon" type="image/png" href="/data/icon_audio.png"/>

    <link rel="stylesheet" type="text/css" href="/data/pure-min.css"/>
    <link rel="stylesheet" href="/data/spin.css"/>

    <link rel="stylesheet" href="/data/fa-solid.css">
    <link rel="stylesheet" href="/data/fontawesome.css">

    <link rel="stylesheet" href="/data/styles.css"/>
</head>
<body>

    <script src="/data/jquery-3.4.1.js" type="text/javascript" ></script>
    <script src="/data/spin.js" type="text/javascript" ></script>

    <script src="/data/script.js" type="text/javascript" ></script>

	<div id="root">

        <div id="header">
            <div id="headertext"><img src="/data/icon_audio.png" /><span>Audiobooks</span></div>
            <input type="text" id="filter" placeholder="Filter">

            <div id="headerlinks">
                <a href="https://ebooks.mikescher.com"><img src="/data/icon_ebk.png" /><span> Ebooks</span></a>
                <a href="https://audiobooks.mikescher.com"><img src="/data/icon_audio.png" /><span> Audiobooks</span></a>
                <a href="https://clipcorn.mikescher.com"><img src="/data/icon_jcc.png" /><span> Movies</span></a>
            </div>
        </div>

        <div id="content">
            <table id="maintab" class="pure-table pure-table-bordered">
                <!-- filled via js -->
            </table>
        </div>

        <div id="pagefooter" class="">
            <div class="FooterInfo"><span class="FIText">Script:</span><span class="FIValue" id="InfoCommit">?</span></div>
            <div class="FooterInfo"><span class="FIText">Database size:</span><span class="FIValue" id="InfoSize">?</span></div>
            <div class="FooterInfo"><span class="FIText">Data size:</span><span class="FIValue" id="InfoDatasize">?</span></div>
            <div class="FooterInfo"><span class="FIText">Total length:</span><span class="FIValue" id="InfoDataLength">?</span></div>
            <div class="FooterInfo"><span class="FIText">Authors:</span><span class="FIValue" id="InfoDataAuthorCount">?</span></div>
            <div class="FooterInfo"><span class="FIText">Books:</span><span class="FIValue" id="InfoDataBookCount">?</span></div>
            <div class="FooterInfo"><span class="FIText">Files:</span><span class="FIValue" id="InfoDataFileCount">?</span></div>
            <div class="Sho"><a href="#" id="AnchorSho">Ϸ</a></div>
        </div>
	</div>

</body>
</html>
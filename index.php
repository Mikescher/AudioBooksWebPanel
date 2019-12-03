<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
    <meta name="robots" content="noindex">
	<title>AudioBooks - Webview</title>
	<link rel="icon" type="image/png" href="/data/icon.png"/>

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
            <div id="headertext"><img src="/data/icon.png" /><span>Audiobooks</span></div>
            <input type="text" class="filter" placeholder="Filter" >
        </div>

        <div id="content">
            <table id="maintab" class="pure-table pure-table-bordered">
                <!-- filled via js -->
            </table>
        </div>

        <div id="pagefooter" class="">
            <div class="FooterInfo">Script:<span id="InfoCommit">?</span></div>
            <div class="FooterInfo">Database size:<span id="InfoSize">?</span></div>
            <div class="FooterInfo">Data size:<span id="InfoDatasize">?</span></div>
            <div class="FooterInfo">Total length:<span id="InfoDataLength">?</span></div>
            <div class="FooterInfo">Authors:<span id="InfoDataAuthorCount">?</span></div>
            <div class="FooterInfo">Books:<span id="InfoDataBookCount">?</span></div>
            <div class="FooterInfo">Files:<span id="InfoDataFileCount">?</span></div>
            <div class="Sho"><a href="#" id="AnchorSho">Ϸ</a></div>
        </div>
	</div>

</body>
</html>
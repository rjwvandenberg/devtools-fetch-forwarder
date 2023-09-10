// isXHR Extracted from AJAX debugger chrome plugin
isXHR = function(request) {
	for (var i=0, len=request.request.headers.length; i<len; i++) {
		if (
			(request.request.headers[i].name == "X-Requested-With" &&
				request.request.headers[i].value == "XMLHttpRequest") ||
			(request.request.headers[i].name == "Content-Type" &&
				request.request.headers[i].value == "application/x-www-form-urlencoded") ||
			(request.request.url.match(/\.json$/) || request.request.url.match(/\.json?/)) ||
			request._resourceType == 'xhr'
		) {
			console.log(request)
			return true;
		}
	};

	return false;
}

function sendToLocalhost(data) {
	$.ajax({
		url: 'http://localhost/ingest/',
		type: 'POST',
		data: data,
		dataType: 'json',
		contentType: 'application/json'
	});
}


chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
        if (isXHR(request)){
        request.getContent(content => {
            //prints to dev page devtools console
            // ctrl+shift+i page devtools are in a seperate window
			// then ctrl+shift+j to access dev page devtools 
			jsoncontent = JSON.parse(content)
			jsoncontent['__url'] = request.request.url
			jsoncontent['__time'] = Date.now()
			jsoncontent['__postData'] = request.request.postData
			sendToLocalhost(JSON.stringify(jsoncontent));  
        });       
    }}
);


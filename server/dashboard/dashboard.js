var socket = io('https://' + location.host);
socket.on('translation', function(response) {
	console.log('Translation of “' + response.query + '” (' +
	            response.langFrom + '-' +
	            response.langTo + '): ' + response.result);
});

$.get('/index.json', function(index) {
	if (index.ok && index.images) {
		console.log(index.images);
		$.each(index.images, function(i, imageSet) {
			setupImagesContainer(imageSet.query);
			if (imageSet.google) {
				addSourceImages(imageSet.query, 'google', imageSet.google);
			}
			if (imageSet.baidu) {
				addSourceImages(imageSet.query, 'baidu', imageSet.baidu);
			}
		});
		$('img').unveil();
	} else if (index.error) {
		console.log(index.error);
	}
});

socket.on('images-received', function(images) {
	console.log('Image records for query ' + images.query + ' from ' + images.source);
	var urls = JSON.parse(images.images);
	setupImagesContainer(images.query, images.query_cn);
	addSourceImages(images.query, images.source, urls);
});

function setupImagesContainer(query, query_cn) {
	var id = getImageContainerId(query);
	if ($('#' + id).length == 0) {
		$('#images').prepend(
			'<div id="' + getImageContainerId(query) + '" class="image-set">' +
				'<div class="container">' +
					'<div class="google">' +
						'<h2>Google: ' + query + '</h2>' +
						'<div class="images"></div>' +
					'</div>' +
					'<div class="baidu">' +
						'<h2>Baidu: ' + query_cn + '</h2>' +
						'<div class="images"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
	}
}

function getImageContainerId(query) {
	var id = 'images-' + query.replace(/\W+/g, '-');
	return id;
}

function addSourceImages(query, source, urls) {
	var imagesHTML = '';
	$.each(urls, function(i, url) {
		url = decodeURIComponent(url);
		url = decodeURIComponent(url);
		imagesHTML += '<img src="/placeholder.png" data-src="' + url + '" alt="">';
	});
	var containerId = getImageContainerId(query);
	$('#' + containerId + ' .' + source + ' .images').html(imagesHTML);
}

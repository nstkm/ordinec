var postID = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);
var startVal = {};

(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/posts/statuses',
		data: '',
		callback: function(result) {
			for (var i in result) {
				if (result[i]) {
					$('#status').append('<option value="'+i+'">'+result[i]+'</option>');
				}
			}
			
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/posting-modules',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#posting-module').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
			}
			window.ruls = result;
			getPost();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/offers?fields=id,name',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#id_offer').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

}());

var getImages = function() {
	if (postID) {
		var ajaxParams = {
			method: 'GET',
			url: '/v1/attachments?&expand=upload&q[id_post][equal]='+postID,
			data: '',
			callback: function(result) {
				$('.upload-info').empty();
				for (var i = 0, length = result.length; i < length; i++) {
					if (result[i].upload != null)
						$('.upload-info').append('<div id="wrap-logo"><span data-image-id="'+result[i].id+'">x</span><img src="'+result[i].upload.server+result[i].upload.patch+'" alt="'+result[i].id+'" /></div>')
				}
				$('.upload-info img').each(function() {
					$(this).zclip({
						path:'js/copy/ZeroClipboard.swf',
						copy:$(this).attr('alt'),
						beforeCopy:function(){},
						afterCopy:function(){}
					});
				});
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	}
}

getImages();

var getPost = function() {
	if (!postID) return false;
	var ajaxParams = {
		method: 'GET',
		url: '/v1/posts/'+postID,
		data: '',
		callback: function(result) {
			for (var i in result) {
				if (result[i] && i == "text") {
					for (var j = 0, length = ruls.length; j < length; j++) {
						if (result.id_posting_module == ruls[j].id && ruls[j].rules != null) {
							var element = document.getElementById('editor_holder');
							startVal = JSON.parse(result.text);
							var options = {
								ajax: true,
								schema: JSON.parse(result.rules),
								startval: startVal,
								theme: 'bootstrap3'
							}
							window.editor = new JSONEditor(element, options);
							$(".post-text").hide();
							break;
						}
						else if (result.id_posting_module == ruls[j].id && ruls[j].rules == null) {
							$(".post-text").show();
							$('#post-table [name="'+i+'"]').val(result.text);
							break;
						}
					}
					continue;
				}
				else if (result[i] && i == "id_offer") {
					$('#post-table [name="'+i+'"]').val(result[i]);
					var ajaxParams = {
						method: 'GET',
						url: '/v1/ref-links?q[id_offer][equal]='+result[i],
						data: '',
						callback: function(result) {
							for (var i = 0, length = result.length; i < length; i++) {
								$('#links').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
							}
							$('#links').chosen();
						},
						response_headers: function(xhr) {

						},
						error: function() {

						}
					}
					settings.sendAjax(ajaxParams);
				}
				else {
					$('#post-table [name="'+i+'"]').val(result[i]);
				}
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}

var editPost = function(data) {
	if (postID) {
		var method = "PATCH";
		var href = '/' + postID;
	}
	else {
		var method = "POST";
		var href = '';
	}
	var ajaxParams = {
		method: method,
		url: '/v1/posts'+href,
		data: data,
		callback: function(result) {
			settings.response_handler(true,1);
			if (!postID) location.replace('editGroups.html?id='+result.id);
		},
		response_headers: function(xhr) {

		},
		error: function(error) {
			settings.response_handler(false,1,error);
		}
	}
	settings.sendAjax(ajaxParams);
}

$(document).ready(function() {
	if (postID) {
		$('#posting-module').change(function() {
			for (var j = 0, length = ruls.length; j < length; j++) {
				if ($(this).val() == ruls[j].id && ruls[j].rules != null) {
					$("#editor_holder").empty().show();
					var element = document.getElementById('editor_holder');
					startVal = startVal || {};
					console.log(startVal);
					var options = {
						ajax: true,
						schema: JSON.parse(ruls[j].rules),
						startval: startVal,
						theme: 'bootstrap3'
					}
					window.editor = new JSONEditor(element, options);
					$(".post-text").hide();
					break;
				}
				else if ($(this).val() == ruls[j].id && ruls[j].rules == null) {
					$(".post-text").show();
					$("#editor_holder").hide();
					break;
				}
			}
		});

		var uploadedFiles = new Array;
		$("#uploader").uploadify({
			'buttonText' : 'Загрузить',
	        height        : 30,
	        swf           : 'js/upload/uploadify.swf',
	        'fileObjName' : 'image',
	        uploader      : "https://file.ordinec.ru/v1/upload?accessToken=" + document.cookie.split('=')[1],
	        width         : 120,
	        onUploadSuccess : function(file, data, response) {
	        	var data = JSON.parse(data);
	        	if (data.success) {
	        		var ajaxParams = {
						method: "POST",
						url: '/v1/attachments',
						data: {
							'id_upload' : data.data.id,
							'type' : data.data.type,
							'id_post' : postID
						},
						callback: function(result) {
							getImages();
						},
						response_headers: function(xhr) {

						},
						error: function(error) {
							
						}
					}
					settings.sendAjax(ajaxParams);
	        	}
	        }
	    });
	    $('#uploader').show();
	    $('.upload-info').on('click', 'span', function() {
			var ajaxParams = {
				method: 'DELETE',
				url: '/v1/attachments/'+ $(this).data('image-id'),
				data: '',
				callback: function(result) {
					getImages();
				},
				response_headers: function(xhr) {

				},
				error: function() {

				}
			}
			settings.sendAjax(ajaxParams);
		});
		
	}

	

	$('#add-new-post').click(function() {
		var data = new Object;
		$('#post-table input, #post-table select, #post-table textarea').each(function() {
			if ($(this).is(':visible')) {
				console.log($(this).attr('name'));
				data[$(this).attr('name')] = $(this).val();
			}
			else if (!$('#post-table textarea').is(':visible')){
				data.text = JSON.stringify(editor.getValue());
			}
		});
		console.log(data);
		editPost(data);
	});
});
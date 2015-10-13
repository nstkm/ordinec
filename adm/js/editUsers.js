var userID = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);
if (userID) {
	$(function() {
		var ajaxParams = {
			method: 'GET',
			url: '/v1/users/'+userID,
			data: '',
			callback: function(result) {
				for (i in result) {
					var el = $('input[name="'+i+'"]');
					if (result[i] && el) {
						el.val(result[i]);
					}
				}
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	});
}

var editUser = function(data,bool) {
	var method = bool ? "POST" : "PATCH";
	userID = userID ? '/'+userID : '';
	$(function() {
		var ajaxParams = {
			method: method,
			url: '/v1/users'+userID,
			data: data,
			callback: function(result) {
				for (i in result) {
					var el = $('input[name="'+i+'"]');
					if (result[i] && el) {
						el.val(result[i]);
					}
				}
			},
			response_headers: function(xhr) {
				location.replace('index.html');
			},
			error: function(error) {
				settings.response_handler(false,1,error);
			}
		}
		settings.sendAjax(ajaxParams);
	});
}

$(document).ready(function() {
	$('#add-user').click(function() {
		var data = new Object();
		$('input').each(function() {
			data[$(this).attr('name')] = $(this).val();
		});
		userID ? editUser(data,false) : editUser(data,true);
	});
});
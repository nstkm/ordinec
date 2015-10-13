settings.end_load();

var id_group = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);
var id_social_network = parseInt(window.location.search.substring(1).split("&")[1].split("=")[1]);

var ajaxParams = {
	method: 'GET',
	url: '/v1/posters/statuses',
	data: '',
	callback: function(result) {
		window.postersStatus = result;
	},
	response_headers: function(xhr) {

	},
	error: function() {

	}
}
settings.sendAjax(ajaxParams);

$(document).ready(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups/'+id_group+'?expand=posters',
		data: '',
		callback: function(result) {
			window.activePosters = result.posters;
			getPosters('&');
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
	var getPosters = function(system) {
		var ajaxParams = {
			method: 'GET',
			url: '/v1/posters?q[id_social_network][equal]='+id_social_network+system,
			data: '',
			callback: function(result) {
				$('.table-step-5 tbody').empty();
				for (var i = 0, length = result.length; i < length; i++) {
					var status = '';
					for (var j in postersStatus) {
						if (postersStatus[j] && j == result[i].status)
							status = postersStatus[j];
					}
					var isActive = 0;
					for (var k = 0, length2 = activePosters.length; k < length2; k++) {
						result[i].id == activePosters[k].id ? (isActive = 1) : 0;
					}
					$('.table-step-5 tbody').append('<tr> \
							<td><input '+(isActive ? 'checked="checked"' : ' ')+'  type="checkbox" data-poster-id="'+result[i].id+'" /><a href="'+result[i].url+'" target="_blank">'+(result[i].name == null || result[i].name == " " ? "-" : result[i].name)+'</a></td> \
							<td>'+(result[i].name == null ? "" : result[i].name)+'</td> \
							<td>'+status+'</td> \
							<td>'+(result[i].system ? "Системный" : "Свой")+'</td> \
							<td>'+(result[i].id_social_network == 3 ? "Вконтакте" : (result[i].id_social_network == 1 ? "Мой мир" : "Одноклассники"))+'</td> \
						</tr>');
				}
				
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	}
	$('.add-system-posters').click(function() {
		getPosters('&');
	});

	$('button[data-id="5"]').click(function() {
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		var ajaxParams = {
			method: 'POST',
			url: '/v1/posters',
			data: {
				id_social_network: id_social_network,
				login: $('#posters-login').val(),
				password: $('#posters-password').val()
			},
			callback: function(result) {
				getPosters('&');
				settings.response_handler(true,data_id);
				settings.btn_preloader(false,data_id);
			},
			response_headers: function(xhr) {

			},
			error: function(error) {
				settings.response_handler(false,data_id,error);
				settings.btn_preloader(false,data_id);
			}
		}
		settings.sendAjax(ajaxParams);
	});

	$('button[data-id="6"]').click(function() {
		var postersArray = new Array;
		$('.table-step-5 input').each(function() {
			$(this).is(':checked') ? postersArray.push($(this).data('poster-id')) : 0;
		});
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		if (postersArray.length) {
			var ajaxParams = {
				method: 'PATCH',
				url: '/v1/groups/'+id_group,
				data: {
					"posters": postersArray
				},
				callback: function(result) {
					location.replace('/soobshestva.html');
				},
				response_headers: function(xhr) {

				},
				error: function(error) {
					settings.response_handler(false,data_id,error);
					settings.btn_preloader(false,data_id);
				}
			}
			settings.sendAjax(ajaxParams);
		}
		else {
			settings.response_handler(false,data_id,"Вы не выбрали аккаунт для постинга.");
			settings.btn_preloader(false,data_id);
		}
	});
});
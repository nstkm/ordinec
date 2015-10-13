$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/tickets',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				var theDate = new Date(result[i].created_at * 1000);
				$('.data-table-tickets>tbody').prepend('<tr> \
					<td>#'+result[i].id+'</td> \
					<td>'+theDate.getDate()+'.'+(theDate.getMonth()<10?('0'+theDate.getMonth()):theDate.getMonth())+'.'+theDate.getFullYear()+'</td> \
					<td><a href="ticket-cart.html?id='+result[i].id+'">'+result[i].name+'</a></td> \
					<td>'+result[i].messageCount+'</td> \
					<td><span>'+(result[i].status == 'active'?"В ожидании":"В архиве")+'</span></td> \
					</tr>');
			}
			$('.data-table-tickets a').each(function() {
				$(this).click(function(e) {
					e.preventDefault();
					History.pushState({load_url:'https://ordinec.ru/templates/'+$(this).attr('href').split('?')[0]+'?'+$(this).attr('href').split('?')[1]}, $(this).text(),$(this).attr('href'));
				});
			});
			settings.end_load();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/tickets/sections',
		data: '',
		callback: function(result) {
			for (var i in result) {
				if(result[i])
					$('#ticket-section').append('<option value="'+i+'">'+result[i]+'</option>');
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
});

$(document).ready(function() {
	$('#make_ticket').click(function(){
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);

		var ajaxParams = {
			method: 'POST',
			url: '/v1/tickets',
			data: {
				name: $('input[name="ticket-theme"]').val(),
				section: $('#ticket-section').val(),
				message: $('textarea[name="ticket-message"]').val()
			},
			callback: function(result) {
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
});

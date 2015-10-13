function get_messages() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/ticket-messages?sort=-id&q[id_ticket][equal]='+get+'&page='+getPage,
		data: '',
		callback: function(result) {
			for (length = result.length-1; length >= 0 ; length--) {
				$('#ticket-messages').prepend('<div class="ticket-answer"> <div class="ticket-answer-logo">\
					<img src="images/answer-'+(id_user == result[length].id_user ? "user" : "agent")+'.png" alt=""> \
					<span>'+(id_user == result[length].id_user ? "Вы" : "Агент")+'</span> </div> \
					<div class="ticket-answer-message"> <span>'+settings.get_time(result[length].created_at,true)+'</span> <p>'+result[length].text+'</p></div></div>');
			}
			settings.end_load();
		},
		response_headers: function(xhr) {
			if (xhr.getResponseHeader('x-pagination-page-count') > 1) {
				$('#pagination').twbsPagination({
			        totalPages: xhr.getResponseHeader('x-pagination-page-count'),
			        visiblePages: 6,
			        first: 'В начало',
			        last: 'В конец',
			        prev: '<<',
			        next: '>>',
			        onPageClick: function (event, page) {
			        	getPage = page;
			            History.pushState({load_url:'https://ordinec.ru/templates/ticket-cart.html?id='+get+'&page='+page}, 'Тикеты','/ticket-cart?id='+get+'&page='+page);
			        }
			    });
			    $('#pagination .active').removeClass('active');
			    $('#pagination a:contains("'+getPage+'")').trigger('click').parent().addClass('active');
			}
		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}

$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/tickets/'+get,
		data: '',
		callback: function(result) {
			$('#ticket-name').text(result.name+' ('+settings.get_time(result.created_at,false)+')');
			window.id_user = result.creator;
			get_messages();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
});

$(document).ready(function() {
	$('#send_ticket_message').click(function() {
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);

		var ajaxParams = {
			method: 'POST',
			url: '/v1/ticket-messages',
			data: {
				text: $('#message').val(),
				id_ticket: get
			},
			callback: function(result) {
				settings.response_handler(true,data_id);
				get_messages();
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
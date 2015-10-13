var get_transactions = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/payment-transactions',
		data: '',
		callback: function(result) {
		$('#transaction-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				$('#transaction-table>tbody').prepend('<tr> \
					<td>'+(result[i].recipient == 1? "Пополнение баланса":"Списание баланса")+'</td> \
					<td>'+result[i].sum*currency+symbol+'</td> \
					<td><span>'+(result[i].sender == null?"Автоматическое изменение":"Вывод средств")+'</span></td> \
					<td>'+settings.get_time(result[i].created_at,false)+'</td> \
					</tr>');
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
		url: '/v1/withdrawals?expand=userWallet',
		data: '',
		callback: function(result) {
			$('#wallets-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				var status = '';
				for (j in statuses) {
					if (statuses[j] &&result[i].status == j) {
						status = statuses[j];
					}
				}
				$('#wallets-table>tbody').append('<tr> \
					<td>'+result[i].sum*currency+symbol+'</td> \
					<td>'+result[i].userWallet.wallet_number+'</td> \
					<td><span>'+status+'</span></td> \
					<td>'+settings.get_time(result[i].created_at,false)+'</td> \
					</tr>');
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
	settings.end_load();
}

$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/users?expand=currency',
		data: '',
		callback: function(result) {
			var ajaxParams2 = {
				method: 'GET',
				url: '/v1/withdrawals/statuses',
				data: '',
				callback: function(results) {
					window.statuses = results;
					window.currency = parseInt(result[0].currency.rate);
					window.symbol = result[0].currency.symbol;
					get_transactions();
				},
				response_headers: function(xhr) {

				},
				error: function() {

				}
			}
			settings.sendAjax(ajaxParams2);
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/wallets?q[status][equal]=active&expand=walletModule',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#user-wallets').append('<option value='+result[i].walletModule.id+'>'+result[i].wallet_number+'</option>');
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
	$('#wallets').click(function() {
		data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		var ajaxParams = {
			method: 'POST',
			url: '/v1/withdrawals',
			data: {
				id_user_wallet: $('#user-wallets').val(),
				sum_real: $('#sum_real').val(),
				comment: $('textarea[name="ticket-message"]').val()
			},
			callback: function(result) {
				settings.response_handler(true,data_id);
				settings.btn_preloader(false,data_id);
				get_transactions();
			},
			response_headers: function(xhr) {

			},
			error: function(error) {
				settings.response_handler(false,data_id,error);
				settings.btn_preloader(false,data_id);
			}
		}
		settings.sendAjax(ajaxParams)
	});
	$('.different-tables>span').each(function() {
		$(this).click(function() {
			if (!$('#'+$(this).data('table')).is(':visible')) {
				$('.data-table-tickets').hide();
				$('#'+$(this).data('table')).show();
				$('.different-tables>span').each(function() {
					$(this).removeClass('active');
				});
				$(this).addClass('active');
			}
		});
	});
});
$(function() {
	var ajaxParams = {
		method: 'GET',
		data: '',
		url: '/v1/users?fields=phone,icq,skype,id,platforms,balance',
		callback: function(result) {
			$('input[name="icq"]').val(result[0].icq);
			$('input[name="phone"]').val(result[0].phone);
			$('input[name="skype"]').val(result[0].skype);
		},
		response_headers: function(xhr) {

		},
		error: function() {
			
		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		data: '',
		url: '/v1/wallets?expand=walletModule',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('.data-table-lk-main>tbody').append('<tr><td>'+result[i].walletModule.name+'</td><td>'+result[i].wallet_number+'</td><td><span>Нет<br />примечания</span></td></tr>');
			}
			settings.end_load();
		},
		response_headers: function(xhr) {

		},
		error: function() {
			
		}
	}
	settings.sendAjax(ajaxParams);
});

$(document).ready(function() {
	$('#user-data').click(function(){
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		var ajaxParams = {
			method: 'PATCH',
			url: '/v1/users/'+user_id,
			data: {
				icq: $('input[name="icq"]').val(),
				phone: $('input[name="phone"]').val(),
				skype: $('input[name="skype"]').val()
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
	$('#change_password').click(function() {
		var data_id = $(this).data('id');
		var ajaxParams = {
			method: 'PATCH',
			url: '/v1/users/'+user_id,
			data: {
				oldPassword: $('input[name="old_passwd"]').val(),
				newPassword: $('input[name="new_passwd"]').val(),
				repeatPassword: $('input[name="repeat_passwd"]').val()
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

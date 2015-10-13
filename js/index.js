var settings = {
	sendAjax: function(ajaxParams) {
		$.ajax({
			type: ajaxParams.method,
			url: ajaxParams.url,
			dataType: 'json',
			data: ajaxParams.data,
			success: function(result,status,xhr) {
				ajaxParams.callback(result);
			},
			error: function(data) {
				ajaxParams.error(data.responseJSON[0].message);
			}
		});
	}
}

$(document).ready(function() {
	$('.registration a').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			$('.input-wrap').hide();
			$('.registration button').hide();
			$('.input-wrap[data-id="'+$(this).data('id')+'"]').show();
			$('.registration button[data-id="'+$(this).data('id')+'"]').show();
		});
	});
	$('button[data-id="2"').click(function() {
		var ajaxParams = {
			method: 'POST',
			url: 'auth/?method=getAccessToken',
			data: {
				login: $('#username').val(),
				password: $('#password').val()
			},
			callback: function(result) {
				if(result.success && $('#username').val() != "admin")
					location.replace('/soobshestva.html');
				else if (result.success)
					location.replace('/adm/index.html');
				else
					alert('Неправильный логин или пароль');
			},
			response_headers: function(xhr) {

			},
			error: function(error) {
				
			}
		}
		settings.sendAjax(ajaxParams);
	});

	$('button[data-id="1"').click(function() {
		var ajaxParams = {
			method: 'POST',
			url: 'https://webmaster.ordinec.ru/v1/users',
			data: {
				login: $('#new-login').val(),
				password: $('#new-password').val(),
				email: $('#new-mail').val(),
				repeatPassword: $('#new-repeat-password').val()
			},
			callback: function(result) {
				alert('Регистрация прошла успешно!');
			},
			response_headers: function(xhr) {

			},
			error: function(error) {
				alert(error);
			}
		}
		settings.sendAjax(ajaxParams);
	})
});
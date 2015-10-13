getToken = function(boolean) {
	var token = '';
	var cookies = document.cookie.split('; ');
	for (var i = 0, length = cookies.length; i < length; i++) {
		if (cookies[i].split('=')[0] == 'token') {
			token = cookies[i].split('=')[1];
			$.ajax({
				type: 'post',
				url: 'https://ordinec.ru/auth/?method=checkToken',
				dataType: 'json',
				async: false,
				data: {'access_token': token},
				success: function(result) {
					if (!result.success) {
						$.ajax({
							type: 'post',
							url: 'https://ordinec.ru/auth/?method=refreshToken',
							dataType: 'json',
							async: false,
							data: {'access_token': token},
							success: function(result) {
								if(result.success)
									token = 'Bearer ' + result.access_token;
								else 
									location.replace('/');
							}
						});
					}
					else {
						token = 'Bearer ' + cookies[i].split('=')[1];
					}
				}
			});
			break;
		}
	}
	return token;
};

var settings = {
	token: getToken(),
	base_url: 'https://adm.ordinec.ru',
	sendAjax: function(ajaxParams) {
		$.ajax({
			type: ajaxParams.method,
			url: this.base_url+ajaxParams.url,
			dataType: 'json',
			headers: {
				'Authorization' : 'Bearer ' + this.token.replace('Bearer ','')
			},
			data: ajaxParams.data,
			success: function(result,status,xhr) {
				ajaxParams.callback(result);
				ajaxParams.response_headers(xhr);
			},
			error: function(data,status,xhr) {
				console.log(data.status);
				ajaxParams.error(data.responseJSON[0].message);
			}
		});
	},
	response_handler: function(bool,data_id,error) {
		if (bool) {
			$('.success-block[data-id="'+data_id+'"]').show();
			$('.error-block[data-id="'+data_id+'"]').hide();
		}
		else {
			$('.alert-warning[data-id="'+data_id+'"]').hide();
			$('.alert-warning[data-id="'+data_id+'"] span').text(error);
			$('.alert-warning[data-id="'+data_id+'"]').show();
		}
	},
	get_time: function(created_at,full) {
		var theDate = new Date(created_at * 1000);
		var full_date = theDate.getDate()+'.'+(theDate.getMonth()+1<10?('0'+(theDate.getMonth()+1)):theDate.getMonth()+1)+'.'+theDate.getFullYear();
		var full_date_width_time = full_date+' в '+theDate.getHours()+':'+(theDate.getMinutes()<10?('0'+theDate.getMinutes()):theDate.getMinutes());
		if (full)
			return full_date_width_time;
		else
			return full_date;
	},
	btn_preloader: function(bool,data_id) {
		if (bool) {
			$('button[data-id="'+data_id+'"]>span').hide();
			$('button[data-id="'+data_id+'"] .btn-preloader-img').show();
		}
		else {
			$('button[data-id="'+data_id+'"]>span').show();
			$('button[data-id="'+data_id+'"] .btn-preloader-img').hide();
		}
	},
	end_load: function() {
		$('#page-preloader').hide();
    	$('.dynamic-content').show();
	}
}

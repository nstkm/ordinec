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

var get = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);
var getPage = parseInt(window.location.search.substring(1).split("&")[1]?parseInt(window.location.search.substring(1).split("&")[1].split("=")[1]) : 1);

checkActiveHref = function() {
	$('.nav a').each(function() {
		if ($(this).attr('href') == document.location.pathname.substring(1)) {
			$(this).addClass('active');
			if ($(this).closest('.level-0')) {
				$('>a',$(this).closest('.level-0')).addClass('active');
			}
		}
		else
			$(this).removeClass('active');
	});
}

$(function() {
	checkActiveHref();
	$('#page-preloader').show();
	var load_url = 'https://ordinec.ru/templates'+(document.location.pathname == "/" ? '/index' : document.location.pathname);
	$('.dynamic-content').hide().load(load_url);
	$('.nav a').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			$(this).attr('href') ? History.pushState({load_url:'https://ordinec.ru/templates/'+$(this).attr('href')}, $(this).text(),$(this).attr('href')) : ($(this).parent().children('ul').is(':visible') ? $(this).parent().children('ul').slideUp() : $(this).parent().children('ul').slideDown());
		});
	});
	History.Adapter.bind(window,'statechange',function() {
		checkActiveHref();
		$('#page-preloader').show();
	    var State = History.getState();
	    get = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);
	    $('.dynamic-content').hide().empty().load(State.data.load_url);
    });
});

var settings = {
	token: getToken(),
	base_url: 'https://webmaster.ordinec.ru',
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
			$('.success-block[data-id="'+data_id+'"]').hide();
			$('.error-block[data-id="'+data_id+'"] span').text(error);
			$('.error-block[data-id="'+data_id+'"]').show();
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

$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/users?fields=id,platforms,balance,hold,waiting',
		data: '',
		callback: function(result) {
			window.user_id = result[0].id;
			for (var i = 0, length = result[0].platforms.length; i < length; i++) {
				result[0].platforms[i].id == 3 ? $('#count-vk').text(result[0].platforms[i].group_count) : $('#count-vk').text('0');
				result[0].platforms[i].id == 2 ? $('#count-ok').text(result[0].platforms[i].group_count) : $('#count-ok').text('0');
				result[0].platforms[i].id == 1 ? $('#count-mm').text(result[0].platforms[i].group_count) : $('#count-mm').text('0');
			}
			$('#balance').text(result[0].balance);
			$('#hold').text(result[0].hold);
			$('#expect').text(result[0].waiting);
			var groupCount = 0;
			var followersCount = 0;
			for (var i = 0, length = result[0].platforms.length; i < length; i++) {
				groupCount = groupCount + result[0].platforms[i].group_count;
				followersCount = followersCount + parseInt(result[0].platforms[i].followers);
			}
			$('#count-all-platforms,.static-count-platforms').text(groupCount);
			$('#count-all-followers,.static-count-followers').text(followersCount);
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
});

$(document).ready(function() {
	$('.dynamic-content').on('click','.close', function() {
		$(this).parent().hide();
	});
	$('#exit').click(function() {
		$.ajax({
			type: 'POST',
			url: 'auth/?method=exit',
			success: function(result) {
				location.replace('/');
			}
		});
	});
});
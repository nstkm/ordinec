settings.end_load();

$(document).ready(function() {
	$('button[data-id="1"]').click(function(){
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		var ajaxParams = {
			method: 'POST',
			url: '/v1/groups',
			data: {
				link: $('input[name="choice-community"]').val()
			},
			callback: function(result) {
				settings.response_handler(true,data_id);
				settings.btn_preloader(false,data_id);
				window.id_group = result.id;
				window.id_social_network = result.id_social_network;
				$('#step1').hide();
				$('#step2').show();
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
	$('.add-squere').each(function() {
		$(this).click(function() {
			$('.add-squere>div').hide();
			$(this).children().show();
			if ($(this).data('choice') == 1) {
				$('#step-number').text('Шаг 5');
			}
			else {
				$('#step-number').text('Шаг 3');
			}
		
		});
	});

	$('button[data-id="2"]').click(function() {
		var id = 0;
		$('.add-squere>div').each(function() {
			if($(this).is(':visible')) {
				id = $(this).parent().data('choice');
			}
		});
		if (id == 2) {
			var ajaxParams = {
				method: 'PATCH',
				url: '/v1/groups/'+id_group,
				data: {
					maxProfit: 1
				},
				callback: function(result) {
					getPosters('&q[system][equal]=false');
					$('#step5').show();
					$('#step2').hide();
				},
				response_headers: function(xhr) {

				},
				error: function() {
					settings.response_handler(false,data_id,error);
					settings.btn_preloader(false,data_id);
				}
			}
			settings.sendAjax(ajaxParams);
		}
		else if (id == 1) {
			$('#step3').show();
			$('#step2').hide();
		}
		else {
			settings.response_handler(false,2,"Выберите режим монетизации");
		}
	});

	var html = '<tr>'+$('.table-step-3-second tr').eq(1).html()+'<tr>';
	$('#post-new-pole').click(function() {
		$('.table-step-3-second').append(html);
	});
	$('.table-step-3-second').on("click", ".post-save-new-pole", function() {
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		var button = $(this);
		if (button.data('post-id'))  {
			var thisMethod = 'DELETE';
			var thisUrl = '/' + button.data('post-id');
		}
		else {
			var thisMethod = 'POST';
			var thisUrl = '';
		}
		var time = parseInt($('input[name="post-time-hours"]', $(this).closest('tr')).val())*3600 + parseInt($('input[name="post-time-minits"]', $(this).closest('tr')).val())*60;
		if ($('select[name="post-continue"]', $(this).closest('tr')).val() != "null")
			var lifetime = $('select[name="post-continue"]', $(this).closest('tr')).val()*3600;
		var ajaxParams = {
			method: thisMethod,
			url: '/v1/posting-plans' + thisUrl,
			data: {
				id_group: id_group,
				name: $('input[name="post-name"]', $(this).closest('tr')).val(),
				posting_time: time,
				lifetime: lifetime,
				comment: $('input[name="post-note"]', $(this).closest('tr')).val()
			},
			callback: function(result) {
				settings.response_handler(true,data_id);
				settings.btn_preloader(false,data_id);
				if (thisMethod == 'POST') {
					$('span', button).text('Удалить');
					button.attr('data-post-id',result.id);
					var hours = $('input[name="post-time-hours"]', button.closest('tr')).val();
					var minits = $('input[name="post-time-minits"]', button.closest('tr')).val();
					var interval = $('select[name="post-continue"]', button.closest('tr')).val();
					interval == "null" ? (interval = "Всегда") : 0;
					button.parent().addClass('adventure-add');
					$('td',button.closest('tr')).eq(0).html(result.name);
					$('td',button.closest('tr')).eq(1).html(hours+' : '+minits);
					$('td',button.closest('tr')).eq(2).html(interval);
					$('td',button.closest('tr')).eq(3).html(result.comment);
				}
				else {
					button.closest('tr').remove();
				}
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

	var offerSearch = function(paginationPage,category,networks) {
		var string = '';
		var filter_url = '/v1/offers?expand=category&';
		$('.table-step-4-first td').each(function() {
			if($('input', $(this)).length == 2 && $('input', $(this)).eq(0).val() != '' && $('input', $(this)).eq(1).val() != '') {
				string = string + $(this).data('offers-search') + '=' + $('input', $(this)).eq(0).val() + ',' + $('input', $(this)).eq(1).val() + '&';
			}
			else if ($('input', $(this)).length == 1 && $('input', $(this)).val() != '')
				string = string + $(this).data('offers-search') + '=' + $('input', $(this)).val() + '&';
		});
		filter_url = filter_url + string;
		if (paginationPage)
			filter_url = filter_url + 'page='+paginationPage;
		if (category)
			filter_url = filter_url + 'q[id_category][equal]='+category;
		var ajaxParams = {
			method: 'GET',
			url: filter_url,
			data: '',
			callback: function(result) {
				$('.table-step-4-second tbody').empty();
				for (var i = 0, length = result.length; i < length; i++) {
					$('.table-step-4-second tbody').append('<tr> \
							<td><input type="checkbox" data-offer-id="'+result[i].id+'" />'+(result[i].logo == null ? '<img src="../images/offer-logo.png" alt="">' : '<img src="'+result[i].logo+'" alt="">')+'</td> \
							<td><span>'+result[i].name+'</span><br>Российская Федерация</td> \
							<td>'+result[i].category.name+'</td> \
							<td>'+(result[i].price == null ? '-' : result[i].price )+'</td> \
							<td>'+result[i].epc+'</td> \
							<td>'+result[i].cr+'</td> \
						</tr>');
				}
				$('#step4').show();
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
				        	event.preventDefault();
				        	offerSearch(page);
				        }
				    });
				    
				}
			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
		var ajaxParams = {
			method: 'GET',
			url: '/v1/categories',
			data: '',
			callback: function(result) {
				$('.table-step-4-third tbody').empty().append('<tr><td><a href="">Все категории</a></td></tr>');
				for (var i = 0, length = result.length; i < length; i++) {
					$('.table-step-4-third tbody').append('<tr> \
							<td><a href="" data-offer-category="'+result[i].id+'">'+result[i].name+'</a></td> \
						</tr>');
				}
				$('.table-step-4-third a').each(function() {
					$(this).click(function(e) {
						e.preventDefault();
						offerSearch(false,$(this).data('offer-category'));
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

	$('button[data-id="3"]').click(function() {
		if ($('.table-step-3-second .adventure-add').length == 0) {
			settings.response_handler(false,7,"Вы не выбрали график выхода рекламы.");
		}
		else {
			$('#step3').hide();
			offerSearch();
		}
	});

	$('#offer-search-btn').click(function() {
		offerSearch();
	});

	$('button[data-id="4"]').click(function() {
		var offersArray = new Array;
		$('.table-step-4-second input').each(function() {
			$(this).is(':checked') ? offersArray.push($(this).data('offer-id')) : 0;
		});
		var data_id = $(this).data('id');
		settings.btn_preloader(true,data_id);
		if (offersArray.length) {
			var ajaxParams = {
				method: 'PATCH',
				url: '/v1/groups/'+id_group,
				data: {
					offers: offersArray
				},
				callback: function(result) {
					getPosters('&q[system][equal]=false');
					$('#step5').show();
					$('#step4').hide();
				},
				response_headers: function(xhr) {

				},
				error: function() {
					settings.response_handler(false,data_id,error);
					settings.btn_preloader(false,data_id);
				}
			}
			settings.sendAjax(ajaxParams);
		}
		else
			settings.response_handler(false,data_id,"Вы не выбрали офферы");
			settings.btn_preloader(false,data_id);
	});

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
					$('.table-step-5 tbody').append('<tr> \
							<td><input '+(result[i].system ? 'checked="checked"' : ' ')+'  type="checkbox" data-poster-id="'+result[i].id+'" /><a href="'+result[i].url+'" target="_blank">'+result[i].login+'</a></td> \
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

	$('.add-system-posters').click(function() {
		getPosters('&');
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
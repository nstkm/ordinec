$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups?expand=postingPlans,socialNetwork',
		data: '',
		callback: function(result) {
			var posterCount = function(posters) {
				var totalCount = 0;
				var totalString = 'Активные: ' + posters.active + '\r\nБез доступа: ' + posters.no_access + '\r\nГотовятся: ' + posters.prepare + '\r\nОжидают: ' + posters.waiting;
				for (var i in posters) {
					if (posters[i]+1) {}
						totalCount += posters[i];
				}
				return [totalCount,totalString];
			}
			for (var i = 0, length = result.length; i < length; i++) {
				var dots = '';
				for (var j = 0; j < 23; j++) {
					var active_dots = '<table>';
					for (var k = 0, length2 = result[i].postingPlans.length; k < length2; k++) {
						var dots_time = result[i].postingPlans[k].posting_time/3600;
						if (dots_time>=j&&dots_time<j+1) {
							var dots_time_hours = Math.floor(dots_time);
							var dots_time_minits = Math.round((dots_time - dots_time_hours)*60);
							active_dots += '<tr> \
										<td><div class="wrap-dots"></div></td> \
										<td style="color:'+(result[i].postingPlans[k].status == 'active' ? "black" : "red")+';">'+(dots_time_hours<10 ? ('0'+dots_time_hours):dots_time_hours)+':'+(dots_time_minits<10 ? ('0'+dots_time_minits):dots_time_minits)+'</td> \
									</tr>';
						}
					}
					active_dots += '</table>';
					dots += '<td> \
							<div class="wrap-dots '+(active_dots.length>17 ? 'wrap-dot-event':'')+'">'+active_dots+'</div> \
							<span>'+(j < 10 ? '0'+j:j)+':00</span> \
						</td>';
				}
				var count = posterCount(result[i].poster_count);
				$('#soob-page').append('<div class="lk-window lk-window-soob"> \
				<div class="lk-window-header lk-window-header-soob"> \
					<span><img src="images/'+(result[i].id_social_network == 3 ? "vk-icon" : (result[i].id_social_network == 2 ? "ok-icon" : "mm-icon"))+'.png" alt="">'+result[i].name+'</span> \
					<table> \
						<tr> \
							<td><img src="images/human.png" alt="">Аудитория: <span>'+result[i].followers+' человек</span></td> \
							<td><img src="images/repare.png" alt=""><a href="/adventure.html?id='+result[i].id+'" class="adv1">Реклама</a></td> \
							<td><a class="a-posters" href="/posters.html?id='+result[i].id+'&social='+result[i].id_social_network+'"><i title="'+count[1]+'" color="'+(result[i].poster_count.no_access != 0 ? "red" : ((result[i].poster_count.active == 0 || result[i].poster_count.prepare != 0 || result[i].poster_count.waiting != 0) ? "#ffd40d" : "green"))+'">'+count[0]+'</i></a></td> \
							<td><a class="delete-group" href="" data-id-group="'+result[i].id+'" ><img src="images/remove.png"alt="">Удалить<a></td> \
						</tr> \
					</table> \
				</div> \
				<div class="lk-window-body"> \
					<section class="lk-window-section"> \
						<div class="adventure-control clearfix" data-group-id="'+result[i].id+'"> \
							<a data-group-status="start" href=""><img src="../images/start-m.png" alt="">Включить рекламу</a> \
							<a data-group-status="stop" href=""><img src="../images/stop-m.png" alt="">Остановить рекламу</a> \
							'+(result[i].postingPlans[0] ? '' : '<span>Нет рекламы</span>')+' \
						</div> \
						<div class="soob-dots"> \
							<div class="soob-dots-bg"> \
								<table> \
									<tr> \
										'+dots+' \
									</tr> \
								</table> \
							</div> \
						</div> \
					</section> \
				</div> \
				</div>');
			}
			settings.end_load();
			deleteGroup();
			adventureStatus();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
});

deleteGroup = function() {
	$('.delete-group').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			var group = $(this);
			var ajaxParams = {
				method: 'DELETE',
				data: '',
				url: '/v1/groups/' + group.data('id-group'),
				callback: function(result) {
					group.closest('.lk-window').remove();
				},
				response_headers: function(xhr) {

				},
				error: function() {
					
				}
			}
			settings.sendAjax(ajaxParams);
		});
	});
}

adventureStatus = function() {
	$('.adventure-control a').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			var thisHref = $(this);
			var ajaxParams = {
				method: 'PATCH',
				url: '/v1/groups/'+ $(this).parent().data('group-id') + '?expand=postingPlans',
				data: {
					advertising: $(this).data('group-status')
				},
				callback: function(result) {
					if (thisHref.data('group-status') == "stop") {
						thisHref.closest('.lk-window-section').addClass('red-dots');
						thisHref.closest('.lk-window-section').removeClass('black-dots');
					}
					else {
						thisHref.closest('.lk-window-section').addClass('black-dots');
						thisHref.closest('.lk-window-section').removeClass('red-dots');
					}
				},
				response_headers: function(xhr) {

				},
				error: function(error) {

				}
			}
			settings.sendAjax(ajaxParams);
		});
	});
	$('.adv1').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			History.pushState({load_url:'https://ordinec.ru/templates'+ $(this).attr('href')}, $(this).text(),$(this).attr('href'));
		});
	});
	$('.a-posters').each(function() {
		$(this).click(function(e) {
			e.preventDefault();
			History.pushState({load_url:'https://ordinec.ru/templates'+ $(this).attr('href')}, $(this).text(),$(this).attr('href'));
		});
	});
}

$(document).ready(function() {
	$('a.btn').click(function(e) {
		e.preventDefault();
		History.pushState({load_url:'https://ordinec.ru/templates'+ $(this).attr('href')}, 'Добавление нового сообщества',$(this).attr('href'));
	});
});


					
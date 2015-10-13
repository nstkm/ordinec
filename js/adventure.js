settings.end_load();

var id_group = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);

adventureStatus = function() {
	$('.adventure-control').on("click","a",function(e) {
		e.preventDefault();
		var thisHref = $(this);
		var ajaxParams = {
			method: 'PATCH',
			url: '/v1/posting-plans/'+ $(this).parent().data('group-id'),
			data: {
				status: $(this).data('group-status')
			},
			callback: function(result) {
				$('a', thisHref.parent()).each(function() {
					$(this).data('group-status') == thisHref.data('group-status') ? $(this).hide() : $(this).show();
				});
			},
			response_headers: function(xhr) {

			},
			error: function(error) {

			}
		}
		settings.sendAjax(ajaxParams);
	});
}

var getAdventure = function() {
	ajaxParams = {
		method: 'GET',
		url: '/v1/posting-plans?q[id_group][equal]='+id_group,
		data: '',
		callback: function(result) {
			$('.table-step-3-second tbody').empty();
			for( var i = 0, length = result.length; i < length; i++) {
				var postTimeHours = (Math.floor(result[i].posting_time/3600) < 10 ? '0'+Math.floor(result[i].posting_time/3600) : Math.floor(result[i].posting_time/3600));
				var postTimeMinits = Math.round((result[i].posting_time/3600 - Math.floor(result[i].posting_time/3600))*60) < 10 ? '0'+Math.round((result[i].posting_time/3600 - Math.floor(result[i].posting_time/3600))*60):Math.round((result[i].posting_time/3600 - Math.floor(result[i].posting_time/3600))*60);
				var lifeTime = result[i].lifetime == null ? "Всегда" : result[i].lifetime/3600 + 'часа';
				$('.table-step-3-second tbody').append('<tr> \
					<td>'+result[i].name+'</td> \
					<td>'+postTimeHours+' : '+postTimeMinits+'</td> \
					<td>'+lifeTime+'</td> \
					<td>'+result[i].comment+'</td> \
					<td> \
						<button class="btn post-save-new-pole" data-id="1" data-post-id="'+result[i].id+'"> \
							<div class="btn-left"> \
								<img class="btn-bg" src="../images/button-left.png" alt=""> \
								<img src="../images/btn-arrow.png" alt="" class="btn-icon"> \
							</div> \
							<span>Удалить</span> \
							<img class="btn-preloader-img" src="../images/loader.gif" alt="" style="display: none;"> \
							<div class="btn-right"> \
								<img class="btn-bg" src="../images/button-right.png" alt=""> \
							</div> \
						</button> \
						<div class="adventure-control clearfix" data-group-id="'+result[i].id+'"> \
							<a title="Включить рекламу" data-group-status="active" style="display:'+(result[i].status != "active" ? "block" : "none")+';" href=""><img src="../images/start-m.png" alt=""></a> \
							<a title="Выключить рекламу" data-group-status="stopped" style="display:'+(result[i].status == "active" ? "block" : "none")+';" href=""><img src="../images/stop-m.png" alt=""></a> \
						</div> \
					</td> \
				</tr>');
			}
			adventureStatus();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}
getAdventure();
$(document).ready(function() {
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
					getAdventure();
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
});
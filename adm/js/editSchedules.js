var schedulesID = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);

(function(){
	var ajaxParams = {
		method: 'GET',
		url: '/v1/posts?fields=id,name',
		data: '',
		callback: function(result) {
			window.posts = result; 
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/offers?fields=id,name',
		data: '',
		callback: function(result) {
			window.offers = result;
			if (schedulesID) getSchedules();
		},
		response_headers: function(xhr) {
		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}());

var getSchedules = function() {
	if (!schedulesID) return false;
	var ajaxParams = {
		method: 'GET',
		url: '/v1/schedules/'+schedulesID,
		data: '',
		callback: function(result) {
			var schedules = JSON.parse(result.data);
			$('#name').val(result.name);
			for (var i = 0, length = schedules.length; i < length; i++) {
				var postsHTML = '<option value="">Не выбран</option>';
				var offersHTML = '<option value="">Не выбран</option>';
				for (var j = 0, length2 = posts.length; j < length2; j++) {
					postsHTML += '<option '+(schedules[i].id_post && schedules[i].id_post == posts[j].id ? "selected" : "")+' value="'+posts[j].id+'">'+posts[j].id+'</option>';
				}
				for (var j = 0, length2 = offers.length; j < length2; j++) {
					offersHTML += '<option '+(schedules[i].id_offer && schedules[i].id_offer == offers[j].id ? "selected" : "")+' value="'+offers[j].id+'">'+offers[j].name+'</option>';
				}
				$('#schedules-table>tbody').prepend('<tr data-schedules-id="'+i+'"> \
					<td><input name="start" type="text" class="form-control" value="'+(schedules[i].start ? schedules[i].start : "")+'" /></td> \
					<td><input name="stop" type="text" class="form-control" value="'+(schedules[i].stop ? schedules[i].stop : "")+'" /></td> \
					<td><input name="posting_time" type="text" class="form-control" value="'+(schedules[i].posting_time ? schedules[i].posting_time : "")+'" /></td> \
					<td><select name="id_offer" class="form-control">'+offersHTML+'<select></td> \
					<td><select name="id_post" class="form-control">'+postsHTML+'<select></td> \
					<td><button data-action="delete" type="button" class="btn btn-delete btn-default btn-sm">Удалить</button></td> \
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

var editSchedules = function(data) {
	if (schedulesID) {
		method = "PATCH";
		href = '/'+schedulesID;
	}
	else {
		method = "POST";
		href = '';
	}
	console.log(data);
	var ajaxParams = {
		method: method,
		url: '/v1/schedules'+href,
		data: data,
		callback: function(result) {
			settings.response_handler(true,1);
		},
		response_headers: function(xhr) {
			
		},
		error: function(error) {
			settings.response_handler(false,1,error);
		}
	}
	settings.sendAjax(ajaxParams);
}

$(document).ready(function() {
	$('#add').click(function() {
		var postsHTML = '<option value="">Не выбран</option>';
		var offersHTML = '<option value="">Не выбран</option>';
		for (var j = 0, length2 = posts.length; j < length2; j++) {
			postsHTML += '<option value="'+posts[j].id+'">'+posts[j].id+'</option>';
		}
		for (var j = 0, length2 = offers.length; j < length2; j++) {
			offersHTML += '<option value="'+offers[j].id+'">'+offers[j].name+'</option>';
		}
		$('#schedules-table>tbody').append('<tr> \
			<td><input name="start" type="text" class="form-control" value="" /></td> \
			<td><input name="stop" type="text" class="form-control" value="" /></td> \
			<td><input name="posting_time" type="text" class="form-control" value="" /></td> \
			<td><select name="id_offer" class="form-control">'+offersHTML+'<select></td> \
			<td><select name="id_post" class="form-control">'+postsHTML+'<select></td> \
			<td><button data-action="delete" type="button" class="btn btn-default btn-sm">Удалить</button></td> \
		</tr>');
	});
	$('#schedules-table').on('click','button', function() {
		$(this).closest('tr').remove();
	});
	$('#add-schedules').click(function() {
		var data = new Array;
		var result = {
			name: $('#name').val()
		};

		$('#schedules-table>tbody>tr').each(function() {
			var obj = new Object;
			$('input, select', $(this)).each(function() {
				if ($(this).attr('name') == 'name') {
					result.name = $(this).val();
				}
				else if ($(this).val() != "" && parseInt($(this).val())+1)
					obj[$(this).attr('name')] = parseInt($(this).val());
				else if ($(this).val() != "") {
					obj[$(this).attr('name')] = $(this).val();
				}
			});
			data.push(obj);
		});
		
		result['data'] = JSON.stringify(data);
		editSchedules(result);
	});
});
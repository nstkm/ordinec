var groupID = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);

(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups/statuses',
		data: '',
		callback: function(result) {
			window.statuses = result;
			var statusText = '';
			for (var i in statuses) {
				if (statuses[i]) {
					statusText += '<option value="'+i+'">'+statuses[i]+'</option>';
				}
			}
			$('#status').append(statusText);
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/schedules',
		data: '',
		callback: function(result) {
			window.schedules = result;
			var schedulesText = '<option value="null">Не выбрано</option>';
			for (var i = 0, length = result.length; i < length; i++) {
				schedulesText += '<option value="'+result[i].id+'">'+result[i].name+'</option>';
			}
			$('#id_schedule').append(schedulesText);
			getGroups();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/users?fields=id,name',
		data: '',
		callback: function(result) {
			window.users = result;
			var usersText = '<option value="null">Не выбран</option>';
			for (var i = 0, length = result.length; i < length; i++) {
				usersText += '<option value="'+result[i].id+'">'+result[i].name+'</option>';
			}
			$('#id_user').append(usersText);
			getGroups();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
	
}());

var getGroups = function() {
	if (!groupID) {
		$('#groups-table-url').show();
		return false;
	}
	$('#groups-table').show();
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups/'+groupID,
		data: '',
		callback: function(result) {
			$('#groups-table input, #groups-table select').each(function() {
				console.log(result[$(this).attr('name')]);
				if (result[$(this).attr('name')])
					$(this).val(result[$(this).attr('name')]);
			});
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}

var editGroup = function(data) {
	if (groupID) {
		var method = "PATCH";
		var href = "/"+groupID;
	}
	else {
		var method = "POST";
		var href = "";
	}

	var ajaxParams = {
		method: method,
		url: '/v1/groups'+href,
		data: data,
		callback: function(result) {
			settings.response_handler(true,1);
			if (!groupID) location.replace('editGroups.html?id='+result.id);
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
	$('#add-new-group').click(function() {
		var data = new Object;
		if (groupID) {
			$('#groups-table input, #groups-table select').each(function() {
				data[$(this).attr('name')] = $(this).val();
			});
		}
		else {
			data[$('#groups-table-url input').attr('name')] = $('#groups-table-url input').val();
			data[$('#groups-table-url select').attr('name')] = $('#groups-table-url select').val();
		}
		editGroup(data);
	});
});
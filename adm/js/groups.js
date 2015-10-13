(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups/statuses',
		data: '',
		callback: function(result) {
			window.statuses = result;
			var statusOption = '<option>Любой</option>';
			for (var j in statuses) {
				if (statuses[j]) {
					statusOption += '<option value="'+j+'">'+statuses[j]+'</option>';
				}
			}
			$('#status').append(statusOption);
			getGroups();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}())

var getGroups = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/groups?expand=user',
		data: '',
		callback: function(result) {
			$('#groups-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				var statusText = '';
				for (var j in statuses) {
					if (statuses[j] && j == result[i].status) {
						statusText = statuses[j];
					}
				}

				$('#groups-table>tbody').append('<tr data-group-id="'+result[i].id+'"> \
					<td>'+result[i].id+'</td> \
					<td>'+(result[i].id_social_network == 1 ? "Мой Мир" : (result[i].id_social_network == 2 ? "Одноклассники" : "Вконтакте"))+'</td> \
					<td>'+result[i].user.name+'</td> \
					<td><a target="_blank" href="'+result[i].url+'">'+result[i].name+'</a></td> \
					<td>'+result[i].pid+'</td> \
					<td>'+statusText+'</td> \
					<td> \
						<button data-action="edit" type="button" class="btn btn-default btn-sm">Редактировать</button> \
						<button data-action="delete" type="button" class="btn btn-default btn-sm">Удалить</button> \
					</td> \
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

var actionEdit = function(el) {
	location.replace('editGroups.html?id='+el.closest('tr').data('group-id'));
}

var deleteGroup = function(el) {
	if (confirm('Действительно удалить?')) {
		var ajaxParams = {
			method: 'DELETE',
			url: '/v1/groups/'+el.closest('tr').data('group-id'),
			data: '',
			callback: function(result) {
				getGroups();
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	}
	
}

var filters = function() {
	var serachUrl = '';
	$('#filter input, #filter select').each(function() {
		if ($(this).val()) {
			//serachUrl += 
		}
	});
}

$(document).ready(function() {
	$('#groups-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "delete":
				deleteGroup($(this));
				break;
		}
	});
	$('#add-new-group').click(function() {
		location.replace('editGroups.html');
	});
});
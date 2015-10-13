var showUsers = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/users',
		data: '',
		callback: function(result) {
			$('#users-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				$('#users-table>tbody').append('<tr data-user-id="'+result[i].id+'"> \
					<td>'+result[i].name+'</td> \
					<td>'+result[i].role+'</td> \
					<td>'+result[i].status+'</td> \
					<td>'+result[i].login+'</td> \
					<td> \
						<button data-action="edit" type="button" class="btn btn-default btn-sm">Редактировать</button> \
						<button data-action="status" data-status="'+result[i].status+'" type="button" class="btn btn-default btn-sm">'+(result[i].status == "banned" ? "Разблокировать" : "Заблокировать")+'</button> \
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
};

showUsers();

var actionEdit = function(el) {
	location.replace('users.html?id='+el.closest('tr').data('user-id'));
}

var blockUser = function(el) {
	var status = (el.data('status') == "banned" ? "active" : "banned");
	var ajaxParams = {
		method: 'PATCH',
		url: '/v1/users/'+el.closest('tr').data('user-id'),
		data: {
			status: status
		},
		callback: function(result) {
			showUsers();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}

var deleteUser = function(el) {
	if (confirm('Действительно удалить?')) {
		var ajaxParams = {
			method: 'DELETE',
			url: '/v1/users/'+el.closest('tr').data('user-id'),
			data: '',
			callback: function(result) {
				showUsers();
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	}
	
}

$(document).ready(function() {
	$('#users-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "status":
				blockUser($(this));
				break;
			case "delete":
				deleteUser($(this));
				break;
		}
	});
	$('#add-new-user').click(function() {
		location.replace('users.html');
	});
});
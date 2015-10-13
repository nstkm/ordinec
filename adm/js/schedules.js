var getSchedules = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/schedules',
		data: '',
		callback: function(result) {
			$('#schedules-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				$('#schedules-table>tbody').append('<tr data-schedules-id="'+result[i].id+'"> \
					<td>'+result[i].id+'</td> \
					<td>'+result[i].name+'</td> \
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
};

getSchedules();

var actionEdit = function(el) {
	location.replace('editSchedules.html?id='+el.closest('tr').data('schedules-id'));
}

var deleteSchedules = function(el) {
	if (confirm('Действительно удалить?')) {
		var ajaxParams = {
			method: 'DELETE',
			url: '/v1/schedules/'+el.closest('tr').data('schedules-id'),
			data: '',
			callback: function(result) {
				getSchedules();
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
	$('#schedules-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "delete":
				deleteSchedules($(this));
				break;
		}
	});
	$('#add-new-schedules').click(function() {
		location.replace('editSchedules.html');
	});
});
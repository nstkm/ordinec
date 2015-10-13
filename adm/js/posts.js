(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/offers?id,name',
		data: '',
		callback: function(result) {
			window.offers = result;
			getPosts();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/posts/statuses',
		data: '',
		callback: function(result) {
			window.statuses = result;
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
})();

var getPosts = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/posts',
		data: '',
		callback: function(result) {
			$('#posts-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				var offerName,
					status;
				for (var j in statuses) {
					if (statuses[j] && j == result[i].status) {
						status = statuses[j];
						break;
					}
				}
				for (var j = 0, length2 = offers.length; j < length2; j++) {
					if (offers[j].id == result[i].id_offer) {
						offerName = offers[j].name;
						break;
					}
				}
				$('#posts-table>tbody').append('<tr data-post-id="'+result[i].id+'"> \
					<td>'+result[i].name+'</td> \
					<td>'+offerName+'</td> \
					<td>'+(result[i].id_social_network == 1 ? "Мой Мир" : (result[i].id_social_network == 2 ? "Одноклассники" : "Вконтакте"))+'</td> \
					<td>'+status+'</td> \
					<td></td> \
					<td>'+settings.get_time(result[i].created_at)+'</td> \
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

var actionEdit = function(el) {
	location.replace('editPosts.html?id='+el.closest('tr').data('post-id'));
}

var deleteUser = function(el) {
	if (confirm('Действительно удалить?')) {
		var ajaxParams = {
			method: 'DELETE',
			url: '/v1/posts/'+el.closest('tr').data('post-id'),
			data: '',
			callback: function(result) {
				getPosts();
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
	$('#posts-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "delete":
				deleteUser($(this));
				break;
		}
	});
	$('#add-new-post').click(function() {
		location.replace('editPosts.html');
	});
});
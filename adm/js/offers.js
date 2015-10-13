(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/categories',
		data: '',
		callback: function(result) {
			window.categories = result;
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/partners',
		data: '',
		callback: function(result) {
			window.partners = result;
			getOffers();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
})();

getOffers = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/offers?expand=countries',
		data: '',
		callback: function(result) {
			$('#offers-table>tbody').empty();
			for (var i = 0, length = result.length; i < length; i++) {
				var categoryName,
					partnerName;
				for (var j = 0, length2 = categories.length; j < length2; j++) {
					if (categories[j].id == result[i].id_category) {
						categoryName = categories[j].name;
						break;
					}
				}
				for (var j = 0, length2 = partners.length; j < length2; j++) {
					if (partners[j].id == result[i].id_category) {
						partnerName = partners[j].name;
						break;
					}
				}
				$('#offers-table>tbody').append('<tr data-offer-id="'+result[i].id+'"> \
					<td>'+result[i].name+'</td> \
					<td>'+result[i].oid+'</td> \
					<td>'+partnerName+'</td> \
					<td>'+categoryName+'</td> \
					<td>'+(result[i].logo == null ? "-" : "<img src="+result[i].logo+">")+'</td> \
					<td>'+(result[i].price == null ? "-" : result[i].price)+'</td> \
					<td>'+result[i].epc+'</td> \
					<td>'+result[i].cr+'</td> \
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
	location.replace('editOffers.html?id='+el.closest('tr').data('offer-id'));
}

var deleteUser = function(el) {
	if (confirm('Действительно удалить?')) {
		var ajaxParams = {
			method: 'DELETE',
			url: '/v1/offers/'+el.closest('tr').data('offer-id'),
			data: '',
			callback: function(result) {
				getOffers();
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
	$('#offers-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "delete":
				deleteUser($(this));
				break;
		}
	});
	$('#add-new-offer').click(function() {
		location.replace('editOffers.html');
	});
});
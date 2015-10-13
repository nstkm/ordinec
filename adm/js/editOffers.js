var offerID = parseInt(window.location.search.substring(1).split("&")[0].split("=")[1]);

(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/categories',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#category').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
			}
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
			for (var i = 0, length = result.length; i < length; i++) {
				$('#partner').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/countries?per-page=1000',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#countries').append('<option value="'+result[i].id+'">'+result[i].name_ru+'</option>');
			}
			if (offerID) {
				getOffers();
			}	
			else {
				$('#logo').append('<input id="uploader" style="display:block;" name="image" class="form-control" type="file" />');
				$('#countries').chosen();
			}	
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	var ajaxParams = {
		method: 'GET',
		url: '/v1/short-link-modules',
		data: '',
		callback: function(result) {
			window.modules = result;
			getLinks();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
})();

var getOffers = function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/offers/'+offerID+"?expand=countries",
		data: '',
		callback: function(result) {
			for (i in result) {
				var elInput = $('#offers-table input[name="'+i+'"]');
				var elSelect = $('#offers-table select[name="'+i+'"]');
				if (i == "placement_rules" && result[i]) {
					var decoded = $.parseJSON(result[i]).social_networks;
					for (var j = 0, length = elInput.length; j < length; j++) {
						$.inArray(elInput.eq(j).val(), decoded)+1 ? elInput.eq(j).attr("checked","checked") : 0;
					}
					continue;
				}
				else if (i == "logo") {
					if (result[i] != null && result[i] != "")
						$('#logo').append('<div id="wrap-logo"><span>x</span><img src="'+result[i]+'" alt="" /></div>');
					else {
						$('#logo').append('<input id="uploader" style="display:block;" name="image" class="form-control" type="file" />');
					}
					continue;
				}
				if (result[i] && elInput.length) {
					elInput.val(result[i]);
				}
				else if (result[i] && elSelect.length) {
					if (typeof(result[i]) == "object") {
						var countriesArray = new Array;
						for (var j = 0, length = result[i].length; j < length; j++) {
							countriesArray.push(result[i][j].id);
						}
						elSelect.val(countriesArray);
						$('#countries').chosen();
					}
					else
					 	elSelect.val(result[i]);
				}
			}
			$('#wrap-logo>span').click(function() {
				$('#logo').empty().append('<input id="uploader" style="display:block;" name="image" class="form-control" type="file" />');
			});
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
};

var editOffer = function(data,bool) {
	if (bool) {
		var method = "POST";
		var href = "";
	}
	else {
		var method = "PATCH";
		var href = '/'+offerID;
	}
	var ajaxParams = {
		method: method,
		url: '/v1/offers'+href,
		data: data,
		callback: function(result) {
			location.replace('offers.html');
		},
		response_headers: function(xhr) {

		},
		error: function(error) {
			settings.response_handler(false,1,error);
		}
	}
	settings.sendAjax(ajaxParams);
}

var getLinks = function() {
	if (offerID) {
		var ajaxParams = {
			method: 'GET',
			url: '/v1/ref-links?q[id_offer][equal]='+offerID,
			data: '',
			callback: function(result) {
				$('#links-table>tbody').empty();
				for (var i = 0, length = result.length; i < length; i++) {
					var moduleName = '';
					for (var j = 0, length2 = modules.length; j < length2; j++) {
						if (result[i].id_short_link_module == modules[j].id) {
							moduleName = modules[j].name;
							break;
						}
					}
					$('#links-table>tbody').append('<tr data-link-id="'+result[i].id+'"> \
						<td data-input-name="id">'+result[i].id+'</td> \
						<td data-input-name="name">'+result[i].name+'</td> \
						<td data-input-name="url">'+result[i].url+'</td> \
						<td data-input-name="id_short_link_module">'+moduleName+'</td> \
						<td> \
							<button data-action="save" style="display: none;" type="button" class="btn btn-default btn-sm">Сохранить</button> \
							<button data-action="edit" type="button" class="btn btn-default btn-sm">Редактировать</button> \
							<button data-action="delete" type="button" class="btn btn-default btn-sm">Удалить</button> \
						</td> \
					</tr>');
				}

				var linkSelect = '';
				for (var i = 0; i < modules.length; i++) {
					linkSelect += '<option value="'+modules[i].id+'">'+modules[i].name+'</option>'
				}
				$('#links-table>tbody').append('<tr> \
					<td><input class="form-control" name="id" type="text"></td> \
					<td><input class="form-control" name="name" type="text"></td> \
					<td><input class="form-control" name="url" type="text"></td> \
					<td><select name="id_short_link_module" id="" class="form-control">'+linkSelect+'</select></td> \
					<td> \
						<button data-action="add" type="button" class="btn btn-default btn-sm">Добавить</button> \
					</td> \
				</tr>');
			},
			response_headers: function(xhr) {

			},
			error: function() {

			}
		}
		settings.sendAjax(ajaxParams);
	}
	else {
		var linkSelect = '';
		for (var i = 0; i < modules.length; i++) {
			linkSelect += '<option value="'+modules[i].id+'">'+modules[i].name+'</option>'
		}
		$('#links-table>tbody').append('<tr> \
			<td><input class="form-control" name="name" type="text"></td> \
			<td><input class="form-control" name="url" type="text"></td> \
			<td><select name="id_short_link_module" id="" class="form-control">'+linkSelect+'</select></td> \
			<td> \
				<button data-action="add" type="button" class="btn btn-default btn-sm">Добавить</button> \
			</td> \
		</tr>');
	}
}

var actionEdit = function(el) {
	el.hide();
	$('button[data-action="save"]',el.parent()).show();
	var linkTableTr = el.closest('tr').find('td');
	for (var i = 0; i < 3; i++) {
		var text = linkTableTr.eq(i).text();
		linkTableTr.eq(i).empty().append('<input class="form-control" name="'+linkTableTr.eq(i).data('input-name')+'" type="text" value="'+text+'">');
	}
	var linkSelect = '';
	for (var i = 0; i < modules.length; i++) {
		linkSelect += '<option value="'+modules[i].id+'">'+modules[i].name+'</option>'
	}
	linkTableTr.eq(3).empty().append('<select class="form-control" name="'+linkTableTr.eq(3).data('input-name')+'">'+linkSelect+'</select>');
}

var saveLink = function(el,bool) {
	var data = new Object;
	if (bool) {
		var method = "POST";
		var linkId = '';
		data.id_offer = offerID;
	}
	else {
		var method = "PATCH";
		var linkId = '/'+el.closest('tr').data('link-id');
	}
	
	$('input,select',el.closest('tr')).each(function() {
		data[$(this).attr('name')] = $(this).val();
	});
	


	var ajaxParams = {
		method: method,
		url: '/v1/ref-links'+linkId,
		data: data,
		callback: function(result) {
			getLinks();
			settings.response_handler(true,2);
		},
		response_headers: function(xhr) {

		},
		error: function(error) {
			settings.response_handler(false,2,error);
		}
	}
	settings.sendAjax(ajaxParams);
}

var deleteLink = function(el) {
	var ajaxParams = {
		method: "DELETE",
		url: '/v1/ref-links/'+el.closest('tr').data('link-id'),
		data: data,
		callback: function(result) {
			getLinks();
			settings.response_handler(true,2);
		},
		response_headers: function(xhr) {

		},
		error: function() {
			settings.response_handler(false,2,error);
		}
	}
	settings.sendAjax(ajaxParams);
}

$(document).ready(function() {
	$('#add-new-offer').click(function() {
		var data = new Object;
		var countriesArray = new Object;
		countriesArray.social_networks = new Array;
		$("#offers-table input, #offers-table select").each(function() {
			if ($(this).is(':checked') && $(this).attr('name') == "placement_rules") {
				countriesArray.social_networks.push($(this).val());
			}
			else {
				data[$(this).attr('name')] = $(this).val();
			}
		});
		data["placement_rules"] = JSON.stringify(countriesArray);
		if ($('#uploader').val()) {
			var fd = new FormData;
			fd.append('image', $('#uploader').prop('files')[0]);
			$.ajax({
				type: "POST",
				url: "https://file.ordinec.ru/v1/upload?accessToken=" + document.cookie.split('=')[1],
				data: fd,
				processData: false,
       			contentType: false,
       			async: false,
       			success: function(data1) {
       				var server = data1.data.server;
       				var patch = data1.data.patch;
       				data.logo = server+''+patch;
       				offerID ? editOffer(data,false) : editOffer(data,true);	
       			}
			});
		}
		else {
			if ($('#uploader').is(':visible')) {
				data.logo = null;
			}
			else {
				data.logo = $('#logo img').attr('href');
			}
			offerID ? editOffer(data,false) : editOffer(data,true);	
		}	
	});

	$('#links-table').on('click','button', function() {
		switch ($(this).data('action')) {
			case "edit":
				actionEdit($(this));
				break;
			case "delete":
				deleteLink($(this));
				break;
			case "save":
				saveLink($(this));
				break;
			case "add":
				saveLink($(this),true);
				break;
		}
	});
});

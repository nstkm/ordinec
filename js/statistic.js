$('#data-range').daterangepicker({
	startDate: moment().subtract(7,'days').format('DD.MM.YYYY'),
	locale: {
        format: 'DD.MM.YYYY'
    }
});

var statisticsFilter = function(bool) {
	var filter_url = '/statistics?';
	var group = new Array;
	$('#statistic-filters select,#statistic-filters input').each(function() {
		if ($(this).attr('id') == 'group')
			group.push($(this).val(),$('#group option[value="'+$('#group').val()+'"]').text());
		var string = '';
		if($(this).val() != '') {
			if ($(this).attr('name') == 'q[date][between]') {
				var date_array = $(this).val().split(' - ');
				var x = new Date();
				var zone = x.getTimezoneOffset()/60;
				var timeUnix = (Date.UTC(date_array[0].split('.')[2], date_array[0].split('.')[1]-1, date_array[0].split('.')[0], 0, 0, 0)/1000)+','+(Date.UTC(date_array[1].split('.')[2], date_array[1].split('.')[1]-1, date_array[1].split('.')[0], 23, 59, 59)/1000);
				string += string + $(this).attr('name') + '=' + timeUnix + '&';
			}
			else
				string += string + $(this).attr('name') + '=' + $(this).val() + '&';
		}
		filter_url = filter_url + string;
	});

	var ajaxParams = {
		method: 'GET',
		url: '/v1'+filter_url,
		data: '',
		callback: function(result) {
			$('.for-statistic-table tbody').empty();
			$('.for-statistic-table thead td').eq(0).text(group[1]);
			for (var i = 0, length = result.length; i < length; i++) {
				$('.for-statistic-table tbody').prepend('<tr> \
					<td>'+(group[0] == "date" ? settings.get_time(result[i].date) : result[i][group[0]])+'</td> \
					<td>'+result[i].hit_count+'</td> \
					<td>'+result[i].click_count+'</td> \
					<td>'+result[i].confirmed_leads_count + ' / ' + result[i].confirmed_profit.split('.')[0] + '.00</td> \
					<td>'+result[i].pending_leads_count + ' / ' + result[i].pending_profit.split('.')[0] + '.00</td> \
					<td>'+result[i].rejected_leads_count + ' / ' + result[i].rejected_profit.split('.')[0] + '.00</td> \
					<td>'+result[i].all_leads_count + ' / ' + result[i].all_profit + '</td> \
					<td>'+result[i].cr+'</td> \
					<td>'+result[i].epc+'</td> \
					</tr>');
			}
			if (bool)
				settings.end_load();
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);
}

$(function() {
	var ajaxParams = {
		method: 'GET',
		url: '/v1/social-networks',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#social-networks').append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
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
		url: '/v1/offers',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#offers').append('<option value="'+result[i].id+'">'+(result[i].name.length>10 ? result[i].name.substring(0,10)+'...' : result[i].name)+'</option>');
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
		url: '/v1/hits/devices/',
		data: '',
		callback: function(result) {
			for(i in result){
				if(result[i])
					$('#traffics').append('<option value="'+i+'">'+result[i]+'</option>');
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
		url: '/v1/groups',
		data: '',
		callback: function(result) {
			for (var i = 0, length = result.length; i < length; i++) {
				$('#groups').append('<option value="'+result[i].id+'">'+(result[i].name.length>15 ? result[i].name.substring(0,15)+'...' : result[i].name)+'</option>');
			}
		},
		response_headers: function(xhr) {

		},
		error: function() {

		}
	}
	settings.sendAjax(ajaxParams);

	statisticsFilter(true);
});

$(document).ready(function() {
	$('#filter').click(function() {
		statisticsFilter();
	});
});
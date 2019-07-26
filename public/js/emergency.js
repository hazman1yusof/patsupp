
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

$(document).ready(function () {
	function calanderposition(){
		var width = Math.floor($("#colmd_outer")[0].offsetWidth - $("#colmd_outer")[0].offsetLeft);
		$('#mydate_glpd').css('width',width);
		$('#mydate_glpd').css('height',width);
	}
	calanderposition();

	var gldatepicker = $('#mydate').glDatePicker({
		zIndex: 0,
		showAlways: true,
		onClick: function(target, cell, date, data) {
			urlParam.filterVal[0] = moment(date).format('YYYY-MM-DD');
			refreshGrid("#jqGrid", urlParam);
	    }
	}).glDatePicker(true);

	var urlParam = {
		action: 'get_table_default',
		url: $('#util_tab').val(),
		field: '',
		fixPost:'true',
		table_name:['hisdb.episode as e','hisdb.pat_mast as p'],
		join_type:['LEFT JOIN'],
		join_onCol:['e.mrn'],
		join_onVal:['p.mrn'],
		filterCol:['e.reg_date'],
		filterVal:[moment().format('YYYY-MM-DD')],
	}

	$("#jqGrid").jqGrid({
		datatype: "local",
		colModel: [
			{ label: 'idno', name: 'e_idno', width: 5, hidden: true },
			{ label: 'MRN', name: 'e_mrn', width: 12, classes: 'wrap', formatter: padzero, unformat: unpadzero, canSearch: true, checked: true,  },
			{ label: 'Epis. No', name: 'e_episno', width: 10 ,canSearch: true,classes: 'wrap' },
			// { label: 'Registered Date', name: 'e_reg_date', width: 15 ,classes: 'wrap' },
			// { label: 'Registered Time', name: 'e_reg_time', width: 15 ,classes: 'wrap' },
			{ label: 'Name', name: 'p_name', width: 30 ,canSearch: true,classes: 'wrap' },
			{ label: 'Action', name: 'action', width: 30 ,canSearch: true,classes: 'wrap', formatter: formatterRemarks,unformat: unformatRemarks}
		],
		autowidth: true,
		viewrecords: true,
		width: 900,
		height: 365,
		rowNum: 30,
		pager: "#jqGridPager",
		onSelectRow:function(rowid, selected){
		},
		ondblClickRow: function (rowid, iRow, iCol, e) {
		},
		gridComplete: function () {

		},
	});
	addParamField('#jqGrid',true,urlParam,['action']);
	/////////////////////////start grid pager/////////////////////////////////////////////////////////
	$("#jqGrid").jqGrid('navGrid', '#jqGridPager', {
		view: false, edit: false, add: false, del: false, search: false,
		beforeRefresh: function () {
			refreshGrid("#jqGrid", urlParam);
		},
	});

	function formatterRemarks(cellvalue, options, rowObject){
		return "<a class='remarks_button btn btn-success btn-xs' target='_blank' href='./upload?mrn="+rowObject.e_mrn+"&episno="+rowObject.e_episno+"' > upload </a>";
	}

	function unformatRemarks(cellvalue, options, rowObject){
		return null;
	}

});
